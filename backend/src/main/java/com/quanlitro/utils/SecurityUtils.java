package com.quanlitro.utils;

import com.quanlitro.config.UserPrincipal;
import com.quanlitro.enums.MaVaiTro;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Optional;

public final class SecurityUtils {

    private SecurityUtils() {}

    public static Optional<UserPrincipal> nguoiDangNhap() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && auth.getPrincipal() instanceof UserPrincipal p) {
            return Optional.of(p);
        }
        return Optional.empty();
    }

    public static Optional<String> tenDangNhap() {
        return nguoiDangNhap().map(UserPrincipal::getUsername);
    }

    public static Optional<Integer> taiKhoanId() {
        return nguoiDangNhap().map(UserPrincipal::getId);
    }

    public static Optional<Integer> khachThueId() {
        return nguoiDangNhap().map(UserPrincipal::getKhachThueId);
    }

    public static boolean coVaiTro(MaVaiTro vaiTro) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth != null && auth.getAuthorities().stream()
                .anyMatch(a -> vaiTro.getMa().equals(a.getAuthority()));
    }

    public static boolean laNhanVien() {
        return coVaiTro(MaVaiTro.ADMIN) || coVaiTro(MaVaiTro.QUAN_LY);
    }

    public static boolean laKhach() {
        return coVaiTro(MaVaiTro.KHACH);
    }


    public static boolean duocXemDuLieuCuaKhach(Integer khachThueId) {
        if (laNhanVien()) {
            return true;
        }
        return laKhach() && khachThueId().filter(id -> id.equals(khachThueId)).isPresent();
    }
}
