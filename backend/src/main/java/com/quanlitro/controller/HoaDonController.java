package com.quanlitro.controller;

import com.quanlitro.dto.common.PageResponse;
import com.quanlitro.dto.hoadon.HoaDonDtos;
import com.quanlitro.service.HoaDonService;
import com.quanlitro.utils.NgayUtils;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.time.YearMonth;

@RestController
@RequestMapping("/api/hoa-don")
public class HoaDonController {
    private final HoaDonService service;
    public HoaDonController(HoaDonService service) { this.service = service; }

    @GetMapping
    public PageResponse<HoaDonDtos.HoaDon> danhSach(@RequestParam(required = false) String ky,
            @RequestParam(required = false) String trangThai, @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int trang, @RequestParam(defaultValue = "10") int kichThuoc) {
        return service.danhSach(ky, trangThai, keyword, trang, kichThuoc);
    }
    @GetMapping("/thong-ke") public HoaDonDtos.ThongKe thongKe(@RequestParam(required = false) String ky) {
        return service.thongKe(ky == null || ky.isBlank() ? YearMonth.from(NgayUtils.homNay()).toString() : ky);
    }
    @GetMapping("/goi-y") public HoaDonDtos.GoiY goiY(@RequestParam Integer hopDongId, @RequestParam String ky) {
        return service.goiY(hopDongId, ky);
    }
    @GetMapping("/{id}") public HoaDonDtos.HoaDon chiTiet(@PathVariable Long id) { return service.chiTiet(id); }
    @PostMapping @ResponseStatus(HttpStatus.CREATED)
    public HoaDonDtos.HoaDon lap(@Valid @RequestBody HoaDonDtos.LapHoaDon body) { return service.lap(body); }
    @PostMapping("/{id}/thanh-toan") public HoaDonDtos.HoaDon thanhToan(@PathVariable Long id,
            @Valid @RequestBody HoaDonDtos.ThanhToan body) { return service.thanhToan(id, body); }
    @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT)
    public void huy(@PathVariable Long id) { service.huy(id); }
}
