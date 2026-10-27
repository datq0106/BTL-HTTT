package com.quanlitro.dto.taikhoan;


import java.time.LocalDateTime;

public record TaiKhoanResponse(
        Integer id,
        String tenDangNhap,
        String hoTen,
        String maVaiTro,
        String tenVaiTro,
        String trangThai,
        Integer khachThueId,
        LocalDateTime lanDangNhapCuoi,
        LocalDateTime createdAt
) {}
