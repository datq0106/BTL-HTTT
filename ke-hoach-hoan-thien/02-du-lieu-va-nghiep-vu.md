# Dữ liệu, quan hệ và quy tắc nghiệp vụ

## 1. Kiểm kê trước khi sửa DB

Các entity trong source hiện có: `vai_tro`, `tai_khoan`, `loai_phong`, `phong`, `khach_thue`, `hop_dong`, `hop_dong_khach`, `dich_vu`, `hop_dong_dich_vu`, `thong_bao`. Sau F0, repo có Flyway V1 cho DB mới và `ddl-auto=validate`; cấu hình Aiven gắn cứng đã bỏ. `sp_thanh_ly_hop_dong` có trong V1, còn `fn_cong_no_hop_dong` và mô hình hóa đơn chưa có. Schema thật của DB hiện hữu vẫn phải kiểm tra theo [quy trình database](../docs/database.md).

Trước migration đầu tiên phải xuất **schema-only dump** và danh sách `TABLES`, `VIEWS`, `TRIGGERS`, `ROUTINES`, index/FK của DB đang chạy; so với entity và dữ liệu thực. Sao lưu và thử restore trên DB tách biệt. Không dùng `ddl-auto=create/update` trên dữ liệu đang vận hành. Sau khi có baseline, mọi thay đổi dùng migration có thứ tự và kiểm tra `ddl-auto=validate` nếu mapping tương thích.

## 2. Bảng và thuộc tính cần bổ sung

| Nhóm | Bảng/thuộc tính đề xuất | Ràng buộc quan trọng |
| --- | --- | --- |
| Danh mục địa điểm | `bat_dong_san` (tên, địa chỉ, khu vực, tọa độ, chủ sở hữu nếu quản lý), `khu_vuc` | `phong.bat_dong_san_id` bắt buộc sau khi backfill; tọa độ chỉ lưu nếu vị trí được công bố. |
| Tin công khai | `tin_dang` (phòng, slug, tiêu đề, mô tả, giá niêm yết, cọc, phòng ngủ/tắm, nội thất, trạng thái, thời điểm xuất bản), `tin_dang_anh` | Một tin gắn đúng phòng; ảnh có thứ tự; chỉ tin `xuat_ban` mới ra API public; tránh dùng ảnh CCCD làm ảnh công khai. |
| Lead và lịch xem | `yeu_cau` (nguồn, loại, tên/SĐT/email liên hệ, tài khoản nếu có, phòng/tin nếu có, nội dung, ưu tiên, trạng thái, người xử lý, ngày tạo/cập nhật), `lich_xem` (tin, khung giờ đề nghị, khung xác nhận, trạng thái), `yeu_cau_lich_su` | Người gửi công khai không tự gán `taiKhoanId`/quyền; người gửi đã đăng nhập lấy danh tính từ phiên; lịch sử không sửa/xóa âm thầm. |
| Tuyển dụng | `tin_tuyen_dung`, `ung_tuyen` | Đơn ứng tuyển phải lưu trước khi báo thành công; email/ghi chú validate; tệp CV là quyết định riêng. |
| Chỉ số | `cong_to` hoặc cấu hình dịch vụ theo phòng, `chi_so` (phòng, dịch vụ, kỳ, chỉ số trước/sau, người ghi, thời điểm) | Duy nhất `(phong, dich_vu, ky)` khi đã chốt; chỉ số mới không nhỏ hơn cũ; xác định cách xử lý khi đổi khách giữa kỳ. |
| Hóa đơn | `hoa_don` (hợp đồng, kỳ, hạn trả, trạng thái, tổng, số đã trả), `hoa_don_chi_tiet` (loại khoản, mô tả, số lượng, đơn giá chụp tại kỳ, thành tiền) | Không tính lại hóa đơn cũ từ bảng giá hiện tại; một hợp đồng/kỳ chỉ có một hóa đơn chính thức; tiền dùng `DECIMAL`/`BigDecimal`. |
| Thanh toán | `thanh_toan` (hóa đơn, số tiền, phương thức, mã tham chiếu, người ghi, thời điểm, trạng thái) | Chống ghi hai lần cùng mã giao dịch; không vượt số còn nợ; điều chỉnh/hủy phải có dấu vết. |
| Kiểm soát | `audit_log` hoặc bảng lịch sử theo nghiệp vụ; version cho bản ghi sửa đồng thời | Ghi ai đổi hợp đồng, giá, hóa đơn, phiếu; không ghi mật khẩu hoặc nội dung CCCD vào log. |
| Biên tập website | `noi_dung`/`bai_viet`, `nhan_su`, `dich_vu_gioi_thieu`, `faq`, `loi_chung_thuc` nếu cần CMS | Tách dữ liệu marketing khỏi `dich_vu` tính phí. Chỉ bản xuất bản hiện public. Nội dung ít đổi có thể giữ trong source sau khi duyệt. |

