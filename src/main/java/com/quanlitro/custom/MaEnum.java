package com.quanlitro.custom;

import com.quanlitro.enums.GiaTriDb;
import jakarta.validation.Constraint;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import jakarta.validation.Payload;

import java.lang.annotation.Documented;
import java.lang.annotation.Retention;
import java.lang.annotation.Target;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

import static java.lang.annotation.ElementType.*;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

@Documented
@Retention(RUNTIME)
@Target({METHOD, FIELD, ANNOTATION_TYPE, CONSTRUCTOR, PARAMETER, TYPE_USE})
@Constraint(validatedBy = MaEnum.Validator.class)
public @interface MaEnum {

    Class<? extends GiaTriDb> value();

    String[] loaiTru() default {};

    String message() default "Giá trị không hợp lệ";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};

    class Validator implements ConstraintValidator<MaEnum, String> {
        private Set<String> hopLe;

        @Override
        public void initialize(MaEnum annotation) {
            GiaTriDb[] hang = annotation.value().getEnumConstants();
            if (hang == null) {
                throw new IllegalStateException(annotation.value().getSimpleName() + " phải là enum");
            }
            hopLe = new HashSet<>();
            for (GiaTriDb g : hang) {
                hopLe.add(g.getMa());
            }
            hopLe.removeAll(Arrays.asList(annotation.loaiTru()));
        }

        @Override
        public boolean isValid(String value, ConstraintValidatorContext context) {
            return value == null || value.isBlank() || hopLe.contains(value);
        }
    }
}
