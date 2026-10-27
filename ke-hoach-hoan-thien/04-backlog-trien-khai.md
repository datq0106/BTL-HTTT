# Backlog triển khai theo lát cắt FE + BE + DB

Mỗi mã việc là một gói có thể nghiệm thu độc lập. Thứ tự trong gói: migration/dữ liệu → BE/API/quyền → FE → kiểm thử. Ước lượng chỉ để sắp thứ tự, giả định 1 FE + 1 BE + QA bán thời gian; điều chỉnh sau khi kiểm tra schema MySQL thật.

## Nền tảng (làm trước các tính năng mới)

### F0 — Baseline database và triển khai (P0, 1–2 tuần)

**Tiến độ:** đã có bố cục `backend/` + `frontend/`, migration V1 cho DB mới, Compose local, healthcheck, backup/restore local, build/lint và smoke test upload/download. Còn đối chiếu schema Aiven, thử nâng cấp dữ liệu hiện hữu và đối soát tài liệu upload sau restore trên DB có dữ liệu.

- **DB/BE:** lấy schema-only dump và routine/trigger hiện hữu; lập migration baseline, chọn một cơ chế migration có phiên bản; đưa stored procedure/trigger cần thiết vào source hoặc chuyển logic sang service. Kiểm tra mapping entity so với schema, đặc biệt `thong_bao.da_doc` và công nợ.
- **Hạ tầng:** cấu hình FE build + reverse proxy `/api`, BE, MySQL hoặc DB ngoài; biến môi trường cho URL/user/password/initial admin; volume hoặc storage cho upload; healthcheck và backup/restore. Phần Compose local đã có; cấu hình DB ngoài cần đối chiếu schema.
- **FE:** xác nhận base URL cùng origin, URL SPA tải lại không 404; trạng thái lỗi mạng và 401/403 nhất quán.
- **Xong khi:** dựng môi trường mới từ hướng dẫn; nâng cấp DB có dữ liệu không mất bản ghi; đăng nhập, tải lại route sâu, upload và restore dữ liệu hoạt động.

### F1 — Xác thực, quyền, thông báo và chất lượng nền (P0, 1 tuần)

**Tiến độ:** đã bỏ mật khẩu admin cố định, kiểm tra tài khoản hiện tại trên mỗi request và hủy phiên sau khóa/đổi mật khẩu/đổi vai trò; sửa hợp đồng API thông báo, badge, CSRF sau login, ngày nghiệp vụ; có 5 test BE, 3 test FE và smoke test HTTP cho role, CSRF, IDOR, logout. Giới hạn còn lại: phiếu concierge vẫn ở `localStorage` cho tới F2, nên bộ lọc chủ phiếu trên FE chưa phải ranh giới bảo mật.

- **BE:** bỏ mật khẩu admin cố định trong `DataInitializer`; từ chối đăng nhập tài khoản khóa; thu hồi hoặc vô hiệu hóa phiên cũ sau khóa/đổi mật khẩu; kiểm tra quyền truy cập tài liệu và mọi ID của cư dân. Đồng nhất ngày nghiệp vụ `Asia/Ho_Chi_Minh`.
- **FE:** `AuthContext` đọc lại `/auth/me` sau login để lấy CSRF token mới; `ThongBaoPage` dùng `daDoc`/`createdAt`; badge thông báo và lỗi phiên hết hạn cập nhật chính xác. Bỏ dữ liệu cá nhân fallback giả ở concierge.
- **Kiểm thử:** BE có test login/logout/CSRF/role/IDOR, thay đổi mật khẩu, khóa tài khoản; FE sửa lint và test tối thiểu cho auth, thông báo.
- **Xong khi:** admin/staff/resident truy cập đúng route và API; tài khoản đã khóa không thể tiếp tục thao tác; thông báo mới hiện chưa đọc và được đánh dấu đúng.

## Dữ liệu chia sẻ giữa khách, nhân viên và cư dân

### F2 — Phiếu yêu cầu/lead/lịch xem (P0, 2 tuần; sau F0–F1)

**Tiến độ 27/10/2026:** đã thêm migration V2, API yêu cầu/lịch xem công khai, API cư dân theo phiên, API nhân viên để lọc/phân công/phản hồi/xác nhận lịch; nối các form FE và bỏ `yeuCauStore.js`. Chưa chạy build/test/migration theo yêu cầu lượt này. Cần xác minh với database MySQL và trình duyệt trước khi đánh dấu F2 hoàn tất.

