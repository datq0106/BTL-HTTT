package com.quanlitro.repository;

import com.quanlitro.entity.KhuVuc;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface KhuVucRepository extends JpaRepository<KhuVuc, String> {
    List<KhuVuc> findByHienThiTrueOrderByTenAsc();
}
