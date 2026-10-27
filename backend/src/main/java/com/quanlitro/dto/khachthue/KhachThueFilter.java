package com.quanlitro.dto.khachthue;

public record KhachThueFilter(
        String keyword,
        String trangThaiTamTru,
        Boolean dangThue
) {}