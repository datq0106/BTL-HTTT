package com.quanlitro.dto.dichvu;

import java.math.BigDecimal;

public record DichVuResponse(
        Integer id,
        String tenDichVu,
        BigDecimal donGia,
        String donVi,
        String loaiTinh,
        Boolean dangApDung
) {}
