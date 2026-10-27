package com.quanlitro.enums;

import java.util.Optional;

public enum TrangThaiSuCo implements GiaTriDb {

    MOI("moi", "Mới"),
    DANG_XU_LY("dang_xu_ly", "Đang xử lý"),
    HOAN_THANH("hoan_thanh", "Hoàn thành"),
    HUY("huy", "Đã hủy");

    private final String ma;
    private final String nhan;

    TrangThaiSuCo(String ma, String nhan) {
        this.ma = ma;
        this.nhan = nhan;
    }

    @Override public String getMa() { return ma; }
    @Override public String getNhan() { return nhan; }

    public static Optional<TrangThaiSuCo> tuMa(String ma) { return EnumHelper.tuMa(TrangThaiSuCo.class, ma); }
    public static String nhan(String ma) { return EnumHelper.nhan(TrangThaiSuCo.class, ma); }
}
