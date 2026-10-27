package com.quanlitro.service.impl;

import java.util.Optional;
import com.quanlitro.service.HopDongService;

import com.quanlitro.dto.hopdong.DichVuHopDongRequest;
import com.quanlitro.dto.hopdong.GiaHanHopDongRequest;
import com.quanlitro.dto.hopdong.HopDongCreateRequest;
import com.quanlitro.dto.hopdong.HopDongFilter;
import com.quanlitro.dto.hopdong.HopDongResponse;
import com.quanlitro.dto.hopdong.ThanhLyHopDongRequest;
import com.quanlitro.entity.DichVu;
import com.quanlitro.entity.HopDong;
import com.quanlitro.entity.KhachThue;
import com.quanlitro.entity.Phong;
import com.quanlitro.entity.TaiKhoan;
import com.quanlitro.exception.BusinessException;
import com.quanlitro.exception.ResourceNotFoundException;
import com.quanlitro.mapper.HopDongMapper;
import com.quanlitro.repository.DichVuRepository;
import com.quanlitro.repository.HopDongRepository;
import com.quanlitro.repository.KhachThueRepository;
import com.quanlitro.repository.PhongRepository;
import com.quanlitro.repository.TaiKhoanRepository;
import com.quanlitro.utils.TextUtils;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;

@Service
@Transactional
public class HopDongServiceImpl implements HopDongService {

    private static final int SO_NGAY_CANH_BAO = 30;

    private final HopDongRepository hopDongRepo;
    private final PhongRepository phongRepo;
    private final KhachThueRepository khachThueRepo;
    private final DichVuRepository dichVuRepo;
    private final TaiKhoanRepository taiKhoanRepo;
    private final HopDongMapper mapper;

    @PersistenceContext
    private EntityManager em;

    public HopDongServiceImpl(HopDongRepository hopDongRepo, PhongRepository phongRepo,
                              KhachThueRepository khachThueRepo, DichVuRepository dichVuRepo,
                              TaiKhoanRepository taiKhoanRepo, HopDongMapper mapper) {
        this.hopDongRepo = hopDongRepo;
        this.phongRepo = phongRepo;
        this.khachThueRepo = khachThueRepo;
        this.dichVuRepo = dichVuRepo;
        this.taiKhoanRepo = taiKhoanRepo;
        this.mapper = mapper;
    }

