package com.quanlitro.service.impl;

import com.quanlitro.dto.baocao.DashboardResponse;
import com.quanlitro.enums.TrangThaiHopDong;
import com.quanlitro.enums.TrangThaiPhong;
import com.quanlitro.repository.HopDongRepository;
import com.quanlitro.repository.PhongRepository;
import com.quanlitro.service.DashboardService;
import com.quanlitro.service.HopDongService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class DashboardServiceImpl implements DashboardService {

    private final PhongRepository phongRepo;
    private final HopDongRepository hopDongRepo;
    private final HopDongService hopDongService;

    public DashboardServiceImpl(PhongRepository phongRepo, HopDongRepository hopDongRepo,
                                HopDongService hopDongService) {
        this.phongRepo = phongRepo;
        this.hopDongRepo = hopDongRepo;
        this.hopDongService = hopDongService;
    }

    @Override
    public DashboardResponse tongQuan() {
        long tong = phongRepo.countByHienThiTrue();
        long trong = phongRepo.countByTrangThaiAndHienThiTrue(TrangThaiPhong.TRONG.getMa());
        long dangThue = phongRepo.countByTrangThaiAndHienThiTrue(TrangThaiPhong.DANG_THUE.getMa());
        long baoTri = phongRepo.countByTrangThaiAndHienThiTrue(TrangThaiPhong.BAO_TRI.getMa());
        long daDatCoc = phongRepo.countByTrangThaiAndHienThiTrue(TrangThaiPhong.DA_DAT_COC.getMa());

        double tyLe = tong == 0 ? 0 : Math.round(dangThue * 1000.0 / tong) / 10.0;

        return new DashboardResponse(
                tong, trong, dangThue, baoTri, daDatCoc, tyLe,
                hopDongRepo.countByTrangThai(TrangThaiHopDong.HIEU_LUC.getMa()),
                hopDongService.sapHetHan());
    }
}
