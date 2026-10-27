package com.quanlitro.controller;

import com.quanlitro.config.UserPrincipal;
import com.quanlitro.dto.auth.NguoiDungResponse;
import com.quanlitro.dto.taikhoan.DoiMatKhauRequest;
import com.quanlitro.service.TaiKhoanService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final TaiKhoanService taiKhoanService;

    public AuthController(TaiKhoanService taiKhoanService) {
        this.taiKhoanService = taiKhoanService;
    }

    @GetMapping("/me")
    public NguoiDungResponse toiLa(@AuthenticationPrincipal UserPrincipal nguoiDung) {
        return NguoiDungResponse.tu(nguoiDung);
    }

    @PostMapping("/doi-mat-khau")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void doiMatKhau(@AuthenticationPrincipal UserPrincipal nguoiDung,
                           @Valid @RequestBody DoiMatKhauRequest req) {
        taiKhoanService.doiMatKhau(nguoiDung.getId(), req);
    }
}
