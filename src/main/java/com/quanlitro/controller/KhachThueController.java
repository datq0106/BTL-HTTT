package com.quanlitro.controller;

import com.quanlitro.dto.common.PageResponse;
import com.quanlitro.dto.khachthue.KhachThueFilter;
import com.quanlitro.dto.khachthue.KhachThueRequest;
import com.quanlitro.dto.khachthue.KhachThueResponse;
import com.quanlitro.exception.ResourceNotFoundException;
import com.quanlitro.service.KhachThueService;
import com.quanlitro.utils.FileUtils;
import com.quanlitro.utils.PhanTrang;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

@RestController
@RequestMapping("/api/khach-thue")
public class KhachThueController {

    private static final String THU_MUC_CCCD = "cccd";
    private static final String THU_MUC_TAM_TRU = "tam-tru";

    private final KhachThueService khachThueService;
    private final Path thuMucUpload;

    public KhachThueController(KhachThueService khachThueService,
                               @Value("${nhatro.upload.dir:uploads}") String thuMucUpload) {
        this.khachThueService = khachThueService;
        this.thuMucUpload = Path.of(thuMucUpload);
    }

    @GetMapping
    public PageResponse<KhachThueResponse> danhSach(@RequestParam(required = false) String keyword,
                                                    @RequestParam(required = false) String trangThaiTamTru,
                                                    @RequestParam(required = false) Boolean dangThue,
                                                    @RequestParam(defaultValue = "0") int trang,
                                                    @RequestParam(defaultValue = "10") int kichThuoc) {
        KhachThueFilter filter = new KhachThueFilter(keyword, trangThaiTamTru, dangThue);
        return PageResponse.tu(khachThueService.timKiem(filter, PhanTrang.cua(trang, kichThuoc, Sort.by("hoTen"))));
    }

    @GetMapping("/{id}")
    public KhachThueResponse chiTiet(@PathVariable Integer id) {
        return khachThueService.timTheoId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public KhachThueResponse tao(@Valid @RequestBody KhachThueRequest req) {
        return khachThueService.tao(req);
    }

    @PutMapping("/{id}")
    public KhachThueResponse capNhat(@PathVariable Integer id, @Valid @RequestBody KhachThueRequest req) {
        return khachThueService.capNhat(id, req);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void xoa(@PathVariable Integer id) {
        KhachThueResponse k = khachThueService.timTheoId(id);
        khachThueService.xoa(id);               // đã có hợp đồng / tài khoản thì Service ném BusinessException (400)
        FileUtils.xoa(thuMucUpload, k.anhCccd());
        FileUtils.xoa(thuMucUpload, k.anhTamTru());
    }

    @PostMapping("/{id}/anh")
    public KhachThueResponse taiAnh(@PathVariable Integer id,
                                    @RequestParam(value = "anhCccd", required = false) MultipartFile anhCccd,
                                    @RequestParam(value = "anhTamTru", required = false) MultipartFile anhTamTru) {
        KhachThueResponse k = khachThueService.timTheoId(id);
        boolean coCccd = anhCccd != null && !anhCccd.isEmpty();
        boolean coTamTru = anhTamTru != null && !anhTamTru.isEmpty();
        if (!coCccd && !coTamTru) {
            throw new com.quanlitro.exception.BusinessException("Chưa chọn tệp nào");
        }

        String duongDanCccd = null;
        String duongDanTamTru = null;
        try {
            if (coCccd) {
                duongDanCccd = FileUtils.luu(anhCccd, thuMucUpload, THU_MUC_CCCD,
                        FileUtils.DUOI_ANH_VA_PDF, FileUtils.TOI_DA_5MB);
            }
            if (coTamTru) {
                duongDanTamTru = FileUtils.luu(anhTamTru, thuMucUpload, THU_MUC_TAM_TRU,
                        FileUtils.DUOI_ANH_VA_PDF, FileUtils.TOI_DA_5MB);
            }
            khachThueService.capNhatDuongDanAnh(id, duongDanCccd, duongDanTamTru);
        } catch (RuntimeException e) {
            // Lưu dở dang thì dọn tệp vừa ghi để không để lại tệp mồ côi
            FileUtils.xoa(thuMucUpload, duongDanCccd);
            FileUtils.xoa(thuMucUpload, duongDanTamTru);
            throw e;
        }

        // Chỉ xóa tệp cũ sau khi đường dẫn mới đã lưu vào DB thành công
        if (duongDanCccd != null) FileUtils.xoa(thuMucUpload, k.anhCccd());
        if (duongDanTamTru != null) FileUtils.xoa(thuMucUpload, k.anhTamTru());
        return khachThueService.timTheoId(id);
    }

    @GetMapping("/{id}/anh/{loai}")
    public ResponseEntity<byte[]> xemAnh(@PathVariable Integer id, @PathVariable String loai) throws IOException {
        KhachThueResponse k = khachThueService.timTheoId(id);
        String duongDan = switch (loai) {
            case THU_MUC_CCCD -> k.anhCccd();
            case THU_MUC_TAM_TRU -> k.anhTamTru();
            default -> null;
        };
        if (duongDan == null) {
            throw new ResourceNotFoundException("Khách thuê chưa có tệp này");
        }
        Path tep = FileUtils.duongDanAnToan(thuMucUpload, duongDan);
        if (!Files.isRegularFile(tep)) {
            throw new ResourceNotFoundException("Không tìm thấy tệp trên máy chủ");
        }
        return ResponseEntity.ok()
                .contentType(kieuNoiDung(tep))
                .header("Cache-Control", "private, no-store")
                .header("X-Content-Type-Options", "nosniff")
                .body(Files.readAllBytes(tep));
    }

    private static MediaType kieuNoiDung(Path tep) {
        String ten = tep.getFileName().toString().toLowerCase();
        if (ten.endsWith(".png")) return MediaType.parseMediaType("image/png");
        if (ten.endsWith(".webp")) return MediaType.parseMediaType("image/webp");
        if (ten.endsWith(".pdf")) return MediaType.parseMediaType("application/pdf");
        return MediaType.parseMediaType("image/jpeg");                   // jpg, jpeg
    }
}
