package com.quanlitro.dto.baocao;

import com.quanlitro.dto.hopdong.HopDongResponse;

import java.util.List;

public record DashboardResponse(
        long tongPhong,
        long phongTrong,
        long phongDangThue,
        long phongBaoTri,
        long phongDaDatCoc,
        double tyLeLapDay,
        long hopDongHieuLuc,
        List<HopDongResponse> hopDongSapHetHan
) {}
