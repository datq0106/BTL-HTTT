package com.quanlitro.controller;

import com.quanlitro.dto.common.PageResponse;
import com.quanlitro.dto.tindang.TinDangDtos;
import com.quanlitro.service.TinDangService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/tin-dang")
public class TinDangController {
    private final TinDangService service;
    public TinDangController(TinDangService service) { this.service = service; }

    @GetMapping public PageResponse<TinDangDtos.TinDang> danhSach(@RequestParam(required = false) String q,
            @RequestParam(required = false) String trangThai, @RequestParam(required = false) Integer phongId,
            @RequestParam(defaultValue = "0") int trang, @RequestParam(defaultValue = "10") int kichThuoc) {
        return service.danhSachNoiBo(q, trangThai, phongId, trang, kichThuoc);
    }
    @GetMapping("/{id}") public TinDangDtos.TinDang chiTiet(@PathVariable Long id) { return service.chiTietNoiBo(id); }
    @PostMapping @ResponseStatus(HttpStatus.CREATED)
    public TinDangDtos.TinDang tao(@Valid @RequestBody TinDangDtos.TinDangRequest body) { return service.luuTin(null, body); }
    @PutMapping("/{id}") public TinDangDtos.TinDang sua(@PathVariable Long id,
            @Valid @RequestBody TinDangDtos.TinDangRequest body) { return service.luuTin(id, body); }
    @PostMapping("/{id}/xuat-ban") public TinDangDtos.TinDang xuatBan(@PathVariable Long id) { return service.xuatBan(id); }
    @PostMapping("/{id}/an") public TinDangDtos.TinDang an(@PathVariable Long id) { return service.anTin(id); }
    @PostMapping("/{id}/anh") public TinDangDtos.TinDang themAnh(@PathVariable Long id,
            @RequestParam("file") MultipartFile file, @RequestParam(required = false) String altText) {
        return service.themAnh(id, file, altText);
    }
    @PutMapping("/{id}/anh/thu-tu") public TinDangDtos.TinDang sapXepAnh(@PathVariable Long id,
            @RequestBody List<Long> ids) { return service.sapXepAnh(id, ids); }
    @DeleteMapping("/{id}/anh/{anhId}") public TinDangDtos.TinDang xoaAnh(@PathVariable Long id, @PathVariable Long anhId) {
        return service.xoaAnh(id, anhId);
    }
    @GetMapping("/{id}/anh/{anhId}") public ResponseEntity<byte[]> anh(@PathVariable Long id,
            @PathVariable Long anhId) throws IOException {
        return PublicTinDangController.traAnh(service.anhNoiBo(id, anhId), false);
    }
}
