package com.quanlitro.controller;

import com.quanlitro.dto.phong.LoaiPhongRequest;
import com.quanlitro.dto.phong.LoaiPhongResponse;
import com.quanlitro.service.PhongService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/phong/loai")
public class LoaiPhongController {

    private final PhongService phongService;

    public LoaiPhongController(PhongService phongService) {
        this.phongService = phongService;
    }

    @GetMapping
    public List<LoaiPhongResponse> danhSach() {
        return phongService.danhSachLoaiPhong();
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.CREATED)
    public LoaiPhongResponse tao(@Valid @RequestBody LoaiPhongRequest req) {
        return phongService.taoLoaiPhong(req);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public LoaiPhongResponse capNhat(@PathVariable Integer id, @Valid @RequestBody LoaiPhongRequest req) {
        return phongService.capNhatLoaiPhong(id, req);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void xoa(@PathVariable Integer id) {
        phongService.xoaLoaiPhong(id);
    }
}
