package com.quanlitro.repository;

import com.quanlitro.entity.ThongBao;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;

public interface ThongBaoRepository extends JpaRepository<ThongBao, Integer> {

    @Query("""
           SELECT COUNT(t) > 0 FROM ThongBao t
           WHERE t.taiKhoan.id = :taiKhoanId AND t.loai = :loai
             AND t.tieuDe = :tieuDe AND t.createdAt >= :tuLuc
           """)
    boolean daCoThongBao(@Param("taiKhoanId") Integer taiKhoanId,
                         @Param("loai") String loai,
                         @Param("tieuDe") String tieuDe,
                         @Param("tuLuc") LocalDateTime tuLuc);

    Page<ThongBao> findByTaiKhoan_IdOrderByCreatedAtDesc(Integer taiKhoanId, Pageable pageable);

    long countByTaiKhoan_IdAndDaDocIsNull(Integer taiKhoanId);

    @Modifying
    @Query("""
           UPDATE ThongBao t SET t.daDoc = :thoiDiem
           WHERE t.id = :id AND t.taiKhoan.id = :taiKhoanId AND t.daDoc IS NULL
           """)
    int danhDauDaDoc(@Param("id") Integer id,
                     @Param("taiKhoanId") Integer taiKhoanId,
                     @Param("thoiDiem") LocalDateTime thoiDiem);

    @Modifying
    @Query("""
           UPDATE ThongBao t SET t.daDoc = :thoiDiem
           WHERE t.taiKhoan.id = :taiKhoanId AND t.daDoc IS NULL
           """)
    int danhDauTatCaDaDoc(@Param("taiKhoanId") Integer taiKhoanId,
                          @Param("thoiDiem") LocalDateTime thoiDiem);
}