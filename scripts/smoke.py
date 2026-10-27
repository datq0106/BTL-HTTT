"""End-to-end check of the local Compose stack; creates then removes one test tenant."""

import base64
import http.cookiejar
import json
import secrets
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path


SETTINGS = dict(line.split("=", 1) for line in Path(__file__).resolve().parents[1].joinpath(".env")
                .read_text(encoding="ascii").splitlines() if "=" in line)
BASE = "http://localhost:" + SETTINGS.get("APP_PORT", "8088")
COOKIES = http.cookiejar.CookieJar()
CLIENT = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(COOKIES))
PNG = base64.b64decode("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScL5WQAAAABJRU5ErkJggg==")


def call(path, method="GET", data=None, content_type=None):
    headers = {}
    if content_type:
        headers["Content-Type"] = content_type
    token = next((cookie.value for cookie in COOKIES if cookie.name == "XSRF-TOKEN"), None)
    if token and method != "GET":
        headers["X-XSRF-TOKEN"] = token
    request = urllib.request.Request(BASE + path, data=data, method=method, headers=headers)
    try:
        with CLIENT.open(request, timeout=20) as response:
            return response.status, response.read()
    except urllib.error.HTTPError as error:
        return error.code, error.read()


def expect(path, method="GET", data=None, content_type=None, status=200):
    code, body = call(path, method, data, content_type)
    if code != status:
        raise RuntimeError(f"{method} {path}: expected {status}, got {code}: {body[:200]!r}")
    return body


def main():
    for path in ("/", "/quan-ly/phong/123"):
        assert b"<html" in expect(path).lower()
    assert json.loads(expect("/health"))["status"] == "UP"
    assert call("/api/dashboard")[0] == 401

    call("/api/auth/me")  # establishes the CSRF cookie before login
    login = urllib.parse.urlencode({"tenDangNhap": "admin", "matKhau": SETTINGS["APP_ADMIN_PASSWORD"]}).encode()
    assert json.loads(expect("/api/auth/login", "POST", login,
                             "application/x-www-form-urlencoded"))["maVaiTro"] == "ROLE_ADMIN"
    expect("/api/auth/me")  # refreshes CSRF cookie for the authenticated session
    expect("/api/dashboard")

    tenant_id = None
    try:
        cccd = "9" + f"{secrets.randbelow(10**11):011d}"
        tenant = {"hoTen": "F0 Smoke Test", "cccd": cccd, "sdt": "0905123456"}
        created = json.loads(expect("/api/khach-thue", "POST", json.dumps(tenant).encode(),
                                    "application/json", 201))
        tenant_id = created["id"]
        boundary = "f0smoke" + secrets.token_hex(8)
        multipart = (f"--{boundary}\r\nContent-Disposition: form-data; name=\"anhCccd\"; "
                     f"filename=\"smoke.png\"\r\nContent-Type: image/png\r\n\r\n").encode() + PNG + f"\r\n--{boundary}--\r\n".encode()
        expect(f"/api/khach-thue/{tenant_id}/anh", "POST", multipart,
               f"multipart/form-data; boundary={boundary}")
        downloaded = expect(f"/api/khach-thue/{tenant_id}/anh/cccd")
        assert downloaded == PNG, "Uploaded file differs from downloaded file"
        print("OK: SPA deep route, health, role protection, admin login, API, upload/download")
    finally:
        if tenant_id is not None:
            expect(f"/api/khach-thue/{tenant_id}", "DELETE", status=204)


if __name__ == "__main__":
    main()