    @Override
    public HopDongResponse tao(HopDongCreateRequest req, String tenDangNhapNguoiTao) {
        Phong phong = phongRepo.findByIdAndHienThiTrue(req.phongId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy phòng"));
        if ("bao_tri".equals(phong.getTrangThai())) {
            throw new BusinessException("Phòng đang bảo trì, không thể cho thuê");
        }
        if ("dang_thue".equals(phong.getTrangThai())
                || hopDongRepo.existsByPhong_IdAndTrangThai(phong.getId(), "hieu_luc")) {
            throw new BusinessException("Phòng đang có hợp đồng hiệu lực");
        }

        KhachThue daiDien = khachThueRepo.findById(req.khachThueId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy khách thuê"));

        List<Integer> nguoiOCungIds = req.nguoiOCungIds() == null ? List.of()
                : req.nguoiOCungIds().stream()
                .filter(Objects::nonNull)
                .filter(id -> !id.equals(req.khachThueId()))
                .distinct()
                .toList();
        List<KhachThue> nguoiOCung = nguoiOCungIds.isEmpty() ? List.of()
                : khachThueRepo.findAllById(nguoiOCungIds);
        if (nguoiOCung.size() != nguoiOCungIds.size()) {
            throw new ResourceNotFoundException("Có người ở cùng không tồn tại trong hệ thống");
        }

        Map<Integer, DichVu> dichVuTheoId = new HashMap<>();
        if (req.dichVu() != null && !req.dichVu().isEmpty()) {
            List<Integer> dvIds = req.dichVu().stream().map(DichVuHopDongRequest::dichVuId).toList();
            if (new HashSet<>(dvIds).size() != dvIds.size()) {
                throw new BusinessException("Có dịch vụ bị chọn trùng");
            }
            for (DichVu dv : dichVuRepo.findAllById(dvIds)) {
                dichVuTheoId.put(dv.getId(), dv);
            }
            if (dichVuTheoId.size() != dvIds.size()) {
                throw new ResourceNotFoundException("Có dịch vụ không tồn tại");
            }
            for (DichVu dv : dichVuTheoId.values()) {
                if (!Boolean.TRUE.equals(dv.getDangApDung())) {
                    throw new BusinessException("Dịch vụ '" + dv.getTenDichVu() + "' đã ngừng áp dụng");
                }
                if (!"co_dinh".equals(dv.getLoaiTinh())) {
                    throw new BusinessException("Dịch vụ '" + dv.getTenDichVu()
                            + "' tính theo chỉ số (điện, nước), không gắn vào hợp đồng");
                }
            }
        }

        BigDecimal giaThue = req.giaThue() != null ? req.giaThue() : phong.getLoaiPhong().getGiaThue();

        TaiKhoan nguoiTao = tenDangNhapNguoiTao == null ? null
                : taiKhoanRepo.findByTenDangNhap(tenDangNhapNguoiTao).orElse(null);

        HopDong h = mapper.toEntity(req, tamMa(), phong, daiDien, giaThue, nguoiTao, nguoiOCung, dichVuTheoId);
        HopDong saved = hopDongRepo.save(h);                 // INSERT chạy ngay (IDENTITY)
        saved.setMaHopDong(String.format("HDT%05d", saved.getId()));

        // Trigger trong DB vừa đổi trạng thái phòng; xóa cache để đọc lại dữ liệu mới nhất
        em.flush();
        em.clear();
        return chiTiet(saved.getId());
    }

    @Override
    public HopDongResponse giaHan(Integer id, GiaHanHopDongRequest req) {
        HopDong h = timDetail(id);
        if (!"hieu_luc".equals(h.getTrangThai())) {
            throw new BusinessException("Chỉ gia hạn được hợp đồng đang hiệu lực");
        }
        if (!req.ngayKetThucMoi().isAfter(h.getNgayKetThuc())) {
            throw new BusinessException("Ngày kết thúc mới phải sau ngày kết thúc hiện tại");
        }
        mapper.applyGiaHan(h, req);
        em.flush();
        em.clear();
        return chiTiet(id);
    }

    @Override
    public HopDongResponse thanhLy(Integer id, ThanhLyHopDongRequest req) {
        HopDong h = timDetail(id);
        if (!"hieu_luc".equals(h.getTrangThai())) {
            throw new BusinessException("Hợp đồng không còn hiệu lực, không thể thanh lý");
        }

        String ghiChu = TextUtils.khongRong(req.ghiChu());
        if (ghiChu != null) {
            h.setGhiChu(ghiChu);
        }
        em.flush();

        hopDongRepo.thanhLy(id, req.tienKhauTru());
        em.clear();
        return chiTiet(id);
    }

    @Override
    @Transactional(readOnly = true)
    public HopDongResponse chiTiet(Integer id) {
        HopDong h = timDetail(id);
        hopDongRepo.findWithNguoiOCungById(id);
        hopDongRepo.findWithDichVuById(id);
        return mapper.toResponse(h, layCongNoAnToan(id));
    }

    private BigDecimal layCongNoAnToan(Integer id) {
        try {
            Number count = (Number) em.createNativeQuery(
                    "SELECT COUNT(*) FROM information_schema.routines " +
                    "WHERE routine_schema = 'quan_ly_nha_tro' AND routine_name = 'fn_cong_no_hop_dong'")
                    .getSingleResult();
            if (count != null && count.intValue() > 0) {
                BigDecimal cn = hopDongRepo.congNo(id);
                if (cn != null) return cn;
            }
        } catch (Exception ignored) {}
        return BigDecimal.ZERO;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<HopDongResponse> timKiem(HopDongFilter filter, Pageable pageable) {
        HopDongFilter f = filter != null ? filter : new HopDongFilter(null, null, null, null);
        return hopDongRepo.search(TextUtils.khongRong(f.keyword()), f.phongId(),
                        TextUtils.khongRong(f.trangThai()), f.sapHetHan(),
                        LocalDate.now().plusDays(SO_NGAY_CANH_BAO), pageable)
                .map(mapper::toListResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public List<HopDongResponse> sapHetHan() {
        return hopDongRepo.findSapHetHan(LocalDate.now().plusDays(SO_NGAY_CANH_BAO)).stream()
                .map(mapper::toListResponse)
                .toList();
    }

    @Override
    public int danhDauHopDongHetHan() {
        return hopDongRepo.danhDauHetHan(LocalDate.now());
    }

    private HopDong timDetail(Integer id) {
        return hopDongRepo.findDetailById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy hợp đồng"));
    }

    private String tamMa() {
        return "TMP" + UUID.randomUUID().toString().replace("-", "").substring(0, 20);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<HopDongResponse> hopDongHienTaiCuaKhach(Integer khachThueId) {
        return hopDongRepo
                .findFirstByKhachThue_IdAndTrangThaiOrderByNgayBatDauDesc(khachThueId, "hieu_luc")
                .map(h -> chiTiet(h.getId()));
    }
}
