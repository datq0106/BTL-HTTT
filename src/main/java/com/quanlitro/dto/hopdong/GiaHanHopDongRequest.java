package com.quanlitro.dto.hopdong;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;


public record GiaHanHopDongRequest(
        @NotNull @Future LocalDate ngayKetThucMoi,
        @PositiveOrZero BigDecimal giaThueMoi
) {}
