package com.quanlitro.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

@Embeddable
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @EqualsAndHashCode
public class HopDongKhachId implements Serializable {

    @Column(name = "hop_dong_id")
    private Integer hopDongId;

    @Column(name = "khach_thue_id")
    private Integer khachThueId;
}
