package com.quanlitro.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.math.BigDecimal;

@Entity @Table(name = "hoa_don_chi_tiet")
@Getter @Setter @NoArgsConstructor
public class HoaDonChiTiet {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "hoa_don_id") private HoaDon hoaDon;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "dich_vu_id") private DichVu dichVu;
    @Column(name = "noi_dung", nullable = false, length = 150) private String noiDung;
    @Column(name = "don_vi", length = 30) private String donVi;
    @Column(name = "chi_so_cu", precision = 10, scale = 2) private BigDecimal chiSoCu;
    @Column(name = "chi_so_moi", precision = 10, scale = 2) private BigDecimal chiSoMoi;
    @Column(name = "so_luong", nullable = false, precision = 10, scale = 2) private BigDecimal soLuong;
    @Column(name = "don_gia", nullable = false, precision = 12, scale = 0) private BigDecimal donGia;
    @Column(name = "thanh_tien", nullable = false, precision = 14, scale = 0) private BigDecimal thanhTien;
}
