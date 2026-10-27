# Hợp đồng API FE ↔ BE

Đây là **đề xuất thiết kế tổng thể**. Các endpoint F2 thực tế và payload đã được ghi riêng tại [07-f2-api-thuc-te.md](07-f2-api-thuc-te.md); những dòng F2 ở tài liệu này vẫn là thiết kế ban đầu. Tiếp tục dùng cookie session và CSRF hiện có cho API cần đăng nhập; các `POST` công khai cần quy tắc chống spam và CSRF phù hợp mô hình cùng origin.

## 1. API hiện có để giữ và kiểm thử

| Nhóm | Đường dẫn hiện có | Ghi chú |
| --- | --- | --- |
| Xác thực | `/api/auth/login`, `/api/auth/logout`, `/api/auth/me`, `/api/auth/doi-mat-khau` | Login/logout do Spring Security xử lý; sau login cần lấy CSRF token mới. |
| Quản lý | `/api/dashboard`, `/api/phong`, `/api/phong/loai`, `/api/khach-thue`, `/api/hop-dong`, `/api/dich-vu`, `/api/tai-khoan` | Có CRUD/tác vụ trong controller; kiểm tra request/response thực và quyền trước khi mở rộng. |
| Cư dân | `/api/khach/hop-dong` | Hiện chỉ tìm khách đại diện; cần quyết định quyền người ở cùng. |
| Thông báo | `/api/thong-bao`, `/chua-doc`, `/{id}/da-doc`, `/da-doc-tat-ca` | FE phải dùng `daDoc` và `createdAt` đúng DTO. |

Các matcher `/api/chi-so/**`, `/api/hoa-don/**`, `/api/su-co/**`, `/api/bao-cao/**` trong `SecurityConfig` **không tạo endpoint**. Chúng chỉ định quyền cho đường dẫn nếu controller được triển khai sau này.

## 2. API công khai cần thêm

| Phương thức | Đường dẫn đề xuất | Đầu vào/kết quả | Quyền |
| --- | --- | --- | --- |
| GET | `/api/public/tin-dang` | `q,khuVuc,loai,giaDen,phongNgu,trang,sapXep`; trả trang tin đã xuất bản | Công khai |
| GET | `/api/public/tin-dang/{slug}` | Chi tiết, gallery, tình trạng nhận lịch, tin tương tự | Công khai |
| GET | `/api/public/khu-vuc` và `/{slug}` | Khu vực, tọa độ được công bố, số tin/giá tham khảo | Công khai |
| POST | `/api/public/yeu-cau` | `loai,hoTen,sdt,email,noiDung,tinDangId?`; trả mã phiếu và trạng thái `cho_xu_ly` | Công khai, rate limit |
| POST | `/api/public/lich-xem` | `tinDangId,hoTen,sdt,email,khungDeNghi,ghiChu`; trả mã lịch `cho_xac_nhan` | Công khai, rate limit |
| GET | `/api/public/xac-nhan/{maTraCuu}` | Trạng thái tối thiểu của lead/lịch mà không lộ dữ liệu cá nhân | Có mã tra cứu khó đoán hoặc link riêng |
| GET | `/api/public/noi-dung/{loai}` và `/{slug}` | Bài viết, dịch vụ marketing, đội ngũ, FAQ, tin tuyển dụng nếu chọn CMS | Công khai |
| POST | `/api/public/ung-tuyen` | `tinTuyenDungId,hoTen,email,ghiChu,CV?`; trả mã hồ sơ | Công khai, rate limit |

Không trả CCCD, số điện thoại của cư dân, giá hợp đồng hoặc thông tin nhân viên nội bộ trong API tin đăng.

## 3. API nhân viên và quản trị cần thêm

