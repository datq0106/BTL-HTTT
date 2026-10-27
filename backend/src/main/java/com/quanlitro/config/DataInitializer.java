package com.quanlitro.config;

import com.quanlitro.entity.TaiKhoan;
import com.quanlitro.entity.VaiTro;
import com.quanlitro.repository.TaiKhoanRepository;
import com.quanlitro.repository.VaiTroRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);
    private static final String PLACEHOLDER = "thay_bang_bcrypt_hash";

    private final TaiKhoanRepository taiKhoanRepo;
    private final VaiTroRepository vaiTroRepo;
    private final PasswordEncoder passwordEncoder;
    private final String adminUsername;
    private final String initialPassword;

    public DataInitializer(TaiKhoanRepository taiKhoanRepo, VaiTroRepository vaiTroRepo,
                           PasswordEncoder passwordEncoder,
                           @Value("${nhatro.admin.username:admin}") String adminUsername,
                           @Value("${nhatro.admin.initial-password:}") String initialPassword) {
        this.taiKhoanRepo = taiKhoanRepo;
        this.vaiTroRepo = vaiTroRepo;
        this.passwordEncoder = passwordEncoder;
        this.adminUsername = adminUsername;
        this.initialPassword = initialPassword;
    }

    @Override
    public void run(String... args) {
        TaiKhoan existing = taiKhoanRepo.findByTenDangNhap(adminUsername).orElse(null);
        if (existing != null) {
            if (existing.getMatKhauHash() != null && existing.getMatKhauHash().contains(PLACEHOLDER)) {
                requireInitialPassword();
                existing.setMatKhauHash(passwordEncoder.encode(initialPassword));
                taiKhoanRepo.save(existing);
                log.warn("Đã thay hash giữ chỗ cho tài khoản quản trị '{}'", adminUsername);
            }
            return;
        }

        requireInitialPassword();
        VaiTro adminRole = vaiTroRepo.findByMaVaiTro("ROLE_ADMIN")
                .orElseThrow(() -> new IllegalStateException("Thiếu vai trò ROLE_ADMIN trong database"));
        TaiKhoan admin = new TaiKhoan();
        admin.setTenDangNhap(adminUsername);
        admin.setMatKhauHash(passwordEncoder.encode(initialPassword));
        admin.setHoTen("Quản trị viên");
        admin.setVaiTro(adminRole);
        taiKhoanRepo.save(admin);
        log.info("Đã tạo tài khoản quản trị '{}'; hãy đổi mật khẩu sau lần đăng nhập đầu", adminUsername);
    }

    private void requireInitialPassword() {
        if (initialPassword == null || initialPassword.length() < 12) {
            throw new IllegalStateException("Cần NHATRO_ADMIN_INITIAL_PASSWORD dài ít nhất 12 ký tự để khởi tạo admin");
        }
    }
}
