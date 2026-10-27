package com.quanlitro.dto.taikhoan;

import com.quanlitro.custom.MaEnum;
import com.quanlitro.enums.TrangThaiTaiKhoan;
import jakarta.validation.constraints.*;

public record TaiKhoanUpdateRequest(
        @NotBlank @Size(max = 100) String hoTen,
        @NotNull Integer vaiTroId,
        @NotNull @MaEnum(TrangThaiTaiKhoan.class) String trangThai
) {}
