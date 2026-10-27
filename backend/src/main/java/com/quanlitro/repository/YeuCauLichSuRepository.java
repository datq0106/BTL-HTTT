package com.quanlitro.repository;

import com.quanlitro.entity.YeuCauLichSu;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface YeuCauLichSuRepository extends JpaRepository<YeuCauLichSu, Long> {
    List<YeuCauLichSu> findByYeuCau_IdOrderByCreatedAtAsc(Long id);
}
