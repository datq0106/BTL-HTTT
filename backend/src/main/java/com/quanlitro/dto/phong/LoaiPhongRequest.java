package com.quanlitro.dto.phong;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public record LoaiPhongRequest(
        @NotBlank @Size(max = 100) String tenLoai,
        @NotNull @PositiveOrZero BigDecimal giaThue,
        @Positive BigDecimal dienTich,
        @Size(max = 500) String moTa
) {}
