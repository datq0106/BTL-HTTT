package com.quanlitro.custom;

import jakarta.validation.Constraint;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import jakarta.validation.Payload;

import java.lang.annotation.Documented;
import java.lang.annotation.Retention;
import java.lang.annotation.Target;

import static java.lang.annotation.ElementType.*;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

@Documented
@Retention(RUNTIME)
@Target({METHOD, FIELD, ANNOTATION_TYPE, CONSTRUCTOR, PARAMETER, TYPE_USE})
@Constraint(validatedBy = MatKhauManh.Validator.class)
public @interface MatKhauManh {

    String message() default "Mật khẩu tối thiểu 8 ký tự, gồm cả chữ và số, không có khoảng trắng";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};

    class Validator implements ConstraintValidator<MatKhauManh, String> {

        @Override
        public boolean isValid(String value, ConstraintValidatorContext context) {
            if (value == null || value.isEmpty()) {
                return true;
            }
            if (value.length() < 8) {
                return false;
            }
            boolean coChu = false;
            boolean coSo = false;
            for (char c : value.toCharArray()) {
                if (Character.isWhitespace(c)) return false;
                if (Character.isLetter(c)) coChu = true;
                if (Character.isDigit(c)) coSo = true;
            }
            return coChu && coSo;
        }
    }
}
