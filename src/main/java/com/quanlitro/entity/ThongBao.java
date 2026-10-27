package com.quanlitro.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;

@Entity
@Table(name = "thong_bao")
@Getter @Setter @NoArgsConstructor
public class ThongBao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tai_khoan_id")
    private TaiKhoan taiKhoan;

    @Column(name = "tieu_de", nullable = false, length = 200)
    private String tieuDe;

    @JdbcTypeCode(SqlTypes.LONGVARCHAR)
    @Column(name = "noi_dung", nullable = false, columnDefinition = "TEXT")
    private String noiDung;

    @Column(nullable = false, length = 20)
    private String loai = "chung";

    @Column(name = "da_doc", nullable = false)
    private LocalDateTime daDoc;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;
}
