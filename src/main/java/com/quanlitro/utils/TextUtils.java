package com.quanlitro.utils;

import java.text.Normalizer;
import java.util.Locale;

public final class TextUtils {

    private TextUtils() {}

    public static String khongRong(String s) {
        return (s == null || s.isBlank()) ? null : s.trim();
    }

    public static String boDau(String s) {
        if (s == null) {
            return null;
        }
        String ketQua = Normalizer.normalize(s, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "")
                .replace('đ', 'd')
                .replace('Đ', 'D');
        return ketQua;
    }

    public static String vietHoaMoiTu(String s) {
        String sach = khongRong(s);
        if (sach == null) {
            return null;
        }
        StringBuilder sb = new StringBuilder();
        for (String tu : sach.toLowerCase(Locale.ROOT).split("\\s+")) {
            if (sb.length() > 0) {
                sb.append(' ');
            }
            sb.append(Character.toUpperCase(tu.charAt(0))).append(tu.substring(1));
        }
        return sb.toString();
    }

    public static String catNgan(String s, int toiDa) {
        if (s == null || s.length() <= toiDa) {
            return s;
        }
        return s.substring(0, Math.max(0, toiDa - 1)).trim() + "…";
    }

    public static String cheCccd(String cccd) {
        return che(cccd, 3, 3);
    }

    public static String cheSdt(String sdt) {
        return che(sdt, 3, 3);
    }

    private static String che(String s, int giuDau, int giuCuoi) {
        if (s == null || s.length() <= giuDau + giuCuoi) {
            return s;
        }
        return s.substring(0, giuDau)
                + "*".repeat(s.length() - giuDau - giuCuoi)
                + s.substring(s.length() - giuCuoi);
    }
}
