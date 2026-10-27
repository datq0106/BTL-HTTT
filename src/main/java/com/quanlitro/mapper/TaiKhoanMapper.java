package com.quanlitro.mapper;

import com.quanlitro.dto.taikhoan.TaiKhoanCreateRequest;
import com.quanlitro.dto.taikhoan.TaiKhoanResponse;
import com.quanlitro.dto.taikhoan.TaiKhoanUpdateRequest;
import com.quanlitro.entity.KhachThue;
import com.quanlitro.entity.TaiKhoan;
import com.quanlitro.entity.VaiTro;
import org.springframework.stereotype.Component;

@Component
public class TaiKhoanMapper {


    public TaiKhoan toEntity(TaiKhoanCreateRequest req, VaiTro vaiTro,
                             KhachThue khachThue, String matKhauHash) {
        TaiKhoan t = new TaiKhoan();
        t.setTenDangNhap(req.tenDangNhap());
        t.setMatKhauHash(matKhauHash);
        t.setHoTen(req.hoTen());
        t.setVaiTro(vaiTro);
        t.setKhachThue(khachThue);
        return t;
    }

    public void updateEntity(TaiKhoan t, TaiKhoanUpdateRequest req, VaiTro vaiTro) {
        t.setHoTen(req.hoTen());
        t.setVaiTro(vaiTro);
        t.setTrangThai(req.trangThai());
    }

    public TaiKhoanResponse toResponse(TaiKhoan t) {
        VaiTro vt = t.getVaiTro();
        return new TaiKhoanResponse(
                t.getId(),
                t.getTenDangNhap(),
                t.getHoTen(),
                vt != null ? vt.getMaVaiTro() : null,
                vt != null ? vt.getTenVaiTro() : null,
                t.getTrangThai(),
                t.getKhachThue() != null ? t.getKhachThue().getId() : null,
                t.getLanDangNhapCuoi(),
                t.getCreatedAt()
        );
    }
}
