package com.quanlitro.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity @Table(name = "tin_dang_anh")
@Getter @Setter @NoArgsConstructor
public class TinDangAnh {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "tin_dang_id") private TinDang tinDang;
    @Column(name = "duong_dan", nullable = false, length = 500) private String duongDan;
    @Column(name = "thu_tu", nullable = false) private Integer thuTu;
    @Column(name = "alt_text", length = 200) private String altText;
}
