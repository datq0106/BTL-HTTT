# Ma trận giao diện và phần còn thiếu

Nguồn route: `frontend/src/App.jsx`. Nguồn API FE: `frontend/src/api/services.js`. Ký hiệu: **API** = đã gọi BE, **tĩnh** = `frontend/src/data/listings.js`, **local** = `localStorage`, **toast** = chỉ hiện thông báo. “Đã gọi API” chỉ xác nhận nối mã nguồn; chưa chứng minh hoạt động với database thật.

**Cập nhật F2 (27/10/2026):** các dòng về form liên hệ, brief, chủ nhà, quan tâm căn, đặt lịch, xác nhận, concierge và trang yêu cầu nhân viên ở bảng dưới mô tả hiện trạng trước F2. Chúng đã chuyển sang API/DB trong mã nguồn; đối chiếu [hợp đồng API F2](07-f2-api-thuc-te.md). **Cập nhật F3:** danh sách, chi tiết, khu vực, bản đồ, ngân sách, so sánh, shortlist đọc tin đăng từ API; nhân viên quản lý tin ở `/quan-ly/tin-dang` ([API F3](08-f3-api-thuc-te.md)).

## Website công khai

| Route | Hiện tại | Cần bổ sung để dùng thật |
| --- | --- | --- |
| `/` | Nội dung, khu vực, tin nổi bật tĩnh; ô tìm kiếm chuyển route | Tin nổi bật và khu vực từ API; chỉ đưa tin đã xuất bản; trạng thái tải/rỗng/lỗi. Nội dung thương hiệu có thể tiếp tục tĩnh nếu đã chốt. |
| `/bat-dong-san` | Lọc/sắp xếp trên mảng `LISTINGS` | API tìm kiếm có phân trang, lọc giá/khu/loại/số phòng ngủ/trạng thái, sắp xếp; đồng bộ bộ lọc với URL. |
| `/bat-dong-san/:id` | Tin và ảnh tĩnh; quan tâm gửi `localStorage` | Chi tiết tin, ảnh, giá và tình trạng từ DB; form tạo lead gắn `tinDangId`; xử lý tin đã ẩn/không tồn tại; tin tương tự từ API. Nút sao chép link hoạt động tại FE. |
| `/ban-do` | Pin/khu vực/tin tĩnh | Tọa độ từ DB, bộ lọc cùng API danh sách; khi chọn pin mở tin đúng. Nếu chỉ có sơ đồ minh họa, ghi rõ phạm vi; không hiển thị tọa độ giả như vị trí thực. |
| `/brief` | Form ghi `localStorage` | Tạo lead loại `tim_can`, giữ tiêu chí tìm nhà trong DB; trả mã phiếu để trang xác nhận hiển thị dữ liệu đã lưu. |
| `/dat-lich` | Căn từ `LISTINGS`, form ghi `localStorage` | Lấy căn đang nhận lịch từ API, gửi thời gian/khung giờ hợp lệ; chống gửi lặp; trả booking ID. |
| `/dat-lich/xac-nhan` | Dựa vào React Router state; tải lại có thể mất thông tin | Tra mã yêu cầu/booking bằng ID hoặc token an toàn; hiển thị trạng thái thực, không tự nhận đã xác nhận khi BE chưa lưu. |
| `/lien-he` | Form ghi `localStorage`, toast thành công | Tạo lead loại `lien_he`; validate, chống spam, thông báo lỗi; chỉ báo thành công sau HTTP 201. |
| `/chu-nha` | Nội dung tĩnh, form ghi `localStorage` | Lead loại `chu_nha`, thông tin tài sản và kênh liên hệ; staff có màn nhận/xử lý. |
| `/quan-tam` | Danh sách ID trong `localStorage` | Tra chi tiết tin theo danh sách ID từ API; bỏ tin đã ẩn/hết hiệu lực; khách chưa đăng nhập vẫn có thể lưu cục bộ. Đồng bộ tài khoản là quyết định mở rộng. |
| `/so-sanh` | So sánh các bản ghi tĩnh | Dùng chi tiết tin API cho các ID đã chọn; tính giá/diện tích/tiện ích từ dữ liệu mới nhất, xử lý tin bị gỡ. |
| `/ngan-sach` | Phép tính FE hoạt động, gợi ý từ `LISTINGS` | Giữ phép tính ở FE; lấy gợi ý căn theo mức giá/khu vực từ API. Làm rõ đây là ước tính, không phải báo giá. |
| `/khu-vuc`, `/khu-vuc/:id` | Khu vực và tin theo khu vực tĩnh | Bảng khu vực/địa điểm và API; số tin, giá tham khảo tính từ tin đang xuất bản; slug ổn định. |
| `/dich-vu`, `/dich-vu/:id` | Nội dung dịch vụ marketing tĩnh | Nếu biên tập qua admin: API nội dung. **Không** dùng trực tiếp `/api/dich-vu` hiện tại vì đó là dịch vụ tính phí của hợp đồng. |
| `/thi-truong`, `/thi-truong/:id` | Bài viết tĩnh | Bài viết có nháp/xuất bản, slug, ảnh, ngày đăng; API công khai và giao diện biên tập nếu yêu cầu cập nhật nội dung. |
| `/doi-ngu`, `/doi-ngu/:id` | Hồ sơ tư vấn tĩnh | Hồ sơ nhân sự/địa bàn từ CMS nếu có quản trị; liên kết tin theo advisor bằng ID thật. |
| `/tuyen-dung`, `/tuyen-dung/:id` | Tin tuyển dụng tĩnh; form chỉ hiện toast | Danh sách vị trí mở từ DB/CMS; `POST` hồ sơ ứng tuyển, staff nhận được; form lỗi/thành công dựa trên phản hồi BE. Quyết định có upload CV hay không. |
| `/bao-chi`, `/loi-khach`, `/huong-dan`, `/quy-trinh` | Nội dung tĩnh | Có thể giữ tĩnh khi ít cập nhật; nếu cần quản trị, dùng CMS xuất bản. Xác minh link, ảnh và nội dung thật trước phát hành. |
| `/hoi-dap`, `/chinh-sach`, `/ve-chung-toi` | Nội dung tĩnh; FAQ mở/đóng tại FE | FAQ tương tác đã dùng được; nội dung pháp lý/chính sách cần người phụ trách duyệt; CMS nếu muốn sửa mà không deploy. |

