package com.quanlitro.dto.phong;


import java.math.BigDecimal;

public record PhongResponse(
        Integer id,
        String maPhong,
        Integer tang,
        Integer loaiPhongId,
        String tenLoai,
        BigDecimal giaThue,
        BigDecimal dienTich,
        String trangThai,
        String tienNghi,
        String ghiChu,
        Integer hopDongId,
        String tenKhachDangThue
) {}
