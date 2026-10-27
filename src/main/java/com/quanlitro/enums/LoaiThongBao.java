package com.quanlitro.enums;

import java.util.Optional;

public enum LoaiThongBao implements GiaTriDb {

    HOA_DON("hoa_don", "Hóa đơn"),
    NHAC_NO("nhac_no", "Nhắc nợ"),
    HET_HAN_HD("het_han_hd", "Hợp đồng sắp hết hạn"),
    CHUNG("chung", "Thông báo chung"),
    SU_CO("su_co", "Sự cố");

    private final String ma;
    private final String nhan;

    LoaiThongBao(String ma, String nhan) {
        this.ma = ma;
        this.nhan = nhan;
    }

    @Override public String getMa() { return ma; }
    @Override public String getNhan() { return nhan; }

    public static Optional<LoaiThongBao> tuMa(String ma) { return EnumHelper.tuMa(LoaiThongBao.class, ma); }
    public static String nhan(String ma) { return EnumHelper.nhan(LoaiThongBao.class, ma); }
}
