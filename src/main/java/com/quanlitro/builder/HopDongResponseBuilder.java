package com.quanlitro.builder;

import com.quanlitro.dto.hopdong.DichVuHopDongResponse;
import com.quanlitro.dto.hopdong.HopDongResponse;
import com.quanlitro.dto.khachthue.KhachThueSummary;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

public class HopDongResponseBuilder {

    private Integer id;
    private String maHopDong;
    private Integer phongId;
    private String maPhong;
    private KhachThueSummary khachThue;
    private List<KhachThueSummary> nguoiOCung = Collections.emptyList();
    private LocalDate ngayBatDau;
    private LocalDate ngayKetThuc;
    private Long soNgayConLai;
    private BigDecimal giaThue;
    private BigDecimal tienCoc;
    private String trangThai;
    private LocalDate ngayThanhLy;
    private BigDecimal tienKhauTru;
    private BigDecimal tienHoanCoc;
    private BigDecimal congNo;
    private List<DichVuHopDongResponse> dichVu = Collections.emptyList();
    private String ghiChu;
    private LocalDateTime createdAt;

    private HopDongResponseBuilder() {}

    public static HopDongResponseBuilder moi() {
        return new HopDongResponseBuilder();
    }

    public HopDongResponseBuilder id(Integer v) { this.id = v; return this; }
    public HopDongResponseBuilder maHopDong(String v) { this.maHopDong = v; return this; }
    public HopDongResponseBuilder phong(Integer phongId, String maPhong) {
        this.phongId = phongId;
        this.maPhong = maPhong;
        return this;
    }
    public HopDongResponseBuilder khachThue(KhachThueSummary v) { this.khachThue = v; return this; }
    public HopDongResponseBuilder nguoiOCung(List<KhachThueSummary> v) {
        this.nguoiOCung = v != null ? v : Collections.emptyList();
        return this;
    }
    public HopDongResponseBuilder thoiHan(LocalDate batDau, LocalDate ketThuc) {
        this.ngayBatDau = batDau;
        this.ngayKetThuc = ketThuc;
        return this;
    }
    public HopDongResponseBuilder soNgayConLai(Long v) { this.soNgayConLai = v; return this; }
    public HopDongResponseBuilder giaThue(BigDecimal v) { this.giaThue = v; return this; }
    public HopDongResponseBuilder tienCoc(BigDecimal v) { this.tienCoc = v; return this; }
    public HopDongResponseBuilder trangThai(String v) { this.trangThai = v; return this; }
    public HopDongResponseBuilder thanhLy(LocalDate ngayThanhLy, BigDecimal tienKhauTru, BigDecimal tienHoanCoc) {
        this.ngayThanhLy = ngayThanhLy;
        this.tienKhauTru = tienKhauTru;
        this.tienHoanCoc = tienHoanCoc;
        return this;
    }
    public HopDongResponseBuilder congNo(BigDecimal v) { this.congNo = v; return this; }
    public HopDongResponseBuilder dichVu(List<DichVuHopDongResponse> v) {
        this.dichVu = v != null ? v : Collections.emptyList();
        return this;
    }
    public HopDongResponseBuilder ghiChu(String v) { this.ghiChu = v; return this; }
    public HopDongResponseBuilder createdAt(LocalDateTime v) { this.createdAt = v; return this; }

    public HopDongResponse build() {
        return new HopDongResponse(
                id, maHopDong, phongId, maPhong, khachThue, nguoiOCung,
                ngayBatDau, ngayKetThuc, soNgayConLai,
                giaThue, tienCoc, trangThai,
                ngayThanhLy, tienKhauTru, tienHoanCoc,
                congNo, dichVu, ghiChu, createdAt);
    }
}
