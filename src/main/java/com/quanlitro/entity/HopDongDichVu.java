package com.quanlitro.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "hop_dong_dich_vu")
@Getter @Setter @NoArgsConstructor
public class HopDongDichVu {

    @EmbeddedId
    private HopDongDichVuId id;

    @MapsId("hopDongId")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hop_dong_id")
    private HopDong hopDong;

    @MapsId("dichVuId")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dich_vu_id")
    private DichVu dichVu;

    @Column(name = "so_luong", nullable = false, precision = 8, scale = 2)
    private BigDecimal soLuong = BigDecimal.ONE;
}
