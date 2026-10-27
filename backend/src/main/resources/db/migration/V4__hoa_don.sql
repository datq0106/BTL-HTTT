CREATE TABLE hoa_don (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    ma_hoa_don VARCHAR(40) NOT NULL UNIQUE,
    hop_dong_id INT NOT NULL,
    ky CHAR(7) NOT NULL,
    tong_tien DECIMAL(14,0) NOT NULL,
    trang_thai VARCHAR(20) NOT NULL DEFAULT 'da_chot',
    han_thanh_toan DATE NOT NULL,
    ngay_thanh_toan DATETIME NULL,
    phuong_thuc VARCHAR(20) NULL,
    ghi_chu VARCHAR(500) NULL,
    created_at DATETIME NOT NULL,
    CONSTRAINT fk_hoa_don_hop_dong FOREIGN KEY (hop_dong_id) REFERENCES hop_dong(id),
    UNIQUE KEY uq_hoa_don_hop_dong_ky (hop_dong_id, ky),
    INDEX idx_hoa_don_ky_trang_thai (ky, trang_thai)
);

CREATE TABLE hoa_don_chi_tiet (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    hoa_don_id BIGINT NOT NULL,
    dich_vu_id INT NULL,
    noi_dung VARCHAR(150) NOT NULL,
    don_vi VARCHAR(30) NULL,
    chi_so_cu DECIMAL(10,2) NULL,
    chi_so_moi DECIMAL(10,2) NULL,
    so_luong DECIMAL(10,2) NOT NULL,
    don_gia DECIMAL(12,0) NOT NULL,
    thanh_tien DECIMAL(14,0) NOT NULL,
    CONSTRAINT fk_hdct_hoa_don FOREIGN KEY (hoa_don_id) REFERENCES hoa_don(id) ON DELETE CASCADE,
    CONSTRAINT fk_hdct_dich_vu FOREIGN KEY (dich_vu_id) REFERENCES dich_vu(id),
    INDEX idx_hdct_dich_vu (dich_vu_id)
);

DELIMITER $$

CREATE FUNCTION fn_cong_no_hop_dong(p_hop_dong_id INT)
RETURNS DECIMAL(14, 0)
READS SQL DATA
BEGIN
    RETURN (SELECT COALESCE(SUM(tong_tien), 0) FROM hoa_don
             WHERE hop_dong_id = p_hop_dong_id AND trang_thai <> 'da_thanh_toan');
END$$

DELIMITER ;
