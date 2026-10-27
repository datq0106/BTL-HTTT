package com.quanlitro.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.math.BigDecimal;

@Entity @Table(name = "khu_vuc")
@Getter @Setter @NoArgsConstructor
public class KhuVuc {
    @Id @Column(length = 60) private String slug;
    @Column(nullable = false, length = 100) private String ten;
    @Column(name = "mo_ta", length = 500) private String moTa;
    @Column(name = "anh_url", length = 500) private String anhUrl;
    @Column(length = 500) private String khach;
    @Column(name = "dac_diem", columnDefinition = "TEXT") private String dacDiem;
    @Column(name = "pin_x", precision = 5, scale = 2) private BigDecimal pinX;
    @Column(name = "pin_y", precision = 5, scale = 2) private BigDecimal pinY;
    @Column(name = "hien_thi", nullable = false) private Boolean hienThi = true;
}
