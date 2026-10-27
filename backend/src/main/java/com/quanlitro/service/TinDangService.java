package com.quanlitro.service;

import com.quanlitro.dto.common.PageResponse;
import com.quanlitro.dto.tindang.TinDangDtos;
import com.quanlitro.entity.*;
import com.quanlitro.exception.BusinessException;
import com.quanlitro.exception.ResourceNotFoundException;
import com.quanlitro.repository.*;
import com.quanlitro.utils.FileUtils;
import com.quanlitro.utils.NgayUtils;
import com.quanlitro.utils.PhanTrang;
import jakarta.persistence.criteria.Predicate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.*;

@Service
public class TinDangService {
    private static final Set<String> TRANG_THAI_CAN = Set.of("trong", "da_dat_coc", "dang_thue", "bao_tri");
    private final KhuVucRepository khuVucRepo;
    private final BatDongSanRepository batDongSanRepo;
    private final TinDangRepository tinDangRepo;
    private final TinDangAnhRepository anhRepo;
    private final PhongRepository phongRepo;
    private final Path uploadRoot;

    public TinDangService(KhuVucRepository khuVucRepo, BatDongSanRepository batDongSanRepo,
                          TinDangRepository tinDangRepo, TinDangAnhRepository anhRepo, PhongRepository phongRepo,
                          @Value("${nhatro.upload.dir:uploads}") String uploadDir) {
        this.khuVucRepo = khuVucRepo;
        this.batDongSanRepo = batDongSanRepo;
        this.tinDangRepo = tinDangRepo;
        this.anhRepo = anhRepo;
        this.phongRepo = phongRepo;
        this.uploadRoot = Path.of(uploadDir);
    }

    @Transactional(readOnly = true)
    public List<TinDangDtos.KhuVuc> khuVucCongKhai() {
        return khuVucRepo.findByHienThiTrueOrderByTenAsc().stream().map(this::mapKhu).toList();
    }

    @Transactional(readOnly = true)
    public TinDangDtos.KhuVuc chiTietKhu(String slug) {
        KhuVuc k = khuVucRepo.findById(slug).orElseThrow(() -> ResourceNotFoundException.khongTim("khu vực", slug));
        if (!Boolean.TRUE.equals(k.getHienThi())) throw ResourceNotFoundException.khongTim("khu vực", slug);
        return mapKhu(k);
    }

    @Transactional(readOnly = true)
    public List<TinDangDtos.KhuVuc> khuVucNoiBo() {
        return khuVucRepo.findAll(Sort.by("ten")).stream().map(this::mapKhu).toList();
    }

    @Transactional
    public TinDangDtos.KhuVuc luuKhu(String slug, TinDangDtos.KhuVucRequest body) {
        if (!slug.equals(body.slug())) throw new BusinessException("Slug khu vực không được đổi");
        KhuVuc k = khuVucRepo.findById(slug).orElseGet(KhuVuc::new);
        k.setSlug(slug);
        k.setTen(body.ten().trim());
        k.setMoTa(trim(body.moTa()));
        k.setAnhUrl(trim(body.anhUrl()));
        k.setKhach(trim(body.khach()));
        k.setDacDiem(trim(body.dacDiem()));
        k.setPinX(body.pinX());
        k.setPinY(body.pinY());
        k.setHienThi(body.hienThi() == null || body.hienThi());
        return mapKhu(khuVucRepo.save(k));
    }

    @Transactional(readOnly = true)
    public List<TinDangDtos.BatDongSan> batDongSanNoiBo() {
        return batDongSanRepo.findAll(Sort.by("ten")).stream().map(this::mapBatDongSan).toList();
    }

