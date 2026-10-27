package com.quanlitro.controller;

import com.quanlitro.config.UserPrincipal;
import com.quanlitro.service.ThongBaoService;
import com.quanlitro.utils.SecurityUtils;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ModelAttribute;

@ControllerAdvice
public class GlobalModelAdvice {

    private final ThongBaoService thongBaoService;

    public GlobalModelAdvice(ThongBaoService thongBaoService) {
        this.thongBaoService = thongBaoService;
    }

    @ModelAttribute("nguoiDung")
    public UserPrincipal nguoiDung() {
        return SecurityUtils.nguoiDangNhap().orElse(null);
    }

    @ModelAttribute("soThongBaoChuaDoc")
    public long soThongBaoChuaDoc() {
        return SecurityUtils.taiKhoanId().map(thongBaoService::demChuaDoc).orElse(0L);
    }

    @ModelAttribute("duongDan")
    public String duongDan(HttpServletRequest req) {
        return req.getRequestURI();
    }
}
