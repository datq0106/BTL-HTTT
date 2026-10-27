package com.quanlitro.service;

import com.quanlitro.dto.dichvu.DichVuRequest;
import com.quanlitro.dto.dichvu.DichVuResponse;
import java.util.List;

public interface DichVuService {

    DichVuResponse tao(DichVuRequest req);

    DichVuResponse capNhat(Integer id, DichVuRequest req);

    DichVuResponse datApDung(Integer id, boolean apDung);

    void xoa(Integer id);

    DichVuResponse timTheoId(Integer id);

    List<DichVuResponse> danhSach();

    List<DichVuResponse> danhSachDangApDung(String loaiTinh);
}