Tên bảng cuối cùng phải theo schema thật và quyết định ở [06-quyet-dinh-can-chot.md](06-quyet-dinh-can-chot.md). Không tạo tất cả bảng CMS khi người dùng không cần biên tập.

## 3. Trạng thái và chuyển trạng thái

| Nghiệp vụ | Trạng thái tối thiểu | Quy tắc |
| --- | --- | --- |
| Tin đăng | `nhap` → `xuat_ban` → `an` | Chỉ staff được phát hành; phòng bảo trì/đã ẩn không thể nhận lịch mới theo chính sách đã chốt. |
| Lead/yêu cầu | `cho_xu_ly` → `dang_xu_ly` → `da_xu_ly`; có `da_huy` | Ghi lịch sử mỗi lần phân công, đổi trạng thái, phản hồi; staff không xóa cứng phiếu đã nhận. |
| Lịch xem | `cho_xac_nhan` → `da_xac_nhan` → `hoan_tat`; có `tu_choi`/`da_huy` | Không được hiển thị “đã xác nhận” ngay khi khách mới gửi. Tránh hai lịch xác nhận cùng phòng/khung giờ nếu lịch độc quyền. |
| Hợp đồng/phòng | Hợp đồng `hieu_luc`, `het_han`, `thanh_ly`; phòng theo trạng thái hiện có | Không có hai hợp đồng hiệu lực cùng phòng. Thay đổi hợp đồng và phòng trong một transaction hoặc bằng cơ chế DB thống nhất. |
| Hóa đơn | `nhap` → `da_chot` → `thanh_toan_mot_phan` → `da_thanh_toan`; có `huy` | Chỉ hóa đơn đã chốt mới thu tiền; thay đổi tiền sau chốt đi qua điều chỉnh có lịch sử. |
| Phiếu sự cố | Dùng `yeu_cau` loại `bao_tri` hoặc bảng sự cố riêng nếu cần SLA/thiết bị/chi phí | Chọn một nguồn dữ liệu chính, không tạo hai danh sách sự cố lệch nhau. |

## 4. Bất biến cần bảo vệ ở BE và DB

1. Mã phòng, CCCD, username, slug tin đăng và mã hóa đơn là duy nhất theo phạm vi nghiệp vụ.
2. Không trùng hợp đồng hiệu lực cho một phòng kể cả hai nhân viên tạo đồng thời; kiểm tra ở service và ràng buộc DB.
3. Giá thuê/cọc/đơn giá/số tiền ghi thu không âm; số lượng dịch vụ và chỉ số phù hợp quy tắc đã chốt.
4. Dữ liệu cư dân lấy từ tài khoản đăng nhập. FE không được gửi `khachThueId` rồi tự quyết quyền xem.
5. Hóa đơn chụp giá tại thời điểm chốt; thay đổi bảng giá về sau không đổi công nợ cũ.
6. Công nợ = tổng hóa đơn đã chốt còn hiệu lực trừ các khoản thanh toán hợp lệ. Nếu chưa có mô hình hóa đơn, trả trạng thái “chưa hỗ trợ” thay vì mặc định `0` như `HopDongServiceImpl.layCongNoAnToan` hiện tại.
7. Khi thanh lý, xác định rõ công nợ, tiền cọc, khấu trừ và hoàn cọc; không âm thầm trả phòng trống khi còn tranh chấp theo quy tắc đã chốt.
8. Thời gian nghiệp vụ dùng `Asia/Ho_Chi_Minh` thống nhất trong Java, DB và UI; lưu thời điểm có timezone rõ ràng, phân biệt với ngày lịch.
9. Ảnh/tài liệu cá nhân chỉ tải qua endpoint có kiểm tra quyền; quy định giữ/xóa và sao lưu cùng DB.

## 5. Migration và dữ liệu mẫu

- Tách migration **schema** và seed tối thiểu (ba vai trò). Dữ liệu mẫu tin đăng, khách và yêu cầu chỉ nạp ở môi trường demo/dev; không tạo dữ liệu giả cho người dùng thật.
- Với DB đã tồn tại: baseline sau khi đối chiếu schema; thêm cột nullable, backfill, tạo FK/index, rồi mới siết `NOT NULL` trong migration sau. Có script kiểm tra số bản ghi trước/sau.
- Stored procedure/trigger đang tồn tại trong DB phải được đưa vào version control hoặc chuyển logic sang service/transaction. Chọn một nơi quyết định trạng thái phòng và tiền thanh lý để tránh lệch.
- Các thay đổi migration có kế hoạch rollback bằng backup/restore và bước triển khai tương thích ngược; không dùng `docker compose down -v` như cách nâng cấp.
