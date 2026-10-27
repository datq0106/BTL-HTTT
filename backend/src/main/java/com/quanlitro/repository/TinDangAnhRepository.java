package com.quanlitro.repository;

import com.quanlitro.entity.TinDangAnh;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TinDangAnhRepository extends JpaRepository<TinDangAnh, Long> {
    List<TinDangAnh> findByTinDang_IdOrderByThuTuAsc(Long tinDangId);
    long countByTinDang_Id(Long tinDangId);
}
