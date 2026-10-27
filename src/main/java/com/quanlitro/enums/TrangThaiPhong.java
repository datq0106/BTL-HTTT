package com.quanlitro.enums;

import java.util.Optional;

public enum TrangThaiPhong implements GiaTriDb {

    TRONG("trong", "Trống"),
    DANG_THUE("dang_thue", "Đang thuê"),
    BAO_TRI("bao_tri", "Đang bảo trì"),
    DA_DAT_COC("da_dat_coc", "Đã đặt cọc");

    private final String ma;
    private final String nhan;

    TrangThaiPhong(String ma, String nhan) {
        this.ma = ma;
        this.nhan = nhan;
    }

    @Override public String getMa() { return ma; }
    @Override public String getNhan() { return nhan; }

    public static Optional<TrangThaiPhong> tuMa(String ma) { return EnumHelper.tuMa(TrangThaiPhong.class, ma); }
    public static String nhan(String ma) { return EnumHelper.nhan(TrangThaiPhong.class, ma); }
}
