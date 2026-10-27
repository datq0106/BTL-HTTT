# F3: API danh mục và tin đăng đã triển khai

Trạng thái 27/10/2026: migration V3 đã chạy trên MySQL 8.4 local; `scripts/f2_f3_smoke.py` đạt trên stack Docker. Chưa đối chiếu với DB Aiven và chưa backfill phòng cũ sang tin đăng.

## Công khai

| Phương thức | Endpoint | Dữ liệu chính |
| --- | --- | --- |
| GET | `/api/public/khu-vuc` | Khu đang hiển thị, `giaTu`/`giaDen`/`soTin` tính từ tin đã xuất bản |
| GET | `/api/public/khu-vuc/{slug}` | Một khu; khu bị ẩn trả 404 |
| GET | `/api/public/tin-dang` | Lọc `q`, `khuVuc`, `loai`, `giaDen`, `phongNgu` (3 = từ 3 trở lên), `trangThaiCan`; `sapXep` = `gia-tang`, `gia-giam`, `dien-tich`, mặc định nổi bật rồi mới nhất; `trang`, `kichThuoc` ≤ 100 |
| GET | `/api/public/tin-dang/{slug}` | Chi tiết; tin nháp/ẩn hoặc thuộc khu ẩn trả 404 |
| GET | `/api/public/tin-dang/{slug}/tuong-tu` | Tối đa 3 tin cùng khu |
| GET | `/api/public/tin-dang/{slug}/anh/{anhId}` | Ảnh của tin đã xuất bản, cache 1 giờ |
| GET | `/api/public/thong-ke` | `soTin`, `soCanTrong` (còn nhận lịch), `soKhuVuc`, `tyLeLapDay` (% phòng đang thuê) |

`id` trong phản hồi là slug, `dbId` là khóa số. `trangThai` là tình trạng căn: lấy từ phòng vận hành nếu tin có liên kết `phongId`, nếu không lấy `trangThaiCan` của tin. `nhanLich` chỉ đúng khi tin đã xuất bản, khu hiển thị và căn trống; `/api/public/lich-xem` và chủ đề `quan-tam` kiểm tra lại điều kiện này ở BE và gắn `maPhong` từ mã tin.

## Nhân viên (`ADMIN`, `QUAN_LY`)

| Phương thức | Endpoint | Dữ liệu chính |
| --- | --- | --- |
| GET, PUT | `/api/bat-dong-san/khu-vuc`, `/khu-vuc/{slug}` | Danh sách mọi khu; PUT tạo hoặc sửa, không đổi slug |
| GET, POST, PUT | `/api/bat-dong-san`, `/{id}` | Tòa nhà: `khuVucSlug`, `ten`, `diaChi`, `pinX`, `pinY` (0–100) |
| GET | `/api/tin-dang?q=&trangThai=&phongId=` | `trangThai` = `nhap`, `xuat_ban`, `an`; `phongId` tìm tin của một phòng |
| POST, PUT | `/api/tin-dang`, `/{id}` | Tạo nháp hoặc sửa; tin đang xuất bản phải ẩn trước khi sửa |
| POST | `/api/tin-dang/{id}/xuat-ban`, `/{id}/an` | Xuất bản cần ít nhất một ảnh và khu đang hiển thị |
| POST | `/api/tin-dang/{id}/anh` | Multipart `file` (jpg/jpeg/png/webp, ≤ 5 MB), `altText?` |
| PUT | `/api/tin-dang/{id}/anh/thu-tu` | Mảng đủ toàn bộ ID ảnh theo thứ tự mới |
| DELETE, GET | `/api/tin-dang/{id}/anh/{anhId}` | Xóa (khi chưa xuất bản) hoặc xem ảnh nội bộ |

Màn FE: `/quan-ly/tin-dang` (tab tin đăng, tab khu vực & tòa nhà, hộp quản lý ảnh).

## Đồng bộ phòng ↔ tin (28/10/2026)

- Mỗi phòng gắn tối đa một tin (Q2 chốt 1:1). Tin có `phongId` lấy tình trạng căn từ phòng: ký hợp đồng → website hiện "Đang thuê" và ngừng nhận lịch; thanh lý → "Trống" và nhận lịch lại; phòng bảo trì/đặt cọc cũng hiện tương ứng.
- Chi tiết phòng (`/quan-ly/phong/:id`) hiện tin liên kết hoặc nút "Đăng tin" mở form điền sẵn từ phòng.
- `scripts/seed_demo.py` tạo một phòng cùng mã cho mỗi tin mẫu; RIVER-604 và STUDIO-310 có hợp đồng thật.

## Còn lại của F3

- Backfill phòng hiện hữu sang `bat_dong_san`/`tin_dang` sau khi có schema dump Aiven (F0).
- Quyền xuất bản đang cho cả `ADMIN` và `QUAN_LY`.
- Các trang nội dung tĩnh còn đọc `data/listings.js` (văn phòng, đội ngũ, bài thị trường, tuyển dụng) thuộc F7.
