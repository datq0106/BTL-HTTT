package com.quanlitro.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.quanlitro.dto.auth.NguoiDungResponse;
import com.quanlitro.service.TaiKhoanService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class LoginSuccessHandler implements AuthenticationSuccessHandler {

    private final TaiKhoanService taiKhoanService;
    private final ObjectMapper objectMapper;

    public LoginSuccessHandler(TaiKhoanService taiKhoanService, ObjectMapper objectMapper) {
        this.taiKhoanService = taiKhoanService;
        this.objectMapper = objectMapper;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException {
        UserPrincipal user = (UserPrincipal) authentication.getPrincipal();
        taiKhoanService.ghiNhanDangNhap(user.getId());
        JsonResponseWriter.ghi(response, objectMapper, 200, NguoiDungResponse.tu(user));
    }
}