    @Transactional
    public TinDangDtos.BatDongSan luuBatDongSan(Long id, TinDangDtos.BatDongSanRequest body) {
        KhuVuc khu = khuVucRepo.findById(body.khuVucSlug())
                .orElseThrow(() -> ResourceNotFoundException.khongTim("khu vực", body.khuVucSlug()));
        BatDongSan b = id == null ? new BatDongSan() : batDongSanRepo.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.khongTim("bất động sản", id));
        b.setKhuVuc(khu);
        b.setTen(body.ten().trim());
        b.setDiaChi(body.diaChi().trim());
        b.setPinX(body.pinX());
        b.setPinY(body.pinY());
        if (id == null) b.setCreatedAt(NgayUtils.bayGio());
        b.setUpdatedAt(NgayUtils.bayGio());
        return mapBatDongSan(batDongSanRepo.save(b));
    }

    @Transactional(readOnly = true)
    public PageResponse<TinDangDtos.TinDang> danhSachCongKhai(String q, String khu, String loai,
            BigDecimal giaDen, Integer phongNgu, String trangThaiCan, String sapXep, int trang, int kichThuoc) {
        Specification<TinDang> spec = (root, query, cb) -> {
            List<Predicate> p = new ArrayList<>();
            p.add(cb.equal(root.get("trangThai"), "xuat_ban"));
            p.add(cb.isTrue(root.get("batDongSan").get("khuVuc").get("hienThi")));
            if (coGiaTri(khu)) p.add(cb.equal(root.get("batDongSan").get("khuVuc").get("slug"), khu));
            if (coGiaTri(loai)) p.add(cb.equal(root.get("loai"), loai));
            if (giaDen != null) p.add(cb.lessThanOrEqualTo(root.get("giaNiemYet"), giaDen));
            if (phongNgu != null) p.add(phongNgu >= 3 ? cb.greaterThanOrEqualTo(root.get("phongNgu"), 3)
                    : cb.equal(root.get("phongNgu"), phongNgu));
            if (coGiaTri(trangThaiCan)) p.add(cb.equal(root.get("trangThaiCan"), trangThaiCan));
            if (coGiaTri(q)) {
                String like = "%" + q.trim().toLowerCase(Locale.ROOT) + "%";
                p.add(cb.or(cb.like(cb.lower(root.get("tieuDe")), like),
                        cb.like(cb.lower(root.get("ma")), like),
                        cb.like(cb.lower(root.get("loai")), like),
                        cb.like(cb.lower(root.get("batDongSan").get("diaChi")), like)));
            }
            return cb.and(p.toArray(new Predicate[0]));
        };
        Sort sort = switch (sapXep == null ? "" : sapXep) {
            case "gia-tang" -> Sort.by("giaNiemYet").ascending();
            case "gia-giam" -> Sort.by("giaNiemYet").descending();
            case "dien-tich" -> Sort.by("dienTich").descending();
            default -> Sort.by(Sort.Order.desc("noiBat"), Sort.Order.desc("publishedAt"));
        };
        return PageResponse.tu(tinDangRepo.findAll(spec, PhanTrang.cua(trang, kichThuoc, sort))
                .map(t -> mapTin(t, true)));
    }

    @Transactional(readOnly = true)
    public TinDangDtos.TinDang chiTietCongKhai(String slug) {
        TinDang t = tinDangRepo.findBySlugAndTrangThai(slug, "xuat_ban")
                .orElseThrow(() -> ResourceNotFoundException.khongTim("tin đăng", slug));
        if (!Boolean.TRUE.equals(t.getBatDongSan().getKhuVuc().getHienThi()))
            throw ResourceNotFoundException.khongTim("tin đăng", slug);
        return mapTin(t, true);
    }

    @Transactional(readOnly = true)
    public List<TinDangDtos.TinDang> tuongTu(String slug) {
        TinDangDtos.TinDang goc = chiTietCongKhai(slug);
        return danhSachCongKhai(null, goc.khuVuc(), null, null, null, null,
                "noi-bat", 0, 20).noiDung().stream()
                .filter(x -> !x.id().equals(slug)).limit(3).toList();
    }

    @Transactional(readOnly = true)
    public PageResponse<TinDangDtos.TinDang> danhSachNoiBo(String q, String trangThai, Integer phongId,
                                                         int trang, int kichThuoc) {
        Specification<TinDang> spec = (root, query, cb) -> {
            List<Predicate> p = new ArrayList<>();
            if (phongId != null) p.add(cb.equal(root.get("phong").get("id"), phongId));
            if (coGiaTri(trangThai)) p.add(cb.equal(root.get("trangThai"), trangThai));
            if (coGiaTri(q)) {
                String like = "%" + q.trim().toLowerCase(Locale.ROOT) + "%";
                p.add(cb.or(cb.like(cb.lower(root.get("tieuDe")), like), cb.like(cb.lower(root.get("ma")), like)));
            }
            return cb.and(p.toArray(new Predicate[0]));
        };
        return PageResponse.tu(tinDangRepo.findAll(spec,
                PhanTrang.cua(trang, kichThuoc, Sort.by(Sort.Direction.DESC, "updatedAt")))
                .map(t -> mapTin(t, false)));
    }

    @Transactional(readOnly = true)
    public TinDangDtos.TinDang chiTietNoiBo(Long id) { return mapTin(layTin(id), false); }

    @Transactional
    public TinDangDtos.TinDang luuTin(Long id, TinDangDtos.TinDangRequest body) {
        if (body.gia().precision() > 14 || body.datCoc().precision() > 14 || body.dienTich().precision() > 7)
            throw new BusinessException("Giá hoặc diện tích vượt phạm vi cho phép");
        String ttCan = body.trangThaiCan() == null ? "trong" : body.trangThaiCan();
        if (!TRANG_THAI_CAN.contains(ttCan)) throw new BusinessException("Trạng thái căn không hợp lệ");
        BatDongSan b = batDongSanRepo.findById(body.batDongSanId())
                .orElseThrow(() -> ResourceNotFoundException.khongTim("bất động sản", body.batDongSanId()));
        TinDang t = id == null ? new TinDang() : layTin(id);
        if (body.phongId() != null && tinDangRepo.existsByPhong_IdAndIdNot(body.phongId(), id == null ? -1L : id))
            throw new BusinessException("Phòng này đã có tin đăng khác");
        if (id != null && "xuat_ban".equals(t.getTrangThai()))
            throw new BusinessException("Ẩn tin trước khi sửa nội dung");
        t.setSlug(body.slug());
        t.setBatDongSan(b);
        t.setPhong(body.phongId() == null ? null : phongRepo.findById(body.phongId())
                .orElseThrow(() -> ResourceNotFoundException.khongTim("phòng", body.phongId())));
        t.setMa(body.ma().trim());
        t.setTieuDe(body.tieuDe().trim());
        t.setLoai(body.loai().trim());
        t.setPhongNgu(body.phongNgu());
        t.setPhongTam(body.phongTam());
        t.setDienTich(body.dienTich());
        t.setTang(body.tang());
        t.setGiaNiemYet(body.gia());
        t.setDatCoc(body.datCoc());
        t.setTienNghi(trim(body.tienNghi()));
        t.setMoTa(body.moTa().trim());
        t.setNoiBat(Boolean.TRUE.equals(body.noiBat()));
        t.setTrangThaiCan(ttCan);
        if (id == null) t.setCreatedAt(NgayUtils.bayGio());
        t.setUpdatedAt(NgayUtils.bayGio());
        return mapTin(tinDangRepo.save(t), false);
    }

    @Transactional
    public TinDangDtos.TinDang xuatBan(Long id) {
        TinDang t = layTin(id);
        if (anhRepo.countByTinDang_Id(id) == 0) throw new BusinessException("Cần tải ít nhất một ảnh trước khi xuất bản");
        if (!Boolean.TRUE.equals(t.getBatDongSan().getKhuVuc().getHienThi()))
            throw new BusinessException("Khu vực đang bị ẩn");
        t.setTrangThai("xuat_ban");
        t.setPublishedAt(NgayUtils.bayGio());
        t.setUpdatedAt(t.getPublishedAt());
        return mapTin(tinDangRepo.save(t), false);
    }

    @Transactional
    public TinDangDtos.TinDang anTin(Long id) {
        TinDang t = layTin(id);
        t.setTrangThai("an");
        t.setUpdatedAt(NgayUtils.bayGio());
        return mapTin(tinDangRepo.save(t), false);
    }

    @Transactional
    public TinDangDtos.TinDang themAnh(Long id, MultipartFile file, String altText) {
        TinDang t = layTin(id);
        if ("xuat_ban".equals(t.getTrangThai())) throw new BusinessException("Ẩn tin trước khi thay ảnh");
        String path = FileUtils.luu(file, uploadRoot, "tin-dang/" + id, FileUtils.DUOI_ANH, FileUtils.TOI_DA_5MB);
        try {
            TinDangAnh a = new TinDangAnh();
            a.setTinDang(t);
            a.setDuongDan(path);
            a.setThuTu(anhRepo.findByTinDang_IdOrderByThuTuAsc(id).size());
            a.setAltText(trim(altText));
            anhRepo.save(a);
            return mapTin(t, false);
        } catch (RuntimeException ex) {
            FileUtils.xoa(uploadRoot, path);
            throw ex;
        }
    }

    @Transactional
    public TinDangDtos.TinDang xoaAnh(Long id, Long anhId) {
        TinDang t = layTin(id);
        if ("xuat_ban".equals(t.getTrangThai())) throw new BusinessException("Ẩn tin trước khi thay ảnh");
        TinDangAnh a = layAnh(id, anhId);
        anhRepo.delete(a);
        FileUtils.xoa(uploadRoot, a.getDuongDan());
        return mapTin(t, false);
    }

    @Transactional
    public TinDangDtos.TinDang sapXepAnh(Long id, List<Long> ids) {
        TinDang t = layTin(id);
        if ("xuat_ban".equals(t.getTrangThai())) throw new BusinessException("Ẩn tin trước khi thay ảnh");
        List<TinDangAnh> images = anhRepo.findByTinDang_IdOrderByThuTuAsc(id);
        if (ids.size() != images.size() || !new HashSet<>(ids).equals(images.stream().map(TinDangAnh::getId).collect(java.util.stream.Collectors.toSet())))
            throw new BusinessException("Thứ tự ảnh không hợp lệ");
        Map<Long, TinDangAnh> byId = new HashMap<>();
        images.forEach(a -> byId.put(a.getId(), a));
        for (int i = 0; i < ids.size(); i++) byId.get(ids.get(i)).setThuTu(i);
        anhRepo.saveAll(images);
        return mapTin(t, false);
    }

    @Transactional(readOnly = true)
    public Path anhCongKhai(String slug, Long anhId) {
        TinDang t = tinDangRepo.findBySlugAndTrangThai(slug, "xuat_ban")
                .orElseThrow(() -> ResourceNotFoundException.khongTim("tin đăng", slug));
        if (!Boolean.TRUE.equals(t.getBatDongSan().getKhuVuc().getHienThi()))
            throw ResourceNotFoundException.khongTim("tin đăng", slug);
        return duongDanAnh(layAnh(t.getId(), anhId));
    }

    @Transactional(readOnly = true)
    public Path anhNoiBo(Long id, Long anhId) { return duongDanAnh(layAnh(id, anhId)); }

    @Transactional(readOnly = true)
    public TinDangDtos.ThongKe thongKeCongKhai() {
        List<TinDang> tin = tinDangRepo.findByTrangThai("xuat_ban").stream()
                .filter(t -> Boolean.TRUE.equals(t.getBatDongSan().getKhuVuc().getHienThi())).toList();
        long nhanLich = tin.stream().filter(t -> "trong".equals(trangThaiCan(t))).count();
        long tongPhong = phongRepo.countByHienThiTrue();
        long dangThue = phongRepo.countByTrangThaiAndHienThiTrue("dang_thue");
        int tyLe = tongPhong == 0 ? 0 : (int) Math.round(dangThue * 100.0 / tongPhong);
        return new TinDangDtos.ThongKe(tin.size(), nhanLich, khuVucRepo.findByHienThiTrueOrderByTenAsc().size(), tyLe);
    }

    @Transactional(readOnly = true)
    public boolean duocDatLich(String slug) {
        TinDang t = tinDangRepo.findBySlugAndTrangThai(slug, "xuat_ban")
                .orElseThrow(() -> ResourceNotFoundException.khongTim("tin đăng", slug));
        return Boolean.TRUE.equals(t.getBatDongSan().getKhuVuc().getHienThi())
                && "trong".equals(trangThaiCan(t));
    }

    private Path duongDanAnh(TinDangAnh a) {
        Path path = FileUtils.duongDanAnToan(uploadRoot, a.getDuongDan());
        if (!Files.isRegularFile(path)) throw new ResourceNotFoundException("Không tìm thấy ảnh");
        return path;
    }

    private TinDang layTin(Long id) {
        return tinDangRepo.findById(id).orElseThrow(() -> ResourceNotFoundException.khongTim("tin đăng", id));
    }
    private TinDangAnh layAnh(Long id, Long anhId) {
        TinDangAnh a = anhRepo.findById(anhId).orElseThrow(() -> ResourceNotFoundException.khongTim("ảnh", anhId));
        if (!a.getTinDang().getId().equals(id)) throw ResourceNotFoundException.khongTim("ảnh", anhId);
        return a;
    }
    private String trangThaiCan(TinDang t) {
        return t.getPhong() == null ? t.getTrangThaiCan() : t.getPhong().getTrangThai();
    }
    private String trim(String s) { return s == null ? null : s.trim(); }
    private boolean coGiaTri(String s) { return s != null && !s.isBlank(); }
    private List<String> split(String value) {
        return value == null || value.isBlank() ? List.of() : Arrays.stream(value.split("\\r?\\n"))
                .map(String::trim).filter(x -> !x.isBlank()).toList();
    }
    private TinDangDtos.Pin pin(BigDecimal x, BigDecimal y) { return x == null || y == null ? null : new TinDangDtos.Pin(x, y); }

    private TinDangDtos.KhuVuc mapKhu(KhuVuc k) {
        List<TinDang> list = tinDangRepo.findByBatDongSan_KhuVuc_SlugAndTrangThai(k.getSlug(), "xuat_ban");
        BigDecimal min = list.stream().map(TinDang::getGiaNiemYet).min(BigDecimal::compareTo).orElse(null);
        BigDecimal max = list.stream().map(TinDang::getGiaNiemYet).max(BigDecimal::compareTo).orElse(null);
        return new TinDangDtos.KhuVuc(k.getSlug(), k.getTen(), k.getMoTa(), k.getAnhUrl(), k.getKhach(),
                split(k.getDacDiem()), pin(k.getPinX(), k.getPinY()), min, max, list.size(), k.getHienThi());
    }
    private TinDangDtos.BatDongSan mapBatDongSan(BatDongSan b) {
        return new TinDangDtos.BatDongSan(b.getId(), b.getKhuVuc().getSlug(), b.getTen(), b.getDiaChi(),
                pin(b.getPinX(), b.getPinY()));
    }
    private TinDangDtos.TinDang mapTin(TinDang t, boolean publicMode) {
        BatDongSan b = t.getBatDongSan();
        List<TinDangAnh> images = anhRepo.findByTinDang_IdOrderByThuTuAsc(t.getId());
        List<TinDangDtos.Anh> anh = images.stream().map(a -> new TinDangDtos.Anh(a.getId(),
                publicMode ? "/api/public/tin-dang/" + t.getSlug() + "/anh/" + a.getId()
                        : "/api/tin-dang/" + t.getId() + "/anh/" + a.getId(), a.getThuTu(), a.getAltText())).toList();
        String ttCan = trangThaiCan(t);
        boolean nhanLich = "xuat_ban".equals(t.getTrangThai()) && "trong".equals(ttCan)
                && Boolean.TRUE.equals(b.getKhuVuc().getHienThi());
        return new TinDangDtos.TinDang(t.getSlug(), t.getId(), t.getMa(), t.getTieuDe(),
                b.getKhuVuc().getSlug(), b.getDiaChi(), t.getLoai(), t.getPhongNgu(), t.getPhongTam(),
                t.getDienTich(), t.getTang(), t.getGiaNiemYet(), t.getDatCoc(), ttCan,
                Boolean.TRUE.equals(t.getNoiBat()), pin(b.getPinX(), b.getPinY()),
                anh.stream().map(TinDangDtos.Anh::url).toList(), anh, split(t.getTienNghi()), t.getMoTa(),
                nhanLich, t.getTrangThai(), b.getId(), t.getPhong() == null ? null : t.getPhong().getId());
    }
}
