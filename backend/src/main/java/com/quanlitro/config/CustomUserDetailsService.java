package com.quanlitro.config;

import com.quanlitro.entity.TaiKhoan;
import com.quanlitro.repository.TaiKhoanRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final TaiKhoanRepository taiKhoanRepo;

    public CustomUserDetailsService(TaiKhoanRepository taiKhoanRepo) {
        this.taiKhoanRepo = taiKhoanRepo;
    }

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String tenDangNhap) throws UsernameNotFoundException {
        TaiKhoan t = taiKhoanRepo.findByTenDangNhap(tenDangNhap)
                .orElseThrow(() -> new UsernameNotFoundException("Không tìm thấy tài khoản: " + tenDangNhap));
        return UserPrincipal.from(t);
    }
}
