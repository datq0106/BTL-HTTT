package com.quanlitro.config;

import com.quanlitro.entity.TaiKhoan;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

public class UserPrincipal implements UserDetails {

    private static final long serialVersionUID = 1L;

    private final Integer id;
    private final String tenDangNhap;
    private final String matKhauHash;
    private final String hoTen;
    private final Integer khachThueId;
    private final boolean biKhoa;
    private final List<GrantedAuthority> authorities;

    private UserPrincipal(Integer id, String tenDangNhap, String matKhauHash, String hoTen,
                          Integer khachThueId, boolean biKhoa, List<GrantedAuthority> authorities) {
        this.id = id;
        this.tenDangNhap = tenDangNhap;
        this.matKhauHash = matKhauHash;
        this.hoTen = hoTen;
        this.khachThueId = khachThueId;
        this.biKhoa = biKhoa;
        this.authorities = authorities;
    }

    public static UserPrincipal from(TaiKhoan t) {
        List<GrantedAuthority> quyen = List.of(new SimpleGrantedAuthority(t.getVaiTro().getMaVaiTro()));
        return new UserPrincipal(
                t.getId(),
                t.getTenDangNhap(),
                t.getMatKhauHash(),
                t.getHoTen(),
                t.getKhachThue() != null ? t.getKhachThue().getId() : null,
                "khoa".equals(t.getTrangThai()),
                quyen);
    }

    public Integer getId() { return id; }
    public String getHoTen() { return hoTen; }
    public Integer getKhachThueId() { return khachThueId; }

    @Override public Collection<? extends GrantedAuthority> getAuthorities() { return authorities; }
    @Override public String getPassword() { return matKhauHash; }
    @Override public String getUsername() { return tenDangNhap; }
    @Override public boolean isAccountNonExpired() { return true; }
    @Override public boolean isAccountNonLocked() { return !biKhoa; }
    @Override public boolean isCredentialsNonExpired() { return true; }
    @Override public boolean isEnabled() { return true; }
}
