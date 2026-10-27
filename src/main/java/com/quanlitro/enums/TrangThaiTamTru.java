package com.quanlitro.enums;

import java.util.Optional;

public enum TrangThaiTamTru implements GiaTriDb {

    CHUA_KHAI_BAO("chua_khai_bao", "Chưa khai báo"),
    DA_KHAI_BAO("da_khai_bao", "Đã khai báo"),
    HET_HAN("het_han", "Hết hạn");

    private final String ma;
    private final String nhan;

    TrangThaiTamTru(String ma, String nhan) {
        this.ma = ma;
        this.nhan = nhan;
    }

    @Override public String getMa() { return ma; }
    @Override public String getNhan() { return nhan; }

    public static Optional<TrangThaiTamTru> tuMa(String ma) { return EnumHelper.tuMa(TrangThaiTamTru.class, ma); }
    public static String nhan(String ma) { return EnumHelper.nhan(TrangThaiTamTru.class, ma); }
}
