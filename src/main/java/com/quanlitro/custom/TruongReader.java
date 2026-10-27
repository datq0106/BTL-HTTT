package com.quanlitro.custom;

import java.lang.reflect.Field;

final class TruongReader {

    private TruongReader() {}

    static Object doc(Object doiTuong, String tenTruong) {
        try {
            Field f = doiTuong.getClass().getDeclaredField(tenTruong);
            f.setAccessible(true);
            return f.get(doiTuong);
        } catch (ReflectiveOperationException e) {
            throw new IllegalStateException("Không đọc được trường '" + tenTruong + "' của "
                    + doiTuong.getClass().getSimpleName(), e);
        }
    }
}
