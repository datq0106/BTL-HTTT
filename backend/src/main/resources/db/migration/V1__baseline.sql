-- Schema for a NEW, EMPTY MySQL database. Existing databases require a verified baseline.
-- Keep this migration immutable after deployment; add V2, V3, ... for later changes.

CREATE TABLE vai_tro (
    id TINYINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    ma_vai_tro VARCHAR(30) NOT NULL UNIQUE,
    ten_vai_tro VARCHAR(100) NOT NULL
);

CREATE TABLE loai_phong (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    ten_loai VARCHAR(100) NOT NULL UNIQUE,
    gia_thue DECIMAL(12, 0) NOT NULL,
    dien_tich DECIMAL(5, 1) NULL,
    mo_ta VARCHAR(500) NULL
);

CREATE TABLE khach_thue (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    ho_ten VARCHAR(100) NOT NULL,
    cccd VARCHAR(12) NOT NULL UNIQUE,
    sdt VARCHAR(15) NOT NULL,
    email VARCHAR(100) NULL,
    ngay_sinh DATE NULL,
    gioi_tinh VARCHAR(10) NULL,
    que_quan VARCHAR(255) NULL,
    anh_cccd VARCHAR(255) NULL,
    anh_tam_tru VARCHAR(255) NULL,
    trang_thai_tam_tru VARCHAR(20) NOT NULL DEFAULT 'chua_khai_bao',
    ngay_khai_bao DATE NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE dich_vu (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    ten_dich_vu VARCHAR(100) NOT NULL UNIQUE,
    don_gia DECIMAL(12, 0) NOT NULL,
    don_vi VARCHAR(30) NOT NULL,
    loai_tinh VARCHAR(20) NOT NULL,
    dang_ap_dung BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE phong (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    ma_phong VARCHAR(20) NOT NULL UNIQUE,
    tang TINYINT NOT NULL,
    loai_phong_id INT NOT NULL,
    trang_thai VARCHAR(20) NOT NULL DEFAULT 'trong',
    tien_nghi VARCHAR(500) NULL,
    ghi_chu VARCHAR(500) NULL,
    hien_thi BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT fk_phong_loai FOREIGN KEY (loai_phong_id) REFERENCES loai_phong(id)
);

CREATE TABLE tai_khoan (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    ten_dang_nhap VARCHAR(50) NOT NULL UNIQUE,
    mat_khau_hash VARCHAR(100) NOT NULL,
    ho_ten VARCHAR(100) NOT NULL,
    vai_tro_id TINYINT UNSIGNED NOT NULL,
    khach_thue_id INT NULL UNIQUE,
    trang_thai VARCHAR(20) NOT NULL DEFAULT 'hoat_dong',
    lan_dang_nhap_cuoi DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_tai_khoan_vai_tro FOREIGN KEY (vai_tro_id) REFERENCES vai_tro(id),
    CONSTRAINT fk_tai_khoan_khach FOREIGN KEY (khach_thue_id) REFERENCES khach_thue(id)
);

CREATE TABLE hop_dong (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    ma_hop_dong VARCHAR(30) NOT NULL UNIQUE,
    phong_id INT NOT NULL,
    khach_thue_id INT NOT NULL,
    ngay_bat_dau DATE NOT NULL,
    ngay_ket_thuc DATE NOT NULL,
    gia_thue DECIMAL(12, 0) NOT NULL,
    tien_coc DECIMAL(12, 0) NOT NULL DEFAULT 0,
    trang_thai VARCHAR(20) NOT NULL DEFAULT 'hieu_luc',
    ngay_thanh_ly DATE NULL,
    tien_khau_tru DECIMAL(12, 0) NOT NULL DEFAULT 0,
    tien_hoan_coc DECIMAL(12, 0) NULL,
    ghi_chu VARCHAR(500) NULL,
    created_by INT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    active_phong_id INT GENERATED ALWAYS AS (
        CASE WHEN trang_thai = 'hieu_luc' THEN phong_id ELSE NULL END
    ) STORED,
    UNIQUE KEY uq_hop_dong_phong_hieu_luc (active_phong_id),
    KEY ix_hop_dong_khach_trang_thai (khach_thue_id, trang_thai),
    KEY ix_hop_dong_ngay_ket_thuc (trang_thai, ngay_ket_thuc),
    CONSTRAINT fk_hop_dong_phong FOREIGN KEY (phong_id) REFERENCES phong(id),
    CONSTRAINT fk_hop_dong_khach FOREIGN KEY (khach_thue_id) REFERENCES khach_thue(id),
    CONSTRAINT fk_hop_dong_nguoi_tao FOREIGN KEY (created_by) REFERENCES tai_khoan(id)
);

CREATE TABLE hop_dong_khach (
    hop_dong_id INT NOT NULL,
    khach_thue_id INT NOT NULL,
    ngay_vao DATE NULL,
    PRIMARY KEY (hop_dong_id, khach_thue_id),
    KEY ix_hop_dong_khach_khach (khach_thue_id),
    CONSTRAINT fk_hdk_hop_dong FOREIGN KEY (hop_dong_id) REFERENCES hop_dong(id),
    CONSTRAINT fk_hdk_khach FOREIGN KEY (khach_thue_id) REFERENCES khach_thue(id)
);

CREATE TABLE hop_dong_dich_vu (
    hop_dong_id INT NOT NULL,
    dich_vu_id INT NOT NULL,
    so_luong DECIMAL(8, 2) NOT NULL DEFAULT 1,
    PRIMARY KEY (hop_dong_id, dich_vu_id),
    KEY ix_hop_dong_dich_vu_dich_vu (dich_vu_id),
    CONSTRAINT fk_hddv_hop_dong FOREIGN KEY (hop_dong_id) REFERENCES hop_dong(id),
    CONSTRAINT fk_hddv_dich_vu FOREIGN KEY (dich_vu_id) REFERENCES dich_vu(id)
);

CREATE TABLE thong_bao (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    tai_khoan_id INT NULL,
    tieu_de VARCHAR(200) NOT NULL,
    noi_dung TEXT NOT NULL,
    loai VARCHAR(20) NOT NULL DEFAULT 'chung',
    da_doc DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    KEY ix_thong_bao_tai_khoan_created (tai_khoan_id, created_at),
    CONSTRAINT fk_thong_bao_tai_khoan FOREIGN KEY (tai_khoan_id) REFERENCES tai_khoan(id)
);

INSERT INTO vai_tro (ma_vai_tro, ten_vai_tro) VALUES
    ('ROLE_ADMIN', 'Chu tro'),
    ('ROLE_QUAN_LY', 'Quan ly'),
    ('ROLE_KHACH', 'Khach thue');

DELIMITER $$

CREATE TRIGGER trg_hop_dong_after_insert
AFTER INSERT ON hop_dong
FOR EACH ROW
BEGIN
    IF NEW.trang_thai = 'hieu_luc' THEN
        UPDATE phong SET trang_thai = 'dang_thue' WHERE id = NEW.phong_id;
    END IF;
END$$

CREATE TRIGGER trg_hop_dong_after_update
AFTER UPDATE ON hop_dong
FOR EACH ROW
BEGIN
    IF OLD.trang_thai = 'hieu_luc' AND NEW.trang_thai <> 'hieu_luc' THEN
        UPDATE phong SET trang_thai = 'trong' WHERE id = NEW.phong_id;
    END IF;
END$$

CREATE FUNCTION fn_tinh_hoan_coc(p_hop_dong_id INT, p_khau_tru DECIMAL(12, 0))
RETURNS DECIMAL(12, 0)
READS SQL DATA
BEGIN
    DECLARE v_tien_coc DECIMAL(12, 0) DEFAULT 0;
    SELECT tien_coc INTO v_tien_coc FROM hop_dong WHERE id = p_hop_dong_id;
    RETURN GREATEST(v_tien_coc - COALESCE(p_khau_tru, 0), 0);
END$$

CREATE PROCEDURE sp_thanh_ly_hop_dong(IN p_hop_dong_id INT, IN p_khau_tru DECIMAL(12, 0))
BEGIN
    UPDATE hop_dong
       SET trang_thai = 'thanh_ly',
           ngay_thanh_ly = CURRENT_DATE(),
           tien_khau_tru = p_khau_tru,
           tien_hoan_coc = GREATEST(tien_coc - p_khau_tru, 0)
     WHERE id = p_hop_dong_id AND trang_thai = 'hieu_luc';

    IF ROW_COUNT() = 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Hop dong khong con hieu luc';
    END IF;
END$$

DELIMITER ;
