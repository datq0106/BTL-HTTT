package com.quanlitro.utils;

import com.quanlitro.exception.BusinessException;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Set;
import java.util.TreeSet;
import java.util.UUID;

public final class FileUtils {

    public static final Set<String> DUOI_ANH = Set.of("jpg", "jpeg", "png", "webp");
    public static final Set<String> DUOI_ANH_VA_PDF = Set.of("jpg", "jpeg", "png", "webp", "pdf");
    public static final long TOI_DA_5MB = 5L * 1024 * 1024;

    private FileUtils() {}

    public static String luu(MultipartFile file, Path thuMucGoc, String thuMucCon,
                             Set<String> duoiChoPhep, long toiDaByte) {
        if (file == null || file.isEmpty()) {
            throw new BusinessException("Chưa chọn tệp");
        }
        if (file.getSize() > toiDaByte) {
            throw new BusinessException("Tệp vượt quá " + (toiDaByte / 1024 / 1024) + " MB");
        }
        String duoi = layDuoi(file.getOriginalFilename());
        if (duoi == null || !duoiChoPhep.contains(duoi)) {
            throw new BusinessException("Chỉ chấp nhận tệp: " + String.join(", ", new TreeSet<>(duoiChoPhep)));
        }

        Path goc = thuMucGoc.toAbsolutePath().normalize();
        Path thuMuc = goc.resolve(thuMucCon).normalize();
        if (!thuMuc.startsWith(goc)) {
            throw new BusinessException("Đường dẫn lưu không hợp lệ");
        }

        try {
            if (!noiDungKhopDuoi(docDau(file), duoi)) {
                throw new BusinessException("Nội dung tệp không đúng định dạng ." + duoi);
            }
            Files.createDirectories(thuMuc);
            String ten = UUID.randomUUID().toString().replace("-", "") + "." + duoi;
            try (InputStream in = file.getInputStream()) {
                Files.copy(in, thuMuc.resolve(ten));
            }
            return thuMucCon + "/" + ten;
        } catch (IOException e) {
            throw new BusinessException("Không lưu được tệp, vui lòng thử lại");
        }
    }

    public static Path duongDanAnToan(Path thuMucGoc, String duongDanTuongDoi) {
        Path goc = thuMucGoc.toAbsolutePath().normalize();
        Path dich = goc.resolve(duongDanTuongDoi).normalize();
        if (!dich.startsWith(goc)) {
            throw new BusinessException("Đường dẫn tệp không hợp lệ");
        }
        return dich;
    }

    public static boolean xoa(Path thuMucGoc, String duongDanTuongDoi) {
        if (duongDanTuongDoi == null || duongDanTuongDoi.isBlank()) {
            return false;
        }
        try {
            return Files.deleteIfExists(duongDanAnToan(thuMucGoc, duongDanTuongDoi));
        } catch (IOException | BusinessException e) {
            return false;
        }
    }

    static String layDuoi(String tenGoc) {
        if (tenGoc == null) {
            return null;
        }
        String ten = tenGoc.substring(Math.max(tenGoc.lastIndexOf('/'), tenGoc.lastIndexOf('\\')) + 1);
        int cham = ten.lastIndexOf('.');
        if (cham < 0 || cham == ten.length() - 1) {
            return null;
        }
        return ten.substring(cham + 1).toLowerCase();
    }

    private static byte[] docDau(MultipartFile file) throws IOException {
        try (InputStream in = file.getInputStream()) {
            return in.readNBytes(12);
        }
    }

    static boolean noiDungKhopDuoi(byte[] d, String duoi) {
        return switch (duoi) {
            case "jpg", "jpeg" -> d.length >= 3 && (d[0] & 0xFF) == 0xFF && (d[1] & 0xFF) == 0xD8 && (d[2] & 0xFF) == 0xFF;
            case "png" -> d.length >= 4 && (d[0] & 0xFF) == 0x89 && d[1] == 'P' && d[2] == 'N' && d[3] == 'G';
            case "webp" -> d.length >= 12 && d[0] == 'R' && d[1] == 'I' && d[2] == 'F' && d[3] == 'F'
                    && d[8] == 'W' && d[9] == 'E' && d[10] == 'B' && d[11] == 'P';
            case "pdf" -> d.length >= 4 && d[0] == '%' && d[1] == 'P' && d[2] == 'D' && d[3] == 'F';
            default -> false;
        };
    }
}
