package com.quanlitro.dto.auth;

import com.quanlitro.config.UserPrincipal;

public record NguoiDungResponse(
        Integer id,
        String tenDangNhap,
        String hoTen,
        String maVaiTro,
        Integer khachThueId
) {
    public static NguoiDungResponse tu(UserPrincipal p) {
        String vaiTro = p.getAuthorities().stream().findFirst().map(a -> a.getAuthority()).orElse(null);
        return new NguoiDungResponse(p.getId(), p.getUsername(), p.getHoTen(), vaiTro, p.getKhachThueId());
    }
}
