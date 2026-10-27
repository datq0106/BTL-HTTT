package com.quanlitro.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@Table(name = "phong")
@Getter @Setter @NoArgsConstructor
public class Phong {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "ma_phong", nullable = false, unique = true, length = 20)
    private String maPhong;

    @JdbcTypeCode(SqlTypes.TINYINT)
    @Column(nullable = false)
    private Integer tang;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "loai_phong_id", nullable = false)
    private LoaiPhong loaiPhong;

    @Column(name = "trang_thai", nullable = false, length = 20)
    private String trangThai = "trong";

    @Column(name = "tien_nghi", length = 500)
    private String tienNghi;

    @Column(name = "ghi_chu", length = 500)
    private String ghiChu;

    @Column(name = "hien_thi", nullable = false)
    private Boolean hienThi = true;
}
