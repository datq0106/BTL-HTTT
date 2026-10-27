package com.quanlitro.service.impl;

import com.quanlitro.service.DichVuService;

import com.quanlitro.dto.dichvu.DichVuRequest;
import com.quanlitro.dto.dichvu.DichVuResponse;
import com.quanlitro.entity.DichVu;
import com.quanlitro.exception.BusinessException;
import com.quanlitro.exception.ResourceNotFoundException;
import com.quanlitro.mapper.DichVuMapper;
import com.quanlitro.repository.DichVuRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class DichVuServiceImpl implements DichVuService {

    private final DichVuRepository dichVuRepo;
    private final DichVuMapper mapper;

    public DichVuServiceImpl(DichVuRepository dichVuRepo, DichVuMapper mapper) {
        this.dichVuRepo = dichVuRepo;
        this.mapper = mapper;
    }

    @Override
    public DichVuResponse tao(DichVuRequest req) {
        if (dichVuRepo.existsByTenDichVu(req.tenDichVu())) {
            throw new BusinessException("Tên dịch vụ đã tồn tại");
        }
        return mapper.toResponse(dichVuRepo.save(mapper.toEntity(req)));
    }

    @Override
    public DichVuResponse capNhat(Integer id, DichVuRequest req) {
        DichVu d = timEntity(id);
        if (dichVuRepo.existsByTenDichVuAndIdNot(req.tenDichVu(), id)) {
            throw new BusinessException("Tên dịch vụ đã tồn tại");
        }
        mapper.updateEntity(d, req);
        return mapper.toResponse(dichVuRepo.save(d));
    }

    @Override
    public DichVuResponse datApDung(Integer id, boolean apDung) {
        DichVu d = timEntity(id);
        d.setDangApDung(apDung);
        return mapper.toResponse(dichVuRepo.save(d));
    }

    @Override
    public void xoa(Integer id) {
        DichVu d = timEntity(id);
        try {
            dichVuRepo.delete(d);
            dichVuRepo.flush();
        } catch (DataIntegrityViolationException e) {
            throw new BusinessException("Dịch vụ đã được sử dụng, hãy chuyển sang ngừng áp dụng thay vì xóa");
        }
    }

    @Override
    @Transactional(readOnly = true)
    public DichVuResponse timTheoId(Integer id) {
        return mapper.toResponse(timEntity(id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<DichVuResponse> danhSach() {
        return dichVuRepo.findAll().stream().map(mapper::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<DichVuResponse> danhSachDangApDung(String loaiTinh) {
        List<DichVu> ds = (loaiTinh == null || loaiTinh.isBlank())
                ? dichVuRepo.findByDangApDungTrueOrderByTenDichVu()
                : dichVuRepo.findByLoaiTinhAndDangApDungTrue(loaiTinh);
        return ds.stream().map(mapper::toResponse).toList();
    }

    private DichVu timEntity(Integer id) {
        return dichVuRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy dịch vụ"));
    }
}
