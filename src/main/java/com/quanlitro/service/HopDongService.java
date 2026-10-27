package com.quanlitro.service;

import java.util.Optional;
import com.quanlitro.dto.hopdong.GiaHanHopDongRequest;
import com.quanlitro.dto.hopdong.HopDongCreateRequest;
import com.quanlitro.dto.hopdong.HopDongFilter;
import com.quanlitro.dto.hopdong.HopDongResponse;
import com.quanlitro.dto.hopdong.ThanhLyHopDongRequest;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface HopDongService {

    HopDongResponse tao(HopDongCreateRequest req, String tenDangNhapNguoiTao);

    HopDongResponse giaHan(Integer id, GiaHanHopDongRequest req);

    HopDongResponse thanhLy(Integer id, ThanhLyHopDongRequest req);

    HopDongResponse chiTiet(Integer id);

    Page<HopDongResponse> timKiem(HopDongFilter filter, Pageable pageable);

    List<HopDongResponse> sapHetHan();

    int danhDauHopDongHetHan();

    Optional<HopDongResponse> hopDongHienTaiCuaKhach(Integer khachThueId);
}
