package com.quanlitro.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "tai_khoan")
@Getter @Setter @NoArgsConstructor
public class TaiKhoan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "ten_dang_nhap", nullable = false, unique = true, length = 50)
    private String tenDangNhap;

    @Column(name = "mat_khau_hash", nullable = false, length = 100)
    private String matKhauHash;              // BCrypt

    @Column(name = "ho_ten", nullable = false, length = 100)
    private String hoTen;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "vai_tro_id", nullable = false)
    private VaiTro vaiTro;


    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "khach_thue_id", unique = true)
    private KhachThue khachThue;

    @Column(name = "trang_thai", nullable = false, length = 20)
    private String trangThai = "hoat_dong";

    @Column(name = "lan_dang_nhap_cuoi")
    private LocalDateTime lanDangNhapCuoi;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;
}
