package com.quanlitro.enums;

import java.util.Optional;

public enum TrangThaiHopDong implements GiaTriDb {

    HIEU_LUC("hieu_luc", "Đang hiệu lực"),
    HET_HAN("het_han", "Đã hết hạn"),
    THANH_LY("thanh_ly", "Đã thanh lý");

    private final String ma;
    private final String nhan;

    TrangThaiHopDong(String ma, String nhan) {
        this.ma = ma;
        this.nhan = nhan;
    }

    @Override public String getMa() { return ma; }
    @Override public String getNhan() { return nhan; }

    public static Optional<TrangThaiHopDong> tuMa(String ma) { return EnumHelper.tuMa(TrangThaiHopDong.class, ma); }
    public static String nhan(String ma) { return EnumHelper.nhan(TrangThaiHopDong.class, ma); }
}
