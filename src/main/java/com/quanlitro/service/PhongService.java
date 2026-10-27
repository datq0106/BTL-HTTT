package com.quanlitro.service;

import com.quanlitro.dto.phong.LoaiPhongRequest;
import com.quanlitro.dto.phong.LoaiPhongResponse;
import com.quanlitro.dto.phong.PhongFilter;
import com.quanlitro.dto.phong.PhongRequest;
import com.quanlitro.dto.phong.PhongResponse;
import com.quanlitro.dto.phong.PhongTrangThaiRequest;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface PhongService {

    List<LoaiPhongResponse> danhSachLoaiPhong();

    LoaiPhongResponse taoLoaiPhong(LoaiPhongRequest req);

    LoaiPhongResponse capNhatLoaiPhong(Integer id, LoaiPhongRequest req);

    void xoaLoaiPhong(Integer id);

    PhongResponse tao(PhongRequest req);

    PhongResponse capNhat(Integer id, PhongRequest req);

    PhongResponse doiTrangThai(Integer id, PhongTrangThaiRequest req);

    void xoa(Integer id);

    PhongResponse timTheoId(Integer id);

    Page<PhongResponse> timKiem(PhongFilter filter, Pageable pageable);

    List<PhongResponse> danhSachPhongTrong();
}
