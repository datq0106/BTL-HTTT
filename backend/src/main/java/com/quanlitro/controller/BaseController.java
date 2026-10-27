package com.quanlitro.controller;

import com.quanlitro.exception.BusinessException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.net.URI;

public abstract class BaseController {

    protected static final int KICH_THUOC_TRANG = 10;

    protected void baoThanhCong(RedirectAttributes ra, String noiDung) {
        ra.addFlashAttribute("thanhCong", noiDung);
    }

    protected void baoLoi(RedirectAttributes ra, String noiDung) {
        ra.addFlashAttribute("loi", noiDung);
    }

    protected Pageable phanTrang(int trang, Sort sapXep) {
        return PageRequest.of(Math.max(trang, 0), KICH_THUOC_TRANG, sapXep);
    }


    @ExceptionHandler(BusinessException.class)
    public String xuLyNghiepVu(BusinessException ex, HttpServletRequest req, RedirectAttributes ra) {
        baoLoi(ra, ex.getMessage());
        String quayLai = "/";
        String referer = req.getHeader("Referer");
        if (referer != null) {
            try {
                URI uri = URI.create(referer);
                String duongDan = uri.getRawPath() == null || uri.getRawPath().isEmpty() ? "/" : uri.getRawPath();
                quayLai = uri.getRawQuery() == null ? duongDan : duongDan + "?" + uri.getRawQuery();
            } catch (IllegalArgumentException e) {
                quayLai = "/";
            }
        }
        return "redirect:" + quayLai;
    }
}
