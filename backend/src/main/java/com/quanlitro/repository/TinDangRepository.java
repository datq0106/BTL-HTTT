package com.quanlitro.repository;

import com.quanlitro.entity.TinDang;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import java.util.Optional;
import java.util.List;

public interface TinDangRepository extends JpaRepository<TinDang, Long>, JpaSpecificationExecutor<TinDang> {
    Optional<TinDang> findBySlugAndTrangThai(String slug, String trangThai);
    boolean existsBySlug(String slug);
    boolean existsByMa(String ma);
    long countByBatDongSan_KhuVuc_SlugAndTrangThai(String slug, String trangThai);
    List<TinDang> findByBatDongSan_KhuVuc_SlugAndTrangThai(String slug, String trangThai);
}
