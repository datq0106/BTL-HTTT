package com.quanlitro.utils;

import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;


@Component("fmt")
public class FormatHelper {

    public String tien(BigDecimal v) { return TienUtils.dinhDang(v); }

    public String so(BigDecimal v) { return TienUtils.dinhDangSo(v); }

    public String chu(BigDecimal v) { return TienUtils.docSoThanhChu(v); }

    public String ngay(LocalDate d) { return NgayUtils.dinhDang(d); }

    public String ngayGio(LocalDateTime t) { return NgayUtils.dinhDangGio(t); }

    public String ky(Integer thang, Integer nam) {
        return (thang == null || nam == null) ? "" : NgayUtils.kyHoaDon(thang, nam);
    }

    public String cheCccd(String s) { return TextUtils.cheCccd(s); }

    public String cheSdt(String s) { return TextUtils.cheSdt(s); }

    public String catNgan(String s, int toiDa) { return TextUtils.catNgan(s, toiDa); }
}
