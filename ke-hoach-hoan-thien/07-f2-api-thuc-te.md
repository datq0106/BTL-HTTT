# F2: API đã triển khai trong mã nguồn

Trạng thái: đã viết mã, chưa chạy build/test/migration trong lượt 27/10/2026 theo yêu cầu.

## Công khai

| Phương thức | Endpoint | Dữ liệu chính |
| --- | --- | --- |
| POST | `/api/public/yeu-cau` | `chuDe` (`lien-he`, `brief`, `chu-nha`, `quan-tam`), `tieuDe`, `hoTen`, `sdt`, `email?`, `maPhong?`, `listingKey?`, `noiDung`; trả `maTraCuu`, `trangThai` |
| POST | `/api/public/lich-xem` | `listingKey`, `maPhong?`, `hoTen`, `sdt`, `email?`, `khungDeNghi` dạng giờ Việt Nam không kèm offset, `ghiChu?`; trả `maTraCuu`, `trangThai` |
| GET | `/api/public/xac-nhan/{ma}` | Mã, loại, trạng thái, khung đề nghị/xác nhận nếu có; không trả thông tin liên hệ |

Hai POST dùng cookie CSRF cùng origin, giới hạn 10 lần/IP/10 phút trong tiến trình BE, và từ chối nội dung giống hệt của cùng số điện thoại/chủ đề trong 5 phút. `listingKey` hiện là ID tin tĩnh của FE; F3 sẽ nối sang tin đăng trong database.

## Cư dân

| Phương thức | Endpoint | Dữ liệu chính |
| --- | --- | --- |
| GET | `/api/khach/yeu-cau?trang=0&kichThuoc=20` | Danh sách phiếu theo tài khoản đăng nhập |
| GET | `/api/khach/yeu-cau/{id}` | Chi tiết và lịch sử, kiểm tra chủ phiếu ở BE |
| POST | `/api/khach/yeu-cau` | `chuDe`, `mucDo`, `noiDung`; BE tự gắn danh tính và phòng từ phiên/hợp đồng |

## Nhân viên

| Phương thức | Endpoint | Dữ liệu chính |
| --- | --- | --- |
| GET | `/api/yeu-cau` | Lọc `keyword`, `nguon`, `chuDe`, `trangThai`, `mucDo`; phân trang |
| GET | `/api/yeu-cau/thong-ke` | Số phiếu theo trạng thái, khẩn cấp, tổng |
| GET | `/api/yeu-cau/nhan-vien` | Danh sách nhân viên hoạt động để phân công |
| GET | `/api/yeu-cau/{id}` | Chi tiết yêu cầu, lịch xem và lịch sử |
| POST | `/api/yeu-cau` | Tạo phiếu tiếp nhận thủ công |
| PATCH | `/api/yeu-cau/{id}` | `trangThai?`, `phanHoi?`, `nguoiXuLyId?` |
| PATCH | `/api/yeu-cau/{id}/lich-xem/xac-nhan` | `khungXacNhan` |
| PATCH | `/api/yeu-cau/{id}/lich-xem/hoan-thanh` | Hoàn thành lịch đã xác nhận |
| PATCH | `/api/yeu-cau/{id}/lich-xem/huy` | Hủy lịch |

V2 thêm `yeu_cau`, `yeu_cau_lich_su`, `lich_xem`. Lịch đã xác nhận có ràng buộc unique theo `listingKey` và giờ xác nhận. F6 sẽ bổ sung thông báo tự động, SLA và dữ liệu xử lý sự cố chuyên biệt.
