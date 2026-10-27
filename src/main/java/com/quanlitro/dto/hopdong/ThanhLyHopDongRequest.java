package com.quanlitro.dto.hopdong;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public record ThanhLyHopDongRequest(
        @NotNull @PositiveOrZero BigDecimal tienKhauTru,
        @Size(max = 500) String ghiChu
) {}
