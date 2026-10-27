package com.quanlitro.dto.form;

import com.quanlitro.dto.hopdong.GiaHanHopDongRequest;
import java.math.BigDecimal;
import java.time.LocalDate;
import org.springframework.format.annotation.DateTimeFormat;

public class GiaHanForm {

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate ngayKetThucMoi;
    private BigDecimal giaThueMoi;

    public LocalDate getNgayKetThucMoi() { return ngayKetThucMoi; }
    public void setNgayKetThucMoi(LocalDate ngayKetThucMoi) { this.ngayKetThucMoi = ngayKetThucMoi; }

    public BigDecimal getGiaThueMoi() { return giaThueMoi; }
    public void setGiaThueMoi(BigDecimal giaThueMoi) { this.giaThueMoi = giaThueMoi; }

    public GiaHanHopDongRequest toRequest() {
        return new GiaHanHopDongRequest(ngayKetThucMoi, giaThueMoi);
    }

}
