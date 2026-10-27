package com.quanlitro.controller;

import com.quanlitro.config.UserPrincipal;
import com.quanlitro.dto.common.PageResponse;
import com.quanlitro.dto.hopdong.GiaHanHopDongRequest;
import com.quanlitro.dto.hopdong.HopDongCreateRequest;
import com.quanlitro.dto.hopdong.HopDongFilter;
import com.quanlitro.dto.hopdong.HopDongResponse;
import com.quanlitro.dto.hopdong.ThanhLyHopDongRequest;
import com.quanlitro.service.HopDongService;
import com.quanlitro.utils.PhanTrang;
import jakarta.validation.Valid;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/hop-dong")
public class HopDongController {

    private final HopDongService hopDongService;

    public HopDongController(HopDongService hopDongService) {
        this.hopDongService = hopDongService;
    }

    @GetMapping
    public PageResponse<HopDongResponse> danhSach(@RequestParam(required = false) String keyword,
                                                  @RequestParam(required = false) String trangThai,
                                                  @RequestParam(required = false) Integer phongId,
                                                  @RequestParam(required = false) Boolean sapHetHan,
                                                  @RequestParam(defaultValue = "0") int trang,
                                                  @RequestParam(defaultValue = "10") int kichThuoc) {
        HopDongFilter filter = new HopDongFilter(keyword, phongId, trangThai, sapHetHan);
        return PageResponse.tu(hopDongService.timKiem(filter,
                PhanTrang.cua(trang, kichThuoc, Sort.by(Sort.Direction.DESC, "id"))));
    }

    @GetMapping("/sap-het-han")
    public List<HopDongResponse> sapHetHan() {
        return hopDongService.sapHetHan();
    }

    @GetMapping("/{id}")
    public HopDongResponse chiTiet(@PathVariable Integer id) {
        return hopDongService.chiTiet(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public HopDongResponse tao(@AuthenticationPrincipal UserPrincipal nguoiDung,
                               @Valid @RequestBody HopDongCreateRequest req) {
        return hopDongService.tao(req, nguoiDung.getUsername());
    }

    @PostMapping("/{id}/gia-han")
    public HopDongResponse giaHan(@PathVariable Integer id, @Valid @RequestBody GiaHanHopDongRequest req) {
        return hopDongService.giaHan(id, req);
    }

    @PostMapping("/{id}/thanh-ly")
    public HopDongResponse thanhLy(@PathVariable Integer id, @Valid @RequestBody ThanhLyHopDongRequest req) {
        return hopDongService.thanhLy(id, req);
    }
}
