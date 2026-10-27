package com.quanlitro.service;

import java.util.List;
import com.quanlitro.dto.taikhoan.VaiTroResponse;
import com.quanlitro.dto.taikhoan.DoiMatKhauRequest;
import com.quanlitro.dto.taikhoan.TaiKhoanCreateRequest;
import com.quanlitro.dto.taikhoan.TaiKhoanResponse;
import com.quanlitro.dto.taikhoan.TaiKhoanUpdateRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface TaiKhoanService {

    TaiKhoanResponse tao(TaiKhoanCreateRequest req);

    TaiKhoanResponse capNhat(Integer id, TaiKhoanUpdateRequest req);

    TaiKhoanResponse datTrangThai(Integer id, boolean khoa);

    void doiMatKhau(Integer id, DoiMatKhauRequest req);

    void ghiNhanDangNhap(Integer id);

    TaiKhoanResponse timTheoId(Integer id);

    Page<TaiKhoanResponse> timKiem(String keyword, Integer vaiTroId, Pageable pageable);

    List<VaiTroResponse> danhSachVaiTro();
}
