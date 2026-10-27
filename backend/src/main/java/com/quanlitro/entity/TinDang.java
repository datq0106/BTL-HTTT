package com.quanlitro.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity @Table(name = "tin_dang")
@Getter @Setter @NoArgsConstructor
public class TinDang {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(nullable = false, unique = true, length = 100) private String slug;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "bat_dong_san_id") private BatDongSan batDongSan;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "phong_id") private Phong phong;
    @Column(nullable = false, unique = true, length = 30) private String ma;
    @Column(name = "tieu_de", nullable = false, length = 200) private String tieuDe;
    @Column(nullable = false, length = 80) private String loai;
    @Column(name = "phong_ngu", nullable = false) private Integer phongNgu;
    @Column(name = "phong_tam", nullable = false) private Integer phongTam;
    @Column(name = "dien_tich", nullable = false, precision = 7, scale = 2) private BigDecimal dienTich;
    @Column(nullable = false) private Integer tang;
    @Column(name = "gia_niem_yet", nullable = false, precision = 14, scale = 0) private BigDecimal giaNiemYet;
    @Column(name = "dat_coc", nullable = false, precision = 14, scale = 0) private BigDecimal datCoc;
    @Column(name = "tien_nghi", columnDefinition = "TEXT") private String tienNghi;
    @Column(name = "mo_ta", nullable = false, columnDefinition = "TEXT") private String moTa;
    @Column(name = "noi_bat", nullable = false) private Boolean noiBat = false;
    @Column(name = "trang_thai_can", nullable = false, length = 20) private String trangThaiCan = "trong";
    @Column(name = "trang_thai", nullable = false, length = 20) private String trangThai = "nhap";
    @Column(name = "created_at", nullable = false) private LocalDateTime createdAt;
    @Column(name = "updated_at", nullable = false) private LocalDateTime updatedAt;
    @Column(name = "published_at") private LocalDateTime publishedAt;
}
