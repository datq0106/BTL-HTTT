package com.quanlitro.dto.yeucau;

import jakarta.validation.constraints.*;
import java.time.LocalDateTime;
import java.util.List;

public final class YeuCauDtos {
    private YeuCauDtos() {}

    public record GuiCongKhai(
            @NotBlank @Size(max = 30) String chuDe,
            @NotBlank @Size(max = 200) String tieuDe,
            @NotBlank @Size(max = 100) String hoTen,
            @NotBlank @Pattern(regexp = "^[0-9+(). -]{9,15}$") String sdt,
            @Email @Size(max = 100) String email,
            @Size(max = 30) String maPhong,
            @Size(max = 100) String listingKey,
            @NotBlank @Size(max = 5000) String noiDung) {}

    public record GuiCuDan(
            @NotBlank @Size(max = 30) String chuDe,
            @NotBlank @Size(max = 20) String mucDo,
            @NotBlank @Size(max = 5000) String noiDung) {}

    public record TaoNoiBo(
            @NotBlank @Size(max = 30) String chuDe,
            @NotBlank @Size(max = 200) String tieuDe,
            @NotBlank @Size(max = 100) String hoTen,
            @NotBlank @Pattern(regexp = "^[0-9+(). -]{9,15}$") String sdt,
            @Email String email,
            String maPhong,
            @NotBlank @Size(max = 5000) String noiDung,
            String mucDo) {}

    public record DatLich(
            @NotBlank @Size(max = 100) String listingKey,
            @Size(max = 30) String maPhong,
            @NotBlank @Size(max = 100) String hoTen,
            @NotBlank @Pattern(regexp = "^[0-9+(). -]{9,15}$") String sdt,
            @Email String email,
            @NotNull LocalDateTime khungDeNghi,
            @Size(max = 5000) String ghiChu) {}

    public record XuLy(String trangThai, String phanHoi, Integer nguoiXuLyId) {}
    public record XacNhanLich(@NotNull LocalDateTime khungXacNhan) {}
    public record LichSu(Long id, String hanhDong, String noiDung, String nguoiThucHien, LocalDateTime createdAt) {}
    public record LichXem(Long id, String listingKey, LocalDateTime khungDeNghi,
                          LocalDateTime khungXacNhan, String trangThai) {}
    public record YeuCau(Long id, String maTraCuu, String nguon, String chuDe, String tieuDe,
                         String hoTen, String sdt, String email, String maPhong, String listingKey,
                         String mucDo, String noiDung, String trangThai, String phanHoi,
                         Integer nguoiXuLyId, String nguoiXuLy, LocalDateTime createdAt,
                         LocalDateTime updatedAt, LichXem lichXem, List<LichSu> lichSu) {}
    public record DaNhan(String maTraCuu, String trangThai) {}
    public record TraCuu(String maTraCuu, String loai, String trangThai, LichXem lichXem) {}
    public record ThongKe(long choXuLy, long dangXuLy, long khanCap, long daXuLy, long tong) {}
    public record NhanVien(Integer id, String hoTen) {}
}
