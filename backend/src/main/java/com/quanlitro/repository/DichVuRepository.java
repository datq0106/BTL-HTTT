package com.quanlitro.repository;

import com.quanlitro.entity.DichVu;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DichVuRepository extends JpaRepository<DichVu, Integer> {

    boolean existsByTenDichVu(String tenDichVu);

    boolean existsByTenDichVuAndIdNot(String tenDichVu, Integer id);

    List<DichVu> findByDangApDungTrueOrderByTenDichVu();

    List<DichVu> findByLoaiTinhAndDangApDungTrue(String loaiTinh);
}

