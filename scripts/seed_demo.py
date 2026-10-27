"""Seed demo data for the coursework presentation on the local Compose stack.

Creates services, room types, rooms, tenants, demo accounts, contracts, two months of
invoices, the public areas/listings from frontend/src/data/listings.js (with images)
and a few requests.
Safe to run again: existing records are kept and skipped. Pass --lam-moi-anh to replace
the uploaded images of the sample listings after listings.js changes.
"""

import json
import secrets
import subprocess
import sys
from datetime import date, datetime, timedelta, timezone
from pathlib import Path

from security_smoke import ROOT, SETTINGS, Session

DEMO_PASSWORD = "Demo@2026"
DICH_VU = [
    ("Điện", 3500, "kWh", "theo_chi_so"),
    ("Nước", 20000, "m³", "theo_chi_so"),
    ("Internet", 150000, "tháng", "co_dinh"),
    ("Vệ sinh & rác", 50000, "tháng", "co_dinh"),
    ("Gửi xe máy", 100000, "xe", "co_dinh"),
]
LOAI_PHONG = [
    ("Studio", 5500000, 25, "Phòng studio có bếp nhỏ, phù hợp 1 người"),
    ("Phòng đôi", 7500000, 35, "Phòng rộng cho 2 người, có ban công"),
    ("Căn 1 phòng ngủ", 10000000, 45, "Phòng ngủ riêng và phòng khách"),
]
PHONG = [("P101", 1, 0), ("P102", 1, 0), ("P103", 1, 1), ("P104", 1, 1), ("P201", 2, 1),
         ("P202", 2, 1), ("P203", 2, 2), ("P301", 3, 2), ("P302", 3, 2), ("P303", 3, 0)]
KHACH = [
    ("Nguyễn Văn An", "001203001111", "0905111222", "an.nguyen@example.com", "nam"),
    ("Trần Thị Bình", "001203002222", "0905333444", "binh.tran@example.com", "nu"),
    ("Lê Minh Châu", "001203003333", "0905555666", "chau.le@example.com", "nam"),
    ("Phạm Thu Dung", "001203004444", "0905777888", "dung.pham@example.com", "nu"),
    ("Đỗ Quang Huy", "001203005555", "0905999000", "huy.do@example.com", "nam"),
]
# (khách, phòng, số ngày đã thuê, số ngày còn lại, dịch vụ cố định). RIVER-604 và STUDIO-310 là
# phòng của tin công khai: có hợp đồng thì website tự hiện "Đang thuê" và ngừng nhận lịch xem.
HOP_DONG = [
    (0, "P101", 120, 245, ["Internet", "Vệ sinh & rác"]),
    (1, "P201", 60, 20, ["Internet", "Gửi xe máy"]),  # sắp hết hạn, hiện cảnh báo trên dashboard
    (2, "P301", 200, 165, ["Internet", "Vệ sinh & rác", "Gửi xe máy"]),
    (3, "RIVER-604", 90, 275, ["Internet"]),
    (4, "STUDIO-310", 45, 320, ["Internet", "Gửi xe máy"]),
]
TAI_KHOAN = [("quanly", "Quản lý Demo", "ROLE_QUAN_LY", None),
             ("cudan1", "Nguyễn Văn An", "ROLE_KHACH", 0),
             ("cudan2", "Trần Thị Bình", "ROLE_KHACH", 1)]


def doc_listings():
    script = ("import { KHU_VUC, LISTINGS } from './frontend/src/data/listings.js';"
              "console.log(JSON.stringify({ KHU_VUC, LISTINGS }))")
    out = subprocess.run(["node", "--input-type=module", "-e", script], cwd=ROOT,
                         capture_output=True, text=True, encoding="utf-8", check=True).stdout
    return json.loads(out)


def upload(session, path, file_path, alt):
    boundary = "seed" + secrets.token_hex(8)
    body = (f"--{boundary}\r\nContent-Disposition: form-data; name=\"altText\"\r\n\r\n{alt}\r\n"
            f"--{boundary}\r\nContent-Disposition: form-data; name=\"file\"; filename=\"{file_path.name}\"\r\n"
            "Content-Type: image/jpeg\r\n\r\n").encode() + file_path.read_bytes() + f"\r\n--{boundary}--\r\n".encode()
    return session.expect(path, "POST", body, content_type=f"multipart/form-data; boundary={boundary}")


