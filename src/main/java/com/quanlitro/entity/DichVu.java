package com.quanlitro.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "dich_vu")
@Getter @Setter @NoArgsConstructor
public class DichVu {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "ten_dich_vu", nullable = false, unique = true, length = 100)
    private String tenDichVu;

    @Column(name = "don_gia", nullable = false, precision = 12, scale = 0)
    private BigDecimal donGia;

    @Column(name = "don_vi", nullable = false, length = 30)
    private String donVi;

    @Column(name = "loai_tinh", nullable = false, length = 20)
    private String loaiTinh;

    @Column(name = "dang_ap_dung", nullable = false)
    private Boolean dangApDung = true;
}