- **DB:** thêm `yeu_cau`, `yeu_cau_lich_su`, `lich_xem` và index theo trạng thái/ngày/người gửi; migration và seed demo chỉ cho dev.
- **BE:** endpoint công khai liên hệ/brief/chủ nhà/quan tâm căn/đặt lịch; endpoint cư dân `yeu-cau cua-toi`; endpoint staff phân trang, lọc, phân công, phản hồi, đổi trạng thái, xác nhận lịch. Server gắn danh tính cư dân từ session. Validate SĐT/email/nội dung; rate limit form public; chống gửi trùng.
- **FE:** thay `yeuCauStore.js` tại `ContactPage`, `BriefPage`, `OwnersPage`, `PropertyDetailPage`, `ViewingPage`, `ConciergePage`, `YeuCauPage`, badge `Layout`. Bỏ bản ghi mẫu trong luồng thật. Trang xác nhận dùng mã trả về từ BE, không chỉ Router state.
- **Xong khi:** gửi ở trình duyệt A, nhân viên ở B thấy ngay sau tải; staff phản hồi, cư dân A thấy lịch sử và chỉ phiếu của mình; lỗi HTTP không hiện toast thành công.

### F3 — Danh mục bất động sản và tin công khai (P1, 2–3 tuần; sau F0, phối hợp F2)

- **DB:** khu vực/địa điểm, bất động sản, liên kết phòng, tin đăng, ảnh/tệp công khai; backfill phòng cũ. Tách giá thuê trong hợp đồng, giá loại phòng và giá niêm yết.
- **BE:** quản lý bất động sản/tin/ảnh; phát hành/ẩn; API public danh sách, chi tiết, khu vực, tin tương tự, bản đồ. Quy tắc phòng bảo trì/ẩn/đang thuê có được hiện và nhận lịch phải được chốt.
- **FE staff:** bổ sung trang quản lý tin/ảnh hoặc mở rộng trang phòng với phần phát hành; hiển thị lỗi upload và xem trước.
- **FE public:** chuyển Home, Listings, PropertyDetail, Districts/Detail, Map, Budget, Shortlist, Compare, AdvisorDetail, Viewing sang ID/slug và API thật. Giữ tương tác lọc/sort/map/so sánh hiện có; thêm loading, empty, 404.
- **Xong khi:** staff sửa và xuất bản một tin, khách ở trình duyệt khác tìm thấy đúng giá/ảnh/trạng thái; tin bị ẩn không còn trong danh sách, link chi tiết xử lý đúng.

## Luồng thuê và tiền

### F4 — Hợp đồng và hồ sơ cư dân (P1, 1–2 tuần; sau F0–F1)

- **BE:** khóa cạnh tranh khi lập hợp đồng và ràng buộc một phòng/một hợp đồng hiệu lực; thống nhất trigger/service đổi trạng thái phòng; kiểm tra người ở cùng không nằm trong hợp đồng hiệu lực không tương thích. Quyết định người ở cùng được xem gì. Ghi audit gia hạn/thanh lý/giá/cọc.
- **FE:** form tạo/gia hạn/thanh lý giải thích lỗi nghiệp vụ; trang chi tiết thể hiện người đại diện, người ở cùng, dịch vụ và lịch sử đúng; in từ dữ liệu BE, mẫu PDF nếu cần ký/lưu.
- **Xong khi:** hai yêu cầu lập hợp đồng cùng phòng chỉ một thành công; gia hạn/thanh lý cập nhật phòng và lịch sử; cư dân không xem được hợp đồng người khác.

### F5 — Chỉ số, hóa đơn, thanh toán, công nợ (P1, 3–4 tuần; sau F4)

- **DB:** bảng chỉ số/kỳ, hóa đơn, dòng chi tiết, thanh toán; index/unique theo hợp đồng+kỳ, mã giao dịch. Migration giữ được dữ liệu hợp đồng cũ.
- **BE:** nhập/chốt chỉ số, tính tiền phòng và dịch vụ theo giá chụp tại kỳ, tạo/chốt/hủy hóa đơn, ghi thu một phần/đủ, tính công nợ, hạn trả, thông báo. Dùng transaction và `BigDecimal`; quy tắc hoàn cọc khi thanh lý có số nợ phải được chốt trước.
- **FE staff:** trang nhập chỉ số, hóa đơn, thu tiền, lịch sử và lọc theo kỳ/phòng/trạng thái; bổ sung công nợ thật vào hợp đồng/dashboard.
- **FE cư dân:** hóa đơn, chỉ số, lịch sử thanh toán và tải bản in; `DichVuCuDanPage` tách “ước tính” khỏi “đã chốt”.
- **Xong khi:** chỉ số → hóa đơn → hai lần trả một phần → hết nợ; hệ thống từ chối chỉ số giảm, thu vượt nợ, ghi trùng và sửa hóa đơn đã chốt không qua điều chỉnh.

