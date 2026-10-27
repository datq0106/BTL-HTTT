package com.quanlitro.controller;

import com.quanlitro.dto.hopdong.HopDongResponse;
import com.quanlitro.exception.ForbiddenException;
import com.quanlitro.service.HopDongService;
import com.quanlitro.utils.SecurityUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/khach")
public class KhachController {

    private final HopDongService hopDongService;

    public KhachController(HopDongService hopDongService) {
        this.hopDongService = hopDongService;
    }

    @GetMapping("/hop-dong")
    public ResponseEntity<HopDongResponse> hopDongCuaToi() {
        Integer khachThueId = SecurityUtils.khachThueId().orElseThrow(ForbiddenException::new);
        return hopDongService.hopDongHienTaiCuaKhach(khachThueId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.noContent().build());
    }
}
