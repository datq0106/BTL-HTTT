package com.quanlitro.repository;

import com.quanlitro.entity.KhachThue;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface KhachThueRepository extends JpaRepository<KhachThue, Integer> {

    Optional<KhachThue> findByCccd(String cccd);

    boolean existsByCccd(String cccd);

    boolean existsByCccdAndIdNot(String cccd, Integer id);

    @Query("""
           SELECT k FROM KhachThue k
           WHERE (:keyword IS NULL
                  OR LOWER(k.hoTen) LIKE LOWER(CONCAT('%', :keyword, '%'))
                  OR k.sdt  LIKE CONCAT('%', :keyword, '%')
                  OR k.cccd LIKE CONCAT('%', :keyword, '%'))
             AND (:trangThaiTamTru IS NULL OR k.trangThaiTamTru = :trangThaiTamTru)
             AND (:dangThue IS NULL
                  OR (:dangThue = TRUE AND (
                         EXISTS (SELECT 1 FROM HopDong h
                                 WHERE h.khachThue = k AND h.trangThai = 'hieu_luc')
                      OR EXISTS (SELECT 1 FROM HopDongKhach hk
                                 WHERE hk.khachThue = k AND hk.hopDong.trangThai = 'hieu_luc')))
                  OR (:dangThue = FALSE AND
                         NOT EXISTS (SELECT 1 FROM HopDong h
                                     WHERE h.khachThue = k AND h.trangThai = 'hieu_luc')
                     AND NOT EXISTS (SELECT 1 FROM HopDongKhach hk
                                     WHERE hk.khachThue = k AND hk.hopDong.trangThai = 'hieu_luc')))
           """)
    Page<KhachThue> search(@Param("keyword") String keyword,
                           @Param("trangThaiTamTru") String trangThaiTamTru,
                           @Param("dangThue") Boolean dangThue,
                           Pageable pageable);
}
