package com.quanlitro.repository;

import com.quanlitro.entity.TaiKhoan;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface TaiKhoanRepository extends JpaRepository<TaiKhoan, Integer> {

    @EntityGraph(attributePaths = "vaiTro")
    Optional<TaiKhoan> findByTenDangNhap(String tenDangNhap);

    boolean existsByTenDangNhap(String tenDangNhap);

    boolean existsByKhachThue_Id(Integer khachThueId);

    Optional<TaiKhoan> findByKhachThue_Id(Integer khachThueId);

    @Query("""
           SELECT t FROM TaiKhoan t
           WHERE t.vaiTro.maVaiTro IN ('ROLE_ADMIN', 'ROLE_QUAN_LY') AND t.trangThai = 'hoat_dong'
           """)
    List<TaiKhoan> findNhanVienDangHoatDong();

    @EntityGraph(attributePaths = "vaiTro")
    @Query("""
           SELECT t FROM TaiKhoan t
           WHERE (:keyword IS NULL
                  OR LOWER(t.tenDangNhap) LIKE LOWER(CONCAT('%', :keyword, '%'))
                  OR LOWER(t.hoTen)       LIKE LOWER(CONCAT('%', :keyword, '%')))
             AND (:vaiTroId IS NULL OR t.vaiTro.id = :vaiTroId)
           """)
    Page<TaiKhoan> search(@Param("keyword") String keyword,
                          @Param("vaiTroId") Integer vaiTroId,
                          Pageable pageable);

    @Modifying
    @Query("UPDATE TaiKhoan t SET t.lanDangNhapCuoi = :thoiGian WHERE t.id = :id")
    int capNhatLanDangNhapCuoi(@Param("id") Integer id, @Param("thoiGian") LocalDateTime thoiGian);
}
