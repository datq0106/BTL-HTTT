# F5 (bản demo): API hóa đơn

Trạng thái 28/10/2026: migration V4 chạy trên MySQL 8.4 local; `scripts/seed_demo.py` tạo hóa đơn hai kỳ cho mỗi hợp đồng đang hiệu lực.

## Quy tắc

- Một hợp đồng có tối đa một hóa đơn mỗi kỳ (`YYYY-MM`). Kỳ không được ở tương lai, không trước tháng bắt đầu hợp đồng và không sớm hơn kỳ đã lập gần nhất.
- Dòng hóa đơn: tiền phòng theo `gia_thue` của hợp đồng; mỗi dịch vụ cố định gắn hợp đồng (`so_luong × don_gia`); mỗi dịch vụ `theo_chi_so` đang áp dụng (`(chỉ số mới − cũ) × don_gia`). Đơn giá lấy tại thời điểm lập và lưu vào dòng.
- Chỉ số cũ = chỉ số mới của hóa đơn kỳ trước; hóa đơn đầu tiên nhận `chiSoCu` từ request. Chỉ số mới không được nhỏ hơn chỉ số cũ.
- Trạng thái `da_chot` (chưa thanh toán) → `da_thanh_toan`. Hủy (xóa) được hóa đơn kỳ mới nhất khi chưa thu.
- Hạn thanh toán = ngày lập + 7 ngày. Lập hóa đơn gửi thông báo loại `hoa_don` cho tài khoản của khách đại diện.
- `fn_cong_no_hop_dong` = tổng hóa đơn chưa thanh toán; hiện ở chi tiết hợp đồng.

## Nhân viên (`ADMIN`, `QUAN_LY`)

| Phương thức | Endpoint | Dữ liệu chính |
| --- | --- | --- |
| GET | `/api/hoa-don?ky=&trangThai=&keyword=` | Phân trang; `keyword` tìm mã hóa đơn, mã phòng, tên khách |
| GET | `/api/hoa-don/thong-ke?ky=` | `soHoaDon`, `phaiThu`, `daThu`, `conNoKy` của kỳ và `tongCongNo` mọi kỳ |
| GET | `/api/hoa-don/goi-y?hopDongId=&ky=` | Dòng dự kiến với chỉ số cũ; `kyDau` = hợp đồng chưa có hóa đơn |
| POST | `/api/hoa-don` | `hopDongId`, `ky`, `chiSo: [{dichVuId, chiSoCu?, chiSoMoi}]`, `ghiChu?` |
| GET | `/api/hoa-don/{id}` | Chi tiết kèm dòng |
| POST | `/api/hoa-don/{id}/thanh-toan` | `phuongThuc` = `tien_mat`, `chuyen_khoan`, `vi_dien_tu` |
| DELETE | `/api/hoa-don/{id}` | Hủy hóa đơn mới nhất chưa thu |

## Cư dân

| Phương thức | Endpoint | Dữ liệu chính |
| --- | --- | --- |
| GET | `/api/khach/hoa-don` | Hóa đơn của các hợp đồng mà cư dân là người đại diện |
| GET | `/api/khach/hoa-don/{id}` | Chi tiết; hóa đơn của người khác trả 403 |