def seed_van_hanh(admin):
    dv = {d["tenDichVu"]: d["id"] for d in admin.expect("/api/dich-vu")}
    for ten, gia, don_vi, loai in DICH_VU:
        if ten not in dv:
            dv[ten] = admin.expect("/api/dich-vu", "POST", {
                "tenDichVu": ten, "donGia": gia, "donVi": don_vi, "loaiTinh": loai, "dangApDung": True,
            }, status=201)["id"]

    loai = {l["tenLoai"]: l["id"] for l in admin.expect("/api/phong/loai")}
    for ten, gia, dien_tich, mo_ta in LOAI_PHONG:
        if ten not in loai:
            loai[ten] = admin.expect("/api/phong/loai", "POST", {
                "tenLoai": ten, "giaThue": gia, "dienTich": dien_tich, "moTa": mo_ta,
            }, status=201)["id"]
    ten_loai = [x[0] for x in LOAI_PHONG]

    phong = {p["maPhong"]: p["id"] for p in admin.expect("/api/phong?kichThuoc=100")["noiDung"]}
    for ma, tang, i in PHONG:
        if ma not in phong:
            phong[ma] = admin.expect("/api/phong", "POST", {
                "maPhong": ma, "tang": tang, "loaiPhongId": loai[ten_loai[i]],
                "tienNghi": "Máy lạnh, nóng lạnh, giường, tủ", "ghiChu": None,
            }, status=201)["id"]

    khach = []
    for ho_ten, cccd, sdt, email, gioi_tinh in KHACH:
        found = admin.expect(f"/api/khach-thue?keyword={cccd}")["noiDung"]
        khach.append(found[0]["id"] if found else admin.expect("/api/khach-thue", "POST", {
            "hoTen": ho_ten, "cccd": cccd, "sdt": sdt, "email": email, "gioiTinh": gioi_tinh,
            "ngaySinh": "1998-05-20", "queQuan": "Đà Nẵng", "trangThaiTamTru": "da_khai_bao",
            "ngayKhaiBao": (date.today() - timedelta(days=30)).isoformat(),
        }, status=201)["id"])
    return dv, khach


def seed_hop_dong(admin, dv, khach, data):
    gia_tin = {t["ma"]: t["gia"] for t in data["LISTINGS"]}
    phong = {p["maPhong"]: p["id"] for p in admin.expect("/api/phong?kichThuoc=100")["noiDung"]}
    dang_thue = {h["phongId"] for h in admin.expect("/api/hop-dong?trangThai=hieu_luc&kichThuoc=100")["noiDung"]}
    for k, ma, da_thue, con_lai, dich_vu in HOP_DONG:
        if phong[ma] in dang_thue:
            continue
        admin.expect("/api/hop-dong", "POST", {
            "phongId": phong[ma], "khachThueId": khach[k], "giaThue": gia_tin.get(ma),
            "ngayBatDau": (date.today() - timedelta(days=da_thue)).isoformat(),
            "ngayKetThuc": (date.today() + timedelta(days=con_lai)).isoformat(),
            "tienCoc": 10000000, "dichVu": [{"dichVuId": dv[t], "soLuong": 1} for t in dich_vu],
        }, status=201)

    roles = {r["maVaiTro"]: r["id"] for r in admin.expect("/api/tai-khoan/vai-tro")}
    for ten, ho_ten, vai_tro, k in TAI_KHOAN:
        if not any(t["tenDangNhap"] == ten for t in admin.expect(f"/api/tai-khoan?keyword={ten}")["noiDung"]):
            admin.expect("/api/tai-khoan", "POST", {
                "tenDangNhap": ten, "matKhau": DEMO_PASSWORD, "hoTen": ho_ten, "vaiTroId": roles[vai_tro],
                "khachThueId": None if k is None else khach[k],
            }, status=201)


