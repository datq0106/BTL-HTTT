package com.quanlitro.builder;

import com.quanlitro.entity.DichVu;
import com.quanlitro.entity.HopDong;
import com.quanlitro.entity.KhachThue;
import com.quanlitro.entity.Phong;
import com.quanlitro.entity.TaiKhoan;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class HopDongBuilder {

    private record DichVuSoLuong(DichVu dichVu, BigDecimal soLuong) {}

    private String maHopDong;
    private Phong phong;
    private KhachThue daiDien;
    private LocalDate ngayBatDau;
    private LocalDate ngayKetThuc;
    private BigDecimal giaThue;
    private BigDecimal tienCoc = BigDecimal.ZERO;
    private String ghiChu;
    private TaiKhoan nguoiTao;
    private final List<KhachThue> nguoiOCung = new ArrayList<>();
    private final List<DichVuSoLuong> dichVu = new ArrayList<>();

    private HopDongBuilder() {}

    public static HopDongBuilder moi() {
        return new HopDongBuilder();
    }

    public HopDongBuilder maHopDong(String maHopDong) {
        this.maHopDong = maHopDong;
        return this;
    }

    public HopDongBuilder phong(Phong phong) {
        this.phong = phong;
        return this;
    }

    public HopDongBuilder daiDien(KhachThue daiDien) {
        this.daiDien = daiDien;
        return this;
    }

    public HopDongBuilder thoiHan(LocalDate ngayBatDau, LocalDate ngayKetThuc) {
        this.ngayBatDau = ngayBatDau;
        this.ngayKetThuc = ngayKetThuc;
        return this;
    }

    public HopDongBuilder giaThue(BigDecimal giaThue) {
        this.giaThue = giaThue;
        return this;
    }

    public HopDongBuilder tienCoc(BigDecimal tienCoc) {
        this.tienCoc = tienCoc;
        return this;
    }

    public HopDongBuilder ghiChu(String ghiChu) {
        this.ghiChu = ghiChu;
        return this;
    }

    public HopDongBuilder nguoiTao(TaiKhoan nguoiTao) {
        this.nguoiTao = nguoiTao;
        return this;
    }

    public HopDongBuilder themNguoiOCung(KhachThue khach) {
        if (khach != null) {
            this.nguoiOCung.add(khach);
        }
        return this;
    }

    public HopDongBuilder nguoiOCung(Collection<KhachThue> danhSach) {
        if (danhSach != null) {
            danhSach.forEach(this::themNguoiOCung);
        }
        return this;
    }

    public HopDongBuilder themDichVu(DichVu dv, BigDecimal soLuong) {
        this.dichVu.add(new DichVuSoLuong(dv, soLuong));
        return this;
    }

    public HopDong build() {
        kiemTraBatBuoc();

        HopDong h = new HopDong();
        h.setMaHopDong(maHopDong);
        h.setPhong(phong);
        h.setKhachThue(daiDien);
        h.setNgayBatDau(ngayBatDau);
        h.setNgayKetThuc(ngayKetThuc);
        h.setGiaThue(giaThue);
        h.setTienCoc(tienCoc);
        h.setGhiChu(ghiChu);
        h.setCreatedBy(nguoiTao);

        Set<Integer> daThem = new HashSet<>();
        daThem.add(daiDien.getId());
        for (KhachThue k : nguoiOCung) {
            if (daThem.add(k.getId())) {
                h.addNguoiOCung(k, ngayBatDau);
            }
        }

        Set<Integer> dvDaThem = new HashSet<>();
        for (DichVuSoLuong d : dichVu) {
            if (!dvDaThem.add(d.dichVu().getId())) {
                throw new IllegalStateException("Dịch vụ bị thêm trùng: " + d.dichVu().getTenDichVu());
            }
            h.addDichVu(d.dichVu(), d.soLuong());
        }
        return h;
    }

    private void kiemTraBatBuoc() {
        thieuNeu(maHopDong == null || maHopDong.isBlank(), "maHopDong");
        thieuNeu(phong == null, "phong");
        thieuNeu(daiDien == null, "daiDien");
        thieuNeu(ngayBatDau == null || ngayKetThuc == null, "thoiHan");
        thieuNeu(giaThue == null, "giaThue");
        thieuNeu(tienCoc == null, "tienCoc");
        if (!ngayKetThuc.isAfter(ngayBatDau)) {
            throw new IllegalStateException("Ngày kết thúc phải sau ngày bắt đầu");
        }
        if (giaThue.signum() < 0 || tienCoc.signum() < 0) {
            throw new IllegalStateException("Giá thuê và tiền cọc không được âm");
        }
    }

    private static void thieuNeu(boolean dieuKien, String truong) {
        if (dieuKien) {
            throw new IllegalStateException("HopDongBuilder thiếu trường bắt buộc: " + truong);
        }
    }
}
