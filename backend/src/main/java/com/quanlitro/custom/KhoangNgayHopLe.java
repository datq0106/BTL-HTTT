package com.quanlitro.custom;

import jakarta.validation.Constraint;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import jakarta.validation.Payload;

import java.lang.annotation.Documented;
import java.lang.annotation.Retention;
import java.lang.annotation.Target;
import java.time.LocalDate;

import static java.lang.annotation.ElementType.ANNOTATION_TYPE;
import static java.lang.annotation.ElementType.TYPE;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

@Documented
@Retention(RUNTIME)
@Target({TYPE, ANNOTATION_TYPE})
@Constraint(validatedBy = KhoangNgayHopLe.Validator.class)
public @interface KhoangNgayHopLe {

    String message() default "Ngày kết thúc phải sau ngày bắt đầu";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};

    String batDau();
    String ketThuc();

    class Validator implements ConstraintValidator<KhoangNgayHopLe, Object> {
        private String batDau;
        private String ketThuc;

        @Override
        public void initialize(KhoangNgayHopLe annotation) {
            this.batDau = annotation.batDau();
            this.ketThuc = annotation.ketThuc();
        }

        @Override
        public boolean isValid(Object dto, ConstraintValidatorContext context) {
            if (dto == null) {
                return true;
            }
            Object a = TruongReader.doc(dto, batDau);
            Object b = TruongReader.doc(dto, ketThuc);
            if (!(a instanceof LocalDate ngayBatDau) || !(b instanceof LocalDate ngayKetThuc)) {
                return true;
            }
            boolean hopLe = ngayKetThuc.isAfter(ngayBatDau);
            if (!hopLe) {
                context.disableDefaultConstraintViolation();
                context.buildConstraintViolationWithTemplate(context.getDefaultConstraintMessageTemplate())
                        .addPropertyNode(ketThuc)
                        .addConstraintViolation();
            }
            return hopLe;
        }
    }
}
