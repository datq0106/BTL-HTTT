# Kế hoạch hoàn thiện hệ thống quản lý cho thuê

## Mục tiêu

Mọi thao tác trên giao diện phải có kết quả đúng và có thể kiểm chứng: dữ liệu được lưu ở nơi phù hợp, người có quyền xem được từ thiết bị khác, người không có quyền bị từ chối, trạng thái và thông báo phản ánh dữ liệu thật. Các trang thuần nội dung vẫn có thể dùng nội dung tĩnh nếu không cần biên tập trong hệ thống; các form không được báo thành công khi chưa lưu yêu cầu.

Kế hoạch này được lập theo mã nguồn tại `E:/GIT/BTL-HTTT` ngày 27/10/2026. Đây là **đặc tả toàn bộ công việc**. Repo đã tách `backend/` và `frontend/`, có Docker Compose, migration V1 cho database mới và test F1. Baseline Aiven/dữ liệu thật vẫn phải được kiểm tra trước khi nâng cấp. Xem [README gốc](../README.md) và [quy trình database](../docs/database.md) để biết trạng thái triển khai hiện tại.

## Đọc theo thứ tự

1. [01-ma-tran-giao-dien.md](01-ma-tran-giao-dien.md): từng route, trạng thái hiện tại, dữ liệu và thao tác còn thiếu.
2. [02-du-lieu-va-nghiep-vu.md](02-du-lieu-va-nghiep-vu.md): bảng mới, quan hệ, trạng thái và quy tắc nghiệp vụ.
3. [03-hop-dong-api.md](03-hop-dong-api.md): API hiện có, API cần thêm, quyền và mẫu dữ liệu.
4. [04-backlog-trien-khai.md](04-backlog-trien-khai.md): các gói việc FE/BE/DB, thứ tự phụ thuộc, tiêu chí hoàn thành.
5. [05-kiem-thu-nghiem-thu.md](05-kiem-thu-nghiem-thu.md): kịch bản kiểm thử và điều kiện phát hành.
6. [06-quyet-dinh-can-chot.md](06-quyet-dinh-can-chot.md): các quyết định nghiệp vụ cần xác nhận trước khi viết phần liên quan.

## Phân loại ưu tiên

- **P0 — sai kết quả hoặc mất yêu cầu:** các form dùng `localStorage` hay chỉ hiện toast; lỗi CSRF sau đăng nhập; thông báo đọc sai trường; thiếu quyền truy cập dữ liệu cư dân.
- **P1 — luồng thuê nhà hoàn chỉnh:** nguồn dữ liệu chung cho tin đăng, phòng, khách, hợp đồng, lịch xem, yêu cầu; tài chính và công nợ thật.
- **P2 — vận hành và biên tập:** báo cáo, nội dung website, tuyển dụng, tìm kiếm nâng cao, sao lưu và quan sát hệ thống.

## Giới hạn thiết kế

- `frontend/src/data/listings.js` chứa dữ liệu giới thiệu, tin đăng và nội dung biên tập. Không đồng nhất toàn bộ dữ liệu này với bảng `phong`: một phòng vận hành và một tin đăng công khai có vòng đời khác nhau.
- F2 đã thay kho yêu cầu trong trình duyệt bằng API và migration V2; cần xác minh khi chạy stack. Đơn ứng tuyển vẫn cần backend và database ở F7.
- Bộ tính ngân sách, thao tác mở FAQ, sao chép link, so sánh và lưu căn của khách chưa đăng nhập có thể xử lý trên FE. Danh sách căn dùng để tính/so sánh vẫn phải đến từ API thật.
- Thanh toán online, gửi email/SMS và cổng cho chủ sở hữu là các tích hợp riêng; không coi là đã có chỉ vì giao diện nhắc đến.

## Mốc bàn giao đề xuất

| Mốc | Kết quả sử dụng được | Phụ thuộc |
| --- | --- | --- |
| M0 | Cấu hình, migration, bảo mật, test và lint nền tảng | Quyết định schema hiện hữu |
| M1 | Form công khai/cư dân tạo phiếu thật, nhân viên xử lý từ máy khác | M0 |
| M2 | Tin đăng và khu vực lấy DB; tìm kiếm, bản đồ, wishlist, lịch xem có dữ liệu thật | M0, M1 |
| M3 | Phòng → hợp đồng → chỉ số → hóa đơn → thanh toán → công nợ → thanh lý | M0, M2 |
| M4 | Cổng cư dân, thông báo, báo cáo, tuyển dụng/nội dung và triển khai ổn định | M1–M3 |

Mỗi mốc phải hoàn thành cả BE, FE, migration, kiểm thử và tài liệu API; không bàn giao màn hình chỉ có dữ liệu mẫu như chức năng đã hoàn thành.
