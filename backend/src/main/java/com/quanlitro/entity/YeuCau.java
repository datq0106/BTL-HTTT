package com.quanlitro.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity @Table(name = "yeu_cau")
@Getter @Setter @NoArgsConstructor
public class YeuCau {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(name = "ma_tra_cuu", nullable = false, unique = true, length = 64) private String maTraCuu;
    @Column(nullable = false, length = 20) private String nguon;
    @Column(name = "chu_de", nullable = false, length = 30) private String chuDe;
    @Column(name = "tieu_de", nullable = false, length = 200) private String tieuDe;
    @Column(name = "ho_ten", nullable = false, length = 100) private String hoTen;
    @Column(nullable = false, length = 15) private String sdt;
    @Column(length = 100) private String email;
    @Column(name = "ma_phong", length = 30) private String maPhong;
    @Column(name = "listing_key", length = 100) private String listingKey;
    @Column(name = "muc_do", nullable = false, length = 20) private String mucDo = "binh_thuong";
    @Column(name = "noi_dung", nullable = false, columnDefinition = "TEXT") private String noiDung;
    @Column(name = "trang_thai", nullable = false, length = 20) private String trangThai = "cho_xu_ly";
    @Column(name = "phan_hoi", columnDefinition = "TEXT") private String phanHoi;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "tai_khoan_id") private TaiKhoan taiKhoan;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "nguoi_xu_ly_id") private TaiKhoan nguoiXuLy;
    @Column(name = "created_at", nullable = false) private LocalDateTime createdAt;
    @Column(name = "updated_at", nullable = false) private LocalDateTime updatedAt;
}
