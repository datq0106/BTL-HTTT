package com.quanlitro.service;

import com.quanlitro.dto.thongbao.ThongBaoResponse;
import com.quanlitro.entity.ThongBao;
import com.quanlitro.repository.TaiKhoanRepository;
import com.quanlitro.repository.ThongBaoRepository;
import com.quanlitro.service.impl.ThongBaoServiceImpl;
import org.junit.jupiter.api.Test;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class ThongBaoServiceTest {

    @Test
    void responseKeepsCreationTimeAndUnreadStateInCorrectFields() {
        LocalDateTime created = LocalDateTime.of(2026, 10, 27, 9, 30);
        ThongBao unread = new ThongBao();
        unread.setId(1);
        unread.setTieuDe("Unread");
        unread.setNoiDung("Content");
        unread.setCreatedAt(created);
        ThongBao read = new ThongBao();
        read.setId(2);
        read.setTieuDe("Read");
        read.setNoiDung("Content");
        read.setCreatedAt(created);
        read.setDaDoc(created.plusHours(1));
        ThongBaoRepository notifications = mock(ThongBaoRepository.class);
        when(notifications.findByTaiKhoan_IdOrderByCreatedAtDesc(eq(7), any()))
                .thenReturn(new PageImpl<>(List.of(unread, read)));

        List<ThongBaoResponse> result = new ThongBaoServiceImpl(notifications,
                mock(TaiKhoanRepository.class)).cuaToi(7, Pageable.unpaged()).getContent();

        assertEquals(created, result.get(0).createdAt());
        assertNull(result.get(0).daDoc());
        assertEquals(created.plusHours(1), result.get(1).daDoc());
    }
}
