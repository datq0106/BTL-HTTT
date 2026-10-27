package com.quanlitro.controller;

import com.quanlitro.dto.hopdong.HopDongResponse;
import com.quanlitro.dto.common.PageResponse;
import com.quanlitro.dto.hoadon.HoaDonDtos;
import com.quanlitro.dto.yeucau.YeuCauDtos;
import com.quanlitro.exception.ForbiddenException;
import com.quanlitro.service.HoaDonService;
import com.quanlitro.service.HopDongService;
import com.quanlitro.service.YeuCauService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import com.quanlitro.utils.SecurityUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/khach")
public class KhachController {

    private final HopDongService hopDongService;
    private final YeuCauService yeuCauService;
    private final HoaDonService hoaDonService;

    public KhachController(HopDongService hopDongService, YeuCauService yeuCauService, HoaDonService hoaDonService) {
        this.hopDongService = hopDongService;
        this.yeuCauService = yeuCauService;
        this.hoaDonService = hoaDonService;
    }

    @GetMapping("/hop-dong")
    public ResponseEntity<HopDongResponse> hopDongCuaToi() {
        Integer khachThueId = SecurityUtils.khachThueId().orElseThrow(ForbiddenException::new);
        return hopDongService.hopDongHienTaiCuaKhach(khachThueId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.noContent().build());
    }

    @GetMapping("/yeu-cau")
    public PageResponse<YeuCauDtos.YeuCau> yeuCauCuaToi(@RequestParam(defaultValue = "0") int trang,
                                                          @RequestParam(defaultValue = "20") int kichThuoc) {
        return yeuCauService.cuaCuDan(trang, kichThuoc);
    }

    @GetMapping("/yeu-cau/{id}")
    public YeuCauDtos.YeuCau chiTietYeuCau(@PathVariable Long id) { return yeuCauService.chiTietCuDan(id); }

    @PostMapping("/yeu-cau") @ResponseStatus(HttpStatus.CREATED)
    public YeuCauDtos.YeuCau guiYeuCau(@Valid @RequestBody YeuCauDtos.GuiCuDan body) {
        return yeuCauService.guiCuDan(body);
    }

    @GetMapping("/hoa-don")
    public List<HoaDonDtos.HoaDon> hoaDonCuaToi() { return hoaDonService.cuaCuDan(); }

    @GetMapping("/hoa-don/{id}")
    public HoaDonDtos.HoaDon chiTietHoaDon(@PathVariable Long id) { return hoaDonService.chiTietCuDan(id); }
}
