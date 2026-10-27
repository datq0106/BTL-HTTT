package com.quanlitro.service;

import com.quanlitro.dto.common.PageResponse;
import com.quanlitro.dto.hoadon.HoaDonDtos;
import com.quanlitro.entity.*;
import com.quanlitro.exception.BusinessException;
import com.quanlitro.exception.ForbiddenException;
import com.quanlitro.exception.ResourceNotFoundException;
import com.quanlitro.repository.DichVuRepository;
import com.quanlitro.repository.HoaDonRepository;
import com.quanlitro.repository.HopDongRepository;
import com.quanlitro.repository.TaiKhoanRepository;
import com.quanlitro.utils.NgayUtils;
import com.quanlitro.utils.PhanTrang;
import com.quanlitro.utils.SecurityUtils;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.YearMonth;
import java.util.*;

/** Hóa đơn tháng bản đơn giản: tiền phòng + dịch vụ cố định + điện/nước theo chỉ số; chưa thanh toán → đã thanh toán. */
@Service
public class HoaDonService {
    private static final int HAN_THANH_TOAN_NGAY = 7;
    private final HoaDonRepository hoaDonRepo;
    private final HopDongRepository hopDongRepo;
    private final DichVuRepository dichVuRepo;
    private final TaiKhoanRepository taiKhoanRepo;
    private final ThongBaoService thongBaoService;

    public HoaDonService(HoaDonRepository hoaDonRepo, HopDongRepository hopDongRepo, DichVuRepository dichVuRepo,
                         TaiKhoanRepository taiKhoanRepo, ThongBaoService thongBaoService) {
        this.hoaDonRepo = hoaDonRepo;
        this.hopDongRepo = hopDongRepo;
        this.dichVuRepo = dichVuRepo;
        this.taiKhoanRepo = taiKhoanRepo;
        this.thongBaoService = thongBaoService;
    }

    @Transactional(readOnly = true)
    public HoaDonDtos.GoiY goiY(Integer hopDongId, String ky) {
        HopDong h = layHopDong(hopDongId);
        return new HoaDonDtos.GoiY(h.getId(), h.getMaHopDong(), h.getPhong().getMaPhong(),
                h.getKhachThue().getHoTen(), ky, tinhDong(h, Map.of()).stream().map(this::mapDong).toList());
    }

    @Transactional
    public HoaDonDtos.HoaDon lap(HoaDonDtos.LapHoaDon body) {
        HopDong h = layHopDong(body.hopDongId());
        if (!"hieu_luc".equals(h.getTrangThai())) throw new BusinessException("Chỉ lập hóa đơn cho hợp đồng đang hiệu lực");
        YearMonth ky = YearMonth.parse(body.ky());
        if (ky.isAfter(YearMonth.from(NgayUtils.homNay()))) throw new BusinessException("Không lập hóa đơn cho kỳ tương lai");
        if (ky.isBefore(YearMonth.from(h.getNgayBatDau()))) throw new BusinessException("Kỳ trước ngày bắt đầu hợp đồng");
        if (hoaDonRepo.existsByHopDong_IdAndKy(h.getId(), body.ky())) throw new BusinessException("Hợp đồng đã có hóa đơn kỳ " + body.ky());
        hoaDonRepo.findFirstByHopDong_IdOrderByKyDesc(h.getId()).ifPresent(cuoi -> {
            if (body.ky().compareTo(cuoi.getKy()) < 0) throw new BusinessException("Đã có hóa đơn kỳ sau (" + cuoi.getKy() + ")");
        });

        Map<Integer, BigDecimal> chiSoMoi = new HashMap<>();
        if (body.chiSo() != null) body.chiSo().forEach(c -> chiSoMoi.put(c.dichVuId(), c.chiSoMoi()));
        List<HoaDonChiTiet> dong = tinhDong(h, chiSoMoi);
        for (HoaDonChiTiet d : dong) {
            if (d.getChiSoCu() == null) continue;
            if (d.getChiSoMoi() == null) throw new BusinessException("Thiếu chỉ số mới của " + d.getNoiDung());
            if (d.getChiSoMoi().compareTo(d.getChiSoCu()) < 0)
                throw new BusinessException("Chỉ số mới của " + d.getNoiDung() + " nhỏ hơn chỉ số cũ");
        }

        HoaDon hd = new HoaDon();
        hd.setMaHoaDon("HD" + body.ky().replace("-", "") + "-" + h.getPhong().getMaPhong() + "-" + h.getId());
        hd.setHopDong(h);
        hd.setKy(body.ky());
        hd.setGhiChu(body.ghiChu() == null || body.ghiChu().isBlank() ? null : body.ghiChu().trim());
        hd.setCreatedAt(NgayUtils.bayGio());
        hd.setHanThanhToan(NgayUtils.homNay().plusDays(HAN_THANH_TOAN_NGAY));
        dong.forEach(d -> d.setHoaDon(hd));
        hd.getChiTiet().addAll(dong);
        hd.setTongTien(dong.stream().map(HoaDonChiTiet::getThanhTien).reduce(BigDecimal.ZERO, BigDecimal::add));
        HoaDon saved = hoaDonRepo.save(hd);
        thongBaoService.guiChoKhach(h.getKhachThue().getId(), "hoa_don", "Hóa đơn kỳ " + body.ky(),
                "Phòng " + h.getPhong().getMaPhong() + ": " + saved.getTongTien().toPlainString()
                        + " đ, hạn thanh toán " + saved.getHanThanhToan() + ".");
        return map(saved);
    }

