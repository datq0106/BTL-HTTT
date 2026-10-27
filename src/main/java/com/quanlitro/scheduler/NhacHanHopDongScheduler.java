package com.quanlitro.scheduler;

import com.quanlitro.dto.hopdong.HopDongResponse;
import com.quanlitro.service.HopDongService;
import com.quanlitro.service.ThongBaoService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Set;


@Component
@ConditionalOnProperty(name = "nhatro.scheduler.enabled", havingValue = "true", matchIfMissing = true)
public class NhacHanHopDongScheduler {

    private static final Logger log = LoggerFactory.getLogger(NhacHanHopDongScheduler.class);
    private static final Set<Long> CAC_MOC_NHAC = Set.of(30L, 15L, 7L, 3L, 1L, 0L);
    private static final DateTimeFormatter NGAY = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    private static final String LOAI = "het_han_hd";

    private final HopDongService hopDongService;
    private final ThongBaoService thongBaoService;

    public NhacHanHopDongScheduler(HopDongService hopDongService, ThongBaoService thongBaoService) {
        this.hopDongService = hopDongService;
        this.thongBaoService = thongBaoService;
    }

    @Scheduled(cron = "${nhatro.scheduler.nhac-han.cron:0 0 8 * * *}", zone = "Asia/Ho_Chi_Minh")
    public void chayHangNgay() {
        chay();
    }

    @EventListener(ApplicationReadyEvent.class)
    public void chayKhiKhoiDong() {
        chay();
    }

    private void chay() {
        try {
            List<HopDongResponse> sapHetHan = hopDongService.sapHetHan();
            int daGui = 0;

            for (HopDongResponse h : sapHetHan) {
                Long conLai = h.soNgayConLai();
                if (conLai == null || !CAC_MOC_NHAC.contains(conLai)) {
                    continue;
                }
                String tieuDe = "Hợp đồng " + h.maHopDong() + " sắp hết hạn";
                String thoiGian = conLai == 0 ? "hết hạn hôm nay"
                        : "hết hạn vào " + h.ngayKetThuc().format(NGAY) + " (còn " + conLai + " ngày)";

                String noiDungNhanVien = "Hợp đồng " + h.maHopDong() + " của phòng " + h.maPhong()
                        + " (khách " + h.khachThue().hoTen() + ") " + thoiGian + ".";
                String noiDungKhach = "Hợp đồng " + h.maHopDong() + " của bạn (phòng " + h.maPhong() + ") "
                        + thoiGian + ". Vui lòng liên hệ chủ trọ để gia hạn hoặc làm thủ tục trả phòng.";

                daGui += thongBaoService.guiChoNhanVien(LOAI, tieuDe, noiDungNhanVien);
                if (thongBaoService.guiChoKhach(h.khachThue().id(), LOAI, tieuDe, noiDungKhach)) {
                    daGui++;
                }
            }
            if (daGui > 0) {
                log.info("Đã gửi {} thông báo nhắc hạn hợp đồng", daGui);
            }
        } catch (Exception e) {
            log.error("Lỗi khi gửi thông báo nhắc hạn hợp đồng", e);
        }
    }
}
