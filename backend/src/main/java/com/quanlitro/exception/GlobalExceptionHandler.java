package com.quanlitro.exception;

import com.quanlitro.exception.ApiError.ChiTietLoi;
import com.quanlitro.utils.NgayUtils;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.BindException;
import org.springframework.validation.FieldError;
import org.springframework.validation.ObjectError;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@ControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);


    @ExceptionHandler(BusinessException.class)
    public Object xuLyNghiepVu(BusinessException ex, HttpServletRequest req) {
        log.warn("Lỗi nghiệp vụ tại {}: {}", req.getRequestURI(), ex.getMessage());
        return phanHoi(req, HttpStatus.BAD_REQUEST, ex.getMessage(), null, null);
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public Object xuLyKhongTim(ResourceNotFoundException ex, HttpServletRequest req) {
        log.info("Không tìm thấy tại {}: {}", req.getRequestURI(), ex.getMessage());
        return phanHoi(req, HttpStatus.NOT_FOUND, ex.getMessage(), null, null);
    }

    @ExceptionHandler(ForbiddenException.class)
    public Object xuLyCamTruyCap(ForbiddenException ex, HttpServletRequest req) {
        log.warn("Truy cập trái quyền tại {}: {}", req.getRequestURI(), ex.getMessage());
        return phanHoi(req, HttpStatus.FORBIDDEN, ex.getMessage(), null, null);
    }

    @ExceptionHandler(BindException.class)
    public Object xuLyDuLieuKhongHopLe(BindException ex, HttpServletRequest req) {
        List<ChiTietLoi> chiTiet = new ArrayList<>();
        for (FieldError f : ex.getFieldErrors()) {
            chiTiet.add(new ChiTietLoi(f.getField(), f.getDefaultMessage()));
        }
        for (ObjectError g : ex.getGlobalErrors()) {
            chiTiet.add(new ChiTietLoi(null, g.getDefaultMessage()));
        }
        log.warn("Dữ liệu không hợp lệ tại {}: {}", req.getRequestURI(), chiTiet);
        return phanHoi(req, HttpStatus.BAD_REQUEST, "Dữ liệu gửi lên không hợp lệ", chiTiet, null);
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public Object xuLyRangBuoc(ConstraintViolationException ex, HttpServletRequest req) {
        List<ChiTietLoi> chiTiet = new ArrayList<>();
        for (ConstraintViolation<?> v : ex.getConstraintViolations()) {
            String duongDan = v.getPropertyPath().toString();
            chiTiet.add(new ChiTietLoi(duongDan.substring(duongDan.lastIndexOf('.') + 1), v.getMessage()));
        }
        return phanHoi(req, HttpStatus.BAD_REQUEST, "Dữ liệu gửi lên không hợp lệ", chiTiet, null);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public Object xuLyBodyHong(HttpMessageNotReadableException ex, HttpServletRequest req) {
        log.warn("Nội dung JSON không đọc được tại {}: {}", req.getRequestURI(), ex.getMessage());
        return phanHoi(req, HttpStatus.BAD_REQUEST, "Dữ liệu gửi lên không đúng định dạng", null, null);
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public Object xuLyThamSoSaiKieu(MethodArgumentTypeMismatchException ex, HttpServletRequest req) {
        return phanHoi(req, HttpStatus.BAD_REQUEST, "Tham số '" + ex.getName() + "' không hợp lệ", null, null);
    }

    @ExceptionHandler(MissingServletRequestParameterException.class)
    public Object xuLyThieuThamSo(MissingServletRequestParameterException ex, HttpServletRequest req) {
        return phanHoi(req, HttpStatus.BAD_REQUEST,
                "Thiếu tham số bắt buộc '" + ex.getParameterName() + "'", null, null);
    }

    @ExceptionHandler(NoResourceFoundException.class)
    public Object xuLyKhongCoTaiNguyen(NoResourceFoundException ex, HttpServletRequest req) {
        return phanHoi(req, HttpStatus.NOT_FOUND, "Không tìm thấy trang bạn yêu cầu", null, null);
    }

    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public Object xuLySaiPhuongThuc(HttpRequestMethodNotSupportedException ex, HttpServletRequest req) {
        return phanHoi(req, HttpStatus.METHOD_NOT_ALLOWED,
                "Đường dẫn này không hỗ trợ phương thức " + ex.getMethod(), null, null);
    }

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public Object xuLyTepQuaLon(MaxUploadSizeExceededException ex, HttpServletRequest req) {
        return phanHoi(req, HttpStatus.PAYLOAD_TOO_LARGE,
                "Tệp tải lên vượt quá dung lượng cho phép", null, null);
    }

    @ExceptionHandler(DataAccessException.class)
    public Object xuLyLoiDuLieu(DataAccessException ex, HttpServletRequest req) {
        return DichLoiCsdl.dich(ex)
                .map(kq -> {
                    log.warn("Lỗi dữ liệu tại {}: {}", req.getRequestURI(), kq.thongBao());
                    return phanHoi(req, HttpStatus.valueOf(kq.status()), kq.thongBao(), null, null);
                })
                .orElseGet(() -> loiHeThong(ex, req));
    }

    @ExceptionHandler(AccessDeniedException.class)
    public Object xuLyKhongCoQuyen(AccessDeniedException ex, HttpServletRequest req) {
        if (chiMuonJson(req)) {
            return phanHoi(req, HttpStatus.FORBIDDEN, "Bạn không có quyền thực hiện thao tác này", null, null);
        }
        throw ex;
    }

    @ExceptionHandler(AuthenticationException.class)
    public Object xuLyChuaDangNhap(AuthenticationException ex, HttpServletRequest req) {
        if (chiMuonJson(req)) {
            return phanHoi(req, HttpStatus.UNAUTHORIZED, "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại", null, null);
        }
        throw ex;
    }


    @ExceptionHandler(Exception.class)
    public Object xuLyLoiHeThong(Exception ex, HttpServletRequest req) {
        return loiHeThong(ex, req);
    }

    private Object loiHeThong(Exception ex, HttpServletRequest req) {
        String ma = UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        log.error("[{}] Lỗi hệ thống tại {}", ma, req.getRequestURI(), ex);
        return phanHoi(req, HttpStatus.INTERNAL_SERVER_ERROR,
                "Đã có lỗi xảy ra, vui lòng thử lại sau. Nếu lỗi lặp lại, hãy báo mã lỗi cho quản trị viên.",
                null, ma);
    }

    private Object phanHoi(HttpServletRequest req, HttpStatus status, String thongBao,
                           List<ChiTietLoi> chiTiet, String maTheoDoi) {
        if (chiMuonJson(req)) {
            ApiError body = new ApiError(NgayUtils.bayGio(), status.value(), status.getReasonPhrase(),
                    thongBao, req.getRequestURI(), maTheoDoi,
                    (chiTiet == null || chiTiet.isEmpty()) ? null : chiTiet);
            return ResponseEntity.status(status).body(body);
        }

        ModelAndView mav = new ModelAndView("error");
        mav.setStatus(status);
        mav.addObject("status", status.value());
        mav.addObject("error", status.getReasonPhrase());
        mav.addObject("message", thongBao);
        mav.addObject("path", req.getRequestURI());
        mav.addObject("maTheoDoi", maTheoDoi);
        mav.addObject("chiTiet", chiTiet == null ? List.of() : chiTiet.stream()
                .map(c -> c.truong() == null ? c.thongBao() : c.truong() + ": " + c.thongBao())
                .toList());
        return mav;
    }

    static boolean chiMuonJson(HttpServletRequest req) {
        String uri = req.getRequestURI();
        if (uri != null && uri.startsWith("/api/")) {
            return true;
        }
        String accept = req.getHeader("Accept");
        if (accept != null && accept.contains("application/json")) {
            return true;
        }
        return "XMLHttpRequest".equals(req.getHeader("X-Requested-With"));
    }
}
