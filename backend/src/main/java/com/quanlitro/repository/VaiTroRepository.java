package com.quanlitro.repository;

import com.quanlitro.entity.VaiTro;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface VaiTroRepository extends JpaRepository<VaiTro, Integer> {

    Optional<VaiTro> findByMaVaiTro(String maVaiTro);
}
