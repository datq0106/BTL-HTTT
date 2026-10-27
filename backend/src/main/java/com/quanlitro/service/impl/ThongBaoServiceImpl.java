package com.quanlitro.service.impl;

import com.quanlitro.dto.thongbao.ThongBaoResponse;
import com.quanlitro.entity.TaiKhoan;
import com.quanlitro.entity.ThongBao;
import com.quanlitro.enums.LoaiThongBao;
import com.quanlitro.repository.TaiKhoanRepository;
import com.quanlitro.repository.ThongBaoRepository;
import com.quanlitro.service.ThongBaoService;
import com.quanlitro.utils.NgayUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
@Transactional
public class ThongBaoServiceImpl implements ThongBaoService {

    private final ThongBaoRepository thongBaoRepo;
    private final TaiKhoanRepository taiKhoanRepo;

    public ThongBaoServiceImpl(ThongBaoRepository thongBaoRepo, TaiKhoanRepository taiKhoanRepo) {
        this.thongBaoRepo = thongBaoRepo;
        this.taiKhoanRepo = taiKhoanRepo;
    }

    @Override
    public boolean gui(TaiKhoan nguoiNhan, String loai, String tieuDe, String noiDung) {
        LocalDateTime dauNgay = LocalDate.now().atStartOfDay();
        if (thongBaoRepo.daCoThongBao(nguoiNhan.getId(), loai, tieuDe, dauNgay)) {
            return false;
        }
        ThongBao tb = new ThongBao();
        tb.setTaiKhoan(nguoiNhan);
        tb.setLoai(loai);
        tb.setTieuDe(tieuDe);
        tb.setNoiDung(noiDung);
        thongBaoRepo.save(tb);                      // daDoc để null = chưa đọc
        return true;
    }

    @Override
    public int guiChoNhanVien(String loai, String tieuDe, String noiDung) {
        int soLuong = 0;
        for (TaiKhoan tk : taiKhoanRepo.findNhanVienDangHoatDong()) {
            if (gui(tk, loai, tieuDe, noiDung)) {
                soLuong++;
            }
        }
        return soLuong;
    }

    @Override
    public boolean guiChoKhach(Integer khachThueId, String loai, String tieuDe, String noiDung) {
        return taiKhoanRepo.findByKhachThue_Id(khachThueId)
                .filter(tk -> "hoat_dong".equals(tk.getTrangThai()))
                .map(tk -> gui(tk, loai, tieuDe, noiDung))
                .orElse(false);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ThongBaoResponse> cuaToi(Integer taiKhoanId, Pageable pageable) {
        return thongBaoRepo.findByTaiKhoan_IdOrderByCreatedAtDesc(taiKhoanId, pageable)
                .map(ThongBaoServiceImpl::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public long demChuaDoc(Integer taiKhoanId) {
        return thongBaoRepo.countByTaiKhoan_IdAndDaDocIsNull(taiKhoanId);
    }

    @Override
    public void danhDauDaDoc(Integer taiKhoanId, Integer thongBaoId) {
        thongBaoRepo.danhDauDaDoc(thongBaoId, taiKhoanId, NgayUtils.bayGio());
    }

    @Override
    public int danhDauTatCaDaDoc(Integer taiKhoanId) {
        return thongBaoRepo.danhDauTatCaDaDoc(taiKhoanId, NgayUtils.bayGio());
    }

    private static ThongBaoResponse toResponse(ThongBao t) {
        return new ThongBaoResponse(t.getId(), t.getTieuDe(), t.getNoiDung(), t.getLoai(),
                LoaiThongBao.nhan(t.getLoai()), t.getDaDoc(), t.getCreatedAt());
    }
}