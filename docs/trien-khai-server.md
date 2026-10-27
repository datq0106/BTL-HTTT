# Triển khai lên server

Áp dụng cho một máy Linux (Ubuntu 22.04/24.04 hoặc tương đương), RAM từ 2 GB. Toàn bộ hệ thống chạy bằng Docker Compose: MySQL, backend Spring Boot, frontend Nginx; thêm Caddy nếu cần HTTPS.

## 1. Chuẩn bị máy

```bash
# Docker Engine + Compose plugin (script chính thức của Docker)
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER   # đăng xuất rồi đăng nhập lại

# Mở cổng web (ví dụ ufw)
sudo ufw allow OpenSSH && sudo ufw allow 80/tcp && sudo ufw allow 443/tcp && sudo ufw enable
```

## 2. Lấy mã nguồn và tạo .env

```bash
git clone <địa-chỉ-repo> btl-httt && cd btl-httt
cp .env.example .env
nano .env
```

Điền ba mật khẩu bắt buộc (tạo bằng `openssl rand -hex 24`). `APP_ADMIN_PASSWORD` là mật khẩu ban đầu của tài khoản `admin`.

## 3. Chạy

**HTTP theo IP server** (mặc định `APP_BIND=0.0.0.0`, `APP_PORT=80`):

```bash
docker compose up -d --build
docker compose ps          # db, backend, frontend phải "healthy"
```

Mở `http://<IP-server>`; trang quản trị ở `/dang-nhap`.

**HTTPS với tên miền**: trỏ bản ghi A của tên miền về IP server, trong `.env` đặt `DOMAIN=ten-mien.vn`, `APP_BIND=127.0.0.1`, `APP_PORT=8088`, rồi:

```bash
docker compose --profile https up -d --build
```

Caddy tự xin và gia hạn chứng chỉ Let's Encrypt; mọi lệnh `docker compose` sau đó cũng thêm `--profile https`.

## 4. Dữ liệu demo (tùy chọn)

Script seed gọi API qua HTTP và cần Python 3 + Node.js trên máy chạy script. Có thể chạy ngay trên server, hoặc từ máy cá nhân trỏ tới server:

```bash
# trên server
python3 scripts/seed_demo.py

# hoặc từ máy cá nhân (cùng mật khẩu admin với server)
APP_URL=https://ten-mien.vn APP_ADMIN_PASSWORD=... python scripts/seed_demo.py
```

Seed tạo các tài khoản `quanly`, `cudan1`, `cudan2` với mật khẩu `Demo@2026`; đổi hoặc khóa chúng nếu server công khai.

## 5. Cập nhật phiên bản

```bash
git pull
docker compose up -d --build      # thêm --profile https nếu dùng
```

Flyway tự chạy migration mới khi backend khởi động; dữ liệu nằm trong volume `mysql_data` và `uploads` nên không mất khi build lại.

## 6. Sao lưu và khôi phục

```bash
python3 scripts/database.py backup backups/$(date +%F)
python3 scripts/database.py restore backups/2026-10-28 --database restore_verify
```

Bản sao gồm dump MySQL và thư mục ảnh/tệp upload. Chép thư mục `backups/` ra ngoài server định kỳ. **Không** chạy `docker compose down -v` trên server: lệnh này xóa cả hai volume dữ liệu.

## 7. Kiểm tra nhanh và xem log

```bash
curl -s http://localhost:${APP_PORT:-80}/health     # {"status":"UP",...}
python3 scripts/smoke.py                           # thử route, đăng nhập, upload
docker compose logs -f backend                     # log có xoay vòng 3 × 10 MB
```

## Ghi chú cấu hình

| Biến `.env`                          | Mặc định         | Ý nghĩa                                                    |
| --------------------------------------- | ------------------- | ------------------------------------------------------------ |
| `APP_BIND`, `APP_PORT`              | `0.0.0.0`, `80` | Địa chỉ và cổng của frontend trên máy chủ           |
| `DOMAIN`                              | trống              | Tên miền cho profile `https`                             |
| `DB_MEM_LIMIT`, `BACKEND_MEM_LIMIT` | `1g`, `768m`    | Trần bộ nhớ từng container; JVM dùng tối đa 75% trần |

Ảnh upload tối đa 5 MB mỗi tệp. Khi đứng sau Caddy, Nginx lấy IP thật của khách từ `X-Forwarded-For` để giới hạn số lần gửi form theo từng người.
