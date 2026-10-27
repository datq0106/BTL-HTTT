const tienFmt = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
})

const soFmt = new Intl.NumberFormat('vi-VN')

export function tien(value) {
  if (value == null || value === '') return '—'
  return tienFmt.format(Number(value))
}

export function so(value) {
  if (value == null || value === '') return '—'
  return soFmt.format(Number(value))
}

export function ngay(value) {
  if (!value) return '—'
  const d = value.length <= 10 ? new Date(`${value}T00:00:00`) : new Date(value)
  if (Number.isNaN(d.getTime())) return value
  return d.toLocaleDateString('vi-VN')
}

export function ngayGio(value) {
  if (!value) return '—'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  return d.toLocaleString('vi-VN', { hour12: false })
}

export function ngayGioVietNam(value) {
  if (!value) return '—'
  const raw = String(value).replace(/(\.\d{3})\d+/, '$1')
  const d = new Date(/[zZ]$|[+-]\d{2}:\d{2}$/.test(raw) ? raw : `${raw}+07:00`)
  if (Number.isNaN(d.getTime())) return raw
  return d.toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', hour12: false })
}

export const NHAN = {
  phong: {
    trong: 'Trống',
    dang_thue: 'Đang thuê',
    bao_tri: 'Bảo trì',
    da_dat_coc: 'Đã đặt cọc',
  },
  hopDong: {
    hieu_luc: 'Hiệu lực',
    het_han: 'Hết hạn',
    thanh_ly: 'Thanh lý',
  },
  tamTru: {
    chua_khai_bao: 'Chưa khai báo',
    da_khai_bao: 'Đã khai báo',
    het_han: 'Hết hạn',
  },
  gioiTinh: { nam: 'Nam', nu: 'Nữ', khac: 'Khác' },
  loaiTinh: {
    theo_chi_so: 'Theo chỉ số',
    co_dinh: 'Cố định tháng',
  },
  tinDang: {
    nhap: 'Nháp',
    xuat_ban: 'Đang xuất bản',
    an: 'Đã ẩn',
  },
  hoaDon: {
    da_chot: 'Chưa thanh toán',
    da_thanh_toan: 'Đã thanh toán',
  },
  phuongThuc: {
    tien_mat: 'Tiền mặt',
    chuyen_khoan: 'Chuyển khoản',
    vi_dien_tu: 'Ví điện tử',
  },
  taiKhoan: {
    hoat_dong: 'Hoạt động',
    khoa: 'Đã khóa',
  },
  vaiTro: {
    ROLE_ADMIN: 'Chủ trọ',
    ROLE_QUAN_LY: 'Quản lý',
    ROLE_KHACH: 'Khách thuê',
  },
}

export function nhan(nhom, ma) {
  return NHAN[nhom]?.[ma] || ma || '—'
}
