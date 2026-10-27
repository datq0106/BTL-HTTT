package com.quanlitro.service.impl;

import java.util.List;
import com.quanlitro.dto.taikhoan.VaiTroResponse;
import com.quanlitro.service.TaiKhoanService;

import com.quanlitro.dto.taikhoan.DoiMatKhauRequest;
import com.quanlitro.dto.taikhoan.TaiKhoanCreateRequest;
import com.quanlitro.dto.taikhoan.TaiKhoanResponse;
import com.quanlitro.dto.taikhoan.TaiKhoanUpdateRequest;
import com.quanlitro.entity.KhachThue;
import com.quanlitro.entity.TaiKhoan;
import com.quanlitro.entity.VaiTro;
import com.quanlitro.exception.BusinessException;
import com.quanlitro.exception.ResourceNotFoundException;
import com.quanlitro.mapper.TaiKhoanMapper;
import com.quanlitro.repository.KhachThueRepository;
import com.quanlitro.repository.TaiKhoanRepository;
import com.quanlitro.repository.VaiTroRepository;
import com.quanlitro.utils.TextUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@Transactional
public class TaiKhoanServiceImpl implements TaiKhoanService {

    private static final String ROLE_KHACH = "ROLE_KHACH";

    private final TaiKhoanRepository taiKhoanRepo;
    private final VaiTroRepository vaiTroRepo;
    private final KhachThueRepository khachThueRepo;
    private final TaiKhoanMapper mapper;
    private final PasswordEncoder passwordEncoder;

    public TaiKhoanServiceImpl(TaiKhoanRepository taiKhoanRepo, VaiTroRepository vaiTroRepo,
                               KhachThueRepository khachThueRepo, TaiKhoanMapper mapper,
                               PasswordEncoder passwordEncoder) {
        this.taiKhoanRepo = taiKhoanRepo;
        this.vaiTroRepo = vaiTroRepo;
        this.khachThueRepo = khachThueRepo;
        this.mapper = mapper;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public TaiKhoanResponse tao(TaiKhoanCreateRequest req) {
        if (taiKhoanRepo.existsByTenDangNhap(req.tenDangNhap())) {
            throw new BusinessException("Tên đăng nhập đã tồn tại");
        }
        VaiTro vaiTro = timVaiTro(req.vaiTroId());
        boolean laKhach = ROLE_KHACH.equals(vaiTro.getMaVaiTro());

        KhachThue khachThue = null;
        if (laKhach) {
            if (req.khachThueId() == null) {
                throw new BusinessException("Tài khoản khách thuê phải gắn với một khách thuê");
            }
            khachThue = khachThueRepo.findById(req.khachThueId())
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy khách thuê"));
            if (taiKhoanRepo.existsByKhachThue_Id(khachThue.getId())) {
                throw new BusinessException("Khách thuê này đã có tài khoản");
            }
        } else if (req.khachThueId() != null) {
            throw new BusinessException("Chỉ tài khoản có vai trò khách thuê mới gắn với khách thuê");
        }

        TaiKhoan t = mapper.toEntity(req, vaiTro, khachThue, passwordEncoder.encode(req.matKhau()));
        return mapper.toResponse(taiKhoanRepo.save(t));
    }

    @Override
    public TaiKhoanResponse capNhat(Integer id, TaiKhoanUpdateRequest req) {
        TaiKhoan t = timEntity(id);
        VaiTro vaiTro = timVaiTro(req.vaiTroId());

        boolean laKhachCu = ROLE_KHACH.equals(t.getVaiTro().getMaVaiTro());
        boolean laKhachMoi = ROLE_KHACH.equals(vaiTro.getMaVaiTro());
        if (laKhachCu != laKhachMoi) {
            throw new BusinessException("Không đổi giữa vai trò khách thuê và vai trò nhân sự, hãy tạo tài khoản mới");
        }

        mapper.updateEntity(t, req, vaiTro);
        return mapper.toResponse(taiKhoanRepo.save(t));
    }

    @Override
    public TaiKhoanResponse datTrangThai(Integer id, boolean khoa) {
        TaiKhoan t = timEntity(id);
        t.setTrangThai(khoa ? "khoa" : "hoat_dong");
        return mapper.toResponse(taiKhoanRepo.save(t));
    }

    @Override
    public void doiMatKhau(Integer id, DoiMatKhauRequest req) {
        TaiKhoan t = timEntity(id);
        if (!passwordEncoder.matches(req.matKhauCu(), t.getMatKhauHash())) {
            throw new BusinessException("Mật khẩu cũ không đúng");
        }
        if (!req.matKhauMoi().equals(req.xacNhanMatKhauMoi())) {
            throw new BusinessException("Xác nhận mật khẩu mới không khớp");
        }
        if (passwordEncoder.matches(req.matKhauMoi(), t.getMatKhauHash())) {
            throw new BusinessException("Mật khẩu mới phải khác mật khẩu cũ");
        }
        t.setMatKhauHash(passwordEncoder.encode(req.matKhauMoi()));
        taiKhoanRepo.save(t);
    }

    @Override
    public void ghiNhanDangNhap(Integer id) {
        taiKhoanRepo.capNhatLanDangNhapCuoi(id, LocalDateTime.now());
    }

    @Override
    @Transactional(readOnly = true)
    public TaiKhoanResponse timTheoId(Integer id) {
        return mapper.toResponse(timEntity(id));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<TaiKhoanResponse> timKiem(String keyword, Integer vaiTroId, Pageable pageable) {
        return taiKhoanRepo.search(TextUtils.khongRong(keyword), vaiTroId, pageable)
                .map(mapper::toResponse);
    }

    private TaiKhoan timEntity(Integer id) {
        return taiKhoanRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy tài khoản"));
    }

    private VaiTro timVaiTro(Integer id) {
        return vaiTroRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy vai trò"));
    }

    @Override
    @Transactional(readOnly = true)
    public List<VaiTroResponse> danhSachVaiTro() {
        return vaiTroRepo.findAll().stream()
                .map(v -> new VaiTroResponse(v.getId(), v.getMaVaiTro(), v.getTenVaiTro()))
                .toList();
    }
}
