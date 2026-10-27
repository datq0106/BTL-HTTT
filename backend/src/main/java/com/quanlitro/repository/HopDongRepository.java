package com.quanlitro.repository;

import com.quanlitro.entity.HopDong;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface HopDongRepository extends JpaRepository<HopDong, Integer> {

    boolean existsByMaHopDong(String maHopDong);

    boolean existsByPhong_IdAndTrangThai(Integer phongId, String trangThai);
    @EntityGraph(attributePaths = "khachThue")
    Optional<HopDong> findByPhong_IdAndTrangThai(Integer phongId, String trangThai);

    @EntityGraph(attributePaths = "phong")
    Optional<HopDong> findFirstByKhachThue_IdAndTrangThaiOrderByNgayBatDauDesc(Integer khachThueId,
                                                                               String trangThai);

    @Query("""
           SELECT h FROM HopDong h JOIN FETCH h.khachThue
           WHERE h.phong.id IN :phongIds AND h.trangThai = 'hieu_luc'
           """)
    List<HopDong> findHieuLucByPhongIds(@Param("phongIds") Collection<Integer> phongIds);

    @EntityGraph(attributePaths = {"phong", "khachThue"})
    @Query("SELECT h FROM HopDong h WHERE h.id = :id")
    Optional<HopDong> findDetailById(@Param("id") Integer id);

    @EntityGraph(attributePaths = {"nguoiOCung", "nguoiOCung.khachThue"})
    @Query("SELECT h FROM HopDong h WHERE h.id = :id")
    Optional<HopDong> findWithNguoiOCungById(@Param("id") Integer id);

    @EntityGraph(attributePaths = {"dichVu", "dichVu.dichVu"})
    @Query("SELECT h FROM HopDong h WHERE h.id = :id")
    Optional<HopDong> findWithDichVuById(@Param("id") Integer id);

    @EntityGraph(attributePaths = {"phong", "khachThue"})
    @Query("""
           SELECT h FROM HopDong h JOIN h.phong p JOIN h.khachThue k
           WHERE (:keyword IS NULL
                  OR LOWER(h.maHopDong) LIKE LOWER(CONCAT('%', :keyword, '%'))
                  OR LOWER(k.hoTen)     LIKE LOWER(CONCAT('%', :keyword, '%'))
                  OR LOWER(p.maPhong)   LIKE LOWER(CONCAT('%', :keyword, '%')))
             AND (:phongId   IS NULL OR p.id = :phongId)
             AND (:trangThai IS NULL OR h.trangThai = :trangThai)
             AND (:sapHetHan IS NULL OR :sapHetHan = FALSE
                  OR (h.trangThai = 'hieu_luc' AND h.ngayKetThuc <= :han))
           """)
    Page<HopDong> search(@Param("keyword") String keyword,
                         @Param("phongId") Integer phongId,
                         @Param("trangThai") String trangThai,
                         @Param("sapHetHan") Boolean sapHetHan,
                         @Param("han") LocalDate han,
                         Pageable pageable);

    @EntityGraph(attributePaths = {"phong", "khachThue"})
    @Query("""
           SELECT h FROM HopDong h
           WHERE h.trangThai = 'hieu_luc' AND h.ngayKetThuc <= :han
           ORDER BY h.ngayKetThuc
           """)
    List<HopDong> findSapHetHan(@Param("han") LocalDate han);

    @Modifying
    @Query("""
           UPDATE HopDong h SET h.trangThai = 'het_han'
           WHERE h.trangThai = 'hieu_luc' AND h.ngayKetThuc < :homNay
           """)
    int danhDauHetHan(@Param("homNay") LocalDate homNay);

    long countByTrangThai(String trangThai);

    @Procedure(procedureName = "sp_thanh_ly_hop_dong")
    void thanhLy(@Param("p_hop_dong_id") Integer hopDongId,
                 @Param("p_khau_tru") BigDecimal tienKhauTru);

    @Query(value = "SELECT fn_cong_no_hop_dong(:id)", nativeQuery = true)
    BigDecimal congNo(@Param("id") Integer hopDongId);

    @Query(value = "SELECT fn_tinh_hoan_coc(:id, :khauTru)", nativeQuery = true)
    BigDecimal tinhHoanCoc(@Param("id") Integer hopDongId, @Param("khauTru") BigDecimal tienKhauTru);
}
