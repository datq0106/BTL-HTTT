package com.quanlitro.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.quanlitro.exception.ApiError;
import com.quanlitro.utils.NgayUtils;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;

import java.io.IOException;

final class JsonResponseWriter {

    private JsonResponseWriter() {}

    static void ghi(HttpServletResponse res, ObjectMapper om, int status, Object noiDung) throws IOException {
        res.setStatus(status);
        res.setContentType("application/json;charset=UTF-8");
        om.writeValue(res.getOutputStream(), noiDung);
    }

    static void loi(HttpServletRequest req, HttpServletResponse res, ObjectMapper om,
                    HttpStatus status, String thongBao) throws IOException {
        ApiError body = new ApiError(NgayUtils.bayGio(), status.value(), status.getReasonPhrase(),
                thongBao, req.getRequestURI(), null, null);
        ghi(res, om, status.value(), body);
    }
}
