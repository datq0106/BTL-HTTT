package com.quanlitro.dto.form;

import com.quanlitro.dto.khachthue.KhachThueRequest;
import com.quanlitro.dto.khachthue.KhachThueResponse;
import com.quanlitro.utils.TextUtils;
import java.time.LocalDate;
import org.springframework.format.annotation.DateTimeFormat;

public class KhachThueForm {

    private String hoTen;
    private String cccd;
    private String sdt;
    private String email;
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate ngaySinh;
    private String gioiTinh;
    private String queQuan;
    private String trangThaiTamTru = "chua_khai_bao";
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate ngayKhaiBao;

    public String getHoTen() { return hoTen; }
    public void setHoTen(String hoTen) { this.hoTen = hoTen; }

    public String getCccd() { return cccd; }
    public void setCccd(String cccd) { this.cccd = cccd; }

    public String getSdt() { return sdt; }
    public void setSdt(String sdt) { this.sdt = sdt; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public LocalDate getNgaySinh() { return ngaySinh; }
    public void setNgaySinh(LocalDate ngaySinh) { this.ngaySinh = ngaySinh; }

    public String getGioiTinh() { return gioiTinh; }
    public void setGioiTinh(String gioiTinh) { this.gioiTinh = gioiTinh; }

    public String getQueQuan() { return queQuan; }
    public void setQueQuan(String queQuan) { this.queQuan = queQuan; }

    public String getTrangThaiTamTru() { return trangThaiTamTru; }
    public void setTrangThaiTamTru(String trangThaiTamTru) { this.trangThaiTamTru = trangThaiTamTru; }

    public LocalDate getNgayKhaiBao() { return ngayKhaiBao; }
    public void setNgayKhaiBao(LocalDate ngayKhaiBao) { this.ngayKhaiBao = ngayKhaiBao; }

    public KhachThueRequest toRequest() {
        return new KhachThueRequest(TextUtils.khongRong(hoTen), TextUtils.khongRong(cccd), TextUtils.khongRong(sdt),
                TextUtils.khongRong(email), ngaySinh, TextUtils.khongRong(gioiTinh), TextUtils.khongRong(queQuan),
                TextUtils.khongRong(trangThaiTamTru), ngayKhaiBao);
    }

    public static KhachThueForm tu(KhachThueResponse r) {
        KhachThueForm f = new KhachThueForm();
        f.hoTen = r.hoTen();
        f.cccd = r.cccd();
        f.sdt = r.sdt();
        f.email = r.email();
        f.ngaySinh = r.ngaySinh();
        f.gioiTinh = r.gioiTinh();
        f.queQuan = r.queQuan();
        f.trangThaiTamTru = r.trangThaiTamTru();
        f.ngayKhaiBao = r.ngayKhaiBao();
        return f;
    }

}