    @Transactional
    public HoaDonDtos.HoaDon thanhToan(Long id, HoaDonDtos.ThanhToan body) {
        HoaDon hd = lay(id);
        if ("da_thanh_toan".equals(hd.getTrangThai())) throw new BusinessException("Hóa đơn đã được thanh toán");
        hd.setTrangThai("da_thanh_toan");
        hd.setPhuongThuc(body.phuongThuc());
        hd.setNgayThanhToan(NgayUtils.bayGio());
        return map(hoaDonRepo.save(hd));
    }

    @Transactional
    public void huy(Long id) {
        HoaDon hd = lay(id);
        if ("da_thanh_toan".equals(hd.getTrangThai())) throw new BusinessException("Không hủy hóa đơn đã thanh toán");
        hoaDonRepo.findFirstByHopDong_IdOrderByKyDesc(hd.getHopDong().getId()).ifPresent(cuoi -> {
            if (!cuoi.getId().equals(hd.getId())) throw new BusinessException("Chỉ hủy được hóa đơn kỳ mới nhất của hợp đồng");
        });
        hoaDonRepo.delete(hd);
    }

    @Transactional(readOnly = true)
    public PageResponse<HoaDonDtos.HoaDon> danhSach(String ky, String trangThai, String keyword, int trang, int kichThuoc) {
        Specification<HoaDon> spec = (root, query, cb) -> {
            List<Predicate> p = new ArrayList<>();
            if (coGiaTri(ky)) p.add(cb.equal(root.get("ky"), ky));
            if (coGiaTri(trangThai)) p.add(cb.equal(root.get("trangThai"), trangThai));
            if (coGiaTri(keyword)) {
                String like = "%" + keyword.trim().toLowerCase(Locale.ROOT) + "%";
                p.add(cb.or(cb.like(cb.lower(root.get("maHoaDon")), like),
                        cb.like(cb.lower(root.get("hopDong").get("phong").get("maPhong")), like),
                        cb.like(cb.lower(root.get("hopDong").get("khachThue").get("hoTen")), like)));
            }
            return cb.and(p.toArray(new Predicate[0]));
        };
        Sort sort = Sort.by(Sort.Order.desc("ky"), Sort.Order.asc("maHoaDon"));
        return PageResponse.tu(hoaDonRepo.findAll(spec, PhanTrang.cua(trang, kichThuoc, sort)).map(this::map));
    }

    @Transactional(readOnly = true)
    public HoaDonDtos.HoaDon chiTiet(Long id) { return map(lay(id)); }

    @Transactional(readOnly = true)
    public HoaDonDtos.ThongKe thongKe(String ky) {
        BigDecimal phaiThu = hoaDonRepo.tongTheoKy(ky);
        BigDecimal daThu = hoaDonRepo.daThuTheoKy(ky);
        return new HoaDonDtos.ThongKe(ky, hoaDonRepo.countByKy(ky), phaiThu, daThu,
                phaiThu.subtract(daThu), hoaDonRepo.tongCongNo());
    }

    @Transactional(readOnly = true)
    public List<HoaDonDtos.HoaDon> cuaCuDan() {
        return hoaDonRepo.findByHopDong_KhachThue_IdOrderByKyDesc(khachHienTai()).stream().map(this::map).toList();
    }

    @Transactional(readOnly = true)
    public HoaDonDtos.HoaDon chiTietCuDan(Long id) {
        HoaDon hd = lay(id);
        if (!hd.getHopDong().getKhachThue().getId().equals(khachHienTai())) throw new ForbiddenException();
        return map(hd);
    }

