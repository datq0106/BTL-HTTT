package com.quanlitro.mapper;

import com.quanlitro.dto.khachthue.KhachThueRequest;
import com.quanlitro.dto.khachthue.KhachThueResponse;
import com.quanlitro.dto.khachthue.KhachThueSummary;
import com.quanlitro.entity.KhachThue;
import org.springframework.stereotype.Component;

@Component
public class KhachThueMapper {

    public KhachThue toEntity(KhachThueRequest req) {
        KhachThue k = new KhachThue();
        updateEntity(k, req);
        return k;
    }

    public void updateEntity(KhachThue k, KhachThueRequest req) {
        k.setHoTen(req.hoTen());
        k.setCccd(req.cccd());
        k.setSdt(req.sdt());
        k.setEmail(req.email());
        k.setNgaySinh(req.ngaySinh());
        k.setGioiTinh(req.gioiTinh());
        k.setQueQuan(req.queQuan());
        if (req.trangThaiTamTru() != null) {
            k.setTrangThaiTamTru(req.trangThaiTamTru());
        }
        k.setNgayKhaiBao(req.ngayKhaiBao());
    }

    public KhachThueResponse toResponse(KhachThue k, String maPhongHienTai) {
        return new KhachThueResponse(
                k.getId(),
                k.getHoTen(),
                k.getCccd(),
                k.getSdt(),
                k.getEmail(),
                k.getNgaySinh(),
                k.getGioiTinh(),
                k.getQueQuan(),
                k.getAnhCccd(),
                k.getAnhTamTru(),
                k.getTrangThaiTamTru(),
                k.getNgayKhaiBao(),
                maPhongHienTai,
                k.getCreatedAt()
        );
    }

    public KhachThueResponse toResponse(KhachThue k) {
        return toResponse(k, null);
    }

    public KhachThueSummary toSummary(KhachThue k) {
        return new KhachThueSummary(k.getId(), k.getHoTen(), k.getSdt());
    }
}
