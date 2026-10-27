package com.quanlitro.utils;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

public final class PhanTrang {

    public static final int MAC_DINH = 10;
    public static final int TOI_DA = 100;

    private PhanTrang() {}

    public static Pageable cua(int trang, int kichThuoc, Sort sapXep) {
        int k = kichThuoc < 1 ? MAC_DINH : Math.min(kichThuoc, TOI_DA);
        return PageRequest.of(Math.max(trang, 0), k, sapXep);
    }
}
