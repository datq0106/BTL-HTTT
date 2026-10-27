package com.quanlitro.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "khach_thue")
@Getter @Setter @NoArgsConstructor
public class KhachThue {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "ho_ten", nullable = false, length = 100)
    private String hoTen;

    @Column(nullable = false, unique = true, length = 12)
    private String cccd;

    @Column(nullable = false, length = 15)
    private String sdt;

    @Column(length = 100)
    private String email;

    @Column(name = "ngay_sinh")
    private LocalDate ngaySinh;

    @Column(name = "gioi_tinh", length = 10)
    private String gioiTinh;

    @Column(name = "que_quan", length = 255)
    private String queQuan;

    @Column(name = "anh_cccd", length = 255)
    private String anhCccd;

    @Column(name = "anh_tam_tru", length = 255)
    private String anhTamTru;

    @Column(name = "trang_thai_tam_tru", nullable = false, length = 20)
    private String trangThaiTamTru = "chua_khai_bao";

    @Column(name = "ngay_khai_bao")
    private LocalDate ngayKhaiBao;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;
}
