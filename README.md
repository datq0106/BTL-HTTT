# Hệ thống quản lý cho thuê

## Cấu trúc repo

| Thư mục | Vai trò |
| --- | --- |
| `backend/` | Spring Boot API; `src/main/java/com/quanlitro` tách controller, service, repository, entity, DTO, config. |
| `backend/src/main/resources/db/migration/` | Flyway migration có phiên bản. `V1__baseline.sql` chỉ dành cho DB MySQL mới, rỗng. |
| `frontend/` | React/Vite. `src/pages/site` là website công khai, `admin` là trang nhân viên, `portal` là cư dân, `shared` là trang dùng chung. `src/api` là HTTP client/endpoint. |
| `scripts/` | Công cụ backup và restore DB + tệp upload của stack Docker local. |
| `ke-hoach-hoan-thien/` | Ma trận giao diện, backlog F0–F8, hợp đồng API và tiêu chí nghiệm thu. |

## Chạy cả hệ thống bằng Docker

Yêu cầu Docker Compose. Tạo `.env` từ `.env.example` và đặt ba mật khẩu riêng đủ mạnh (`MYSQL_PASSWORD`, `MYSQL_ROOT_PASSWORD`, `APP_ADMIN_PASSWORD`), sau đó:

```bash
docker compose up -d --build
docker compose ps
```

Website và trang quản trị dùng chung `http://localhost:8088` (hoặc `APP_PORT` trong `.env`). Đăng nhập quản trị ở `/dang-nhap` bằng tài khoản `admin` và `APP_ADMIN_PASSWORD` đã đặt. Sau lần tạo đầu, đổi mật khẩu trên giao diện. Backend chỉ nhận kết nối nội bộ từ Nginx, API đi qua `/api`; route sâu của SPA được trả về `index.html`. Kiểm tra `docker compose ps` để thấy cả `db`, `backend`, `frontend` healthy.

MySQL lưu ở volume `mysql_data`; tài liệu tải lên lưu ở volume `uploads`. `docker compose down` giữ dữ liệu, còn `docker compose down -v` xóa cả hai volume. Không dùng lệnh sau cho dữ liệu cần giữ.

## Chạy FE/BE riêng để phát triển

BE cần một MySQL có schema do Flyway tạo, username/password qua biến môi trường `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, `SPRING_DATASOURCE_PASSWORD`; lần đầu cần `NHATRO_ADMIN_INITIAL_PASSWORD` (ít nhất 12 ký tự). Ví dụ chạy BE khi đã có DB local:

```bash
mvn -f backend/pom.xml spring-boot:run
```

FE chạy trên cổng 5173, Vite proxy `/api` đến BE cổng 8080:

```bash
cd frontend
npm ci
npm run dev
```

Kiểm tra BE bằng `mvn -f backend/pom.xml test`; kiểm tra FE bằng `cd frontend && npm run test && npm run lint && npm run build`. Khi stack Docker đã lên, `python scripts/smoke.py` thử route SPA và upload/download, còn `python scripts/security_smoke.py` thử đăng nhập, CSRF, quyền, thông báo, khóa tài khoản và thu hồi phiên. Hai script tự xóa bản ghi thử nghiệm.

## Database và sao lưu

Flyway chạy khi backend khởi động; Hibernate chỉ `validate` schema, không tự sửa bảng. Migration V1 được dựng từ entity và bộ schema local đã chạy ở repo cũ, **chưa được đối chiếu với database Aiven đang có dữ liệu**. Cấu hình cũ trỏ Aiven đã được bỏ khỏi source. Không trỏ phiên bản này vào DB hiện hữu cho đến khi làm xong quy trình ở [tài liệu database](docs/database.md). Mặc định Flyway từ chối baseline DB không rỗng, để tránh nâng cấp nhầm.

Sao lưu stack local vào thư mục được Git bỏ qua:

```bash
python scripts/database.py backup backups/ban-sao-1
python scripts/database.py restore backups/ban-sao-1 --database restore_verify
```

Restore chỉ chấp nhận database đích rỗng; thêm `--with-uploads` nếu muốn khôi phục file lên volume hiện tại. Dừng ứng dụng trước khi khôi phục môi trường đang phục vụ người dùng. Thử restore trên DB riêng trước khi thay DB thật.

## Tình trạng tính năng

F0 đã có cấu trúc repo, stack local, migration DB mới, healthcheck và backup/restore local. Baseline DB hiện hữu và kịch bản nâng cấp dữ liệu thật đang chờ schema dump để đối chiếu. Các màn public còn dùng dữ liệu căn trong `frontend/src/data/listings.js`; đây là phạm vi F3 trong [backlog](ke-hoach-hoan-thien/04-backlog-trien-khai.md).

F1 đã thêm kiểm tra phiên theo trạng thái tài khoản hiện tại, sửa thông báo chưa đọc, làm mới CSRF sau login và chuyển về đăng nhập sau đổi mật khẩu. F2 đã viết API và migration V2 cho yêu cầu/lịch xem; các form, cổng cư dân và màn nhân viên đã gọi API thay cho `localStorage`. Lượt F2 chưa chạy build/test/migration theo yêu cầu; xem [hợp đồng API F2](ke-hoach-hoan-thien/07-f2-api-thuc-te.md).
