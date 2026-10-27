package com.quanlitro.enums;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

public final class EnumHelper {

    private EnumHelper() {}

    public static <E extends Enum<E> & GiaTriDb> Optional<E> tuMa(Class<E> loai, String ma) {
        if (ma == null) {
            return Optional.empty();
        }
        for (E e : loai.getEnumConstants()) {
            if (e.getMa().equals(ma)) {
                return Optional.of(e);
            }
        }
        return Optional.empty();
    }

    public static <E extends Enum<E> & GiaTriDb> String nhan(Class<E> loai, String ma) {
        return tuMa(loai, ma).map(GiaTriDb::getNhan).orElse(ma == null ? "" : ma);
    }

    public static <E extends Enum<E> & GiaTriDb> List<String> danhSachMa(Class<E> loai) {
        return Arrays.stream(loai.getEnumConstants()).map(GiaTriDb::getMa).toList();
    }
}