| Nhóm | Đường dẫn đề xuất | Thao tác | Vai trò |
| --- | --- | --- | --- |
| Bất động sản | `/api/bat-dong-san` | CRUD địa điểm/tòa nhà, ảnh công khai, phòng liên kết | `ADMIN`, `QUAN_LY` theo phân quyền đã chốt |
| Tin đăng | `/api/tin-dang`, `/{id}/xuat-ban`, `/{id}/an`, `/{id}/anh` | CRUD, phát hành, ẩn, upload/sắp xếp ảnh | Staff; quyền phát hành có thể chỉ `ADMIN` |
| Yêu cầu | `/api/yeu-cau`, `/{id}`, `/{id}/phan-cong`, `/{id}/trang-thai`, `/{id}/phan-hoi`, `/{id}/lich-su` | Lọc/phân trang, xử lý, đóng/hủy; không xóa cứng mặc định | Staff |
| Lịch xem | `/api/lich-xem`, `/{id}/xac-nhan`, `/{id}/huy`, `/{id}/hoan-tat` | Điều phối lịch; kiểm tra xung đột | Staff |
| Chỉ số | `/api/chi-so` và `/{id}/chot` | Nhập/xem/chốt theo phòng và kỳ | Staff |
| Hóa đơn | `/api/hoa-don`, `/{id}`, `/{id}/chot`, `/{id}/huy`, `/{id}/pdf` | Tạo nháp từ hợp đồng/chỉ số, duyệt, phát hành, xuất | Staff; tách người lập/người duyệt nếu cần |
| Thu tiền | `/api/hoa-don/{id}/thanh-toan`, `/api/thanh-toan/{id}/huy` | Ghi thu, hoàn tác có lý do và audit | Staff có quyền tài chính |
| Báo cáo | `/api/bao-cao/tong-quan`, `/doanh-thu`, `/cong-no`, `/yeu-cau` | Bộ lọc kỳ/khu/phòng, xuất file | Staff theo quyền |
| Nội dung/tuyển dụng | `/api/noi-dung`, `/api/tin-tuyen-dung`, `/api/ung-tuyen` | Biên tập, duyệt, xử lý hồ sơ nếu chọn CMS | Admin/nhân sự được cấp quyền |

## 4. API cư dân cần thêm

| Phương thức | Đường dẫn đề xuất | Phạm vi |
| --- | --- | --- |
| GET | `/api/khach/ho-so` | Thông tin của tài khoản hiện tại; không nhận ID cư dân từ FE |
| GET/POST | `/api/khach/yeu-cau` | Xem và gửi phiếu của mình; server gắn người gửi/phòng/hợp đồng từ phiên |
| GET | `/api/khach/yeu-cau/{id}` | Chỉ chủ phiếu hoặc người được ủy quyền xem |
| GET | `/api/khach/hoa-don`, `/{id}`, `/{id}/pdf` | Hóa đơn gắn hợp đồng có quyền xem |
| GET | `/api/khach/thanh-toan` | Lịch sử thanh toán của mình |
| GET | `/api/khach/chi-so` | Chỉ số phòng theo các kỳ mình thuê, nếu chính sách cho phép |

BE phải lọc theo `UserPrincipal`, không tin `khachThueId` trong query/body. Nhân viên dùng API quản lý riêng; cư dân không thể đổi trạng thái phiếu hoặc hóa đơn của mình.

## 5. Quy ước request/response

- Danh sách: `trang` bắt đầu từ 0, `kichThuoc` có giới hạn, trả đúng cấu trúc `PageResponse` hiện có (`noiDung`, `trang`, `tongSoTrang`, `tongSoPhanTu` nếu DTO hiện hỗ trợ). FE hiển thị loading, empty và lỗi.
- Tạo: `201 Created` và ID/mã ổn định; sửa: `200`; xóa/đánh dấu: `204` nếu không cần body. Validation: `400`, chưa đăng nhập: `401`, sai quyền: `403`, không tìm thấy: `404`, xung đột trạng thái/duy nhất: `409` nếu được chuẩn hóa.
- Giá trị tiền là số decimal theo DTO BE, FE chỉ format để hiển thị; không dùng số float FE làm nguồn tính hóa đơn.
- Ngày lịch dùng `YYYY-MM-DD`; thời điểm có offset hoặc quy ước timezone rõ trong API. Không trả chuỗi “2 giờ trước” từ DB.
- Các thao tác có thể gửi lại do mạng (`POST` đặt lịch, ghi thanh toán) cần khóa chống trùng/idempotency key hoặc mã tham chiếu duy nhất.
- Ảnh public qua URL/tài nguyên công khai có kiểm soát; tài liệu CCCD/hợp đồng/hóa đơn đi qua endpoint có quyền và header cache phù hợp.

### Ví dụ luồng đặt lịch

```http
POST /api/public/lich-xem
Content-Type: application/json

{
  "tinDangId": 123,
  "hoTen": "Nguyen Van A",
  "sdt": "0905123456",
  "email": "a@example.com",
  "khungDeNghi": "2026-11-02T09:00:00+07:00",
  "ghiChu": "Muon xem buoi sang"
}
```

```json
{
  "id": 456,
  "maTraCuu": "token-ngau-nhien-khong-tuan-tu",
  "trangThai": "cho_xac_nhan",
  "thoiDiemTao": "2026-10-27T10:00:00+07:00"
}
```

FE chỉ hiển thị “đã gửi yêu cầu, chờ xác nhận” ở bước này. Trạng thái `da_xac_nhan` chỉ xuất hiện sau hành động xác nhận của nhân viên.
