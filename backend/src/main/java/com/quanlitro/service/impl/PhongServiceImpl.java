package com.quanlitro.service.impl;

import com.quanlitro.service.PhongService;

import com.quanlitro.dto.phong.LoaiPhongRequest;
import com.quanlitro.dto.phong.LoaiPhongResponse;
import com.quanlitro.dto.phong.PhongFilter;
import com.quanlitro.dto.phong.PhongRequest;
import com.quanlitro.dto.phong.PhongResponse;
import com.quanlitro.dto.phong.PhongTrangThaiRequest;
import com.quanlitro.entity.HopDong;
import com.quanlitro.entity.LoaiPhong;
import com.quanlitro.entity.Phong;
import com.quanlitro.exception.BusinessException;
import com.quanlitro.exception.ResourceNotFoundException;
import com.quanlitro.mapper.PhongMapper;
import com.quanlitro.repository.HopDongRepository;
import com.quanlitro.repository.LoaiPhongRepository;
import com.quanlitro.repository.PhongRepository;
import com.quanlitro.utils.TextUtils;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@Transactional
public class PhongServiceImpl implements PhongService {

    private final PhongRepository phongRepo;
    private final LoaiPhongRepository loaiPhongRepo;
    private final HopDongRepository hopDongRepo;
    private final PhongMapper mapper;

    public PhongServiceImpl(PhongRepository phongRepo, LoaiPhongRepository loaiPhongRepo,
                            HopDongRepository hopDongRepo, PhongMapper mapper) {
        this.phongRepo = phongRepo;
        this.loaiPhongRepo = loaiPhongRepo;
        this.hopDongRepo = hopDongRepo;
        this.mapper = mapper;
    }

    @Override
    @Transactional(readOnly = true)
    public List<LoaiPhongResponse> danhSachLoaiPhong() {
        return loaiPhongRepo.findAll().stream().map(mapper::toResponse).toList();
    }

    @Override
    public LoaiPhongResponse taoLoaiPhong(LoaiPhongRequest req) {
        if (loaiPhongRepo.existsByTenLoai(req.tenLoai())) {
            throw new BusinessException("Tên loại phòng đã tồn tại");
        }
        return mapper.toResponse(loaiPhongRepo.save(mapper.toEntity(req)));
    }

    @Override
    public LoaiPhongResponse capNhatLoaiPhong(Integer id, LoaiPhongRequest req) {
        LoaiPhong lp = timLoaiPhong(id);
        if (loaiPhongRepo.existsByTenLoaiAndIdNot(req.tenLoai(), id)) {
            throw new BusinessException("Tên loại phòng đã tồn tại");
        }
        mapper.updateEntity(lp, req);
        return mapper.toResponse(loaiPhongRepo.save(lp));
    }

    @Override
    public void xoaLoaiPhong(Integer id) {
        LoaiPhong lp = timLoaiPhong(id);
        try {
            loaiPhongRepo.delete(lp);
            loaiPhongRepo.flush();                 // ép chạy ngay để bắt lỗi khóa ngoại
        } catch (DataIntegrityViolationException e) {
            throw new BusinessException("Loại phòng đang được sử dụng, không thể xóa");
        }
    }

    @Override
    public PhongResponse tao(PhongRequest req) {
        if (phongRepo.existsByMaPhong(req.maPhong())) {
            throw new BusinessException("Mã phòng đã tồn tại");
        }
        LoaiPhong lp = timLoaiPhong(req.loaiPhongId());
        Phong p = phongRepo.save(mapper.toEntity(req, lp));
        return mapper.toResponse(p);
    }

    @Override
    public PhongResponse capNhat(Integer id, PhongRequest req) {
        Phong p = timEntity(id);
        if (phongRepo.existsByMaPhongAndIdNot(req.maPhong(), id)) {
            throw new BusinessException("Mã phòng đã tồn tại");
        }
        LoaiPhong lp = timLoaiPhong(req.loaiPhongId());
        mapper.updateEntity(p, req, lp);
        return timTheoId(phongRepo.save(p).getId());
    }

    @Override
    public PhongResponse doiTrangThai(Integer id, PhongTrangThaiRequest req) {
        Phong p = timEntity(id);
        if ("dang_thue".equals(p.getTrangThai())) {
            throw new BusinessException("Phòng đang có hợp đồng, hãy thanh lý hợp đồng trước");
        }
        p.setTrangThai(req.trangThai());
        phongRepo.save(p);
        return timTheoId(id);
    }

    @Override
    public void xoa(Integer id) {
        Phong p = timEntity(id);
        if ("dang_thue".equals(p.getTrangThai())
                || hopDongRepo.existsByPhong_IdAndTrangThai(id, "hieu_luc")) {
            throw new BusinessException("Phòng đang có hợp đồng hiệu lực, không thể xóa");
        }
        p.setHienThi(false);
        phongRepo.save(p);
    }

    @Override
    @Transactional(readOnly = true)
    public PhongResponse timTheoId(Integer id) {
        Phong p = timEntity(id);
        HopDong hd = hopDongRepo.findByPhong_IdAndTrangThai(id, "hieu_luc").orElse(null);
        return mapper.toResponse(p, hd);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PhongResponse> timKiem(PhongFilter filter, Pageable pageable) {
        PhongFilter f = filter != null ? filter : new PhongFilter(null, null, null, null, null);

        Page<Phong> page = phongRepo.search(TextUtils.khongRong(f.keyword()), f.tang(),
                TextUtils.khongRong(f.trangThai()), f.giaTu(), f.giaDen(), pageable);

        List<Integer> ids = page.getContent().stream().map(Phong::getId).toList();
        Map<Integer, HopDong> hopDongTheoPhong = ids.isEmpty()
                ? Map.of()
                : hopDongRepo.findHieuLucByPhongIds(ids).stream()
                .collect(Collectors.toMap(h -> h.getPhong().getId(), Function.identity(), (a, b) -> a));

        return page.map(p -> mapper.toResponse(p, hopDongTheoPhong.get(p.getId())));
    }

    @Override
    @Transactional(readOnly = true)
    public List<PhongResponse> danhSachPhongTrong() {
        return phongRepo.findByTrangThaiAndHienThiTrueOrderByMaPhong("trong").stream()
                .map(mapper::toResponse)
                .toList();
    }

    private Phong timEntity(Integer id) {
        return phongRepo.findByIdAndHienThiTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy phòng"));
    }

    private LoaiPhong timLoaiPhong(Integer id) {
        return loaiPhongRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy loại phòng"));
    }
}