    /** Dòng hóa đơn: tiền phòng, dịch vụ cố định gắn hợp đồng, dịch vụ theo chỉ số đang áp dụng. */
    private List<HoaDonChiTiet> tinhDong(HopDong h, Map<Integer, BigDecimal> chiSoMoi) {
        List<HoaDonChiTiet> dong = new ArrayList<>();
        dong.add(dong(null, "Tiền phòng " + h.getPhong().getMaPhong(), "tháng", null, null, BigDecimal.ONE, h.getGiaThue()));
        for (HopDongDichVu dv : h.getDichVu()) {
            DichVu d = dv.getDichVu();
            dong.add(dong(d, d.getTenDichVu(), d.getDonVi(), null, null, dv.getSoLuong(), d.getDonGia()));
        }
        Map<Integer, BigDecimal> chiSoCu = new HashMap<>();
        hoaDonRepo.findFirstByHopDong_IdOrderByKyDesc(h.getId()).ifPresent(cuoi -> cuoi.getChiTiet().stream()
                .filter(c -> c.getDichVu() != null && c.getChiSoMoi() != null)
                .forEach(c -> chiSoCu.put(c.getDichVu().getId(), c.getChiSoMoi())));
        dichVuRepo.findAll(Sort.by("id")).stream()
                .filter(d -> Boolean.TRUE.equals(d.getDangApDung()) && "theo_chi_so".equals(d.getLoaiTinh()))
                .forEach(d -> {
                    BigDecimal cu = chiSoCu.getOrDefault(d.getId(), BigDecimal.ZERO);
                    BigDecimal moi = chiSoMoi.get(d.getId());
                    BigDecimal soLuong = moi == null ? BigDecimal.ZERO : moi.subtract(cu).max(BigDecimal.ZERO);
                    dong.add(dong(d, d.getTenDichVu(), d.getDonVi(), cu, moi, soLuong, d.getDonGia()));
                });
        return dong;
    }

    private HoaDonChiTiet dong(DichVu dv, String noiDung, String donVi, BigDecimal cu, BigDecimal moi,
                               BigDecimal soLuong, BigDecimal donGia) {
        HoaDonChiTiet d = new HoaDonChiTiet();
        d.setDichVu(dv);
        d.setNoiDung(noiDung);
        d.setDonVi(donVi);
        d.setChiSoCu(cu);
        d.setChiSoMoi(moi);
        d.setSoLuong(soLuong);
        d.setDonGia(donGia);
        d.setThanhTien(soLuong.multiply(donGia).setScale(0, RoundingMode.HALF_UP));
        return d;
    }

    private HoaDonDtos.Dong mapDong(HoaDonChiTiet d) {
        return new HoaDonDtos.Dong(d.getDichVu() == null ? null : d.getDichVu().getId(), d.getNoiDung(), d.getDonVi(),
                d.getChiSoCu(), d.getChiSoMoi(), d.getSoLuong(), d.getDonGia(), d.getThanhTien(), d.getChiSoCu() != null);
    }

    private HoaDonDtos.HoaDon map(HoaDon hd) {
        HopDong h = hd.getHopDong();
        return new HoaDonDtos.HoaDon(hd.getId(), hd.getMaHoaDon(), h.getId(), h.getMaHopDong(), h.getPhong().getMaPhong(),
                h.getKhachThue().getHoTen(), hd.getKy(), hd.getTongTien(), hd.getTrangThai(), hd.getHanThanhToan(),
                hd.getNgayThanhToan(), hd.getPhuongThuc(), hd.getGhiChu(), hd.getCreatedAt(),
                hd.getChiTiet().stream().map(this::mapDong).toList());
    }

    private HopDong layHopDong(Integer id) {
        return hopDongRepo.findById(id).orElseThrow(() -> ResourceNotFoundException.khongTim("hợp đồng", id));
    }
    private HoaDon lay(Long id) {
        return hoaDonRepo.findById(id).orElseThrow(() -> ResourceNotFoundException.khongTim("hóa đơn", id));
    }
    private Integer khachHienTai() {
        Integer id = SecurityUtils.taiKhoanId().orElseThrow(ForbiddenException::new);
        TaiKhoan tk = taiKhoanRepo.findById(id).orElseThrow(ForbiddenException::new);
        if (tk.getKhachThue() == null) throw new ForbiddenException();
        return tk.getKhachThue().getId();
    }
    private boolean coGiaTri(String s) { return s != null && !s.isBlank(); }
}
