package com.quanlitro.dto.phong;

import java.math.BigDecimal;

public record PhongFilter(
        String keyword,
        Integer tang,
        String trangThai,
        BigDecimal giaTu,
        BigDecimal giaDen
) {}
