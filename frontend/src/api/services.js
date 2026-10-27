import { api } from './client'

export const AuthApi = {
  me: () => api.get('/auth/me'),
  login: (tenDangNhap, matKhau) =>
    api.post('/auth/login', new URLSearchParams({ tenDangNhap, matKhau }), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    }),
  logout: () => api.post('/auth/logout'),
  doiMatKhau: (body) => api.post('/auth/doi-mat-khau', body),
}

export const DashboardApi = {
  tongQuan: () => api.get('/dashboard'),
}

export const PhongApi = {
  danhSach: (params) => api.get('/phong', { params }),
  trong: () => api.get('/phong/trong'),
  chiTiet: (id) => api.get(`/phong/${id}`),
  tao: (body) => api.post('/phong', body),
  capNhat: (id, body) => api.put(`/phong/${id}`, body),
  doiTrangThai: (id, trangThai) => api.patch(`/phong/${id}/trang-thai`, { trangThai }),
  xoa: (id) => api.delete(`/phong/${id}`),
}

export const LoaiPhongApi = {
  danhSach: () => api.get('/phong/loai'),
  tao: (body) => api.post('/phong/loai', body),
  capNhat: (id, body) => api.put(`/phong/loai/${id}`, body),
  xoa: (id) => api.delete(`/phong/loai/${id}`),
}