### F6 — Sự cố, tạm trú và thông báo (P1, 1–2 tuần; sau F2)

- **BE:** chọn dùng `yeu_cau` loại bảo trì/tạm trú hoặc bảng chuyên biệt; nếu có SLA, thiết bị, chi phí, ảnh hiện trường thì thêm dữ liệu riêng. Tạo thông báo khi nhận/đổi trạng thái/giải quyết; job nhắc hạn idempotent.
- **FE:** form cư dân gửi sự cố có ảnh nếu cần; nhân viên cập nhật tiến độ/chi phí; trạng thái tạm trú/tài liệu của khách thuê; cổng cư dân hiển thị phản hồi theo phiếu.
- **Xong khi:** cư dân A chỉ xem sự cố của mình; staff có thể nhận việc và phản hồi; thông báo không gửi trùng; tài liệu tạm trú chỉ lộ cho người có quyền.

## Nội dung, báo cáo và phát hành

### F7 — Tuyển dụng và nội dung website (P1/P2, 1–3 tuần; sau F0)

- **Bắt buộc để form dùng được:** `CareersPage` và `CareerDetailPage` gửi hồ sơ qua BE, trả mã, validate và hiển thị lỗi; staff có nơi xem/xử lý. Nếu cần CV, thêm upload riêng có kiểm soát loại/size/quyền.
- **Nếu nội dung cần cập nhật không deploy:** CMS cho bài thị trường, đội ngũ, dịch vụ giới thiệu, tuyển dụng, FAQ, lời khách, chính sách, báo chí; nháp/xuất bản và slug. Không nhập dữ liệu mẫu vào production như nội dung thật.
- **Nếu nội dung ít đổi:** duyệt và giữ các trang thuần giới thiệu tĩnh; kiểm tra link, ảnh, số điện thoại, địa chỉ, tên thương hiệu, ngày hiệu lực chính sách. Các trang tĩnh vẫn được xem là hoạt động nếu nội dung đúng.
- **Xong khi:** hai form ứng tuyển thật sự lưu; các trang nội dung không có link chết hay dữ liệu demo chưa duyệt; nếu chọn CMS, biên tập rồi xuất bản được từ UI staff.

### F8 — Báo cáo, hiệu năng và phát hành (P2, 1–2 tuần; sau F2–F6)

- **BE:** dashboard theo kỳ/khu, tỷ lệ lấp đầy, hợp đồng sắp hạn, phiếu chưa xử lý, doanh thu/công nợ; truy vấn có index, phân trang, xuất CSV/PDF nếu được yêu cầu.
- **FE:** số liệu giải thích rõ kỳ tính, bộ lọc và trạng thái; không pha số mẫu vào số thật.
- **Vận hành:** CI chạy build/lint/test, staging với dữ liệu giả riêng, backup DB + upload, thử restore, log lỗi và healthcheck; kiểm tra giới hạn bộ nhớ Docker.
- **Xong khi:** số dashboard đối soát được từ danh sách chi tiết; deploy lại và restore không mất ảnh/tài liệu; luồng smoke test qua một domain hoạt động.

## Thứ tự và ước lượng tổng

`F0 → F1 → F2` là đường găng vì form hiện báo đã gửi nhưng không có dữ liệu chia sẻ. `F3` và `F4` có thể làm song song sau F0. `F5` cần F4; `F6` cần F2; `F7` làm sau nền tảng; `F8` đóng dự án. Tổng ước lượng **12–18 tuần** với nhân sự giả định ở đầu tài liệu, chưa gồm tích hợp thanh toán online/email/SMS hay chủ sở hữu đăng nhập. Không cam kết lịch trước khi kiểm tra DB hiện hữu và chốt [các quyết định nghiệp vụ](06-quyet-dinh-can-chot.md).
