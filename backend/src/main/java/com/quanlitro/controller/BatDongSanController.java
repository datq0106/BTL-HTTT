package com.quanlitro.controller;

import com.quanlitro.dto.tindang.TinDangDtos;
import com.quanlitro.service.TinDangService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/bat-dong-san")
public class BatDongSanController {
    private final TinDangService service;
    public BatDongSanController(TinDangService service) { this.service = service; }
    @GetMapping("/khu-vuc") public List<TinDangDtos.KhuVuc> khuVuc() { return service.khuVucNoiBo(); }
    @PutMapping("/khu-vuc/{slug}") public TinDangDtos.KhuVuc luuKhu(@PathVariable String slug,
            @Valid @RequestBody TinDangDtos.KhuVucRequest body) { return service.luuKhu(slug, body); }
    @GetMapping public List<TinDangDtos.BatDongSan> danhSach() { return service.batDongSanNoiBo(); }
    @PostMapping @ResponseStatus(HttpStatus.CREATED)
    public TinDangDtos.BatDongSan tao(@Valid @RequestBody TinDangDtos.BatDongSanRequest body) {
        return service.luuBatDongSan(null, body);
    }
    @PutMapping("/{id}") public TinDangDtos.BatDongSan sua(@PathVariable Long id,
            @Valid @RequestBody TinDangDtos.BatDongSanRequest body) { return service.luuBatDongSan(id, body); }
}
