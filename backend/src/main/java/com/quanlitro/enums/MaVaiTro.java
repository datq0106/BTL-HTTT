package com.quanlitro.enums;

import java.util.Optional;

public enum MaVaiTro implements GiaTriDb {

    ADMIN("ROLE_ADMIN", "Chủ trọ"),
    QUAN_LY("ROLE_QUAN_LY", "Quản lý"),
    KHACH("ROLE_KHACH", "Khách thuê");

    private final String ma;
    private final String nhan;

    MaVaiTro(String ma, String nhan) {
        this.ma = ma;
        this.nhan = nhan;
    }

    @Override public String getMa() { return ma; }
    @Override public String getNhan() { return nhan; }

    public String tenRole() {
        return ma.substring("ROLE_".length());
    }

    public static Optional<MaVaiTro> tuMa(String ma) { return EnumHelper.tuMa(MaVaiTro.class, ma); }
    public static String nhan(String ma) { return EnumHelper.nhan(MaVaiTro.class, ma); }
}
