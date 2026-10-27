package com.quanlitro.utils;

import java.util.UUID;

public final class MaUtils {

    private MaUtils() {}

    public static String maHopDong(Integer hopDongId) {
        return String.format("HDT%05d", hopDongId);
    }

    public static String maHoaDon(int nam, int thang, Integer hopDongId) {
        return String.format("HD%d%02d%04d", nam, thang, hopDongId);
    }

    public static String maTam() {
        return "TMP" + UUID.randomUUID().toString().replace("-", "").substring(0, 20);
    }
}
