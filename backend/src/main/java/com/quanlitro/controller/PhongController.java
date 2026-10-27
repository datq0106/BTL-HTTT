package com.quanlitro.controller;

import com.quanlitro.dto.common.PageResponse;
import com.quanlitro.dto.phong.PhongFilter;
import com.quanlitro.dto.phong.PhongRequest;
import com.quanlitro.dto.phong.PhongResponse;
import com.quanlitro.dto.phong.PhongTrangThaiRequest;
import com.quanlitro.service.PhongService;
import com.quanlitro.utils.PhanTrang;
import jakarta.validation.Valid;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
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

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/phong")
public class PhongController {

    private final PhongService phongService;

    public PhongController(PhongService phongService) {
        this.phongService = phongService;
    }

    @GetMapping
    public PageResponse<PhongResponse> danhSach(@RequestParam(required = false) String keyword,
                                                @RequestParam(required = false) Integer tang,
                                                @RequestParam(required = false) String trangThai,
                                                @RequestParam(required = false) BigDecimal giaTu,
                                                @RequestParam(required = false) BigDecimal giaDen,
                                                @RequestParam(defaultValue = "0") int trang,
                                                @RequestParam(defaultValue = "10") int kichThuoc) {
        PhongFilter filter = new PhongFilter(keyword, tang, trangThai, giaTu, giaDen);
        return PageResponse.tu(phongService.timKiem(filter, PhanTrang.cua(trang, kichThuoc, Sort.by("maPhong"))));
    }

    @GetMapping("/trong")
    public List<PhongResponse> danhSachPhongTrong() {
        return phongService.danhSachPhongTrong();
    }

    @GetMapping("/{id}")
    public PhongResponse chiTiet(@PathVariable Integer id) {
        return phongService.timTheoId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PhongResponse tao(@Valid @RequestBody PhongRequest req) {
        return phongService.tao(req);
    }

    @PutMapping("/{id}")
    public PhongResponse capNhat(@PathVariable Integer id, @Valid @RequestBody PhongRequest req) {
        return phongService.capNhat(id, req);
    }

    @PatchMapping("/{id}/trang-thai")
    public PhongResponse doiTrangThai(@PathVariable Integer id, @Valid @RequestBody PhongTrangThaiRequest req) {
        return phongService.doiTrangThai(id, req);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void xoa(@PathVariable Integer id) {
        phongService.xoa(id);
    }
}
