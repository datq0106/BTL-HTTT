package com.quanlitro.scheduler;

import com.quanlitro.service.HopDongService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@ConditionalOnProperty(name = "nhatro.scheduler.enabled", havingValue = "true", matchIfMissing = true)
public class HopDongHetHanScheduler {

    private static final Logger log = LoggerFactory.getLogger(HopDongHetHanScheduler.class);

    private final HopDongService hopDongService;
    private final boolean bat;

    public HopDongHetHanScheduler(HopDongService hopDongService,
                                  @Value("${nhatro.scheduler.het-han.bat:true}") boolean bat) {
        this.hopDongService = hopDongService;
        this.bat = bat;
    }

    @Scheduled(cron = "${nhatro.scheduler.het-han.cron:0 10 0 * * *}", zone = "Asia/Ho_Chi_Minh")
    public void chayHangNgay() {
        chay();
    }

    @EventListener(ApplicationReadyEvent.class)
    public void chayKhiKhoiDong() {
        chay();
    }

    private void chay() {
        if (!bat) {
            return;
        }
        try {
            int soHopDong = hopDongService.danhDauHopDongHetHan();
            if (soHopDong > 0) {
                log.info("Đã chuyển {} hợp đồng quá hạn sang trạng thái hết hạn", soHopDong);
            }
        } catch (Exception e) {
            log.error("Lỗi khi đánh dấu hợp đồng hết hạn", e);
        }
    }
}
