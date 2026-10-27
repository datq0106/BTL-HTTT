package com.quanlitro.controller;

import com.quanlitro.dto.common.PageResponse;
import com.quanlitro.dto.tindang.TinDangDtos;
import com.quanlitro.service.TinDangService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

@RestController
@RequestMapping("/api/public")
public class PublicTinDangController {
    private final TinDangService service;
    public PublicTinDangController(TinDangService service) { this.service = service; }

    @GetMapping("/thong-ke") public TinDangDtos.ThongKe thongKe() { return service.thongKeCongKhai(); }
    @GetMapping("/khu-vuc") public List<TinDangDtos.KhuVuc> khuVuc() { return service.khuVucCongKhai(); }
    @GetMapping("/khu-vuc/{slug}") public TinDangDtos.KhuVuc chiTietKhu(@PathVariable String slug) {
        return service.chiTietKhu(slug);
    }
    @GetMapping("/tin-dang")
    public PageResponse<TinDangDtos.TinDang> danhSach(
            @RequestParam(required = false) String q, @RequestParam(required = false) String khuVuc,
            @RequestParam(required = false) String loai, @RequestParam(required = false) BigDecimal giaDen,
            @RequestParam(required = false) Integer phongNgu, @RequestParam(required = false) String trangThaiCan,
            @RequestParam(required = false) String sapXep,
            @RequestParam(defaultValue = "0") int trang, @RequestParam(defaultValue = "12") int kichThuoc) {
        return service.danhSachCongKhai(q, khuVuc, loai, giaDen, phongNgu, trangThaiCan, sapXep, trang, kichThuoc);
    }
    @GetMapping("/tin-dang/{slug}") public TinDangDtos.TinDang chiTiet(@PathVariable String slug) {
        return service.chiTietCongKhai(slug);
    }
    @GetMapping("/tin-dang/{slug}/tuong-tu") public List<TinDangDtos.TinDang> tuongTu(@PathVariable String slug) {
        return service.tuongTu(slug);
    }
    @GetMapping("/tin-dang/{slug}/anh/{anhId}")
    public ResponseEntity<byte[]> anh(@PathVariable String slug, @PathVariable Long anhId) throws IOException {
        return traAnh(service.anhCongKhai(slug, anhId), true);
    }

    static ResponseEntity<byte[]> traAnh(Path path, boolean congKhai) throws IOException {
        String name = path.getFileName().toString().toLowerCase();
        MediaType mime = name.endsWith(".png") ? MediaType.IMAGE_PNG : name.endsWith(".webp")
                ? MediaType.parseMediaType("image/webp") : MediaType.IMAGE_JPEG;
        return ResponseEntity.ok().contentType(mime)
                .header("Cache-Control", congKhai ? "public, max-age=3600" : "private, no-store")
                .header("X-Content-Type-Options", "nosniff")
                .body(Files.readAllBytes(path));
    }
}
