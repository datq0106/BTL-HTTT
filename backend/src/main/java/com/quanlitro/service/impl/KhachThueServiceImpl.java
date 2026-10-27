package com.quanlitro.service.impl;

import com.quanlitro.service.KhachThueService;

import com.quanlitro.dto.khachthue.KhachThueFilter;
import com.quanlitro.dto.khachthue.KhachThueRequest;
import com.quanlitro.dto.khachthue.KhachThueResponse;
import com.quanlitro.entity.KhachThue;
import com.quanlitro.exception.BusinessException;
import com.quanlitro.exception.ResourceNotFoundException;
import com.quanlitro.mapper.KhachThueMapper;
import com.quanlitro.repository.HopDongRepository;
import com.quanlitro.repository.KhachThueRepository;
import com.quanlitro.utils.TextUtils;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class KhachThueServiceImpl implements KhachThueService {

    private final KhachThueRepository khachThueRepo;
    private final HopDongRepository hopDongRepo;
    private final KhachThueMapper mapper;

    public KhachThueServiceImpl(KhachThueRepository khachThueRepo, HopDongRepository hopDongRepo,
                                KhachThueMapper mapper) {
        this.khachThueRepo = khachThueRepo;
        this.hopDongRepo = hopDongRepo;
        this.mapper = mapper;
    }

    @Override
    public KhachThueResponse tao(KhachThueRequest req) {
        if (khachThueRepo.existsByCccd(req.cccd())) {
            throw new BusinessException("CCCD đã tồn tại trong hệ thống");
        }
        return mapper.toResponse(khachThueRepo.save(mapper.toEntity(req)));
    }

    @Override
    public KhachThueResponse capNhat(Integer id, KhachThueRequest req) {
        KhachThue k = timEntity(id);
        if (khachThueRepo.existsByCccdAndIdNot(req.cccd(), id)) {
            throw new BusinessException("CCCD đã thuộc về khách thuê khác");
        }
        mapper.updateEntity(k, req);
        khachThueRepo.save(k);
        return timTheoId(id);
    }

    @Override
    public void capNhatDuongDanAnh(Integer id, String anhCccd, String anhTamTru) {
        KhachThue k = timEntity(id);
        if (anhCccd != null) k.setAnhCccd(anhCccd);
        if (anhTamTru != null) k.setAnhTamTru(anhTamTru);
        khachThueRepo.save(k);
    }

    @Override
    public void xoa(Integer id) {
        KhachThue k = timEntity(id);
        try {
            khachThueRepo.delete(k);
            khachThueRepo.flush();
        } catch (DataIntegrityViolationException e) {
            throw new BusinessException("Khách thuê đã có hợp đồng hoặc tài khoản, không thể xóa");
        }
    }

    @Override
    @Transactional(readOnly = true)
    public KhachThueResponse timTheoId(Integer id) {
        KhachThue k = timEntity(id);
        String maPhong = hopDongRepo
                .findFirstByKhachThue_IdAndTrangThaiOrderByNgayBatDauDesc(id, "hieu_luc")
                .map(h -> h.getPhong().getMaPhong())
                .orElse(null);
        return mapper.toResponse(k, maPhong);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<KhachThueResponse> timKiem(KhachThueFilter filter, Pageable pageable) {
        KhachThueFilter f = filter != null ? filter : new KhachThueFilter(null, null, null);
        return khachThueRepo.search(TextUtils.khongRong(f.keyword()),
                        TextUtils.khongRong(f.trangThaiTamTru()), f.dangThue(), pageable)
                .map(mapper::toResponse);
    }

    private KhachThue timEntity(Integer id) {
        return khachThueRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy khách thuê"));
    }
}
