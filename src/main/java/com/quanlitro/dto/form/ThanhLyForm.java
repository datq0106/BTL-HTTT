package com.quanlitro.dto.form;

import com.quanlitro.dto.hopdong.ThanhLyHopDongRequest;
import com.quanlitro.utils.TextUtils;
import java.math.BigDecimal;

public class ThanhLyForm {

    private BigDecimal tienKhauTru = BigDecimal.ZERO;
    private String ghiChu;

    public BigDecimal getTienKhauTru() { return tienKhauTru; }
    public void setTienKhauTru(BigDecimal tienKhauTru) { this.tienKhauTru = tienKhauTru; }

    public String getGhiChu() { return ghiChu; }
    public void setGhiChu(String ghiChu) { this.ghiChu = ghiChu; }

    public ThanhLyHopDongRequest toRequest() {
        return new ThanhLyHopDongRequest(tienKhauTru, TextUtils.khongRong(ghiChu));
    }

}
