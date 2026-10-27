package com.quanlitro.dto.taikhoan;

import com.quanlitro.custom.MatKhauManh;
import com.quanlitro.custom.TruongKhop;
import jakarta.validation.constraints.*;

@TruongKhop(truong = "matKhauMoi", truongXacNhan = "xacNhanMatKhauMoi",
        message = "Xác nhận mật khẩu mới không khớp")
public record DoiMatKhauRequest(
        @NotBlank String matKhauCu,
        @NotBlank @Size(min = 8, max = 72) @MatKhauManh String matKhauMoi,
        @NotBlank String xacNhanMatKhauMoi
) {}
