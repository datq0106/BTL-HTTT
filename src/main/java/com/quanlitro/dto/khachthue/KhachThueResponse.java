package com.quanlitro.dto.khachthue;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record KhachThueResponse(
        Integer id,
        String hoTen,
        String cccd,
        String sdt,
        String email,
        LocalDate ngaySinh,
        String gioiTinh,
        String queQuan,
        String anhCccd,
        String anhTamTru,
        String trangThaiTamTru,
        LocalDate ngayKhaiBao,
        String maPhongHienTai,
        LocalDateTime createdAt
) {}
