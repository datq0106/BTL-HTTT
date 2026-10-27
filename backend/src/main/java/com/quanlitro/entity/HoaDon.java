package com.quanlitro.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity @Table(name = "hoa_don")
@Getter @Setter @NoArgsConstructor
public class HoaDon {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(name = "ma_hoa_don", nullable = false, unique = true, length = 40) private String maHoaDon;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "hop_dong_id") private HopDong hopDong;
    @Column(nullable = false, length = 7, columnDefinition = "CHAR(7)") private String ky;
    @Column(name = "tong_tien", nullable = false, precision = 14, scale = 0) private BigDecimal tongTien;
    @Column(name = "trang_thai", nullable = false, length = 20) private String trangThai = "da_chot";
    @Column(name = "han_thanh_toan", nullable = false) private LocalDate hanThanhToan;
    @Column(name = "ngay_thanh_toan") private LocalDateTime ngayThanhToan;
    @Column(name = "phuong_thuc", length = 20) private String phuongThuc;
    @Column(name = "ghi_chu", length = 500) private String ghiChu;
    @Column(name = "created_at", nullable = false) private LocalDateTime createdAt;
    @OneToMany(mappedBy = "hoaDon", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("id") private List<HoaDonChiTiet> chiTiet = new ArrayList<>();
}
