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

@Entity
@Table(name = "hop_dong")
@Getter @Setter @NoArgsConstructor
public class HopDong {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "ma_hop_dong", nullable = false, unique = true, length = 30)
    private String maHopDong;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "phong_id", nullable = false)
    private Phong phong;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "khach_thue_id", nullable = false)
    private KhachThue khachThue;

    @Column(name = "ngay_bat_dau", nullable = false)
    private LocalDate ngayBatDau;

    @Column(name = "ngay_ket_thuc", nullable = false)
    private LocalDate ngayKetThuc;

    @Column(name = "gia_thue", nullable = false, precision = 12, scale = 0)
    private BigDecimal giaThue;

    @Column(name = "tien_coc", nullable = false, precision = 12, scale = 0)
    private BigDecimal tienCoc = BigDecimal.ZERO;

    // hieu_luc | het_han | thanh_ly
    @Column(name = "trang_thai", nullable = false, length = 20)
    private String trangThai = "hieu_luc";

    @Column(name = "ngay_thanh_ly")
    private LocalDate ngayThanhLy;

    @Column(name = "tien_khau_tru", nullable = false, precision = 12, scale = 0)
    private BigDecimal tienKhauTru = BigDecimal.ZERO;

    @Column(name = "tien_hoan_coc", precision = 12, scale = 0)
    private BigDecimal tienHoanCoc;

    @Column(name = "ghi_chu", length = 500)
    private String ghiChu;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private TaiKhoan createdBy;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;


    @OneToMany(mappedBy = "hopDong", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<HopDongKhach> nguoiOCung = new ArrayList<>();


    @OneToMany(mappedBy = "hopDong", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<HopDongDichVu> dichVu = new ArrayList<>();


    public void addNguoiOCung(KhachThue khach, LocalDate ngayVao) {
        HopDongKhach hdk = new HopDongKhach();
        hdk.setId(new HopDongKhachId(null, khach.getId()));
        hdk.setHopDong(this);
        hdk.setKhachThue(khach);
        hdk.setNgayVao(ngayVao);
        nguoiOCung.add(hdk);
    }

    public void addDichVu(DichVu dv, BigDecimal soLuong) {
        HopDongDichVu hdd = new HopDongDichVu();
        hdd.setId(new HopDongDichVuId(null, dv.getId()));
        hdd.setHopDong(this);
        hdd.setDichVu(dv);
        hdd.setSoLuong(soLuong);
        dichVu.add(hdd);
    }
}