export const KhachThueApi = {
  danhSach: (params) => api.get('/khach-thue', { params }),
  chiTiet: (id) => api.get(`/khach-thue/${id}`),
  tao: (body) => api.post('/khach-thue', body),
  capNhat: (id, body) => api.put(`/khach-thue/${id}`, body),
  xoa: (id) => api.delete(`/khach-thue/${id}`),
  taiAnh: (id, formData) =>
    api.post(`/khach-thue/${id}/anh`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  urlAnh: (id, loai) => `/api/khach-thue/${id}/anh/${loai}`,
}

export const HopDongApi = {
  danhSach: (params) => api.get('/hop-dong', { params }),
  sapHetHan: () => api.get('/hop-dong/sap-het-han'),
  chiTiet: (id) => api.get(`/hop-dong/${id}`),
  tao: (body) => api.post('/hop-dong', body),
  giaHan: (id, body) => api.post(`/hop-dong/${id}/gia-han`, body),
  thanhLy: (id, body) => api.post(`/hop-dong/${id}/thanh-ly`, body),
}

export const DichVuApi = {
  danhSach: (params) => api.get('/dich-vu', { params }),
  chiTiet: (id) => api.get(`/dich-vu/${id}`),
  tao: (body) => api.post('/dich-vu', body),
  capNhat: (id, body) => api.put(`/dich-vu/${id}`, body),
  datApDung: (id, apDung) => api.patch(`/dich-vu/${id}/ap-dung`, null, { params: { apDung } }),
  xoa: (id) => api.delete(`/dich-vu/${id}`),
}

export const TaiKhoanApi = {
  danhSach: (params) => api.get('/tai-khoan', { params }),
  vaiTro: () => api.get('/tai-khoan/vai-tro'),
  chiTiet: (id) => api.get(`/tai-khoan/${id}`),
  tao: (body) => api.post('/tai-khoan', body),
  capNhat: (id, body) => api.put(`/tai-khoan/${id}`, body),
  khoa: (id) => api.post(`/tai-khoan/${id}/khoa`),
  moKhoa: (id) => api.post(`/tai-khoan/${id}/mo-khoa`),
}

export const ThongBaoApi = {
  danhSach: (params) => api.get('/thong-bao', { params }),
  chuaDoc: () => api.get('/thong-bao/chua-doc'),
  daDoc: (id) => api.post(`/thong-bao/${id}/da-doc`),
  daDocTatCa: () => api.post('/thong-bao/da-doc-tat-ca'),
}

export const KhachApi = {
  hopDong: () => api.get('/khach/hop-dong'),
  yeuCau: (params) => api.get('/khach/yeu-cau', { params }),
  chiTietYeuCau: (id) => api.get(`/khach/yeu-cau/${id}`),
  guiYeuCau: (body) => api.post('/khach/yeu-cau', body),
  hoaDon: () => api.get('/khach/hoa-don'),
  chiTietHoaDon: (id) => api.get(`/khach/hoa-don/${id}`),
}

export const HoaDonApi = {
  danhSach: (params) => api.get('/hoa-don', { params }),
  thongKe: (ky) => api.get('/hoa-don/thong-ke', { params: { ky } }),
  goiY: (hopDongId, ky) => api.get('/hoa-don/goi-y', { params: { hopDongId, ky } }),
  chiTiet: (id) => api.get(`/hoa-don/${id}`),
  lap: (body) => api.post('/hoa-don', body),
  thanhToan: (id, phuongThuc) => api.post(`/hoa-don/${id}/thanh-toan`, { phuongThuc }),
  huy: (id) => api.delete(`/hoa-don/${id}`),
}

async function chuanBiCsrfCongKhai() {
  if (!document.cookie.split('; ').some((x) => x.startsWith('XSRF-TOKEN='))) {
    await api.get('/auth/me').catch(() => {})
  }
}

export const PublicYeuCauApi = {
  gui: async (body) => {
    await chuanBiCsrfCongKhai()
    return api.post('/public/yeu-cau', body)
  },
  datLich: async (body) => {
    await chuanBiCsrfCongKhai()
    return api.post('/public/lich-xem', body)
  },
  traCuu: (ma) => api.get(`/public/xac-nhan/${encodeURIComponent(ma)}`),
}

export const YeuCauApi = {
  danhSach: (params) => api.get('/yeu-cau', { params }),
  thongKe: () => api.get('/yeu-cau/thong-ke'),
  nhanVien: () => api.get('/yeu-cau/nhan-vien'),
  chiTiet: (id) => api.get(`/yeu-cau/${id}`),
  tao: (body) => api.post('/yeu-cau', body),
  xuLy: (id, body) => api.patch(`/yeu-cau/${id}`, body),
  xacNhanLich: (id, khungXacNhan) => api.patch(`/yeu-cau/${id}/lich-xem/xac-nhan`, { khungXacNhan }),
  hoanThanhLich: (id) => api.patch(`/yeu-cau/${id}/lich-xem/hoan-thanh`),
  huyLich: (id) => api.patch(`/yeu-cau/${id}/lich-xem/huy`),
}

export const PublicTinDangApi = {
  khuVuc: () => api.get('/public/khu-vuc'),
  thongKe: () => api.get('/public/thong-ke'),
  chiTietKhu: (slug) => api.get(`/public/khu-vuc/${encodeURIComponent(slug)}`),
  danhSach: (params) => api.get('/public/tin-dang', { params }),
  chiTiet: (slug) => api.get(`/public/tin-dang/${encodeURIComponent(slug)}`),
  tuongTu: (slug) => api.get(`/public/tin-dang/${encodeURIComponent(slug)}/tuong-tu`),
}

export const BatDongSanApi = {
  khuVuc: () => api.get('/bat-dong-san/khu-vuc'),
  luuKhu: (slug, body) => api.put(`/bat-dong-san/khu-vuc/${encodeURIComponent(slug)}`, body),
  danhSach: () => api.get('/bat-dong-san'),
  tao: (body) => api.post('/bat-dong-san', body),
  sua: (id, body) => api.put(`/bat-dong-san/${id}`, body),
}

export const TinDangApi = {
  danhSach: (params) => api.get('/tin-dang', { params }),
  chiTiet: (id) => api.get(`/tin-dang/${id}`),
  tao: (body) => api.post('/tin-dang', body),
  sua: (id, body) => api.put(`/tin-dang/${id}`, body),
  xuatBan: (id) => api.post(`/tin-dang/${id}/xuat-ban`),
  an: (id) => api.post(`/tin-dang/${id}/an`),
  themAnh: (id, file, altText = '') => {
    const form = new FormData()
    form.append('file', file)
    form.append('altText', altText)
    return api.post(`/tin-dang/${id}/anh`, form)
  },
  sapXepAnh: (id, ids) => api.put(`/tin-dang/${id}/anh/thu-tu`, ids),
  xoaAnh: (id, anhId) => api.delete(`/tin-dang/${id}/anh/${anhId}`),
}