`/dich-vu` trên website là dịch vụ giới thiệu; `/quan-ly/dich-vu` là bảng giá dịch vụ tính tiền. Hai nguồn dữ liệu cần tách rõ trong tên DTO/API.

## Đăng nhập và trang quản lý

| Route | Hiện tại | Cần bổ sung/sửa |
| --- | --- | --- |
| `/dang-nhap` | Gọi `/api/auth/login`; trước login gọi `/me` lấy CSRF | Sau login lấy CSRF token mới; lỗi 401/403 rõ ràng; quản lý phiên và tài khoản bị khóa. |
| `/quan-ly` | Dashboard API: số phòng, tỷ lệ lấp đầy, hợp đồng sắp hết | Chỉ số doanh thu/công nợ/yêu cầu nếu giao diện bổ sung; bộ lọc kỳ, quyền truy cập, dữ liệu có thể đối soát. |
| `/quan-ly/phong`, `/quan-ly/phong/:id` | Danh sách, CRUD, đổi trạng thái, chi tiết qua API | Ảnh, địa chỉ/tòa nhà, tin đăng liên kết; chặn đổi/xóa sai trạng thái; hiển thị hợp đồng hiện tại và lịch sử. |
| `/quan-ly/loai-phong` | CRUD qua API | Kiểm tra phòng đang dùng loại; tiền/diện tích hợp lệ, thông báo lỗi khóa ngoại. |
| `/quan-ly/khach-thue`, `/quan-ly/khach-thue/:id` | CRUD và upload tài liệu qua API | Chính sách xem CCCD, tạm trú, người ở cùng và hợp đồng của họ; quản lý lỗi upload, tài liệu mất trên disk, lưu trữ/sao lưu. |
| `/quan-ly/hop-dong`, `/quan-ly/hop-dong/:id` | Tạo, xem, gia hạn, thanh lý qua API; in trình duyệt | Kiểm tra trùng phòng, số người, giá/cọc, lịch sử thay đổi; công nợ thật; mẫu in/PDF nếu cần văn bản chính thức. |
| `/quan-ly/dich-vu` | CRUD bảng giá qua API | Chốt cách lưu giá tại thời điểm ký và cách sửa giá cho kỳ mới; tránh hóa đơn cũ thay đổi khi bảng giá đổi. |
| `/quan-ly/yeu-cau` | Toàn bộ dữ liệu từ `localStorage`; tạo/lọc/xử lý/xóa chỉ trên một máy | API tìm kiếm, phân công, cập nhật trạng thái, phản hồi và lịch sử; xác nhận xóa/đóng phiếu; badge đếm từ API. |
| `/quan-ly/tai-khoan` | Admin tạo/sửa/khóa qua API | Không tự khóa admin cuối; thu hồi phiên tài khoản bị khóa; xử lý đổi vai trò, đặt lại mật khẩu an toàn. |
| `/quan-ly/thong-bao` | Có API nhưng dùng sai trường `createdAt`/`updatedAt` | Chưa đọc = `daDoc == null`, thời gian = `createdAt`; kiểm tra đánh dấu đã đọc và bộ đếm badge. |
| `/quan-ly/doi-mat-khau` | Gọi API | Sau đổi mật khẩu thu hồi phiên khác hoặc yêu cầu đăng nhập lại theo chính sách đã chốt. |
| `/quan-ly/ho-so` | Hiển thị dữ liệu `/auth/me` | Quyết định hồ sơ chỉ xem hay cho sửa; nếu cho sửa cần API riêng, không dùng API quản trị tài khoản. |

