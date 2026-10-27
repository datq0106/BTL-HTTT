package com.quanlitro.config;

import com.quanlitro.entity.TaiKhoan;
import com.quanlitro.entity.VaiTro;
import com.quanlitro.repository.TaiKhoanRepository;
import com.quanlitro.repository.VaiTroRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private static final String MAT_KHAU_MAC_DINH = "Admin@123456";
    private static final String DAU_HIEU_GIU_CHO = "thay_bang_bcrypt_hash";
    private static final List<String> TAI_KHOAN_MAU = List.of("admin", "quanly1", "khach_a");

    private final TaiKhoanRepository taiKhoanRepo;
    private final VaiTroRepository vaiTroRepo;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(TaiKhoanRepository taiKhoanRepo, VaiTroRepository vaiTroRepo,
                           PasswordEncoder passwordEncoder) {
        this.taiKhoanRepo = taiKhoanRepo;
        this.vaiTroRepo = vaiTroRepo;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        for (String tenDangNhap : TAI_KHOAN_MAU) {
            taiKhoanRepo.findByTenDangNhap(tenDangNhap).ifPresent(t -> {
                if (t.getMatKhauHash() != null && t.getMatKhauHash().contains(DAU_HIEU_GIU_CHO)) {
                    t.setMatKhauHash(passwordEncoder.encode(MAT_KHAU_MAC_DINH));
                    taiKhoanRepo.save(t);
                    log.warn("Đã đặt mật khẩu mặc định cho tài khoản '{}'", tenDangNhap);
                }
            });
        }

        if (!taiKhoanRepo.existsByTenDangNhap("admin")) {
            VaiTro vaiTroAdmin = vaiTroRepo.findByMaVaiTro("ROLE_ADMIN").orElse(null);
            if (vaiTroAdmin == null) {
                log.error("Chưa có vai trò ROLE_ADMIN trong DB, hãy chạy file SQL tạo database trước");
                return;
            }
            TaiKhoan admin = new TaiKhoan();
            admin.setTenDangNhap("admin");
            admin.setMatKhauHash(passwordEncoder.encode(MAT_KHAU_MAC_DINH));
            admin.setHoTen("Chủ trọ");
            admin.setVaiTro(vaiTroAdmin);
            taiKhoanRepo.save(admin);
            log.warn("Đã tạo tài khoản admin mặc định");
        }
    }
}
