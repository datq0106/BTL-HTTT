package com.quanlitro.dto.phong;

import com.quanlitro.custom.MaEnum;
import com.quanlitro.enums.TrangThaiPhong;
import jakarta.validation.constraints.*;

public record PhongTrangThaiRequest(
        @NotNull
        @MaEnum(value = TrangThaiPhong.class, loaiTru = "dang_thue",
                message = "Trạng thái không hợp lệ ('dang_thue' do hợp đồng quyết định)")
        String trangThai
) {}
