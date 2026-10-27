package com.quanlitro.enums;

import java.util.Optional;

public enum BenChiuPhi implements GiaTriDb {

    CHU_TRO("chu_tro", "Chủ trọ"),
    KHACH_THUE("khach_thue", "Khách thuê");

    private final String ma;
    private final String nhan;

    BenChiuPhi(String ma, String nhan) {
        this.ma = ma;
        this.nhan = nhan;
    }

    @Override public String getMa() { return ma; }
    @Override public String getNhan() { return nhan; }

    public static Optional<BenChiuPhi> tuMa(String ma) { return EnumHelper.tuMa(BenChiuPhi.class, ma); }
    public static String nhan(String ma) { return EnumHelper.nhan(BenChiuPhi.class, ma); }
}
