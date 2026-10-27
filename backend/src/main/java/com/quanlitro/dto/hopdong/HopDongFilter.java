package com.quanlitro.dto.hopdong;

public record HopDongFilter(
        String keyword,
        Integer phongId,
        String trangThai,
        Boolean sapHetHan
) {}
