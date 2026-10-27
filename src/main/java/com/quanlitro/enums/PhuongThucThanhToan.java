package com.quanlitro.enums;

import java.util.Optional;

public enum PhuongThucThanhToan implements GiaTriDb {

    TIEN_MAT("tien_mat", "Tiền mặt"),
    CHUYEN_KHOAN("chuyen_khoan", "Chuyển khoản"),
    VI_DIEN_TU("vi_dien_tu", "Ví điện tử");

    private final String ma;
    private final String nhan;

    PhuongThucThanhToan(String ma, String nhan) {
        this.ma = ma;
        this.nhan = nhan;
    }

    @Override public String getMa() { return ma; }
    @Override public String getNhan() { return nhan; }

    public static Optional<PhuongThucThanhToan> tuMa(String ma) { return EnumHelper.tuMa(PhuongThucThanhToan.class, ma); }
    public static String nhan(String ma) { return EnumHelper.nhan(PhuongThucThanhToan.class, ma); }
}
