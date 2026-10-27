package com.quanlitro.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.security.web.csrf.CsrfException;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class RestAccessDeniedHandler implements AccessDeniedHandler {

    private final ObjectMapper objectMapper;

    public RestAccessDeniedHandler(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response,
                       AccessDeniedException accessDeniedException) throws IOException {
        String thongBao = accessDeniedException instanceof CsrfException
                ? "Thiếu hoặc sai token CSRF: gửi lại header X-XSRF-TOKEN lấy từ cookie XSRF-TOKEN"
                : "Bạn không có quyền thực hiện thao tác này";
        JsonResponseWriter.loi(request, response, objectMapper, HttpStatus.FORBIDDEN, thongBao);
    }
}
