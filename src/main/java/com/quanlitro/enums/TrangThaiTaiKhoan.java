package com.quanlitro.enums;

import java.util.Optional;

public enum TrangThaiTaiKhoan implements GiaTriDb {

    HOAT_DONG("hoat_dong", "Đang hoạt động"),
    KHOA("khoa", "Đã khóa");

    private final String ma;
    private final String nhan;

    TrangThaiTaiKhoan(String ma, String nhan) {
        this.ma = ma;
        this.nhan = nhan;
    }

    @Override public String getMa() { return ma; }
    @Override public String getNhan() { return nhan; }

    public static Optional<TrangThaiTaiKhoan> tuMa(String ma) { return EnumHelper.tuMa(TrangThaiTaiKhoan.class, ma); }
    public static String nhan(String ma) { return EnumHelper.nhan(TrangThaiTaiKhoan.class, ma); }
}
