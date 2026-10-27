package com.quanlitro.dto.common;

import org.springframework.data.domain.Page;

import java.util.List;


public record PageResponse<T>(
        List<T> noiDung,
        int trang,
        int kichThuoc,
        long tongSoBanGhi,
        int tongSoTrang
) {
    public static <T> PageResponse<T> tu(Page<T> p) {
        return new PageResponse<>(p.getContent(), p.getNumber(), p.getSize(), p.getTotalElements(), p.getTotalPages());
    }
}
