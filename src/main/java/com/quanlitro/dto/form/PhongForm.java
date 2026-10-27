package com.quanlitro.dto.form;

import com.quanlitro.dto.phong.PhongRequest;
import com.quanlitro.dto.phong.PhongResponse;
import com.quanlitro.utils.TextUtils;

public class PhongForm {

    private String maPhong;
    private Integer tang;
    private Integer loaiPhongId;
    private String tienNghi;
    private String ghiChu;

    public String getMaPhong() { return maPhong; }
    public void setMaPhong(String maPhong) { this.maPhong = maPhong; }

    public Integer getTang() { return tang; }
    public void setTang(Integer tang) { this.tang = tang; }

    public Integer getLoaiPhongId() { return loaiPhongId; }
    public void setLoaiPhongId(Integer loaiPhongId) { this.loaiPhongId = loaiPhongId; }

    public String getTienNghi() { return tienNghi; }
    public void setTienNghi(String tienNghi) { this.tienNghi = tienNghi; }

    public String getGhiChu() { return ghiChu; }
    public void setGhiChu(String ghiChu) { this.ghiChu = ghiChu; }

    public PhongRequest toRequest() {
        return new PhongRequest(TextUtils.khongRong(maPhong), tang, loaiPhongId,
                TextUtils.khongRong(tienNghi), TextUtils.khongRong(ghiChu));
    }

    public static PhongForm tu(PhongResponse r) {
        PhongForm f = new PhongForm();
        f.maPhong = r.maPhong();
        f.tang = r.tang();
        f.loaiPhongId = r.loaiPhongId();
        f.tienNghi = r.tienNghi();
        f.ghiChu = r.ghiChu();
        return f;
    }

}
