package com.quanlitro.dto.hopdong;

import java.math.BigDecimal;

public record DichVuHopDongResponse(
        Integer dichVuId,
        String tenDichVu,
        BigDecimal donGia,
        String donVi,
        BigDecimal soLuong
) {}
