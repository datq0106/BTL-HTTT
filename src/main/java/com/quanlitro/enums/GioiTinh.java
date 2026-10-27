package com.quanlitro.enums;

import java.util.Optional;

public enum GioiTinh implements GiaTriDb {

    NAM("nam", "Nam"),
    NU("nu", "Nữ"),
    KHAC("khac", "Khác");

    private final String ma;
    private final String nhan;

    GioiTinh(String ma, String nhan) {
        this.ma = ma;
        this.nhan = nhan;
    }

    @Override public String getMa() { return ma; }
    @Override public String getNhan() { return nhan; }

    public static Optional<GioiTinh> tuMa(String ma) { return EnumHelper.tuMa(GioiTinh.class, ma); }
    public static String nhan(String ma) { return EnumHelper.nhan(GioiTinh.class, ma); }
}
