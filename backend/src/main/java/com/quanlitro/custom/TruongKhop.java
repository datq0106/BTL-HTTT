package com.quanlitro.custom;

import jakarta.validation.Constraint;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import jakarta.validation.Payload;

import java.lang.annotation.Documented;
import java.lang.annotation.Retention;
import java.lang.annotation.Target;
import java.util.Objects;

import static java.lang.annotation.ElementType.ANNOTATION_TYPE;
import static java.lang.annotation.ElementType.TYPE;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

@Documented
@Retention(RUNTIME)
@Target({TYPE, ANNOTATION_TYPE})
@Constraint(validatedBy = TruongKhop.Validator.class)
public @interface TruongKhop {

    String message() default "Hai trường không khớp nhau";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};

    String truong();
    String truongXacNhan();

    class Validator implements ConstraintValidator<TruongKhop, Object> {
        private String truong;
        private String truongXacNhan;

        @Override
        public void initialize(TruongKhop annotation) {
            this.truong = annotation.truong();
            this.truongXacNhan = annotation.truongXacNhan();
        }

        @Override
        public boolean isValid(Object dto, ConstraintValidatorContext context) {
            if (dto == null) {
                return true;
            }
            boolean khop = Objects.equals(TruongReader.doc(dto, truong),
                    TruongReader.doc(dto, truongXacNhan));
            if (!khop) {
                context.disableDefaultConstraintViolation();
                context.buildConstraintViolationWithTemplate(context.getDefaultConstraintMessageTemplate())
                        .addPropertyNode(truongXacNhan)
                        .addConstraintViolation();
            }
            return khop;
        }
    }
}
