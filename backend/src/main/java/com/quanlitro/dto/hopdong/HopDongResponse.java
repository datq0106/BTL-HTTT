package com.quanlitro.dto.hopdong;

import com.quanlitro.dto.khachthue.KhachThueSummary;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public record HopDongResponse(
        Integer id,
        String maHopDong,

        Integer phongId,
        String maPhong,

        KhachThueSummary khachThue,
        List<KhachThueSummary> nguoiOCung,

        LocalDate ngayBatDau,
        LocalDate ngayKetThuc,
        Long soNgayConLai,

        BigDecimal giaThue,
        BigDecimal tienCoc,
        String trangThai,

        LocalDate ngayThanhLy,
        BigDecimal tienKhauTru,
        BigDecimal tienHoanCoc,

        BigDecimal congNo,
        List<DichVuHopDongResponse> dichVu,

        String ghiChu,
        LocalDateTime createdAt
) {}