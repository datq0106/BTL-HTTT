package com.quanlitro.dto.hopdong;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public record DichVuHopDongRequest(
        @NotNull Integer dichVuId,
        @NotNull @Positive BigDecimal soLuong
) {}
