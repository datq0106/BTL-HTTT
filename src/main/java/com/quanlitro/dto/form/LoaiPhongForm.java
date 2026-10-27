package com.quanlitro.dto.form;

import com.quanlitro.dto.phong.LoaiPhongRequest;
import com.quanlitro.dto.phong.LoaiPhongResponse;
import com.quanlitro.utils.TextUtils;
import java.math.BigDecimal;

public class LoaiPhongForm {

    private String tenLoai;
    private BigDecimal giaThue;
    private BigDecimal dienTich;
    private String moTa;

    public String getTenLoai() { return tenLoai; }
    public void setTenLoai(String tenLoai) { this.tenLoai = tenLoai; }

    public BigDecimal getGiaThue() { return giaThue; }
    public void setGiaThue(BigDecimal giaThue) { this.giaThue = giaThue; }

    public BigDecimal getDienTich() { return dienTich; }
    public void setDienTich(BigDecimal dienTich) { this.dienTich = dienTich; }

    public String getMoTa() { return moTa; }
    public void setMoTa(String moTa) { this.moTa = moTa; }

    public LoaiPhongRequest toRequest() {
        return new LoaiPhongRequest(TextUtils.khongRong(tenLoai), giaThue, dienTich, TextUtils.khongRong(moTa));
    }

    public static LoaiPhongForm tu(LoaiPhongResponse r) {
        LoaiPhongForm f = new LoaiPhongForm();
        f.tenLoai = r.tenLoai();
        f.giaThue = r.giaThue();
        f.dienTich = r.dienTich();
        f.moTa = r.moTa();
        return f;
    }

}
