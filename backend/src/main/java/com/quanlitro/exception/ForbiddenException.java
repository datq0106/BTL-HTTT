package com.quanlitro.exception;


public class ForbiddenException extends RuntimeException {

    public ForbiddenException() {
        super("Bạn không có quyền truy cập dữ liệu này");
    }

    public ForbiddenException(String message) {
        super(message);
    }
}
