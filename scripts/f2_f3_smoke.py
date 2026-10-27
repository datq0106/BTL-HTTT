"""Exercise F2 requests/viewings and F3 listings on the local Compose stack and remove test records.

Public forms are limited to 10 submissions per IP per 10 minutes; one run uses five.
"""

import secrets
from datetime import datetime, timedelta, timezone

from security_smoke import Session, SETTINGS, sql
from smoke import PNG


def multipart(field, filename, content):
    boundary = "f3smoke" + secrets.token_hex(8)
    body = (f"--{boundary}\r\nContent-Disposition: form-data; name=\"{field}\"; "
            f"filename=\"{filename}\"\r\nContent-Type: image/png\r\n\r\n").encode() + content \
        + f"\r\n--{boundary}--\r\n".encode()
    return body, f"multipart/form-data; boundary={boundary}"


def main():
    suffix = secrets.token_hex(4)
    phones = ["09" + f"{secrets.randbelow(10**8):08d}" for _ in range(2)]
    slug = f"f3-smoke-{suffix}"
    khu_slug, bds_id, tin_id, anh_id = None, None, None, None
    accounts, tenants = [], []
    admin = Session()
    admin.login("admin", SETTINGS["APP_ADMIN_PASSWORD"])
    guest = Session()
    guest.call("/api/auth/me")  # CSRF cookie, as the public forms do
    try:
        # F3: staff creates an area, a property and a draft listing
        khu_slug = slug
        admin.expect(f"/api/bat-dong-san/khu-vuc/{khu_slug}", "PUT", {
            "slug": khu_slug, "ten": f"F3 Smoke {suffix}", "moTa": "Khu thử nghiệm",
            "pinX": 50, "pinY": 50, "hienThi": True,
        })
        bds_id = admin.expect("/api/bat-dong-san", "POST", {
            "khuVucSlug": khu_slug, "ten": f"Tòa F3 {suffix}", "diaChi": "1 Đường Thử", "pinX": 40, "pinY": 60,
        }, status=201)["id"]
        tin_id = admin.expect("/api/tin-dang", "POST", {
            "slug": slug, "batDongSanId": bds_id, "ma": f"F3-{suffix}", "tieuDe": "Căn thử nghiệm F3",
            "loai": "Căn hộ", "phongNgu": 2, "phongTam": 1, "dienTich": 60, "tang": 5,
            "gia": 15000000, "datCoc": 30000000, "moTa": "Mô tả thử nghiệm", "trangThaiCan": "trong",
        }, status=201)["dbId"]
        guest.expect(f"/api/public/tin-dang/{slug}", status=404)
        admin.expect(f"/api/tin-dang/{tin_id}/xuat-ban", "POST", status=400)  # needs an image first

        body, content_type = multipart("file", "f3.png", PNG)
        anh_id = admin.expect(f"/api/tin-dang/{tin_id}/anh", "POST", body,
                              content_type=content_type)["chiTietAnh"][0]["id"]
        admin.expect(f"/api/tin-dang/{tin_id}/xuat-ban", "POST")

        found = guest.expect(f"/api/public/tin-dang?q=F3-{suffix}")["noiDung"]
        assert [x["id"] for x in found] == [slug], found
        detail = guest.expect(f"/api/public/tin-dang/{slug}")
        assert detail["gia"] == 15000000 and detail["nhanLich"] is True
        assert guest.expect(detail["anh"][0], raw=True) == PNG
        assert guest.expect(f"/api/public/khu-vuc/{khu_slug}")["soTin"] == 1
        admin.expect(f"/api/tin-dang/{tin_id}", "PUT", {
            "slug": slug, "batDongSanId": bds_id, "ma": f"F3-{suffix}", "tieuDe": "Sửa khi đang xuất bản",
            "loai": "Căn hộ", "phongNgu": 2, "phongTam": 1, "dienTich": 60, "tang": 5,
            "gia": 15000000, "datCoc": 30000000, "moTa": "Mô tả", "trangThaiCan": "trong",
        }, status=400)

        # F2: public contact form and viewing request
        contact = {"chuDe": "lien-he", "tieuDe": "F2 smoke", "hoTen": "F2 Smoke",
                   "sdt": phones[0], "noiDung": f"F2 smoke {suffix}"}
        guest.expect("/api/public/yeu-cau", "POST", contact, status=403, csrf=False)
        ma_lien_he = guest.expect("/api/public/yeu-cau", "POST", contact, status=201)["maTraCuu"]
        guest.expect("/api/public/yeu-cau", "POST", contact, status=400)  # duplicate within 5 minutes
        tra_cuu = guest.expect(f"/api/public/xac-nhan/{ma_lien_he}")
        assert tra_cuu["loai"] == "lien-he" and "sdt" not in tra_cuu and "hoTen" not in tra_cuu

        ngay = (datetime.now(timezone(timedelta(hours=7))) + timedelta(days=2)).date()
        khung = f"{ngay}T10:00:00"
        ma_lich = guest.expect("/api/public/lich-xem", "POST", {
            "listingKey": slug, "hoTen": "F2 Viewer", "sdt": phones[1], "khungDeNghi": khung,
        }, status=201)["maTraCuu"]

        guest.expect("/api/yeu-cau", status=401)
        rows = {r["maTraCuu"]: r for r in admin.expect("/api/yeu-cau?kichThuoc=50")["noiDung"]}
        lien_he, lich = rows[ma_lien_he], rows[ma_lich]
        assert lich["maPhong"] == f"F3-{suffix}" and lich["lichXem"]["trangThai"] == "cho_xac_nhan"
        handled = admin.expect(f"/api/yeu-cau/{lien_he['id']}", "PATCH",
                               {"trangThai": "dang_xu_ly", "phanHoi": "Đã gọi lại"})
        assert handled["phanHoi"] == "Đã gọi lại" and len(handled["lichSu"]) >= 2
        admin.expect(f"/api/yeu-cau/{lich['id']}/lich-xem/xac-nhan", "PATCH", {"khungXacNhan": khung})
        assert guest.expect(f"/api/public/xac-nhan/{ma_lich}")["lichXem"]["trangThai"] == "da_xac_nhan"

        # Hidden listings disappear and stop taking viewings
        admin.expect(f"/api/tin-dang/{tin_id}/an", "POST")
        guest.expect(f"/api/public/tin-dang/{slug}", status=404)
        guest.expect("/api/public/lich-xem", "POST", {
            "listingKey": slug, "hoTen": "F2 Viewer", "sdt": phones[1], "khungDeNghi": khung,
        }, status=404)

        # F2: residents only see their own requests
        roles = {row["maVaiTro"]: row["id"] for row in admin.expect("/api/tai-khoan/vai-tro")}
        passwords = ["F2Test" + secrets.token_hex(8) + "9" for _ in range(2)]
        names = [f"f2_resident_{suffix}_{i}" for i in range(2)]
        for i in range(2):
            cccd = "9" + f"{secrets.randbelow(10**11):011d}"
            tenants.append(admin.expect("/api/khach-thue", "POST", {
                "hoTen": f"F2 Resident {i}", "cccd": cccd, "sdt": phones[i],
            }, status=201)["id"])
            accounts.append(admin.expect("/api/tai-khoan", "POST", {
                "tenDangNhap": names[i], "matKhau": passwords[i], "hoTen": f"F2 Resident {i}",
                "vaiTroId": roles["ROLE_KHACH"], "khachThueId": tenants[i],
            }, status=201)["id"])
        resident1, resident2 = Session(), Session()
        resident1.login(names[0], passwords[0])
        resident2.login(names[1], passwords[1])
        own = resident1.expect("/api/khach/yeu-cau", "POST", {
            "chuDe": "bao-tri", "mucDo": "can_gap", "noiDung": f"Vòi nước hỏng {suffix}",
        }, status=201)
        assert [r["id"] for r in resident1.expect("/api/khach/yeu-cau")["noiDung"]] == [own["id"]]
        assert resident2.expect("/api/khach/yeu-cau")["noiDung"] == []
        resident2.expect(f"/api/khach/yeu-cau/{own['id']}", status=403)
        resident1.expect("/api/yeu-cau", status=403)
        assert admin.expect(f"/api/yeu-cau/{own['id']}")["nguon"] == "cu_dan"
        print("OK: listing draft/publish/hide, public search/detail/image, request and viewing intake, "
              "CSRF, duplicate guard, staff handling, viewing confirmation, resident isolation")
    finally:
        phone_list = ",".join(f"'{p}'" for p in phones)
        ids = f"SELECT id FROM yeu_cau WHERE sdt IN ({phone_list})"
        sql(f"DELETE FROM yeu_cau_lich_su WHERE yeu_cau_id IN ({ids}); "
            f"DELETE FROM lich_xem WHERE yeu_cau_id IN ({ids}); "
            f"DELETE FROM yeu_cau WHERE sdt IN ({phone_list})")
        if tin_id is not None:
            admin.call(f"/api/tin-dang/{tin_id}/an", "POST")
            if anh_id is not None:
                admin.call(f"/api/tin-dang/{tin_id}/anh/{anh_id}", "DELETE")
            sql(f"DELETE FROM tin_dang_anh WHERE tin_dang_id = {int(tin_id)}; "
                f"DELETE FROM tin_dang WHERE id = {int(tin_id)}")
        if bds_id is not None:
            sql(f"DELETE FROM bat_dong_san WHERE id = {int(bds_id)}")
        if khu_slug:
            sql(f"DELETE FROM khu_vuc WHERE slug = '{khu_slug}'")
        if accounts:
            sql("DELETE FROM tai_khoan WHERE id IN (" + ",".join(map(str, accounts)) + ")")
        if tenants:
            sql("DELETE FROM khach_thue WHERE id IN (" + ",".join(map(str, tenants)) + ")")


if __name__ == "__main__":
    main()
