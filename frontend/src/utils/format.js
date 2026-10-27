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