def seed_tin_dang(admin, data):
    for k in data["KHU_VUC"]:
        admin.expect(f"/api/bat-dong-san/khu-vuc/{k['id']}", "PUT", {
            "slug": k["id"], "ten": k["ten"], "moTa": k.get("moTa"), "anhUrl": k.get("anh"),
            "khach": k.get("khach"), "dacDiem": "\n".join(k.get("dacDiem", [])),
            "pinX": k["pin"]["x"], "pinY": k["pin"]["y"], "hienThi": True,
        })

    bds = {b["diaChi"]: b["id"] for b in admin.expect("/api/bat-dong-san")}
    for t in data["LISTINGS"]:
        if t["diaChi"] not in bds:
            bds[t["diaChi"]] = admin.expect("/api/bat-dong-san", "POST", {
                "khuVucSlug": t["khuVuc"], "ten": t["diaChi"].split(",")[0], "diaChi": t["diaChi"],
                "pinX": t["pin"]["x"], "pinY": t["pin"]["y"],
            }, status=201)["id"]

        if admin.expect(f"/api/tin-dang?q={t['ma']}")["noiDung"]:
            continue
        tin = admin.expect("/api/tin-dang", "POST", {
            "slug": t["id"], "batDongSanId": bds[t["diaChi"]], "ma": t["ma"], "tieuDe": t["tieuDe"],
            "loai": t["loai"], "phongNgu": t["phongNgu"], "phongTam": t["phongTam"], "dienTich": t["dienTich"],
            "tang": t["tang"], "gia": t["gia"], "datCoc": t["datCoc"], "tienNghi": "\n".join(t.get("tienNghi", [])),
            "moTa": t["moTa"], "noiBat": t.get("noiBat", False), "trangThaiCan": t.get("trangThai", "trong"),
        }, status=201)
        for i, anh in enumerate(t.get("anh", [])):
            upload(admin, f"/api/tin-dang/{tin['dbId']}/anh", ROOT / "frontend" / "public" / anh.lstrip("/"),
                   f"{t['tieuDe']} - ảnh {i + 1}")
        admin.expect(f"/api/tin-dang/{tin['dbId']}/xuat-ban", "POST")


def lam_moi_anh(admin, data):
    """Thay toàn bộ ảnh đã upload của tin mẫu bằng danh sách ảnh hiện tại trong listings.js."""
    for t in data["LISTINGS"]:
        found = admin.expect(f"/api/tin-dang?q={t['ma']}")["noiDung"]
        if not found:
            continue
        tin = found[0]
        if tin["trangThaiTin"] == "xuat_ban":
            admin.expect(f"/api/tin-dang/{tin['dbId']}/an", "POST")
        for anh in tin["chiTietAnh"]:
            admin.expect(f"/api/tin-dang/{tin['dbId']}/anh/{anh['id']}", "DELETE")
        for i, anh in enumerate(t.get("anh", [])):
            upload(admin, f"/api/tin-dang/{tin['dbId']}/anh", ROOT / "frontend" / "public" / anh.lstrip("/"),
                   f"{t['tieuDe']} - ảnh {i + 1}")
        admin.expect(f"/api/tin-dang/{tin['dbId']}/xuat-ban", "POST")


def seed_phong_cho_tin(admin, data):
    """Mỗi tin công khai gắn một phòng vận hành cùng mã; trạng thái căn trên website lấy theo phòng."""
    loai = {l["tenLoai"]: l["id"] for l in admin.expect("/api/phong/loai")}
    phong = {p["maPhong"]: p for p in admin.expect("/api/phong?kichThuoc=100")["noiDung"]}
    for t in data["LISTINGS"]:
        if t["loai"] not in loai:
            loai[t["loai"]] = admin.expect("/api/phong/loai", "POST", {
                "tenLoai": t["loai"], "giaThue": t["gia"], "dienTich": t["dienTich"], "moTa": f"Theo tin {t['ma']}",
            }, status=201)["id"]
        if t["ma"] not in phong:
            phong[t["ma"]] = admin.expect("/api/phong", "POST", {
                "maPhong": t["ma"], "tang": min(t["tang"], 50), "loaiPhongId": loai[t["loai"]],
                "tienNghi": ", ".join(t.get("tienNghi", []))[:500], "ghiChu": f"Căn công khai {t['tieuDe']}",
            }, status=201)
        p = phong[t["ma"]]
        tin = admin.expect(f"/api/tin-dang?q={t['ma']}")["noiDung"][0]
        if tin["phongId"] is None:
            if tin["trangThaiTin"] == "xuat_ban":
                admin.expect(f"/api/tin-dang/{tin['dbId']}/an", "POST")
            admin.expect(f"/api/tin-dang/{tin['dbId']}", "PUT", {
                "slug": tin["id"], "batDongSanId": tin["batDongSanId"], "phongId": p["id"], "ma": tin["ma"],
                "tieuDe": tin["tieuDe"], "loai": tin["loai"], "phongNgu": tin["phongNgu"], "phongTam": tin["phongTam"],
                "dienTich": tin["dienTich"], "tang": tin["tang"], "gia": tin["gia"], "datCoc": tin["datCoc"],
                "tienNghi": "\n".join(tin["tienNghi"]), "moTa": tin["moTa"], "noiBat": tin["noiBat"], "trangThaiCan": "trong",
            })
            admin.expect(f"/api/tin-dang/{tin['dbId']}/xuat-ban", "POST")
        if t.get("trangThai") in ("da_dat_coc", "bao_tri") and p["trangThai"] == "trong":
            admin.expect(f"/api/phong/{p['id']}/trang-thai", "PATCH", {"trangThai": t["trangThai"]})


