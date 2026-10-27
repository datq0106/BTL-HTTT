package com.quanlitro.repository;

import com.quanlitro.entity.LoaiPhong;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LoaiPhongRepository extends JpaRepository<LoaiPhong, Integer> {

    boolean existsByTenLoai(String tenLoai);

    boolean existsByTenLoaiAndIdNot(String tenLoai, Integer id);
}