## Cổng cư dân

| Route | Hiện tại | Cần bổ sung/sửa |
| --- | --- | --- |
| `/quan-ly/cong-cu-dan` | Hợp đồng và số thông báo từ API | Yêu cầu/hóa đơn gần hạn từ API; không dùng số liệu, hotline hoặc người mẫu cố định trong dữ liệu cá nhân. |
| `/quan-ly/hop-dong-cua-toi` | API chỉ tìm hợp đồng theo khách đại diện | Quyết định quyền của người ở cùng; chỉ hiện hợp đồng, tài liệu và tiền của người có quyền. |
| `/quan-ly/dich-vu-cu-dan` | Hợp đồng từ API, tiền điện/nước ước tính bằng giá mặc định và ô nhập FE | Bảng giá thực, chỉ số thực, hóa đơn thực; giữ máy tính chi phí ở mục “ước tính” riêng. |
| `/quan-ly/ho-tro` | Lịch sử lấy mọi phiếu `cu_dan` trong cùng trình duyệt; gửi bằng `localStorage`, có thông tin fallback giả | API `cua-toi` theo tài khoản đăng nhập; BE tự xác định `khachThueId`, phòng, SĐT; staff phản hồi qua API; bỏ fallback giả. |

## Tương tác dùng FE nhưng phải nối dữ liệu thật

- Tìm kiếm, bộ lọc, phân trang, bản đồ, tin tương tự và gợi ý ngân sách: UI xử lý tương tác, API cung cấp tin đã xuất bản.
- Lưu căn, so sánh, sao chép link, FAQ, gallery và in trình duyệt: có thể ở FE; cần kiểm thử khi tin bị xóa/ẩn, không cần tạo API riêng nếu không đồng bộ đa thiết bị.
- Toast thành công của mọi form: chỉ hiển thị sau khi BE xác nhận; không suy luận từ việc `localStorage.setItem` hoặc `preventDefault`.
