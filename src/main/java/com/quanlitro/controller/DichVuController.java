package com.quanlitro.controller;

import com.quanlitro.dto.dichvu.DichVuRequest;
import com.quanlitro.dto.dichvu.DichVuResponse;
import com.quanlitro.service.DichVuService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/dich-vu")
public class DichVuController {

    private final DichVuService dichVuService;

    public DichVuController(DichVuService dichVuService) {
        this.dichVuService = dichVuService;
    }

    @GetMapping
    public List<DichVuResponse> danhSach(@RequestParam(required = false) Boolean dangApDung,
                                         @RequestParam(required = false) String loaiTinh) {
        if (Boolean.TRUE.equals(dangApDung)) {
            return dichVuService.danhSachDangApDung(loaiTinh);
        }
        return dichVuService.danhSach();
    }

    @GetMapping("/{id}")
    public DichVuResponse chiTiet(@PathVariable Integer id) {
        return dichVuService.timTheoId(id);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.CREATED)
    public DichVuResponse tao(@Valid @RequestBody DichVuRequest req) {
        return dichVuService.tao(req);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public DichVuResponse capNhat(@PathVariable Integer id, @Valid @RequestBody DichVuRequest req) {
        return dichVuService.capNhat(id, req);
    }

    @PatchMapping("/{id}/ap-dung")
    @PreAuthorize("hasRole('ADMIN')")
    public DichVuResponse datApDung(@PathVariable Integer id, @RequestParam boolean apDung) {
        return dichVuService.datApDung(id, apDung);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void xoa(@PathVariable Integer id) {
        dichVuService.xoa(id);
    }
}
