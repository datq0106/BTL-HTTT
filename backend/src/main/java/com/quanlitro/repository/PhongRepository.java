package com.quanlitro.repository;

import com.quanlitro.entity.Phong;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface PhongRepository extends JpaRepository<Phong, Integer> {

    boolean existsByMaPhong(String maPhong);

    boolean existsByMaPhongAndIdNot(String maPhong, Integer id);

    @EntityGraph(attributePaths = "loaiPhong")
    Optional<Phong> findByIdAndHienThiTrue(Integer id);

    @EntityGraph(attributePaths = "loaiPhong")
    @Query("""
           SELECT p FROM Phong p JOIN p.loaiPhong l
           WHERE p.hienThi = TRUE
             AND (:keyword   IS NULL OR LOWER(p.maPhong) LIKE LOWER(CONCAT('%', :keyword, '%')))
             AND (:tang      IS NULL OR p.tang = :tang)
             AND (:trangThai IS NULL OR p.trangThai = :trangThai)
             AND (:giaTu     IS NULL OR l.giaThue >= :giaTu)
             AND (:giaDen    IS NULL OR l.giaThue <= :giaDen)
           """)
    Page<Phong> search(@Param("keyword") String keyword,
                       @Param("tang") Integer tang,
                       @Param("trangThai") String trangThai,
                       @Param("giaTu") BigDecimal giaTu,
                       @Param("giaDen") BigDecimal giaDen,
                       Pageable pageable);


    @EntityGraph(attributePaths = "loaiPhong")
    List<Phong> findByTrangThaiAndHienThiTrueOrderByMaPhong(String trangThai);
    long countByHienThiTrue();

    long countByTrangThaiAndHienThiTrue(String trangThai);
}
