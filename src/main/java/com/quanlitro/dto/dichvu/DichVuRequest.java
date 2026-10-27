package com.quanlitro.dto.dichvu;

import com.quanlitro.custom.MaEnum;
import com.quanlitro.enums.LoaiTinhDichVu;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public record DichVuRequest(
        @NotBlank @Size(max = 100) String tenDichVu,
        @NotNull @PositiveOrZero BigDecimal donGia,
        @NotBlank @Size(max = 30) String donVi,                 // kWh, m3, tháng, xe
        @NotNull @MaEnum(LoaiTinhDichVu.class) String loaiTinh,
        Boolean dangApDung
) {}
