package com.quanlitro.exception;

public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }

    public static ResourceNotFoundException khongTim(String doiTuong, Object id) {
        return new ResourceNotFoundException("Không tìm thấy " + doiTuong + " (id = " + id + ")");
    }
}
