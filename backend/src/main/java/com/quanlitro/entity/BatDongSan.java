package com.quanlitro.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity @Table(name = "bat_dong_san")
@Getter @Setter @NoArgsConstructor
public class BatDongSan {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "khu_vuc_slug") private KhuVuc khuVuc;
    @Column(nullable = false, length = 150) private String ten;
    @Column(name = "dia_chi", nullable = false, length = 300) private String diaChi;
    @Column(name = "pin_x", precision = 5, scale = 2) private BigDecimal pinX;
    @Column(name = "pin_y", precision = 5, scale = 2) private BigDecimal pinY;
    @Column(name = "created_at", nullable = false) private LocalDateTime createdAt;
    @Column(name = "updated_at", nullable = false) private LocalDateTime updatedAt;
}
