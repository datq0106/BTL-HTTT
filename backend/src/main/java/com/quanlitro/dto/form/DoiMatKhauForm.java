package com.quanlitro.dto.form;

import com.quanlitro.dto.taikhoan.DoiMatKhauRequest;

public class DoiMatKhauForm {

    private String matKhauCu;
    private String matKhauMoi;
    private String xacNhanMatKhauMoi;

    public String getMatKhauCu() { return matKhauCu; }
    public void setMatKhauCu(String matKhauCu) { this.matKhauCu = matKhauCu; }

    public String getMatKhauMoi() { return matKhauMoi; }
    public void setMatKhauMoi(String matKhauMoi) { this.matKhauMoi = matKhauMoi; }

    public String getXacNhanMatKhauMoi() { return xacNhanMatKhauMoi; }
    public void setXacNhanMatKhauMoi(String xacNhanMatKhauMoi) { this.xacNhanMatKhauMoi = xacNhanMatKhauMoi; }

    public DoiMatKhauRequest toRequest() {
        return new DoiMatKhauRequest(matKhauCu, matKhauMoi, xacNhanMatKhauMoi);
    }

}