def seed_hoa_don(admin):
    """Kỳ trước đã thu, kỳ này chưa thu, cho mỗi hợp đồng đang hiệu lực chưa có hóa đơn."""
    dau_thang = date.today().replace(day=1)
    ky_nay, ky_truoc = dau_thang.strftime("%Y-%m"), (dau_thang - timedelta(days=1)).strftime("%Y-%m")
    for i, h in enumerate(admin.expect("/api/hop-dong?trangThai=hieu_luc&kichThuoc=100")["noiDung"]):
        chi_so = {"Điện": 1000 + 300 * i, "Nước": 50 + 10 * i}
        if not admin.expect(f"/api/hoa-don/goi-y?hopDongId={h['id']}&ky={ky_nay}")["kyDau"]:
            continue
        for ky, tieu_thu in ((ky_truoc, {"Điện": 110 + 10 * i, "Nước": 5}), (ky_nay, {"Điện": 125 + 10 * i, "Nước": 6})):
            goi_y = admin.expect(f"/api/hoa-don/goi-y?hopDongId={h['id']}&ky={ky}")
            dong = [d for d in goi_y["dong"] if d["theoChiSo"]]
            body = [{"dichVuId": d["dichVuId"], "chiSoCu": chi_so[d["noiDung"]] if goi_y["kyDau"] else None,
                     "chiSoMoi": chi_so[d["noiDung"]] + tieu_thu[d["noiDung"]]} for d in dong]
            hd = admin.expect("/api/hoa-don", "POST", {"hopDongId": h["id"], "ky": ky, "chiSo": body}, status=201)
            for d in dong:
                chi_so[d["noiDung"]] += tieu_thu[d["noiDung"]]
            if ky == ky_truoc:
                admin.expect(f"/api/hoa-don/{hd['id']}/thanh-toan", "POST", {"phuongThuc": "chuyen_khoan"})


def seed_yeu_cau(admin, data):
    if admin.expect("/api/yeu-cau/thong-ke")["tong"]:
        return
    guest = Session()
    guest.call("/api/auth/me")
    guest.expect("/api/public/yeu-cau", "POST", {
        "chuDe": "lien-he", "tieuDe": "Tư vấn thuê căn gần trung tâm", "hoTen": "Hoàng Gia Huy",
        "sdt": "0912345678", "email": "huy.hoang@example.com",
        "noiDung": "Mình cần thuê căn 1 phòng ngủ, ngân sách khoảng 15 triệu, vào ở đầu tháng sau.",
    }, status=201)
    nhan_lich = next(t for t in data["LISTINGS"] if t.get("trangThai", "trong") == "trong")
    ngay = (datetime.now(timezone(timedelta(hours=7))) + timedelta(days=3)).date()
    guest.expect("/api/public/lich-xem", "POST", {
        "listingKey": nhan_lich["id"], "hoTen": "Võ Thanh Mai", "sdt": "0987654321",
        "khungDeNghi": f"{ngay}T09:00:00", "ghiChu": "Muốn xem buổi sáng",
    }, status=201)
    cu_dan = Session()
    cu_dan.login("cudan1", DEMO_PASSWORD)
    cu_dan.expect("/api/khach/yeu-cau", "POST", {
        "chuDe": "bao-tri", "mucDo": "can_gap", "noiDung": "Máy lạnh phòng P101 chảy nước, nhờ kỹ thuật kiểm tra.",
    }, status=201)


def main():
    sys.stdout.reconfigure(encoding="utf-8")
    admin = Session()
    admin.login("admin", SETTINGS["APP_ADMIN_PASSWORD"])
    data = doc_listings()
    dv, khach = seed_van_hanh(admin)
    seed_tin_dang(admin, data)
    if "--lam-moi-anh" in sys.argv:
        lam_moi_anh(admin, data)
    seed_phong_cho_tin(admin, data)
    seed_hop_dong(admin, dv, khach, data)
    seed_hoa_don(admin)
    seed_yeu_cau(admin, data)
    print(f"OK: dữ liệu demo sẵn sàng tại http://localhost:{SETTINGS.get('APP_PORT', '8088')}")
    print(f"  admin / (APP_ADMIN_PASSWORD trong .env)")
    print(f"  quanly, cudan1, cudan2 / {DEMO_PASSWORD}")


if __name__ == "__main__":
    main()
