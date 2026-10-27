package com.quanlitro.controller;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validator;
import org.springframework.beans.BeansException;
import org.springframework.stereotype.Component;
import org.springframework.validation.BindingResult;

import java.util.Optional;
import java.util.Set;

@Component
public class FormValidator {

    private final Validator validator;

    public FormValidator(Validator validator) {
        this.validator = validator;
    }

    public <T> boolean kiemTra(T request, BindingResult ketQua) {
        Set<ConstraintViolation<T>> viPham = validator.validate(request);
        for (ConstraintViolation<T> v : viPham) {
            String truong = v.getPropertyPath().toString();
            if (truong.isEmpty()) {
                ketQua.reject("khongHopLe", v.getMessage());
                continue;
            }
            if (ketQua.hasFieldErrors(truong)) {
                continue;
            }
            try {
                ketQua.rejectValue(truong, "khongHopLe", v.getMessage());
            } catch (BeansException e) {
                ketQua.reject("khongHopLe", truong + ": " + v.getMessage());
            }
        }
        return !ketQua.hasErrors();
    }

    public <T> Optional<String> loiDauTien(T request) {
        return validator.validate(request).stream().map(ConstraintViolation::getMessage).findFirst();
    }
}
