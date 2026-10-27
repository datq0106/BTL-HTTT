package com.quanlitro.mapper;

import com.quanlitro.builder.HopDongBuilder;
import com.quanlitro.builder.HopDongResponseBuilder;
import com.quanlitro.dto.hopdong.DichVuHopDongRequest;
import com.quanlitro.dto.hopdong.DichVuHopDongResponse;
import com.quanlitro.dto.hopdong.GiaHanHopDongRequest;
import com.quanlitro.dto.hopdong.HopDongCreateRequest;
import com.quanlitro.dto.hopdong.HopDongResponse;
import com.quanlitro.dto.khachthue.KhachThueSummary;
import com.quanlitro.entity.DichVu;
import com.quanlitro.entity.HopDong;
import com.quanlitro.entity.HopDongDichVu;
import com.quanlitro.entity.HopDongKhach;
import com.quanlitro.entity.KhachThue;
import com.quanlitro.entity.Phong;
import com.quanlitro.entity.TaiKhoan;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@Component
public class HopDongMapper {

    private final KhachThueMapper khachThueMapper;

    public HopDongMapper(KhachThueMapper khachThueMapper) {
        this.khachThueMapper = khachThueMapper;
    }

    public HopDong toEntity(HopDongCreateRequest req, String maHopDong, Phong phong,
                            KhachThue daiDien, BigDecimal giaThue, TaiKhoan nguoiTao,
                            List<KhachThue> nguoiOCung, Map<Integer, DichVu> dichVuTheoId) {
        HopDongBuilder builder = HopDongBuilder.moi()
                .maHopDong(maHopDong)
                .phong(phong)
                .daiDien(daiDien)
                .thoiHan(req.ngayBatDau(), req.ngayKetThuc())
                .giaThue(giaThue)
                .tienCoc(req.tienCoc())
                .ghiChu(req.ghiChu())
                .nguoiTao(nguoiTao)
                .nguoiOCung(nguoiOCung);

        if (req.dichVu() != null) {
            for (DichVuHopDongRequest dv : req.dichVu()) {
                builder.themDichVu(dichVuTheoId.get(dv.dichVuId()), dv.soLuong());
            }
        }
        return builder.build();
    }

    // Gia hạn: đổi ngày kết thúc, đổi giá nếu có gửi giá mới
    public void applyGiaHan(HopDong h, GiaHanHopDongRequest req) {
        h.setNgayKetThuc(req.ngayKetThucMoi());
        if (req.giaThueMoi() != null) {
            h.setGiaThue(req.giaThueMoi());
        }
    }

    public HopDongResponse toResponse(HopDong h, BigDecimal congNo) {
        List<KhachThueSummary> nguoiOCung = h.getNguoiOCung().stream()
                .map(HopDongKhach::getKhachThue)
                .map(khachThueMapper::toSummary)
                .toList();

        List<DichVuHopDongResponse> dichVu = h.getDichVu().stream()
                .map(this::toResponse)
                .toList();

        return build(h, nguoiOCung, dichVu, congNo);
    }

    public HopDongResponse toListResponse(HopDong h) {
        return build(h, Collections.emptyList(), Collections.emptyList(), null);
    }

    public DichVuHopDongResponse toResponse(HopDongDichVu hdv) {
        DichVu dv = hdv.getDichVu();
        return new DichVuHopDongResponse(
                dv.getId(), dv.getTenDichVu(), dv.getDonGia(), dv.getDonVi(), hdv.getSoLuong());
    }

    private HopDongResponse build(HopDong h, List<KhachThueSummary> nguoiOCung,
                                  List<DichVuHopDongResponse> dichVu, BigDecimal congNo) {
        // Số ngày còn lại chỉ có ý nghĩa với hợp đồng đang hiệu lực (âm = đã quá hạn)
        Long soNgayConLai = "hieu_luc".equals(h.getTrangThai())
                ? ChronoUnit.DAYS.between(LocalDate.now(), h.getNgayKetThuc())
                : null;

        return HopDongResponseBuilder.moi()
                .id(h.getId())
                .maHopDong(h.getMaHopDong())
                .phong(h.getPhong().getId(), h.getPhong().getMaPhong())
                .khachThue(khachThueMapper.toSummary(h.getKhachThue()))
                .nguoiOCung(nguoiOCung)
                .thoiHan(h.getNgayBatDau(), h.getNgayKetThuc())
                .soNgayConLai(soNgayConLai)
                .giaThue(h.getGiaThue())
                .tienCoc(h.getTienCoc())
                .trangThai(h.getTrangThai())
                .thanhLy(h.getNgayThanhLy(), h.getTienKhauTru(), h.getTienHoanCoc())
                .congNo(congNo)
                .dichVu(dichVu)
                .ghiChu(h.getGhiChu())
                .createdAt(h.getCreatedAt())
                .build();
    }
}
