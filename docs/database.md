# Database baseline và quy trình nâng cấp

## DB local mới

Compose tạo database `quan_ly_nha_tro` rỗng. Flyway tự chạy `V1__baseline.sql`, gồm 10 bảng cốt lõi, ba vai trò, trigger trạng thái phòng, function hoàn cọc và procedure thanh lý. MySQL local bật `log_bin_trust_function_creators=1` để user ứng dụng có thể tạo routine. Đây là cấu hình cho local Compose; nếu dùng DB quản lý bên ngoài, quyền tạo routine phải được kiểm tra với nhà cung cấp.

Migration V1 bất biến sau khi phát hành. Mọi thay đổi tiếp theo là `V2__*.sql`, `V3__*.sql` trong `backend/src/main/resources/db/migration`. Không dùng `ddl-auto=create` hoặc `update` với dữ liệu đang có.

## DB hiện hữu (Aiven hoặc một MySQL khác)

Repo ban đầu có URL Aiven nhưng không có schema dump, nên chưa thể khẳng định V1 khớp DB đó. Việc áp V1 lên DB hiện hữu sẽ dừng vì `spring.flyway.baseline-on-migrate=false`. Trình tự trước khi kết nối:

1. Sao lưu đầy đủ DB và tệp upload, restore vào một DB staging độc lập; giữ bản sao trước và sau.
2. Lấy schema-only dump có `--no-data --routines --triggers --events`, rồi thống kê bảng, cột, kiểu/nullable, index/FK, trigger và routine. Đối chiếu từng mục với V1 và mapping entity. Đặc biệt kiểm tra `thong_bao.da_doc` là `DATETIME NULL`, `sp_thanh_ly_hop_dong`, `fn_tinh_hoan_coc`, `fn_cong_no_hop_dong` nếu có, và trigger đổi trạng thái phòng.
3. Kiểm tra dữ liệu đang có: số dòng từng bảng, hợp đồng hiệu lực trùng phòng, tài khoản admin, tệp được tham chiếu, cột nullable, mã trạng thái. Sửa sai lệch bằng migration riêng sau khi xác định rõ dữ liệu cần backfill.
4. Chỉ khi DB staging tương đương V1 mới baseline ở version `1` bằng Flyway trên staging, chạy `validate` và backend với `ddl-auto=validate`. Sau đó thử luồng đăng nhập, hợp đồng, tải tệp và backup/restore.
5. Lặp lại trên DB thật trong cửa sổ triển khai có kế hoạch rollback từ backup. Không bật `baseline-on-migrate=true` thường trực và không chạy `repair` để bỏ qua migration lỗi.

V1 local chưa có bảng hóa đơn/thanh toán hoặc `fn_cong_no_hop_dong`. Công nợ hiện tại trong mã BE vẫn là giá trị tạm; F5 sẽ đưa mô hình công nợ thật và bỏ fallback. Không coi số 0 hiện tại là xác nhận đã thanh toán.

## Backup/restore local

`scripts/database.py backup <folder>` tạo `database.sql` bằng `mysqldump --single-transaction --routines --triggers --events` và `uploads.tar`. Script ghi byte thô, tránh PowerShell chuyển SQL thành UTF-16. Thư mục `backups/` được Git bỏ qua; cần lưu bản sao ở nơi an toàn khác nếu dùng lâu dài.

`scripts/database.py restore <folder> --database <empty_db>` tạo DB đích nếu cần, từ chối nếu đã có bảng, rồi nhập SQL. Dùng `--with-uploads` khi muốn giải nén `uploads.tar` vào volume backend; chỉ dùng với bản backup tin cậy. Kiểm tra số dòng, routine và tải tệp sau restore trước khi chuyển ứng dụng sang DB đã khôi phục.
