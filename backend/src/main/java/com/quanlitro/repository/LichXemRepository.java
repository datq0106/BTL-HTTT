package com.quanlitro.repository;

import com.quanlitro.entity.LichXem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.Optional;

public interface LichXemRepository extends JpaRepository<LichXem, Long> {
    Optional<LichXem> findByYeuCau_Id(Long id);
    boolean existsByListingKeyAndKhungXacNhanAndTrangThai(String listingKey, LocalDateTime khung, String trangThai);
}
