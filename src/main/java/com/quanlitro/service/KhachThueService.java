package com.quanlitro.service;

import com.quanlitro.dto.khachthue.KhachThueFilter;
import com.quanlitro.dto.khachthue.KhachThueRequest;
import com.quanlitro.dto.khachthue.KhachThueResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface KhachThueService {

    KhachThueResponse tao(KhachThueRequest req);

    KhachThueResponse capNhat(Integer id, KhachThueRequest req);

    void capNhatDuongDanAnh(Integer id, String anhCccd, String anhTamTru);

    void xoa(Integer id);

    KhachThueResponse timTheoId(Integer id);

    Page<KhachThueResponse> timKiem(KhachThueFilter filter, Pageable pageable);
}
