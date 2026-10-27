package com.quanlitro.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity @Table(name = "lich_xem")
@Getter @Setter @NoArgsConstructor
public class LichXem {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @OneToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "yeu_cau_id", unique = true) private YeuCau yeuCau;
    @Column(name = "listing_key", nullable = false, length = 100) private String listingKey;
    @Column(name = "khung_de_nghi", nullable = false) private LocalDateTime khungDeNghi;
    @Column(name = "khung_xac_nhan") private LocalDateTime khungXacNhan;
    @Column(name = "trang_thai", nullable = false, length = 20) private String trangThai = "cho_xac_nhan";
    @Column(name = "created_at", nullable = false) private LocalDateTime createdAt;
    @Column(name = "updated_at", nullable = false) private LocalDateTime updatedAt;
}
