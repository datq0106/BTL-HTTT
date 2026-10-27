package com.quanlitro.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity @Table(name = "yeu_cau_lich_su")
@Getter @Setter @NoArgsConstructor
public class YeuCauLichSu {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "yeu_cau_id") private YeuCau yeuCau;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "tai_khoan_id") private TaiKhoan taiKhoan;
    @Column(name = "hanh_dong", nullable = false, length = 30) private String hanhDong;
    @Column(name = "noi_dung", columnDefinition = "TEXT") private String noiDung;
    @Column(name = "created_at", nullable = false) private LocalDateTime createdAt;
}
