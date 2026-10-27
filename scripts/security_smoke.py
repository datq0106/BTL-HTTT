"""Exercise F1 security flows on the local Compose stack and remove test records."""

import http.cookiejar
import json
import secrets
import subprocess
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SETTINGS = dict(line.split("=", 1) for line in (ROOT / ".env").read_text(encoding="ascii")
                .splitlines() if "=" in line)
BASE = "http://localhost:" + SETTINGS.get("APP_PORT", "8088")


class Session:
    def __init__(self):
        self.cookies = http.cookiejar.CookieJar()
        self.client = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(self.cookies))

    def call(self, path, method="GET", body=None, *, csrf=True):
        headers = {"Accept": "application/json"}
        if isinstance(body, dict):
            body = json.dumps(body).encode()
            headers["Content-Type"] = "application/json"
        token = next((c.value for c in self.cookies if c.name == "XSRF-TOKEN"), None)
        if csrf and token and method != "GET":
            headers["X-XSRF-TOKEN"] = token
        request = urllib.request.Request(BASE + path, data=body, method=method, headers=headers)
        try:
            with self.client.open(request, timeout=20) as response:
                return response.status, response.read()
        except urllib.error.HTTPError as error:
            return error.code, error.read()

    def expect(self, path, method="GET", body=None, *, status=200, csrf=True):
        code, payload = self.call(path, method, body, csrf=csrf)
        if code != status:
            raise AssertionError(f"{method} {path}: expected {status}, got {code}: {payload[:200]!r}")
        return json.loads(payload) if payload else None

    def login(self, username, password):
        self.call("/api/auth/me")  # obtain CSRF cookie
        form = urllib.parse.urlencode({"tenDangNhap": username, "matKhau": password}).encode()
        code, payload = self.call("/api/auth/login", "POST", form)
        if code != 200:
            raise AssertionError(f"Login {username}: {code}: {payload[:120]!r}")
        return self.expect("/api/auth/me")  # refresh token after authentication


def sql(query):
    if '"' in query or "`" in query:
        raise ValueError("Unsafe SQL quoting")
    command = ["docker", "compose", "exec", "-T", "db", "sh", "-c",
               f'mysql -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" "$MYSQL_DATABASE" -N -e "{query}"']
    result = subprocess.run(command, cwd=ROOT, capture_output=True, text=True, check=True)
    return result.stdout.strip()


def main():
    accounts = []
    tenants = []
    notices = []
    admin = Session()
    admin.login("admin", SETTINGS["APP_ADMIN_PASSWORD"])
    try:
        roles = {row["maVaiTro"]: row["id"] for row in admin.expect("/api/tai-khoan/vai-tro")}
        suffix = secrets.token_hex(4)
        for index in (1, 2):
            cccd = "9" + f"{secrets.randbelow(10**11):011d}"
            tenants.append(admin.expect("/api/khach-thue", "POST", {
                "hoTen": f"F1 Resident {index}", "cccd": cccd, "sdt": "0905123456",
            }, status=201)["id"])
        passwords = ["F1Test" + secrets.token_hex(8) + "9" for _ in range(3)]
        names = [f"f1_resident_{suffix}_1", f"f1_resident_{suffix}_2", f"f1_manager_{suffix}"]
        for index in range(3):
            role = "ROLE_KHACH" if index < 2 else "ROLE_QUAN_LY"
            accounts.append(admin.expect("/api/tai-khoan", "POST", {
                "tenDangNhap": names[index], "matKhau": passwords[index],
                "hoTen": f"F1 Test {index}", "vaiTroId": roles[role],
                "khachThueId": tenants[index] if index < 2 else None,
            }, status=201)["id"])

        resident1, resident2, manager = Session(), Session(), Session()
        assert resident1.login(names[0], passwords[0])["maVaiTro"] == "ROLE_KHACH"
        resident2.login(names[1], passwords[1])
        assert manager.login(names[2], passwords[2])["maVaiTro"] == "ROLE_QUAN_LY"
        resident1.expect("/api/tai-khoan", status=403)
        resident1.expect(f"/api/khach-thue/{tenants[1]}", status=403)
        resident1.expect(f"/api/khach-thue/{tenants[1]}/anh/cccd", status=403)
        resident1.expect("/api/khach/hop-dong", status=204)
        manager.expect("/api/khach-thue")
        manager.expect("/api/tai-khoan", status=403)
        resident1.expect("/api/thong-bao/da-doc-tat-ca", "POST", status=403, csrf=False)

        for index, account_id in enumerate(accounts[:2]):
            notice_id = int(sql("INSERT INTO thong_bao (tai_khoan_id, tieu_de, noi_dung, loai) "
                                f"VALUES ({account_id}, 'F1 notice {index}', 'F1 content', 'chung'); "
                                "SELECT LAST_INSERT_ID();").splitlines()[-1])
            notices.append(notice_id)
        list1 = resident1.expect("/api/thong-bao")["noiDung"]
        assert {row["id"] for row in list1} == {notices[0]}
        assert list1[0]["daDoc"] is None and list1[0]["createdAt"]
        resident1.expect(f"/api/thong-bao/{notices[1]}/da-doc", "POST", status=204)
        assert resident2.expect("/api/thong-bao/chua-doc")["soChuaDoc"] == 1
        resident1.expect(f"/api/thong-bao/{notices[0]}/da-doc", "POST", status=204)
        assert resident1.expect("/api/thong-bao/chua-doc")["soChuaDoc"] == 0

        admin.expect(f"/api/tai-khoan/{accounts[1]}/khoa", "POST")
        resident2.expect("/api/auth/me", status=401)
        locked = Session()
        locked.call("/api/auth/me")
        form = urllib.parse.urlencode({"tenDangNhap": names[1], "matKhau": passwords[1]}).encode()
        locked.expect("/api/auth/login", "POST", form, status=401)

        admin.expect(f"/api/tai-khoan/{accounts[2]}", "PUT", {
            "hoTen": "F1 Test 2", "vaiTroId": roles["ROLE_ADMIN"], "trangThai": "hoat_dong",
        })
        manager.expect("/api/auth/me", status=401)

        secondSession = Session()
        secondSession.login(names[0], passwords[0])
        new_password = "F1Changed" + secrets.token_hex(8) + "9"
        resident1.expect("/api/auth/doi-mat-khau", "POST", {
            "matKhauCu": passwords[0], "matKhauMoi": new_password,
            "xacNhanMatKhauMoi": new_password,
        }, status=204)
        resident1.expect("/api/auth/me", status=401)
        secondSession.expect("/api/auth/me", status=401)
        fresh = Session()
        fresh.login(names[0], new_password)
        fresh.expect("/api/auth/logout", "POST", status=200)
        fresh.expect("/api/auth/me", status=401)
        print("OK: login/logout, CSRF, roles, document access, notification ownership, lock, password and role session revocation")
    finally:
        if notices:
            sql("DELETE FROM thong_bao WHERE id IN (" + ",".join(map(str, notices)) + ")")
        if accounts:
            sql("DELETE FROM tai_khoan WHERE id IN (" + ",".join(map(str, accounts)) + ")")
        if tenants:
            sql("DELETE FROM khach_thue WHERE id IN (" + ",".join(map(str, tenants)) + ")")


if __name__ == "__main__":
    main()
