package com.quanlitro.dto.form;

import com.quanlitro.dto.dichvu.DichVuRequest;
import com.quanlitro.dto.dichvu.DichVuResponse;
import com.quanlitro.utils.TextUtils;
import java.math.BigDecimal;

public class DichVuForm {

    private String tenDichVu;
    private BigDecimal donGia;
    private String donVi;
    private String loaiTinh;
    private Boolean dangApDung = Boolean.TRUE;

    public String getTenDichVu() { return tenDichVu; }
    public void setTenDichVu(String tenDichVu) { this.tenDichVu = tenDichVu; }

    public BigDecimal getDonGia() { return donGia; }
    public void setDonGia(BigDecimal donGia) { this.donGia = donGia; }

    public String getDonVi() { return donVi; }
    public void setDonVi(String donVi) { this.donVi = donVi; }

    public String getLoaiTinh() { return loaiTinh; }
    public void setLoaiTinh(String loaiTinh) { this.loaiTinh = loaiTinh; }

    public Boolean getDangApDung() { return dangApDung; }
    public void setDangApDung(Boolean dangApDung) { this.dangApDung = dangApDung; }

    public DichVuRequest toRequest() {
        return new DichVuRequest(TextUtils.khongRong(tenDichVu), donGia, TextUtils.khongRong(donVi),
                TextUtils.khongRong(loaiTinh), dangApDung);
    }

    public static DichVuForm tu(DichVuResponse r) {
        DichVuForm f = new DichVuForm();
        f.tenDichVu = r.tenDichVu();
        f.donGia = r.donGia();
        f.donVi = r.donVi();
        f.loaiTinh = r.loaiTinh();
        f.dangApDung = r.dangApDung();
        return f;
    }

}
