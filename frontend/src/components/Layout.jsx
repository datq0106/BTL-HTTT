import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { ThongBaoApi } from '../api/services'
import { nhan } from '../utils/format'
import { Icon } from './icons'
import { getYeuCauList } from '../utils/yeuCauStore'

const MENU_NHAN_VIEN = [
  { to: '/quan-ly', label: 'Tổng quan', end: true, icon: 'overview' },
  { to: '/quan-ly/phong', label: 'Phòng', icon: 'building' },
  { to: '/quan-ly/loai-phong', label: 'Loại phòng', icon: 'layers' },
  { to: '/quan-ly/khach-thue', label: 'Khách thuê', icon: 'users' },
  { to: '/quan-ly/hop-dong', label: 'Hợp đồng', icon: 'file' },
  { to: '/quan-ly/dich-vu', label: 'Dịch vụ', icon: 'spark' },
  { to: '/quan-ly/yeu-cau', label: 'Yêu cầu & Hỗ trợ', icon: 'phone' },
]

const MENU_CU_DAN = [
  { to: '/quan-ly/cong-cu-dan', label: 'Cổng cư dân', end: true, icon: 'home' },
  { to: '/quan-ly/hop-dong-cua-toi', label: 'Hồ sơ hợp đồng', icon: 'file' },
  { to: '/quan-ly/dich-vu-cu-dan', label: 'Dịch vụ & Chi phí', icon: 'spark' },
  { to: '/quan-ly/thong-bao', label: 'Thông báo', icon: 'bell' },
  { to: '/quan-ly/ho-tro', label: 'Báo sự cố & Hỗ trợ', icon: 'phone' },
]

const TITLES = {
  '/quan-ly': ['Portfolio', 'Tổng quan vận hành'],
  '/quan-ly/phong': ['Inventory', 'Danh mục phòng'],
  '/quan-ly/loai-phong': ['Product', 'Loại phòng'],
  '/quan-ly/khach-thue': ['Residents', 'Khách thuê'],
  '/quan-ly/hop-dong': ['Leasing', 'Hợp đồng'],
  '/quan-ly/dich-vu': ['Amenities', 'Dịch vụ'],
  '/quan-ly/yeu-cau': ['Service desk', 'Yêu cầu khách hàng & Cư dân'],
  '/quan-ly/tai-khoan': ['Access', 'Tài khoản'],
  '/quan-ly/thong-bao': ['Inbox', 'Thông báo'],
  '/quan-ly/doi-mat-khau': ['Security', 'Đổi mật khẩu'],
  '/quan-ly/hop-dong-cua-toi': ['My lease', 'Hồ sơ hợp đồng'],
  '/quan-ly/dich-vu-cu-dan': ['Amenities', 'Dịch vụ & Chi phí'],
  '/quan-ly/cong-cu-dan': ['Resident portal', 'Cổng cư dân'],
  '/quan-ly/ho-so': ['Member file', 'Hồ sơ thành viên'],
  '/quan-ly/ho-tro': ['Concierge', 'Báo sự cố & Hỗ trợ'],
}

