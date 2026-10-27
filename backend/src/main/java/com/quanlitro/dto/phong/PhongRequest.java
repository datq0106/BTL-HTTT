package com.quanlitro.dto.phong;

import jakarta.validation.constraints.*;

public record PhongRequest(
        @NotBlank @Size(max = 20) String maPhong,
        @NotNull @Min(0) @Max(50) Integer tang,
        @NotNull Integer loaiPhongId,
        @Size(max = 500) String tienNghi,
        @Size(max = 500) String ghiChu
) {}
