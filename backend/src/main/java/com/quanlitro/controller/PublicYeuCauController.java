package com.quanlitro.controller;

import com.quanlitro.dto.yeucau.YeuCauDtos;
import com.quanlitro.service.YeuCauService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/public")
public class PublicYeuCauController {
    private final YeuCauService service;
    public PublicYeuCauController(YeuCauService service) { this.service = service; }

    @PostMapping("/yeu-cau") @ResponseStatus(HttpStatus.CREATED)
    public YeuCauDtos.DaNhan gui(@Valid @RequestBody YeuCauDtos.GuiCongKhai body, HttpServletRequest request) {
        return service.guiCongKhai(body, ip(request));
    }

    @PostMapping("/lich-xem") @ResponseStatus(HttpStatus.CREATED)
    public YeuCauDtos.DaNhan datLich(@Valid @RequestBody YeuCauDtos.DatLich body, HttpServletRequest request) {
        return service.datLich(body, ip(request));
    }

    @GetMapping("/xac-nhan/{ma}")
    public YeuCauDtos.TraCuu traCuu(@PathVariable String ma) { return service.traCuu(ma); }

    private String ip(HttpServletRequest request) {
        String realIp = request.getHeader("X-Real-IP");
        return realIp == null || realIp.isBlank() ? request.getRemoteAddr() : realIp;
    }
}
