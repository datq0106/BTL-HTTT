# Quyết định nghiệp vụ cần chốt

Kế hoạch có thể bắt đầu bằng kiểm kê, bảo mật và test; các quyết định dưới đây cần được xác nhận trước khi triển khai module tương ứng. Giá trị trong cột “mặc định đề xuất” là giả định để ước lượng, **chưa phải yêu cầu đã được phê duyệt**.

| ID | Cần quyết định | Mặc định đề xuất | Ảnh hưởng |
| --- | --- | --- | --- |
| Q1 | Một nhà trọ hay nhiều tòa nhà/bất động sản? | Nhiều bất động sản vì website có nhiều khu vực và căn | Bảng địa điểm, FK phòng, lọc tin, báo cáo, quyền nhân viên theo tòa. |
| Q2 | Tin công khai gắn 1:1 với phòng hay một tin có nhiều căn tương tự? | **Đã chốt 28/10/2026:** một tin gắn một phòng; giá/ảnh/địa chỉ xuất bản riêng | Model tin đăng, slug, tình trạng còn nhận lịch. |
| Q3 | Phòng đang thuê có được hiển thị và nhận lịch cho kỳ sau? | Hiển thị tùy chọn, không nhận lịch nếu chưa có ngày sẵn sàng | Bộ lọc public và luồng đặt lịch. |
| Q4 | Người ở cùng có tài khoản cư dân và được xem hợp đồng/hóa đơn không? | Có tài khoản riêng; chỉ xem phần hồ sơ được ủy quyền | Query `/api/khach/*`, bảo mật dữ liệu tiền/tài liệu. |
| Q5 | Chu kỳ thuê và lập hóa đơn? Ngày bắt đầu giữa tháng tính thế nào? | Hàng tháng; phần tháng đầu/cuối theo quy tắc cần chốt | Công thức tiền, hạn trả, công nợ, test. |
| Q6 | Giá điện/nước tính theo chỉ số, người hay cố định? Có định mức/bậc thang? | Chỉ số cho điện/nước; dịch vụ cố định chụp giá tại kỳ | Bảng chỉ số, dòng hóa đơn, UI ước tính. |
| Q7 | Cọc được giữ/hoàn khi còn công nợ hoặc khấu trừ vượt cọc? | Không thanh lý tự động khi chưa đối soát; lưu chứng từ điều chỉnh | Procedure thanh lý, trạng thái phòng, báo cáo. |
| Q8 | Thu tiền thủ công hay thanh toán trực tuyến? | Ghi nhận chuyển khoản/tiền mặt trước; online gateway là giai đoạn riêng | Bảng giao dịch, webhook, đối soát, chi phí tích hợp. |
| Q9 | Yêu cầu công khai/cư dân và sự cố bảo trì dùng chung phiếu? | Chung bảng `yeu_cau`, mở rộng phần bảo trì khi cần | Tránh hai nguồn trạng thái và hai badge. |
| Q10 | Lịch xem có giờ cụ thể, ai xác nhận, có chống trùng không? | Khách đề nghị khung; staff xác nhận giờ; chặn hai lịch độc quyền cùng căn | Form, lịch staff, thông báo. |
| Q11 | Kênh thông báo: trong app, email, SMS/Zalo? | Trong app trước; email/SMS/Zalo sau khi có tài khoản dịch vụ | Job, consent, chi phí, retry. |
| Q12 | Nội dung website cần biên tập qua admin? | Tin đăng, tuyển dụng, bài thị trường cần CMS; trang giới thiệu/chính sách có thể tĩnh sau duyệt | Phạm vi CMS và màn admin. |
| Q13 | Hồ sơ ứng tuyển có CV đính kèm và thời hạn lưu? | Bắt đầu bằng form text; thêm CV khi quy trình tuyển dụng cần | Upload, quyền xem, lưu/xóa dữ liệu. |
| Q14 | Có cổng chủ sở hữu đăng nhập không? | Chưa có; `/chu-nha` chỉ gửi lead | Role mới, báo cáo theo tài sản, API riêng nếu mở rộng. |
| Q15 | DB MySQL hiện tại có những bảng/routine/trigger ngoài source? | Kiểm kê trước, giữ dữ liệu hiện có, baseline migration | Tránh ghi đè schema hoặc làm hỏng data production. |
| Q16 | Ai được phát hành tin, chốt hóa đơn, hủy thanh toán? | Chỉ `ADMIN` cho thao tác tài chính/đăng tin nhạy cảm cho đến khi có ma trận quyền | BE authorization, audit, UI nút hành động. |

## Dữ liệu cần bàn giao để chốt Q15

- Schema-only dump và danh sách routine/trigger của MySQL hiện hành; không gửi password trong tài liệu.
- Một số bản ghi **đã ẩn dữ liệu cá nhân** cho phòng, khách, hợp đồng, dịch vụ và hóa đơn/chỉ số nếu DB thực có sẵn.
- Quy tắc tính giá, cọc, hóa đơn, khấu trừ, hạn trả hiện đang dùng trên giấy hoặc bảng tính.
- Danh sách ai quản trị website, ai xử lý yêu cầu, ai duyệt tiền và tin đăng.

Sau khi chốt, cập nhật tài liệu này, khóa DTO/API trong [03-hop-dong-api.md](03-hop-dong-api.md), rồi mới nhận backlog liên quan để triển khai.
