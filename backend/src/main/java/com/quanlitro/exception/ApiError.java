package com.quanlitro.exception;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.LocalDateTime;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ApiError(
        LocalDateTime thoiGian,
        int status,
        String loi,
        String thongBao,
        String duongDan,
        String maTheoDoi,
        List<ChiTietLoi> chiTiet        
) {
    public record ChiTietLoi(String truong, String thongBao) {}
}
