CREATE TABLE khu_vuc (
    slug VARCHAR(60) NOT NULL PRIMARY KEY,
    ten VARCHAR(100) NOT NULL,
    mo_ta VARCHAR(500) NULL,
    anh_url VARCHAR(500) NULL,
    khach VARCHAR(500) NULL,
    dac_diem TEXT NULL,
    pin_x DECIMAL(5,2) NULL,
    pin_y DECIMAL(5,2) NULL,
    hien_thi BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE bat_dong_san (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    khu_vuc_slug VARCHAR(60) NOT NULL,
    ten VARCHAR(150) NOT NULL,
    dia_chi VARCHAR(300) NOT NULL,
    pin_x DECIMAL(5,2) NULL,
    pin_y DECIMAL(5,2) NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    CONSTRAINT fk_bat_dong_san_khu_vuc FOREIGN KEY (khu_vuc_slug) REFERENCES khu_vuc(slug),
    INDEX idx_bat_dong_san_khu_vuc (khu_vuc_slug)
);

CREATE TABLE tin_dang (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    slug VARCHAR(100) NOT NULL UNIQUE,
    bat_dong_san_id BIGINT NOT NULL,
    phong_id INT NULL,
    ma VARCHAR(30) NOT NULL UNIQUE,
    tieu_de VARCHAR(200) NOT NULL,
    loai VARCHAR(80) NOT NULL,
    phong_ngu INT NOT NULL,
    phong_tam INT NOT NULL,
    dien_tich DECIMAL(7,2) NOT NULL,
    tang INT NOT NULL,
    gia_niem_yet DECIMAL(14,0) NOT NULL,
    dat_coc DECIMAL(14,0) NOT NULL,
    tien_nghi TEXT NULL,
    mo_ta TEXT NOT NULL,
    noi_bat BOOLEAN NOT NULL DEFAULT FALSE,
    trang_thai_can VARCHAR(20) NOT NULL DEFAULT 'trong',
    trang_thai VARCHAR(20) NOT NULL DEFAULT 'nhap',
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    published_at DATETIME NULL,
    CONSTRAINT fk_tin_dang_bat_dong_san FOREIGN KEY (bat_dong_san_id) REFERENCES bat_dong_san(id),
    CONSTRAINT fk_tin_dang_phong FOREIGN KEY (phong_id) REFERENCES phong(id),
    INDEX idx_tin_dang_xuat_ban (trang_thai, published_at),
    INDEX idx_tin_dang_bat_dong_san (bat_dong_san_id),
    INDEX idx_tin_dang_gia (gia_niem_yet),
    INDEX idx_tin_dang_phong (phong_id)
);

CREATE TABLE tin_dang_anh (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    tin_dang_id BIGINT NOT NULL,
    duong_dan VARCHAR(500) NOT NULL,
    thu_tu INT NOT NULL,
    alt_text VARCHAR(200) NULL,
    CONSTRAINT fk_tin_dang_anh_tin_dang FOREIGN KEY (tin_dang_id) REFERENCES tin_dang(id),
    INDEX idx_tin_dang_anh_thu_tu (tin_dang_id, thu_tu)
);
