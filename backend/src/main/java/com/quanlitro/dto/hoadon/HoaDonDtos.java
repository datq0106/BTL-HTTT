package com.quanlitro.dto.hoadon;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public final class HoaDonDtos {
    private HoaDonDtos() {}

    /** chiSoCu chỉ dùng cho hóa đơn đầu tiên của hợp đồng; các kỳ sau lấy chỉ số mới của kỳ trước. */
    public record ChiSo(@NotNull Integer dichVuId, @DecimalMin("0") BigDecimal chiSoCu,
                        @NotNull @DecimalMin("0") BigDecimal chiSoMoi) {}
    public record LapHoaDon(
            @NotNull Integer hopDongId,
            @NotBlank @Pattern(regexp = "^\\d{4}-(0[1-9]|1[0-2])$") String ky,
            @Valid List<ChiSo> chiSo,
            @Size(max = 500) String ghiChu) {}
    public record ThanhToan(@NotBlank @Pattern(regexp = "tien_mat|chuyen_khoan|vi_dien_tu") String phuongThuc) {}

    public record Dong(Integer dichVuId, String noiDung, String donVi, BigDecimal chiSoCu, BigDecimal chiSoMoi,
                       BigDecimal soLuong, BigDecimal donGia, BigDecimal thanhTien, boolean theoChiSo) {}
    public record GoiY(Integer hopDongId, String maHopDong, String maPhong, String khachThue, String ky,
                       boolean kyDau, List<Dong> dong) {}
    public record HoaDon(Long id, String maHoaDon, Integer hopDongId, String maHopDong, String maPhong,
                         String khachThue, String ky, BigDecimal tongTien, String trangThai,
                         LocalDate hanThanhToan, LocalDateTime ngayThanhToan, String phuongThuc,
                         String ghiChu, LocalDateTime createdAt, List<Dong> dong) {}
    public record ThongKe(String ky, long soHoaDon, BigDecimal phaiThu, BigDecimal daThu,
                          BigDecimal conNoKy, BigDecimal tongCongNo) {}
}
