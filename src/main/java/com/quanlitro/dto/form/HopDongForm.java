package com.quanlitro.dto.form;

import com.quanlitro.dto.hopdong.DichVuHopDongRequest;
import com.quanlitro.dto.hopdong.HopDongCreateRequest;
import com.quanlitro.utils.TextUtils;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.format.annotation.DateTimeFormat;

public class HopDongForm {

    private Integer phongId;
    private Integer khachThueId;
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate ngayBatDau;
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate ngayKetThuc;
    private BigDecimal giaThue;
    private BigDecimal tienCoc = BigDecimal.ZERO;
    private List<Integer> nguoiOCungIds = new ArrayList<>();
    private List<Integer> dichVuIds = new ArrayList<>();
    private Map<Integer, BigDecimal> soLuong = new HashMap<>();
    private String ghiChu;

    public Integer getPhongId() { return phongId; }
    public void setPhongId(Integer phongId) { this.phongId = phongId; }

    public Integer getKhachThueId() { return khachThueId; }
    public void setKhachThueId(Integer khachThueId) { this.khachThueId = khachThueId; }

    public LocalDate getNgayBatDau() { return ngayBatDau; }
    public void setNgayBatDau(LocalDate ngayBatDau) { this.ngayBatDau = ngayBatDau; }

    public LocalDate getNgayKetThuc() { return ngayKetThuc; }
    public void setNgayKetThuc(LocalDate ngayKetThuc) { this.ngayKetThuc = ngayKetThuc; }

    public BigDecimal getGiaThue() { return giaThue; }
    public void setGiaThue(BigDecimal giaThue) { this.giaThue = giaThue; }

    public BigDecimal getTienCoc() { return tienCoc; }
    public void setTienCoc(BigDecimal tienCoc) { this.tienCoc = tienCoc; }

    public List<Integer> getNguoiOCungIds() { return nguoiOCungIds; }
    public void setNguoiOCungIds(List<Integer> nguoiOCungIds) { this.nguoiOCungIds = nguoiOCungIds; }

    public List<Integer> getDichVuIds() { return dichVuIds; }
    public void setDichVuIds(List<Integer> dichVuIds) { this.dichVuIds = dichVuIds; }

    public Map<Integer, BigDecimal> getSoLuong() { return soLuong; }
    public void setSoLuong(Map<Integer, BigDecimal> soLuong) { this.soLuong = soLuong; }

    public String getGhiChu() { return ghiChu; }
    public void setGhiChu(String ghiChu) { this.ghiChu = ghiChu; }

    public HopDongCreateRequest toRequest() {
        List<DichVuHopDongRequest> dichVu = new ArrayList<>();
        if (dichVuIds != null) {
            for (Integer id : dichVuIds) {
                if (id == null) continue;
                BigDecimal sl = (soLuong == null || soLuong.get(id) == null) ? BigDecimal.ONE : soLuong.get(id);
                dichVu.add(new DichVuHopDongRequest(id, sl));
            }
        }
        return new HopDongCreateRequest(phongId, khachThueId, ngayBatDau, ngayKetThuc, giaThue, tienCoc,
                nguoiOCungIds, dichVu, TextUtils.khongRong(ghiChu));
    }

}
