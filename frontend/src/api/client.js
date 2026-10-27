import axios from 'axios'

function docCookie(ten) {
  const mau = document.cookie.split('; ').find((c) => c.startsWith(`${ten}=`))
  if (!mau) return ''
  return decodeURIComponent(mau.slice(ten.length + 1))
}

export const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  timeout: 60000,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
  headers: { Accept: 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = docCookie('XSRF-TOKEN')
  if (token) {
    config.headers['X-XSRF-TOKEN'] = token
  }
  return config
})

export function thongBaoLoi(err) {
  const data = err?.response?.data
  if (typeof data?.thongBao === 'string') return data.thongBao
  if (Array.isArray(data?.chiTiet) && data.chiTiet[0]?.thongBao) {
    const d = data.chiTiet[0]
    return d.truong ? `${d.truong}: ${d.thongBao}` : d.thongBao
  }
  if (err?.message === 'Network Error') return 'Không kết nối được máy chủ. Kiểm tra backend cổng 8080.'
  return 'Có lỗi xảy ra, vui lòng thử lại.'
}
