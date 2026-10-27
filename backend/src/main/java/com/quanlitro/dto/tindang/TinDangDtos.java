package com.quanlitro.dto.tindang;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.util.List;

public final class TinDangDtos {
    private TinDangDtos() {}

    public record Pin(BigDecimal x, BigDecimal y) {}
    public record KhuVucRequest(
            @NotBlank @Pattern(regexp = "^[a-z0-9-]{2,60}$") String slug,
            @NotBlank @Size(max = 100) String ten,
            @Size(max = 500) String moTa,
            @Size(max = 500) String anhUrl,
            @Size(max = 500) String khach,
            @Size(max = 2000) String dacDiem,
            @DecimalMin("0") @DecimalMax("100") BigDecimal pinX,
            @DecimalMin("0") @DecimalMax("100") BigDecimal pinY,
            Boolean hienThi) {}
    public record KhuVuc(String id, String ten, String moTa, String anh, String khach,
                          List<String> dacDiem, Pin pin, BigDecimal giaTu, BigDecimal giaDen,
                          long soTin, boolean hienThi) {}

    public record BatDongSanRequest(
            @NotBlank String khuVucSlug,
            @NotBlank @Size(max = 150) String ten,
            @NotBlank @Size(max = 300) String diaChi,
            @DecimalMin("0") @DecimalMax("100") BigDecimal pinX,
            @DecimalMin("0") @DecimalMax("100") BigDecimal pinY) {}
    public record BatDongSan(Long id, String khuVucSlug, String ten, String diaChi, Pin pin) {}

    public record TinDangRequest(
            @NotBlank @Pattern(regexp = "^[a-z0-9-]{2,100}$") String slug,
            @NotNull Long batDongSanId,
            Integer phongId,
            @NotBlank @Size(max = 30) String ma,
            @NotBlank @Size(max = 200) String tieuDe,
            @NotBlank @Size(max = 80) String loai,
            @NotNull @Min(0) @Max(20) Integer phongNgu,
            @NotNull @Min(0) @Max(20) Integer phongTam,
            @NotNull @DecimalMin("1") BigDecimal dienTich,
            @NotNull @Min(0) @Max(200) Integer tang,
            @NotNull @DecimalMin("1") BigDecimal gia,
            @NotNull @DecimalMin("0") BigDecimal datCoc,
            @Size(max = 5000) String tienNghi,
            @NotBlank @Size(max = 10000) String moTa,
            Boolean noiBat,
            String trangThaiCan) {}
    public record ThongKe(long soTin, long soCanTrong, long soKhuVuc, int tyLeLapDay) {}
    public record Anh(Long id, String url, int thuTu, String altText) {}
    public record TinDang(String id, Long dbId, String ma, String tieuDe, String khuVuc,
                          String diaChi, String loai, Integer phongNgu, Integer phongTam,
                          BigDecimal dienTich, Integer tang, BigDecimal gia, BigDecimal datCoc,
                          String trangThai, boolean noiBat, Pin pin, List<String> anh,
                          List<Anh> chiTietAnh, List<String> tienNghi, String moTa,
                          boolean nhanLich, String trangThaiTin, Long batDongSanId, Integer phongId) {}
}
