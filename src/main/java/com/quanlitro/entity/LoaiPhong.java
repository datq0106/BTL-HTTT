package com.quanlitro.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "loai_phong")
@Getter @Setter @NoArgsConstructor
public class LoaiPhong {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "ten_loai", nullable = false, length = 100)
    private String tenLoai;

    @Column(name = "gia_thue", nullable = false, precision = 12, scale = 0)
    private BigDecimal giaThue;

    @Column(name = "dien_tich", precision = 5, scale = 1)
    private BigDecimal dienTich;

    @Column(name = "mo_ta", length = 500)
    private String moTa;
}
