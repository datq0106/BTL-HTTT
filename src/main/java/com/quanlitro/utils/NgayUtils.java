package com.quanlitro.utils;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.time.format.ResolverStyle;
import java.time.temporal.ChronoUnit;
import java.util.Optional;

public final class NgayUtils {

    public static final ZoneId MUI_GIO = ZoneId.of("Asia/Ho_Chi_Minh");

    private static final DateTimeFormatter NGAY = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    private static final DateTimeFormatter NGAY_DOC =
            DateTimeFormatter.ofPattern("dd/MM/uuuu").withResolverStyle(ResolverStyle.STRICT);
    private static final DateTimeFormatter NGAY_GIO = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    public static final int NGAY_HAN_THANH_TOAN = 5;

    private NgayUtils() {}

    public static LocalDate homNay() {
        return LocalDate.now(MUI_GIO);
    }

    public static LocalDateTime bayGio() {
        return LocalDateTime.now(MUI_GIO);
    }

    public static String dinhDang(LocalDate ngay) {
        return ngay == null ? "" : ngay.format(NGAY);
    }

    public static String dinhDangGio(LocalDateTime thoiDiem) {
        return thoiDiem == null ? "" : thoiDiem.format(NGAY_GIO);
    }

    public static Optional<LocalDate> phanTich(String chuoi) {
        String s = TextUtils.khongRong(chuoi);
        if (s == null) {
            return Optional.empty();
        }
        try {
            return Optional.of(LocalDate.parse(s, NGAY_DOC));
        } catch (DateTimeParseException e) {
            return Optional.empty();
        }
    }

    public static LocalDate dauThang(int thang, int nam) {
        return YearMonth.of(nam, thang).atDay(1);
    }

    public static LocalDate cuoiThang(int thang, int nam) {
        return YearMonth.of(nam, thang).atEndOfMonth();
    }

    public static YearMonth thangTruoc(int thang, int nam) {
        return YearMonth.of(nam, thang).minusMonths(1);
    }

    public static LocalDate hanThanhToan(int thang, int nam) {
        return YearMonth.of(nam, thang).plusMonths(1).atDay(NGAY_HAN_THANH_TOAN);
    }

    public static long soNgayConLai(LocalDate den) {
        return ChronoUnit.DAYS.between(homNay(), den);
    }

    public static String kyHoaDon(int thang, int nam) {
        return String.format("Tháng %02d/%d", thang, nam);
    }
}
