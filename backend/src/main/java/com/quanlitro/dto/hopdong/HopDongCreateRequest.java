package com.quanlitro.dto.hopdong;

import com.quanlitro.custom.KhoangNgayHopLe;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@KhoangNgayHopLe(batDau = "ngayBatDau", ketThuc = "ngayKetThuc")
public record HopDongCreateRequest(
        @NotNull Integer phongId,
        @NotNull Integer khachThueId,

        @NotNull LocalDate ngayBatDau,
        @NotNull LocalDate ngayKetThuc,

        @PositiveOrZero BigDecimal giaThue,
        @NotNull @PositiveOrZero BigDecimal tienCoc,

        List<Integer> nguoiOCungIds,
        @Valid List<DichVuHopDongRequest> dichVu,

        @Size(max = 500) String ghiChu
) {}
