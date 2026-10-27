package com.quanlitro.enums;

import java.util.Optional;

public enum TrangThaiHoaDon implements GiaTriDb {

    NHAP("nhap", "Nháp"),
    DA_CHOT("da_chot", "Đã chốt"),
    THANH_TOAN_MOT_PHAN("thanh_toan_mot_phan", "Thanh toán một phần"),
    DA_THANH_TOAN("da_thanh_toan", "Đã thanh toán");

    private final String ma;
    private final String nhan;

    TrangThaiHoaDon(String ma, String nhan) {
        this.ma = ma;
        this.nhan = nhan;
    }

    @Override public String getMa() { return ma; }
    @Override public String getNhan() { return nhan; }

    public static Optional<TrangThaiHoaDon> tuMa(String ma) { return EnumHelper.tuMa(TrangThaiHoaDon.class, ma); }
    public static String nhan(String ma) { return EnumHelper.nhan(TrangThaiHoaDon.class, ma); }
}
