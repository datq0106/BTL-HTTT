package com.quanlitro.service;

import com.quanlitro.dto.common.PageResponse;
import com.quanlitro.dto.yeucau.YeuCauDtos;
import com.quanlitro.entity.*;
import com.quanlitro.exception.BusinessException;
import com.quanlitro.exception.ForbiddenException;
import com.quanlitro.exception.ResourceNotFoundException;
import com.quanlitro.exception.RateLimitException;
import com.quanlitro.repository.*;
import com.quanlitro.utils.NgayUtils;
import com.quanlitro.utils.PhanTrang;
import com.quanlitro.utils.SecurityUtils;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class YeuCauService {
    private static final Set<String> CHU_DE_CONG_KHAI = Set.of("lien-he", "brief", "chu-nha", "quan-tam");
    private static final Set<String> CHU_DE_CU_DAN = Set.of("bao-tri", "gia-han", "tam-tru", "nguoi-o-cung", "khac");
    private static final Set<String> TRANG_THAI = Set.of("cho_xu_ly", "dang_xu_ly", "da_xu_ly", "huy");
    private static final Set<String> MUC_DO = Set.of("binh_thuong", "can_gap", "khan_cap");
    private final YeuCauRepository yeuCauRepo;
    private final YeuCauLichSuRepository lichSuRepo;
    private final LichXemRepository lichXemRepo;
    private final TaiKhoanRepository taiKhoanRepo;
    private final HopDongRepository hopDongRepo;
    private final SecureRandom random = new SecureRandom();
    private final Map<String, Deque<LocalDateTime>> luotCongKhai = new HashMap<>();

    public YeuCauService(YeuCauRepository yeuCauRepo, YeuCauLichSuRepository lichSuRepo,
                         LichXemRepository lichXemRepo, TaiKhoanRepository taiKhoanRepo,
                         HopDongRepository hopDongRepo) {
        this.yeuCauRepo = yeuCauRepo;
        this.lichSuRepo = lichSuRepo;
        this.lichXemRepo = lichXemRepo;
        this.taiKhoanRepo = taiKhoanRepo;
        this.hopDongRepo = hopDongRepo;
    }

    @Transactional
    public synchronized YeuCauDtos.DaNhan guiCongKhai(YeuCauDtos.GuiCongKhai body, String ip) {
        if (!CHU_DE_CONG_KHAI.contains(body.chuDe())) throw new BusinessException("Chủ đề không hợp lệ");
        gioiHan(ip);
        String maPhong = body.maPhong();
        if ("quan-tam".equals(body.chuDe())) {
            if (body.listingKey() == null || body.listingKey().isBlank())
                throw new BusinessException("Thiếu mã tin đăng");
        }
        YeuCau yc = tao("khach_ngoai", body.chuDe(), body.tieuDe(), body.hoTen(), body.sdt(),
                body.email(), maPhong, body.listingKey(), "binh_thuong", body.noiDung(), null);
        return new YeuCauDtos.DaNhan(yc.getMaTraCuu(), yc.getTrangThai());
    }

    @Transactional
    public synchronized YeuCauDtos.DaNhan datLich(YeuCauDtos.DatLich body, String ip) {
        gioiHan(ip);
        if (!body.khungDeNghi().isAfter(NgayUtils.bayGio()) || body.khungDeNghi().isAfter(NgayUtils.bayGio().plusMonths(3))) {
            throw new BusinessException("Ngày xem phải ở tương lai và trong vòng 3 tháng");
        }
        String maPhong = body.maPhong();
        String noiDung = "Đề nghị xem căn " + body.listingKey() + " lúc " + body.khungDeNghi()
                + ". Ghi chú: " + (body.ghiChu() == null ? "" : body.ghiChu());
        YeuCau yc = tao("khach_ngoai", "xem-phong", "Đăng ký xem căn " + maPhong, body.hoTen(),
                body.sdt(), body.email(), maPhong, body.listingKey(), "binh_thuong", noiDung, null);
        LichXem lich = new LichXem();
        lich.setYeuCau(yc);
        lich.setListingKey(body.listingKey().trim());
        lich.setKhungDeNghi(body.khungDeNghi());
        lich.setCreatedAt(NgayUtils.bayGio());
        lich.setUpdatedAt(lich.getCreatedAt());
        lichXemRepo.save(lich);
        return new YeuCauDtos.DaNhan(yc.getMaTraCuu(), yc.getTrangThai());
    }

    @Transactional
    public YeuCauDtos.YeuCau guiCuDan(YeuCauDtos.GuiCuDan body) {
        if (!CHU_DE_CU_DAN.contains(body.chuDe()) || !MUC_DO.contains(body.mucDo())) {
            throw new BusinessException("Chủ đề hoặc mức độ không hợp lệ");
        }
        TaiKhoan tk = nguoiHienTai();
        if (tk.getKhachThue() == null) throw new ForbiddenException();
        KhachThue khach = tk.getKhachThue();
        String maPhong = hopDongRepo.findFirstByKhachThue_IdAndTrangThaiOrderByNgayBatDauDesc(khach.getId(), "hieu_luc")
                .map(h -> h.getPhong().getMaPhong()).orElse(null);
        YeuCau yc = tao("cu_dan", body.chuDe(), "Yêu cầu cư dân: " + body.chuDe(), khach.getHoTen(),
                khach.getSdt(), khach.getEmail(), maPhong, null, body.mucDo(), body.noiDung(), tk);
        return map(yc, false);
    }

    @Transactional(readOnly = true)
    public PageResponse<YeuCauDtos.YeuCau> cuaCuDan(int trang, int kichThuoc) {
        Integer id = SecurityUtils.taiKhoanId().orElseThrow(ForbiddenException::new);
        return PageResponse.tu(yeuCauRepo.findByTaiKhoan_Id(id,
                PhanTrang.cua(trang, kichThuoc, Sort.by(Sort.Direction.DESC, "createdAt"))).map(y -> map(y, false)));
    }

    @Transactional(readOnly = true)
    public YeuCauDtos.YeuCau chiTietCuDan(Long id) {
        YeuCau yc = lay(id);
        if (yc.getTaiKhoan() == null || !yc.getTaiKhoan().getId().equals(SecurityUtils.taiKhoanId().orElse(null))) {
            throw new ForbiddenException();
        }
        return map(yc, true);
    }

    @Transactional(readOnly = true)
    public PageResponse<YeuCauDtos.YeuCau> danhSach(String keyword, String nguon, String chuDe,
                                                      String trangThai, String mucDo, int trang, int kichThuoc) {
        Specification<YeuCau> spec = (root, query, cb) -> {
            List<Predicate> conditions = new ArrayList<>();
            if (coGiaTri(nguon)) conditions.add(cb.equal(root.get("nguon"), nguon));
            if (coGiaTri(chuDe)) conditions.add(cb.equal(root.get("chuDe"), chuDe));
            if (coGiaTri(trangThai)) conditions.add(cb.equal(root.get("trangThai"), trangThai));
            if (coGiaTri(mucDo)) conditions.add(cb.equal(root.get("mucDo"), mucDo));
            if (coGiaTri(keyword)) {
                String q = "%" + keyword.trim().toLowerCase(Locale.ROOT) + "%";
                conditions.add(cb.or(cb.like(cb.lower(root.get("hoTen")), q),
                        cb.like(cb.lower(root.get("sdt")), q), cb.like(cb.lower(root.get("tieuDe")), q),
                        cb.like(cb.lower(root.get("maPhong")), q)));
            }
            return cb.and(conditions.toArray(new Predicate[0]));
        };
        return PageResponse.tu(yeuCauRepo.findAll(spec,
                PhanTrang.cua(trang, kichThuoc, Sort.by(Sort.Direction.DESC, "createdAt"))).map(y -> map(y, false)));
    }

    @Transactional(readOnly = true)
    public YeuCauDtos.YeuCau chiTiet(Long id) { return map(lay(id), true); }

    @Transactional(readOnly = true)
    public YeuCauDtos.ThongKe thongKe() {
        return new YeuCauDtos.ThongKe(yeuCauRepo.countByTrangThai("cho_xu_ly"),
                yeuCauRepo.countByTrangThai("dang_xu_ly"),
                yeuCauRepo.countByMucDoAndTrangThaiIn("khan_cap", Set.of("cho_xu_ly", "dang_xu_ly")),
                yeuCauRepo.countByTrangThai("da_xu_ly"), yeuCauRepo.count());
    }

    @Transactional(readOnly = true)
    public List<YeuCauDtos.NhanVien> nhanVien() {
        return taiKhoanRepo.findNhanVienDangHoatDong().stream()
                .map(t -> new YeuCauDtos.NhanVien(t.getId(), t.getHoTen())).toList();
    }

    @Transactional
    public YeuCauDtos.YeuCau taoNoiBo(YeuCauDtos.TaoNoiBo body) {
        if (!MUC_DO.contains(body.mucDo())) throw new BusinessException("Mức độ không hợp lệ");
        return map(tao("noi_bo", body.chuDe(), body.tieuDe(), body.hoTen(), body.sdt(), body.email(),
                body.maPhong(), null, body.mucDo(), body.noiDung(), nguoiHienTai()), false);
    }

    @Transactional
    public YeuCauDtos.YeuCau xuLy(Long id, YeuCauDtos.XuLy body) {
        YeuCau yc = lay(id);
        TaiKhoan actor = nguoiHienTai();
        if (body.nguoiXuLyId() != null && body.nguoiXuLyId() < 0)
            throw new BusinessException("Người xử lý không hợp lệ");
        if (body.trangThai() != null && !body.trangThai().equals(yc.getTrangThai())) {
            if (lichXemRepo.findByYeuCau_Id(id).isPresent())
                throw new BusinessException("Vui lòng đổi trạng thái trong mục lịch xem");
            if (!TRANG_THAI.contains(body.trangThai()) || Set.of("da_xu_ly", "huy").contains(yc.getTrangThai()))
                throw new BusinessException("Không thể chuyển trạng thái yêu cầu");
            yc.setTrangThai(body.trangThai());
            ghi(yc, actor, "doi_trang_thai", body.trangThai());
        }
        if (body.nguoiXuLyId() != null && body.nguoiXuLyId() == 0 && yc.getNguoiXuLy() != null) {
            yc.setNguoiXuLy(null);
            ghi(yc, actor, "bo_phan_cong", "Bỏ phân công người xử lý");
        } else if (body.nguoiXuLyId() != null && body.nguoiXuLyId() > 0 &&
                (yc.getNguoiXuLy() == null || !body.nguoiXuLyId().equals(yc.getNguoiXuLy().getId()))) {
            TaiKhoan nguoiXuLy = taiKhoanRepo.findById(body.nguoiXuLyId())
                    .orElseThrow(() -> ResourceNotFoundException.khongTim("tài khoản", body.nguoiXuLyId()));
            if (!"hoat_dong".equals(nguoiXuLy.getTrangThai()) ||
                    !Set.of("ROLE_ADMIN", "ROLE_QUAN_LY").contains(nguoiXuLy.getVaiTro().getMaVaiTro()))
                throw new BusinessException("Người xử lý phải là nhân viên đang hoạt động");
            yc.setNguoiXuLy(nguoiXuLy);
            ghi(yc, actor, "phan_cong", nguoiXuLy.getHoTen());
        }
        if (body.phanHoi() != null && !body.phanHoi().trim().equals(Optional.ofNullable(yc.getPhanHoi()).orElse(""))) {
            if (body.phanHoi().length() > 5000) throw new BusinessException("Phản hồi quá dài");
            yc.setPhanHoi(body.phanHoi().trim());
            ghi(yc, actor, "phan_hoi", yc.getPhanHoi());
        }
        yc.setUpdatedAt(NgayUtils.bayGio());
        return map(yeuCauRepo.save(yc), true);
    }

    @Transactional
    public YeuCauDtos.YeuCau capNhatLich(Long yeuCauId, String trangThai, LocalDateTime khung) {
        YeuCau yc = lay(yeuCauId);
        LichXem lich = lichXemRepo.findByYeuCau_Id(yeuCauId)
                .orElseThrow(() -> ResourceNotFoundException.khongTim("lịch xem", yeuCauId));
        if (!Set.of("cho_xac_nhan", "da_xac_nhan").contains(lich.getTrangThai()))
            throw new BusinessException("Lịch xem đã kết thúc");
        if ("da_xac_nhan".equals(trangThai)) {
            if (khung == null || !khung.isAfter(NgayUtils.bayGio())) throw new BusinessException("Khung giờ xác nhận không hợp lệ");
            if (lichXemRepo.existsByListingKeyAndKhungXacNhanAndTrangThai(lich.getListingKey(), khung, "da_xac_nhan")
                    && !khung.equals(lich.getKhungXacNhan())) throw new BusinessException("Khung giờ này đã được đặt");
            lich.setKhungXacNhan(khung);
            yc.setTrangThai("dang_xu_ly");
        } else if ("da_hoan_thanh".equals(trangThai) && "da_xac_nhan".equals(lich.getTrangThai())) {
            yc.setTrangThai("da_xu_ly");
        } else if ("huy".equals(trangThai)) {
            yc.setTrangThai("huy");
        } else throw new BusinessException("Chuyển trạng thái lịch xem không hợp lệ");
        lich.setTrangThai(trangThai);
        lich.setUpdatedAt(NgayUtils.bayGio());
        yc.setUpdatedAt(lich.getUpdatedAt());
        ghi(yc, nguoiHienTai(), "lich_xem", trangThai + (khung == null ? "" : ": " + khung));
        lichXemRepo.save(lich);
        yeuCauRepo.save(yc);
        return map(yc, true);
    }

    @Transactional(readOnly = true)
    public YeuCauDtos.TraCuu traCuu(String ma) {
        if (!ma.matches("[0-9a-f]{64}")) throw new ResourceNotFoundException("Mã tra cứu không hợp lệ");
        YeuCau yc = yeuCauRepo.findByMaTraCuu(ma).orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy mã tra cứu"));
        return new YeuCauDtos.TraCuu(ma, yc.getChuDe(), yc.getTrangThai(),
                lichXemRepo.findByYeuCau_Id(yc.getId()).map(this::mapLich).orElse(null));
    }

    private YeuCau tao(String nguon, String chuDe, String tieuDe, String hoTen, String sdt,
                       String email, String maPhong, String listingKey, String mucDo, String noiDung, TaiKhoan tk) {
        String dienThoai = sdt.trim();
        int soChuSo = dienThoai.replaceAll("\\D", "").length();
        if (soChuSo < 9 || soChuSo > 11) throw new BusinessException("Số điện thoại không hợp lệ");
        String moTa = noiDung.trim();
        if (yeuCauRepo.existsBySdtAndChuDeAndNoiDungAndCreatedAtAfter(dienThoai, chuDe, moTa, NgayUtils.bayGio().minusMinutes(5)))
            throw new BusinessException("Yêu cầu giống hệt đã được gửi gần đây");
        YeuCau yc = new YeuCau();
        byte[] bytes = new byte[32];
        random.nextBytes(bytes);
        yc.setMaTraCuu(HexFormat.of().formatHex(bytes));
        yc.setNguon(nguon);
        yc.setChuDe(chuDe.trim());
        yc.setTieuDe(tieuDe.trim());
        yc.setHoTen(hoTen.trim());
        yc.setSdt(dienThoai);
        yc.setEmail(email == null ? null : email.trim());
        yc.setMaPhong(maPhong == null ? null : maPhong.trim());
        yc.setListingKey(listingKey == null ? null : listingKey.trim());
        yc.setMucDo(mucDo);
        yc.setNoiDung(moTa);
        yc.setTaiKhoan(tk);
        yc.setCreatedAt(NgayUtils.bayGio());
        yc.setUpdatedAt(yc.getCreatedAt());
        yc = yeuCauRepo.save(yc);
        ghi(yc, tk, "tiep_nhan", "Đã tiếp nhận yêu cầu");
        return yc;
    }

    private void ghi(YeuCau yc, TaiKhoan actor, String hanhDong, String noiDung) {
        YeuCauLichSu ls = new YeuCauLichSu();
        ls.setYeuCau(yc);
        ls.setTaiKhoan(actor);
        ls.setHanhDong(hanhDong);
        ls.setNoiDung(noiDung);
        ls.setCreatedAt(NgayUtils.bayGio());
        lichSuRepo.save(ls);
    }

    private synchronized void gioiHan(String ip) {
        String key = ip == null ? "unknown" : ip;
        LocalDateTime now = NgayUtils.bayGio();
        luotCongKhai.entrySet().removeIf(e -> {
            e.getValue().removeIf(t -> t.isBefore(now.minusMinutes(10)));
            return e.getValue().isEmpty();
        });
        Deque<LocalDateTime> ds = luotCongKhai.computeIfAbsent(key, x -> new ArrayDeque<>());
        if (ds.size() >= 10) throw new RateLimitException("Bạn gửi quá nhiều yêu cầu. Vui lòng thử lại sau 10 phút");
        ds.add(now);
    }

    private YeuCau lay(Long id) {
        return yeuCauRepo.findById(id).orElseThrow(() -> ResourceNotFoundException.khongTim("yêu cầu", id));
    }

    private TaiKhoan nguoiHienTai() {
        Integer id = SecurityUtils.taiKhoanId().orElseThrow(ForbiddenException::new);
        return taiKhoanRepo.findById(id).orElseThrow(ForbiddenException::new);
    }

    private boolean coGiaTri(String x) { return x != null && !x.isBlank(); }

    private YeuCauDtos.LichXem mapLich(LichXem l) {
        return new YeuCauDtos.LichXem(l.getId(), l.getListingKey(), l.getKhungDeNghi(),
                l.getKhungXacNhan(), l.getTrangThai());
    }

    private YeuCauDtos.YeuCau map(YeuCau y, boolean chiTiet) {
        List<YeuCauDtos.LichSu> ls = chiTiet ? lichSuRepo.findByYeuCau_IdOrderByCreatedAtAsc(y.getId()).stream()
                .map(x -> new YeuCauDtos.LichSu(x.getId(), x.getHanhDong(), x.getNoiDung(),
                        x.getTaiKhoan() == null ? null : x.getTaiKhoan().getHoTen(), x.getCreatedAt())).toList() : null;
        return new YeuCauDtos.YeuCau(y.getId(), y.getMaTraCuu(), y.getNguon(), y.getChuDe(), y.getTieuDe(),
                y.getHoTen(), y.getSdt(), y.getEmail(), y.getMaPhong(), y.getListingKey(), y.getMucDo(),
                y.getNoiDung(), y.getTrangThai(), y.getPhanHoi(),
                y.getNguoiXuLy() == null ? null : y.getNguoiXuLy().getId(),
                y.getNguoiXuLy() == null ? null : y.getNguoiXuLy().getHoTen(),
                y.getCreatedAt(), y.getUpdatedAt(),
                lichXemRepo.findByYeuCau_Id(y.getId()).map(this::mapLich).orElse(null), ls);
    }
}
