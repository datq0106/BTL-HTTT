# Kiểm thử và nghiệm thu toàn hệ thống

Repo hiện chưa có `src/test`. Bộ kiểm thử phải theo luồng nghiệp vụ, không chỉ kiểm tra một phương thức gọi repository. Dữ liệu kiểm thử chạy trên DB tách biệt; không dùng database MySQL ngoài đang có dữ liệu thật.

## 1. Kiểm thử BE

| Nhóm | Tình huống tối thiểu |
| --- | --- |
| Xác thực/CSRF | Login đúng/sai; lấy CSRF trước và sau login; logout; session hết hạn; tài khoản khóa; đổi mật khẩu và phiên cũ. |
| Quyền | Khách chưa đăng nhập chỉ xem tin public; `QUAN_LY` không quản tài khoản; cư dân không gọi API staff; cư dân A không xem hợp đồng, CCCD, phiếu, hóa đơn của B dù đoán được ID. |
| Hợp đồng | Tạo/gia hạn/thanh lý; giá/cọc âm; ngày sai; phòng bảo trì/đang thuê; hai request tạo đồng thời; người ở cùng không hợp lệ; trigger/service cập nhật phòng. |
| Lead và lịch xem | Dữ liệu thiếu/sai, ID tin không tồn tại/ẩn, gửi trùng, rate limit, staff xác nhận/từ chối, người không có mã không đọc được thông tin riêng. |
| Phiếu hỗ trợ | Cư dân gửi, staff phân công/đổi trạng thái/phản hồi, lịch sử không mất, cư dân khác bị 403/404 phù hợp thiết kế. |
| Chỉ số/hóa đơn/tiền | Chỉ số mới thấp hơn cũ, hai hóa đơn cùng kỳ, giá dịch vụ thay đổi sau chốt, trả một phần/đủ/vượt, trùng mã thanh toán, hủy/điều chỉnh, công nợ và hoàn cọc. |
| Upload | File quá lớn, sai MIME/chữ ký, tên có đường dẫn, đọc không quyền, thay ảnh và dọn file cũ, file thiếu trên storage. |
| Scheduler | Hợp đồng hết hạn, thông báo mốc 30/15/7/3/1/0 ngày, chạy lại cùng ngày không gửi trùng, timezone gần nửa đêm. |
| Migration | DB mới áp toàn bộ migration; DB baseline có dữ liệu nâng cấp được; kiểm tra bảng/index/FK/routine; rollback bằng backup đã thử. |

Ưu tiên integration test API với MySQL tương thích production cho stored procedure/trigger/SQL đặc thù; unit test cho phép tính tiền và chuyển trạng thái. Không thay thế kiểm thử DB bằng mock repository cho các ràng buộc cạnh tranh.

## 2. Kiểm thử FE

- Mỗi route trong [ma trận giao diện](01-ma-tran-giao-dien.md): mở bằng link trực tiếp và reload; trạng thái đang tải/rỗng/lỗi/không quyền; responsive trên điện thoại và desktop.
- Form: validate trước khi gửi, nút chống gửi hai lần, hiển thị lỗi từ API; toast thành công chỉ sau `2xx`; không mất dữ liệu đã nhập khi lỗi mạng.
- Danh sách: bộ lọc gắn URL, phân trang/sort nhất quán với BE; khi tin bị ẩn sau lúc lưu vào shortlist/compare thì không crash.
- Auth: vừa login có thể `POST/PUT/DELETE` nhờ CSRF token mới; 401 về login, 403 báo thiếu quyền; logout xóa trạng thái FE.
- Thông báo: `daDoc == null` hiện chưa đọc; dùng `createdAt` hiển thị thời điểm; đánh dấu một/tất cả cập nhật badge.
- Website: form liên hệ, brief, chủ nhà, đặt lịch, chi tiết căn, tuyển dụng đều gửi thật; trang xác nhận tải lại vẫn tra được mã hợp lệ.
- Cổng cư dân: phiếu của người khác không xuất hiện; dịch vụ ước tính có nhãn rõ và không bị trình bày như hóa đơn đã chốt.

## 3. Kịch bản E2E bắt buộc

1. **Khách → nhân viên:** khách ở trình duyệt A tìm căn theo giá/khu → xem chi tiết → đặt lịch → nhận mã `cho_xac_nhan`; nhân viên ở trình duyệt B thấy phiếu → xác nhận; khách tra cứu thấy lịch đã xác nhận.
2. **Cư dân → nhân viên:** cư dân A báo sự cố → staff nhận và phản hồi → A thấy lịch sử; cư dân B không xem được phiếu A qua UI hoặc gọi thẳng API.
3. **Thuê nhà:** staff tạo loại phòng/phòng/khách → ký hợp đồng → phòng thành đang thuê → gia hạn → hết hạn/thanh lý → phòng trở lại trạng thái đúng. Người ở cùng được xử lý theo chính sách đã chốt.
4. **Thu tiền:** nhập chỉ số hai kỳ → tạo/chốt hóa đơn → ghi thu một phần → công nợ giảm → ghi đủ → công nợ bằng 0; đổi giá dịch vụ không làm đổi hóa đơn kỳ trước.
5. **Tin đăng:** staff tạo tin nháp → xuất bản → khách thấy → ẩn → khách không thấy trong tìm kiếm, link cũ có phản hồi phù hợp.
6. **Ứng tuyển:** ứng viên gửi form ở trang danh sách hoặc chi tiết → staff thấy cùng một hồ sơ, không có toast thành công nếu BE lỗi.
7. **Khôi phục:** backup DB và upload → tạo thêm bản ghi/ảnh → restore ở môi trường thử → bản ghi và file khớp, hệ thống khởi động được.

## 4. Cổng chất lượng cho từng gói việc

- Có migration và đường nâng cấp dữ liệu; không sửa schema thủ công chỉ trên một máy.
- API có DTO, validation, phân quyền, mã lỗi, phân trang nếu là danh sách; cập nhật tài liệu OpenAPI/contract.
- FE không còn dữ liệu mẫu trong luồng thật, xử lý loading/empty/error và quyền; test thao tác quan trọng.
- Test BE/FE/E2E của luồng qua; `mvn test`, `npm run build`, `npm run lint` qua trên CI.
- Không lộ secret, CCCD, mật khẩu hay dữ liệu cư dân trong log/browser storage; đã kiểm tra quyền bằng tài khoản khác.
- Có hướng dẫn vận hành, backup và cách đối soát sau deploy.

## 5. Điều kiện kết thúc dự án

Mọi route trong `frontend/src/App.jsx` được đánh dấu một trong hai trạng thái: **có dữ liệu thật và test E2E**, hoặc **trang nội dung tĩnh đã được duyệt và tương tác FE hoạt động**. Không còn form chỉ `preventDefault`/toast hoặc lưu `localStorage` mà tự nhận là đã gửi cho nhân viên. Các ngoại lệ như tính ngân sách cục bộ, FAQ và lưu căn của khách ẩn danh phải được ghi rõ là chức năng cục bộ.
