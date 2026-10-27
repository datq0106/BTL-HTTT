package com.quanlitro.repository;

import com.quanlitro.entity.BatDongSan;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BatDongSanRepository extends JpaRepository<BatDongSan, Long> {
    List<BatDongSan> findByKhuVuc_SlugOrderByTenAsc(String slug);
}
