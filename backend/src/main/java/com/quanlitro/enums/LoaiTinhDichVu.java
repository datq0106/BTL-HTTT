package com.quanlitro.enums;

import java.util.Optional;

public enum LoaiTinhDichVu implements GiaTriDb {

    THEO_CHI_SO("theo_chi_so", "Tính theo chỉ số (điện, nước)"),
    CO_DINH("co_dinh", "Cố định hằng tháng");

    private final String ma;
    private final String nhan;

    LoaiTinhDichVu(String ma, String nhan) {
        this.ma = ma;
        this.nhan = nhan;
    }

    @Override public String getMa() { return ma; }
    @Override public String getNhan() { return nhan; }

    public static Optional<LoaiTinhDichVu> tuMa(String ma) { return EnumHelper.tuMa(LoaiTinhDichVu.class, ma); }
    public static String nhan(String ma) { return EnumHelper.nhan(LoaiTinhDichVu.class, ma); }
}
