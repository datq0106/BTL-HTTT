package com.quanlitro.dto.khachthue;

import com.quanlitro.custom.Cccd;
import com.quanlitro.custom.MaEnum;
import com.quanlitro.custom.SoDienThoai;
import com.quanlitro.enums.GioiTinh;
import com.quanlitro.enums.TrangThaiTamTru;
import jakarta.validation.constraints.*;
import java.time.LocalDate;

public record KhachThueRequest(
        @NotBlank @Size(max = 100) String hoTen,

        @NotBlank @Cccd
        String cccd,

        @NotBlank @SoDienThoai
        String sdt,

        @Email @Size(max = 100) String email,
        @Past LocalDate ngaySinh,
        @MaEnum(GioiTinh.class) String gioiTinh,
        @Size(max = 255) String queQuan,

        @MaEnum(TrangThaiTamTru.class) String trangThaiTamTru,
        @PastOrPresent LocalDate ngayKhaiBao
) {}
