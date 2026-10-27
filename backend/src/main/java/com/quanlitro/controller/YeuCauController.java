package com.quanlitro.controller;

import com.quanlitro.dto.common.PageResponse;
import com.quanlitro.dto.yeucau.YeuCauDtos;
import com.quanlitro.service.YeuCauService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/yeu-cau")
public class YeuCauController {
    private final YeuCauService service;
    public YeuCauController(YeuCauService service) { this.service = service; }

    @GetMapping
    public PageResponse<YeuCauDtos.YeuCau> danhSach(
            @RequestParam(required = false) String keyword, @RequestParam(required = false) String nguon,
            @RequestParam(required = false) String chuDe, @RequestParam(required = false) String trangThai,
            @RequestParam(required = false) String mucDo, @RequestParam(defaultValue = "0") int trang,
            @RequestParam(defaultValue = "10") int kichThuoc) {
        return service.danhSach(keyword, nguon, chuDe, trangThai, mucDo, trang, kichThuoc);
    }

    @GetMapping("/thong-ke") public YeuCauDtos.ThongKe thongKe() { return service.thongKe(); }
    @GetMapping("/nhan-vien") public List<YeuCauDtos.NhanVien> nhanVien() { return service.nhanVien(); }
    @GetMapping("/{id}") public YeuCauDtos.YeuCau chiTiet(@PathVariable Long id) { return service.chiTiet(id); }
    @PostMapping @ResponseStatus(HttpStatus.CREATED)
    public YeuCauDtos.YeuCau tao(@Valid @RequestBody YeuCauDtos.TaoNoiBo body) { return service.taoNoiBo(body); }
    @PatchMapping("/{id}")
    public YeuCauDtos.YeuCau xuLy(@PathVariable Long id, @RequestBody YeuCauDtos.XuLy body) {
        return service.xuLy(id, body);
    }

    @PatchMapping("/{id}/lich-xem/xac-nhan")
    public YeuCauDtos.YeuCau xacNhan(@PathVariable Long id, @Valid @RequestBody YeuCauDtos.XacNhanLich body) {
        return service.capNhatLich(id, "da_xac_nhan", body.khungXacNhan());
    }

    @PatchMapping("/{id}/lich-xem/hoan-thanh")
    public YeuCauDtos.YeuCau hoanThanh(@PathVariable Long id) {
        return service.capNhatLich(id, "da_hoan_thanh", null);
    }

    @PatchMapping("/{id}/lich-xem/huy")
    public YeuCauDtos.YeuCau huyLich(@PathVariable Long id) {
        return service.capNhatLich(id, "huy", null);
    }
}
