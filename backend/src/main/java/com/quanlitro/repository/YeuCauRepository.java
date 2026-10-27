package com.quanlitro.repository;

import com.quanlitro.entity.YeuCau;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.Optional;

public interface YeuCauRepository extends JpaRepository<YeuCau, Long>, JpaSpecificationExecutor<YeuCau> {
    Optional<YeuCau> findByMaTraCuu(String maTraCuu);
    Page<YeuCau> findByTaiKhoan_Id(Integer id, Pageable pageable);
    boolean existsBySdtAndChuDeAndNoiDungAndCreatedAtAfter(String sdt, String chuDe, String noiDung, LocalDateTime sau);
    long countByTrangThai(String trangThai);
    long countByMucDoAndTrangThaiIn(String mucDo, Collection<String> trangThai);
}
