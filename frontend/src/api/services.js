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
}
