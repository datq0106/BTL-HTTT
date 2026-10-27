package com.quanlitro.controller;

import com.quanlitro.dto.common.PageResponse;
import com.quanlitro.dto.thongbao.ThongBaoResponse;
import com.quanlitro.exception.ForbiddenException;
import com.quanlitro.service.ThongBaoService;
import com.quanlitro.utils.PhanTrang;
import com.quanlitro.utils.SecurityUtils;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/thong-bao")
public class ThongBaoController {

    private final ThongBaoService thongBaoService;

    public ThongBaoController(ThongBaoService thongBaoService) {
        this.thongBaoService = thongBaoService;
    }

    @GetMapping
    public PageResponse<ThongBaoResponse> danhSach(@RequestParam(defaultValue = "0") int trang,
                                                   @RequestParam(defaultValue = "10") int kichThuoc) {
        return PageResponse.tu(thongBaoService.cuaToi(taiKhoanId(),
                PhanTrang.cua(trang, kichThuoc, Sort.unsorted())));
    }

    @GetMapping("/chua-doc")
    public Map<String, Long> soChuaDoc() {
        return Map.of("soChuaDoc", thongBaoService.demChuaDoc(taiKhoanId()));
    }

    @PostMapping("/{id}/da-doc")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void daDoc(@PathVariable Integer id) {
        thongBaoService.danhDauDaDoc(taiKhoanId(), id);
    }

    @PostMapping("/da-doc-tat-ca")
    public Map<String, Integer> daDocTatCa() {
        return Map.of("soDaDanhDau", thongBaoService.danhDauTatCaDaDoc(taiKhoanId()));
    }

    private Integer taiKhoanId() {
        return SecurityUtils.taiKhoanId().orElseThrow(ForbiddenException::new);
    }
}
