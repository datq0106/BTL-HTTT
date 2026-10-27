package com.quanlitro.controller;

import com.quanlitro.dto.common.PageResponse;
import com.quanlitro.dto.taikhoan.TaiKhoanCreateRequest;
import com.quanlitro.dto.taikhoan.TaiKhoanResponse;
import com.quanlitro.dto.taikhoan.TaiKhoanUpdateRequest;
import com.quanlitro.dto.taikhoan.VaiTroResponse;
import com.quanlitro.exception.BusinessException;
import com.quanlitro.service.TaiKhoanService;
import com.quanlitro.utils.PhanTrang;
import com.quanlitro.utils.SecurityUtils;
import jakarta.validation.Valid;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
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
@RequestMapping("/api/tai-khoan")
public class TaiKhoanController {

    private final TaiKhoanService taiKhoanService;

    public TaiKhoanController(TaiKhoanService taiKhoanService) {
        this.taiKhoanService = taiKhoanService;
    }

    @GetMapping
    public PageResponse<TaiKhoanResponse> danhSach(@RequestParam(required = false) String keyword,
                                                   @RequestParam(required = false) Integer vaiTroId,
                                                   @RequestParam(defaultValue = "0") int trang,
                                                   @RequestParam(defaultValue = "10") int kichThuoc) {
        return PageResponse.tu(taiKhoanService.timKiem(keyword, vaiTroId,
                PhanTrang.cua(trang, kichThuoc, Sort.by("tenDangNhap"))));
    }

    @GetMapping("/vai-tro")
    public List<VaiTroResponse> danhSachVaiTro() {
        return taiKhoanService.danhSachVaiTro();
    }

    @GetMapping("/{id}")
    public TaiKhoanResponse chiTiet(@PathVariable Integer id) {
        return taiKhoanService.timTheoId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TaiKhoanResponse tao(@Valid @RequestBody TaiKhoanCreateRequest req) {
        return taiKhoanService.tao(req);
    }

    @PutMapping("/{id}")
    public TaiKhoanResponse capNhat(@PathVariable Integer id, @Valid @RequestBody TaiKhoanUpdateRequest req) {
        return taiKhoanService.capNhat(id, req);
    }

    @PostMapping("/{id}/khoa")
    public TaiKhoanResponse khoa(@PathVariable Integer id) {
        if (SecurityUtils.taiKhoanId().filter(id::equals).isPresent()) {
            throw new BusinessException("Bạn không thể tự khóa tài khoản của chính mình");
        }
        return taiKhoanService.datTrangThai(id, true);
    }

    @PostMapping("/{id}/mo-khoa")
    public TaiKhoanResponse moKhoa(@PathVariable Integer id) {
        return taiKhoanService.datTrangThai(id, false);
    }
}
