package com.quanlitro.utils;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.text.DecimalFormat;
import java.text.DecimalFormatSymbols;
import java.util.Locale;

public final class TienUtils {

    private static final String[] CHU_SO = {
            "không", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"};

    private TienUtils() {}

    public static String dinhDangSo(BigDecimal so) {
        DecimalFormatSymbols kyHieu = new DecimalFormatSymbols(Locale.ROOT);
        kyHieu.setGroupingSeparator('.');
        DecimalFormat df = new DecimalFormat("#,##0", kyHieu);   // DecimalFormat không an toàn đa luồng nên tạo mới mỗi lần
        return df.format(so == null ? BigDecimal.ZERO : so.setScale(0, RoundingMode.HALF_UP));
    }

    public static String dinhDang(BigDecimal so) {
        return dinhDangSo(so) + " đ";
    }

    public static BigDecimal thanhTien(BigDecimal soLuong, BigDecimal donGia) {
        if (soLuong == null || donGia == null) {
            return BigDecimal.ZERO;
        }
        return soLuong.multiply(donGia).setScale(0, RoundingMode.HALF_UP);
    }

    public static BigDecimal tinhHoanCoc(BigDecimal tienCoc, BigDecimal khauTru, BigDecimal congNo) {
        BigDecimal coc = tienCoc == null ? BigDecimal.ZERO : tienCoc;
        BigDecimal kt = khauTru == null ? BigDecimal.ZERO : khauTru;
        BigDecimal no = congNo == null ? BigDecimal.ZERO : congNo;
        return coc.subtract(kt).subtract(no).max(BigDecimal.ZERO);
    }

    public static String docSoThanhChu(BigDecimal so) {
        long n = (so == null ? BigDecimal.ZERO : so).setScale(0, RoundingMode.HALF_UP).longValue();
        if (n == 0) {
            return "Không đồng";
        }
        boolean am = n < 0;
        long giaTri = Math.abs(n);

        int[] nhom = new int[8];
        int soNhom = 0;
        while (giaTri > 0) {
            nhom[soNhom++] = (int) (giaTri % 1000);
            giaTri /= 1000;
        }

        StringBuilder sb = new StringBuilder();
        for (int i = soNhom - 1; i >= 0; i--) {
            if (nhom[i] == 0) {
                continue;
            }
            String doc = docBaChuSo(nhom[i], i == soNhom - 1);
            String donVi = tenHang(i);
            if (sb.length() > 0) {
                sb.append(' ');
            }
            sb.append(doc);
            if (!donVi.isEmpty()) {
                sb.append(' ').append(donVi);
            }
        }
        String ketQua = (am ? "âm " : "") + sb + " đồng";
        return Character.toUpperCase(ketQua.charAt(0)) + ketQua.substring(1);
    }

    private static String tenHang(int chiSo) {
        return switch (chiSo) {
            case 0 -> "";
            case 1 -> "nghìn";
            case 2 -> "triệu";
            case 3 -> "tỷ";
            default -> tenHang(chiSo - 3) + " tỷ";
        };
    }

    private static String docBaChuSo(int n, boolean laNhomDau) {
        int tram = n / 100;
        int chuc = (n % 100) / 10;
        int donVi = n % 10;
        StringBuilder sb = new StringBuilder();

        if (tram > 0 || !laNhomDau) {
            sb.append(CHU_SO[tram]).append(" trăm");
        }
        if (chuc > 1) {
            sb.append(sb.length() > 0 ? " " : "").append(CHU_SO[chuc]).append(" mươi");
            if (donVi == 1) {
                sb.append(" mốt");
            } else if (donVi == 5) {
                sb.append(" lăm");
            } else if (donVi > 0) {
                sb.append(' ').append(CHU_SO[donVi]);
            }
        } else if (chuc == 1) {
            sb.append(sb.length() > 0 ? " " : "").append("mười");
            if (donVi == 5) {
                sb.append(" lăm");
            } else if (donVi > 0) {
                sb.append(' ').append(CHU_SO[donVi]);
            }
        } else if (donVi > 0) {
            if (sb.length() > 0) {
                sb.append(" lẻ ");
            }
            sb.append(CHU_SO[donVi]);
        }
        return sb.toString();
    }
}
