package com.quanlitro.enums;

public interface GiaTriDb {

    String getMa();

    String getNhan();

    default boolean laMa(String ma) {
        return getMa().equals(ma);
    }
}
