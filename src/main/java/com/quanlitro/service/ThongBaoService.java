package com.quanlitro.service;

import com.quanlitro.dto.thongbao.ThongBaoResponse;
import com.quanlitro.entity.TaiKhoan;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ThongBaoService {

    boolean gui(TaiKhoan nguoiNhan, String loai, String tieuDe, String noiDung);

    int guiChoNhanVien(String loai, String tieuDe, String noiDung);

    boolean guiChoKhach(Integer khachThueId, String loai, String tieuDe, String noiDung);

    Page<ThongBaoResponse> cuaToi(Integer taiKhoanId, Pageable pageable);

    long demChuaDoc(Integer taiKhoanId);

    void danhDauDaDoc(Integer taiKhoanId, Integer thongBaoId);

    int danhDauTatCaDaDoc(Integer taiKhoanId);
}
