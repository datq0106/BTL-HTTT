package com.quanlitro.dto.form;

import com.quanlitro.dto.taikhoan.TaiKhoanCreateRequest;
import com.quanlitro.dto.taikhoan.TaiKhoanResponse;
import com.quanlitro.dto.taikhoan.TaiKhoanUpdateRequest;
import com.quanlitro.utils.TextUtils;

public class TaiKhoanForm {

    private String tenDangNhap;
    private String matKhau;
    private String hoTen;
    private Integer vaiTroId;
    private Integer khachThueId;
    private String trangThai = "hoat_dong";

    public String getTenDangNhap() { return tenDangNhap; }
    public void setTenDangNhap(String tenDangNhap) { this.tenDangNhap = tenDangNhap; }

    public String getMatKhau() { return matKhau; }
    public void setMatKhau(String matKhau) { this.matKhau = matKhau; }

    public String getHoTen() { return hoTen; }
    public void setHoTen(String hoTen) { this.hoTen = hoTen; }

    public Integer getVaiTroId() { return vaiTroId; }
    public void setVaiTroId(Integer vaiTroId) { this.vaiTroId = vaiTroId; }

    public Integer getKhachThueId() { return khachThueId; }
    public void setKhachThueId(Integer khachThueId) { this.khachThueId = khachThueId; }

    public String getTrangThai() { return trangThai; }
    public void setTrangThai(String trangThai) { this.trangThai = trangThai; }

    public TaiKhoanCreateRequest toCreateRequest() {
        return new TaiKhoanCreateRequest(TextUtils.khongRong(tenDangNhap), matKhau,
                TextUtils.khongRong(hoTen), vaiTroId, khachThueId);
    }

    public TaiKhoanUpdateRequest toUpdateRequest() {
        return new TaiKhoanUpdateRequest(TextUtils.khongRong(hoTen), vaiTroId, trangThai);
    }

    public static TaiKhoanForm tu(TaiKhoanResponse r, Integer vaiTroId) {
        TaiKhoanForm f = new TaiKhoanForm();
        f.tenDangNhap = r.tenDangNhap();
        f.hoTen = r.hoTen();
        f.vaiTroId = vaiTroId;
        f.khachThueId = r.khachThueId();
        f.trangThai = r.trangThai();
        return f;
    }

}
