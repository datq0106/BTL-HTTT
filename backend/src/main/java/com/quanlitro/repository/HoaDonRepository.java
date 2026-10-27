package com.quanlitro.repository;

import com.quanlitro.entity.HoaDon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface HoaDonRepository extends JpaRepository<HoaDon, Long>, JpaSpecificationExecutor<HoaDon> {
    boolean existsByHopDong_IdAndKy(Integer hopDongId, String ky);
    Optional<HoaDon> findFirstByHopDong_IdOrderByKyDesc(Integer hopDongId);
    List<HoaDon> findByHopDong_KhachThue_IdOrderByKyDesc(Integer khachThueId);

    @Query("SELECT COALESCE(SUM(h.tongTien), 0) FROM HoaDon h WHERE h.ky = :ky")
    BigDecimal tongTheoKy(@Param("ky") String ky);

    @Query("SELECT COALESCE(SUM(h.tongTien), 0) FROM HoaDon h WHERE h.ky = :ky AND h.trangThai = 'da_thanh_toan'")
    BigDecimal daThuTheoKy(@Param("ky") String ky);

    @Query("SELECT COALESCE(SUM(h.tongTien), 0) FROM HoaDon h WHERE h.trangThai <> 'da_thanh_toan'")
    BigDecimal tongCongNo();

    long countByKy(String ky);
}
