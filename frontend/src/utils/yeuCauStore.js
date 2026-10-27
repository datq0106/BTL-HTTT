// Quản lý kho dữ liệu yêu cầu khách hàng & cư dân gửi tới Leasing Desk

const KEY_YEU_CAU = 'blackpanther_leasing_requests'

export const MAU_YEU_CAU_BAN_DAU = [
  {
    id: 'YC-1001',
    nguon: 'cu_dan', // 'cu_dan' | 'khach_ngoai'
    chuDe: 'bao-tri',
    tieuDe: 'Kiểm tra áp lực nước và bình nóng lạnh',
    hoTen: 'Đỗ Quang Đạt',
    sdt: '0987988807',
    email: 'dat@gmail.com',
    maPhong: 'P.101',
    mucDo: 'can_gap', // 'binh_thuong' | 'can_gap' | 'khan_cap'
    noiDung: 'Bình nóng lạnh phòng tắm có tiếng kêu nhỏ khi bật và nước chảy hơi yếu. Nhờ kỹ thuật viên qua kiểm tra giúp.',
    thoiGian: '2 giờ trước',
    trangThai: 'cho_xu_ly', // 'cho_xu_ly' | 'dang_xu_ly' | 'da_xu_ly' | 'da_huy'
    phanHoi: '',
    nguoiXuLy: '',
    ngayGui: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
  },
  {
    id: 'YC-1002',
    nguon: 'cu_dan',
    chuDe: 'gia-han',
    tieuDe: 'Hỏi thủ tục và thời hạn gia hạn hợp đồng',
    hoTen: 'Trần Thị Mai Lan',
    sdt: '0912345678',
    email: 'mailan.tran@gmail.com',
    maPhong: 'P.201',
    mucDo: 'binh_thuong',
    noiDung: 'Hợp đồng của tôi sắp hết hạn vào ngày 15/11. Tôi muốn đăng ký gia hạn thêm 1 năm với giá cũ có được không?',
    thoiGian: '5 giờ trước',
    trangThai: 'dang_xu_ly',
    phanHoi: 'Leasing desk đã ghi nhận và đã gửi phụ lục gia hạn 12 tháng qua Zalo/Email cho bạn.',
    nguoiXuLy: 'Nguyễn Văn Quản Lý',
    ngayGui: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
  },
  {
    id: 'YC-1003',
    nguon: 'khach_ngoai',
    chuDe: 'xem-phong',
    tieuDe: 'Đặt lịch xem căn Studio P.102',
    hoTen: 'Hoàng Anh Tuấn',
    sdt: '0936112233',
    email: 'tuan.hoang@fpt.com',
    maPhong: 'P.102',
    mucDo: 'binh_thuong',
    noiDung: 'Khách muốn xem căn hộ vào chiều mai khoảng 15h30. Cần căn thoáng có ánh sáng tự nhiên.',
    thoiGian: '1 ngày trước',
    trangThai: 'cho_xu_ly',
    phanHoi: '',
    nguoiXuLy: '',
    ngayGui: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
  },
  {
    id: 'YC-1004',
    nguon: 'cu_dan',
    chuDe: 'tam-tru',
    tieuDe: 'Hỗ trợ thủ tục đăng ký tạm trú',
    hoTen: 'Lê Hoàng Nam',
    sdt: '0978112233',
    email: 'namle.it@gmail.com',
    maPhong: 'P.301',
    mucDo: 'binh_thuong',
    noiDung: 'Nhờ quản lý cung cấp hợp đồng bản cứng có chữ ký và số điện thoại chủ nhà để công an phường làm hồ sơ tạm trú.',
    thoiGian: '2 ngày trước',
    trangThai: 'da_xu_ly',
    phanHoi: 'Đã chuẩn bị bản hợp đồng công chứng tại quầy lễ tân tầng 1, bạn có thể xuống lấy bất kỳ lúc nào.',
    nguoiXuLy: 'Chủ trọ',
    ngayGui: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
  },
]

export function getYeuCauList() {
  try {
    const raw = localStorage.getItem(KEY_YEU_CAU)
    if (!raw) {
      localStorage.setItem(KEY_YEU_CAU, JSON.stringify(MAU_YEU_CAU_BAN_DAU))
      return MAU_YEU_CAU_BAN_DAU
    }
    return JSON.parse(raw)
  } catch {
    return MAU_YEU_CAU_BAN_DAU
  }
}

export function luuYeuCauList(list) {
  try {
    localStorage.setItem(KEY_YEU_CAU, JSON.stringify(list))
    // Đồng bộ lại cả khóa cũ nếu có
    window.dispatchEvent(new Event('yeucau_updated'))
  } catch (e) {
    console.error('Không thể lưu yêu cầu:', e)
  }
}

export function themYeuCau(item) {
  const ds = getYeuCauList()
  const nextId = 'YC-' + (1000 + ds.length + 1)
  const newItem = {
    id: nextId,
    thoiGian: 'Vừa xong',
    trangThai: 'cho_xu_ly',
    phanHoi: '',
    nguoiXuLy: '',
    ngayGui: new Date().toISOString(),
    ...item,
  }
  const nextList = [newItem, ...ds]
  luuYeuCauList(nextList)
  return newItem
}

export function capNhatYeuCau(id, updates) {
  const ds = getYeuCauList()
  const nextList = ds.map((item) => {
    if (item.id === id) {
      return { ...item, ...updates }
    }
    return item
  })
  luuYeuCauList(nextList)
  return nextList
}

export function xoaYeuCau(id) {
  const ds = getYeuCauList()
  const nextList = ds.filter((item) => item.id !== id)
  luuYeuCauList(nextList)
  return nextList
}
