package com.quanlitro.exception;

import java.sql.SQLException;
import java.util.Map;
import java.util.Optional;

public final class DichLoiCsdl {

    public record KetQua(int status, String thongBao) {}

    private static final Map<String, String> THONG_BAO_TRIGGER = Map.of(
            "Phong nay dang co hop dong hieu luc", "Phòng này đang có hợp đồng hiệu lực",
            "Chi so moi khong duoc nho hon chi so cu", "Chỉ số mới không được nhỏ hơn chỉ số cũ",
            "Hoa don chua chot, khong the thanh toan", "Hóa đơn chưa chốt, không thể thanh toán",
            "So tien thanh toan vuot qua so con no", "Số tiền thanh toán vượt quá số còn nợ");

    private DichLoiCsdl() {}

    /** Rỗng nghĩa là không nhận ra lỗi này, người gọi nên coi là lỗi hệ thống. */
    public static Optional<KetQua> dich(Throwable loi) {
        SQLException sql = timSql(loi);
        if (sql == null) {
            return Optional.empty();
        }

        if ("45000".equals(sql.getSQLState())) {
            String goc = sql.getMessage() == null ? "" : sql.getMessage().trim();
            return Optional.of(new KetQua(400, THONG_BAO_TRIGGER.getOrDefault(goc,
                    goc.isEmpty() ? "Thao tác không hợp lệ" : goc)));
        }

        return switch (sql.getErrorCode()) {
            case 1062 -> ketQua(409, "Dữ liệu bị trùng với bản ghi đã có");
            case 1451 -> ketQua(409, "Dữ liệu đang được sử dụng ở nơi khác nên không thể xóa");
            case 1452 -> ketQua(400, "Dữ liệu tham chiếu không tồn tại");
            case 1048 -> ketQua(400, "Thiếu dữ liệu bắt buộc");
            case 1406 -> ketQua(400, "Dữ liệu nhập quá dài");
            case 1264 -> ketQua(400, "Giá trị nằm ngoài phạm vi cho phép");
            case 3819 -> ketQua(400, "Dữ liệu vi phạm ràng buộc kiểm tra");
            default -> {
                String state = sql.getSQLState();
                yield (state != null && state.startsWith("23"))
                        ? ketQua(400, "Dữ liệu vi phạm ràng buộc của hệ thống")
                        : Optional.empty();
            }
        };
    }

    private static SQLException timSql(Throwable loi) {
        SQLException timDuoc = null;
        Throwable t = loi;
        for (int i = 0; t != null && i < 25; i++, t = t.getCause()) {
            if (t instanceof SQLException s) {
                timDuoc = s;
            }
        }
        return timDuoc;
    }

    private static Optional<KetQua> ketQua(int status, String thongBao) {
        return Optional.of(new KetQua(status, thongBao));
    }
}
