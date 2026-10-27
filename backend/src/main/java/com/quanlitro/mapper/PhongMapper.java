package com.quanlitro.mapper;

import com.quanlitro.dto.phong.LoaiPhongRequest;
import com.quanlitro.dto.phong.LoaiPhongResponse;
import com.quanlitro.dto.phong.PhongRequest;
import com.quanlitro.dto.phong.PhongResponse;
import com.quanlitro.entity.HopDong;
import com.quanlitro.entity.LoaiPhong;
import com.quanlitro.entity.Phong;
import org.springframework.stereotype.Component;

@Component
public class PhongMapper {
    public LoaiPhong toEntity(LoaiPhongRequest req) {
        LoaiPhong lp = new LoaiPhong();
        updateEntity(lp, req);
        return lp;
    }

    public void updateEntity(LoaiPhong lp, LoaiPhongRequest req) {
        lp.setTenLoai(req.tenLoai());
        lp.setGiaThue(req.giaThue());
        lp.setDienTich(req.dienTich());
        lp.setMoTa(req.moTa());
    }

    public LoaiPhongResponse toResponse(LoaiPhong lp) {
        return new LoaiPhongResponse(
                lp.getId(), lp.getTenLoai(), lp.getGiaThue(), lp.getDienTich(), lp.getMoTa());
    }

    public Phong toEntity(PhongRequest req, LoaiPhong loaiPhong) {
        Phong p = new Phong();
        updateEntity(p, req, loaiPhong);
        return p;
    }

    public void updateEntity(Phong p, PhongRequest req, LoaiPhong loaiPhong) {
        p.setMaPhong(req.maPhong());
        p.setTang(req.tang());
        p.setLoaiPhong(loaiPhong);
        p.setTienNghi(req.tienNghi());
        p.setGhiChu(req.ghiChu());
    }

    public PhongResponse toResponse(Phong p, HopDong hopDongHieuLuc) {
        LoaiPhong lp = p.getLoaiPhong();
        return new PhongResponse(
                p.getId(),
                p.getMaPhong(),
                p.getTang(),
                lp != null ? lp.getId() : null,
                lp != null ? lp.getTenLoai() : null,
                lp != null ? lp.getGiaThue() : null,
                lp != null ? lp.getDienTich() : null,
                p.getTrangThai(),
                p.getTienNghi(),
                p.getGhiChu(),
                hopDongHieuLuc != null ? hopDongHieuLuc.getId() : null,
                hopDongHieuLuc != null ? hopDongHieuLuc.getKhachThue().getHoTen() : null
        );
    }

    public PhongResponse toResponse(Phong p) {
        return toResponse(p, null);
    }
}