export default function Layout() {
  const { user, dangXuat, laAdmin, laNhanVien, laKhach } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [chuaDoc, setChuaDoc] = useState(0)
  const [soYeuCauCho, setSoYeuCauCho] = useState(0)
  const [moMenu, setMoMenu] = useState(false)

  useEffect(() => {
    ThongBaoApi.chuaDoc()
      .then(({ data }) => setChuaDoc(data.soChuaDoc || 0))
      .catch(() => {})

    function capNhatSoYeuCau() {
      try {
        const ds = getYeuCauList()
        const cho = ds.filter((x) => x.trangThai === 'cho_xu_ly').length
        setSoYeuCauCho(cho)
      } catch {}
    }
    capNhatSoYeuCau()
    window.addEventListener('yeucau_updated', capNhatSoYeuCau)
    window.addEventListener('storage', capNhatSoYeuCau)
    return () => {
      window.removeEventListener('yeucau_updated', capNhatSoYeuCau)
      window.removeEventListener('storage', capNhatSoYeuCau)
    }
  }, [location.pathname])

  const [kicker, title] = useMemo(() => {
    const exact = TITLES[location.pathname]
    if (exact) {
      if (location.pathname === '/quan-ly') {
        return laAdmin ? ['Owner desk', 'Tổng quan quỹ'] : ['Leasing desk', 'Tổng quan vận hành']
      }
      return exact
    }
    if (location.pathname.startsWith('/quan-ly/hop-dong/')) return ['Lease file', 'Chi tiết hợp đồng']
    if (location.pathname.startsWith('/quan-ly/khach-thue/')) return ['Resident file', 'Hồ sơ khách thuê']
    if (location.pathname.startsWith('/quan-ly/phong/')) return ['Room file', 'Hồ sơ phòng']
    return ['Black Panther', 'Quản lý lưu trú']
  }, [location.pathname, laAdmin])

  async function xuLyDangXuat() {
    await dangXuat()
    navigate('/')
  }

  const chuCai = (user?.hoTen || user?.tenDangNhap || 'U').slice(0, 1).toUpperCase()
  const vai = nhan('vaiTro', user?.maVaiTro)
  const desk = laKhach ? 'Resident portal' : laAdmin ? 'Owner desk' : 'Leasing desk'
  const roleClass = laAdmin ? 'admin' : laKhach ? 'resident' : 'staff'

  return (
    <div className={`app-shell ${laKhach ? 'app-shell--resident' : ''}`}>
      {moMenu && <div className="sidebar-backdrop" onClick={() => setMoMenu(false)} />}
      <aside className={`sidebar ${moMenu ? 'open' : ''}`}>
        <Link to={laKhach ? '/quan-ly/cong-cu-dan' : '/'} className="brand">
          <div className="brand-mark"><Icon name="home" size={20} /></div>
          <div>
            <strong>Black Panther</strong>
            <small>{desk}</small>
          </div>
        </Link>
        {laNhanVien && <div className="nav-label">Vận hành</div>}
        {laKhach && <div className="nav-label">Cư dân</div>}
        <nav className="nav">
          {laNhanVien && MENU_NHAN_VIEN.map((m) => (
            <NavLink key={m.to} to={m.to} end={m.end} onClick={() => setMoMenu(false)}>
              <Icon name={m.icon} size={16} />
              {m.label}
              {m.to === '/quan-ly/yeu-cau' && soYeuCauCho > 0 && (
                <span className="badge-count" style={{ background: 'var(--gold-2)', color: '#fff' }}>
                  {soYeuCauCho}
                </span>
              )}
            </NavLink>
          ))}
          {laKhach && MENU_CU_DAN.map((m) => (
            <NavLink key={m.to} to={m.to} end={m.end} onClick={() => setMoMenu(false)}>
              <Icon name={m.icon} size={16} />
              {m.label}
              {m.to === '/quan-ly/thong-bao' && chuaDoc > 0 && <span className="badge-count">{chuaDoc}</span>}
            </NavLink>
          ))}
        </nav>
        <div className="nav-label">Tài khoản</div>
        <nav className="nav">
          {laAdmin && (
            <NavLink to="/quan-ly/tai-khoan" onClick={() => setMoMenu(false)}>
              <Icon name="lock" size={16} />Tài khoản
            </NavLink>
          )}
          {!laKhach && (
            <NavLink to="/quan-ly/thong-bao" onClick={() => setMoMenu(false)}>
              <Icon name="bell" size={16} />
              Thông báo
              {chuaDoc > 0 && <span className="badge-count">{chuaDoc}</span>}
            </NavLink>
          )}
          <NavLink to="/quan-ly/ho-so" onClick={() => setMoMenu(false)}><Icon name="user" size={16} />Hồ sơ</NavLink>
          <NavLink to="/quan-ly/doi-mat-khau" onClick={() => setMoMenu(false)}><Icon name="key" size={16} />Đổi mật khẩu</NavLink>
        </nav>
        <div className="sidebar-user">
          <span className={`role-pill role-pill--${roleClass}`}>{vai}</span>
          <strong>{user?.hoTen}</strong>
          <span>{user?.tenDangNhap}</span>
          <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Link className="btn btn--ghost btn--sm" to="/" onClick={() => setMoMenu(false)}>Website</Link>
            <button className="btn btn--ghost btn--sm" onClick={xuLyDangXuat}>
              <Icon name="logout" size={14} /> Đăng xuất
            </button>
          </div>
        </div>
      </aside>
      <div className="workspace">
        <header className="topbar">
          <div className="topbar-left">
            <button type="button" className="icon-btn menu-toggle" onClick={() => setMoMenu(true)} aria-label="Mở menu">
              <Icon name="menu" />
            </button>
            <div>
              <p className="topbar-kicker">{kicker}</p>
              <h2 className="topbar-title">{title}</h2>
            </div>
          </div>
          <div className="topbar-right">
            <button type="button" className="icon-btn" onClick={() => navigate('/quan-ly/thong-bao')} aria-label="Thông báo">
              <Icon name="bell" />
              {chuaDoc > 0 && <span className="dot" />}
            </button>
            <button type="button" className="user-chip" onClick={() => navigate('/quan-ly/ho-so')}>
              <span className="avatar">{chuCai}</span>
              <div>
                <strong>{user?.hoTen}</strong>
                <small>{vai}</small>
              </div>
            </button>
          </div>
        </header>
        <main className="main">
          <Outlet />
        </main>
      </div>
    </div>
  )
}


