package com.quanlitro.dto.phong;

import java.math.BigDecimal;

public record LoaiPhongResponse(
        Integer id,
        String tenLoai,
        BigDecimal giaThue,
        BigDecimal dienTich,
        String moTa
) {}
