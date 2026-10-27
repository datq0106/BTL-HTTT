CREATE TABLE yeu_cau (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    ma_tra_cuu VARCHAR(64) NOT NULL UNIQUE,
    nguon VARCHAR(20) NOT NULL,
    chu_de VARCHAR(30) NOT NULL,
    tieu_de VARCHAR(200) NOT NULL,
    ho_ten VARCHAR(100) NOT NULL,
    sdt VARCHAR(15) NOT NULL,
    email VARCHAR(100) NULL,
    ma_phong VARCHAR(30) NULL,
    listing_key VARCHAR(100) NULL,
    muc_do VARCHAR(20) NOT NULL DEFAULT 'binh_thuong',
    noi_dung TEXT NOT NULL,
    trang_thai VARCHAR(20) NOT NULL DEFAULT 'cho_xu_ly',
    phan_hoi TEXT NULL,
    tai_khoan_id INT NULL,
    nguoi_xu_ly_id INT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    CONSTRAINT fk_yeu_cau_tai_khoan FOREIGN KEY (tai_khoan_id) REFERENCES tai_khoan(id),
    CONSTRAINT fk_yeu_cau_nguoi_xu_ly FOREIGN KEY (nguoi_xu_ly_id) REFERENCES tai_khoan(id),
    INDEX idx_yeu_cau_trang_thai (trang_thai, created_at),
    INDEX idx_yeu_cau_tai_khoan (tai_khoan_id, created_at),
    INDEX idx_yeu_cau_lien_he (sdt, chu_de, created_at)
);

CREATE TABLE yeu_cau_lich_su (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    yeu_cau_id BIGINT NOT NULL,
    tai_khoan_id INT NULL,
    hanh_dong VARCHAR(30) NOT NULL,
    noi_dung TEXT NULL,
    created_at DATETIME NOT NULL,
    CONSTRAINT fk_yeu_cau_lich_su_yeu_cau FOREIGN KEY (yeu_cau_id) REFERENCES yeu_cau(id),
    CONSTRAINT fk_yeu_cau_lich_su_tai_khoan FOREIGN KEY (tai_khoan_id) REFERENCES tai_khoan(id),
    INDEX idx_yeu_cau_lich_su (yeu_cau_id, created_at)
);

CREATE TABLE lich_xem (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    yeu_cau_id BIGINT NOT NULL UNIQUE,
    listing_key VARCHAR(100) NOT NULL,
    khung_de_nghi DATETIME NOT NULL,
    khung_xac_nhan DATETIME NULL,
    trang_thai VARCHAR(20) NOT NULL DEFAULT 'cho_xac_nhan',
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    confirmed_listing_key VARCHAR(100) GENERATED ALWAYS AS
        (CASE WHEN trang_thai = 'da_xac_nhan' THEN listing_key ELSE NULL END) STORED,
    confirmed_slot DATETIME GENERATED ALWAYS AS
        (CASE WHEN trang_thai = 'da_xac_nhan' THEN khung_xac_nhan ELSE NULL END) STORED,
    CONSTRAINT fk_lich_xem_yeu_cau FOREIGN KEY (yeu_cau_id) REFERENCES yeu_cau(id),
    INDEX idx_lich_xem_khung_de_nghi (khung_de_nghi, trang_thai),
    INDEX idx_lich_xem_listing (listing_key, khung_xac_nhan, trang_thai),
    UNIQUE KEY uq_lich_xem_slot (confirmed_listing_key, confirmed_slot)
);
