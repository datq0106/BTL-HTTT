package com.quanlitro.dto.taikhoan;

import com.quanlitro.custom.MatKhauManh;
import jakarta.validation.constraints.*;

public record TaiKhoanCreateRequest(
        @NotBlank @Size(min = 4, max = 50)
        @Pattern(regexp = "^[a-zA-Z0-9_.]+$", message = "Chỉ gồm chữ, số, dấu _ và .")
        String tenDangNhap,

        @NotBlank @Size(min = 8, max = 72, message = "Mật khẩu từ 8 đến 72 ký tự") @MatKhauManh
        String matKhau,

        @NotBlank @Size(max = 100) String hoTen,

        @NotNull Integer vaiTroId,

        Integer khachThueId
) {}
