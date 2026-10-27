import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function RequireAuth() {
  const { user, dangTai } = useAuth()
  const location = useLocation()
  if (dangTai) return <div className="empty">Đang tải phiên…</div>
  if (!user) return <Navigate to="/dang-nhap" replace state={{ from: location }} />
  return <Outlet />
}

export function RequireStaff() {
  const { laNhanVien, dangTai, duongDanSauDangNhap } = useAuth()
  if (dangTai) return null
  if (!laNhanVien) return <Navigate to={duongDanSauDangNhap} replace />
  return <Outlet />
}

export function RequireAdmin() {
  const { laAdmin, laNhanVien, dangTai } = useAuth()
  if (dangTai) return null
  if (!laAdmin) return <Navigate to={laNhanVien ? '/quan-ly' : '/quan-ly/cong-cu-dan'} replace />
  return <Outlet />
}

export function RequireKhach() {
  const { laKhach, dangTai, duongDanSauDangNhap } = useAuth()
  if (dangTai) return null
  if (!laKhach) return <Navigate to={duongDanSauDangNhap} replace />
  return <Outlet />
}

export function GuestOnly() {
  const { user, dangTai, duongDanSauDangNhap } = useAuth()
  if (dangTai) return <div className="empty">Đang tải…</div>
  if (user) return <Navigate to={duongDanSauDangNhap} replace />
  return <Outlet />
}
