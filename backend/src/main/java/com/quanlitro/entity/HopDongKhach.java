package com.quanlitro.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "hop_dong_khach")
@Getter @Setter @NoArgsConstructor
public class HopDongKhach {

    @EmbeddedId
    private HopDongKhachId id;

    @MapsId("hopDongId")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hop_dong_id")
    private HopDong hopDong;

    @MapsId("khachThueId")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "khach_thue_id")
    private KhachThue khachThue;

    @Column(name = "ngay_vao")
    private LocalDate ngayVao;
}
