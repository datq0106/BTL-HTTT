package com.quanlitro.mapper;

import com.quanlitro.dto.dichvu.DichVuRequest;
import com.quanlitro.dto.dichvu.DichVuResponse;
import com.quanlitro.entity.DichVu;
import org.springframework.stereotype.Component;

@Component
public class DichVuMapper {

    public DichVu toEntity(DichVuRequest req) {
        DichVu d = new DichVu();
        updateEntity(d, req);
        return d;
    }

    public void updateEntity(DichVu d, DichVuRequest req) {
        d.setTenDichVu(req.tenDichVu());
        d.setDonGia(req.donGia());
        d.setDonVi(req.donVi());
        d.setLoaiTinh(req.loaiTinh());
        if (req.dangApDung() != null) {
            d.setDangApDung(req.dangApDung());
        }
    }

    public DichVuResponse toResponse(DichVu d) {
        return new DichVuResponse(
                d.getId(), d.getTenDichVu(), d.getDonGia(),
                d.getDonVi(), d.getLoaiTinh(), d.getDangApDung());
    }
}
