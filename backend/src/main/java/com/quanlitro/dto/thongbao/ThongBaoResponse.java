package com.quanlitro.dto.thongbao;

import java.time.LocalDateTime;

public record ThongBaoResponse(
        Integer id,
        String tieuDe,
        String noiDung,
        String loai,
        String nhanLoai,
        LocalDateTime daDoc,
        LocalDateTime createdAt
) {}
