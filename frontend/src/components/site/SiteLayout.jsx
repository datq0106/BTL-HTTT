import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { Icon } from '../icons'
import { VAN_PHONG } from '../../data/listings'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { useShortlist } from '../../context/ShortlistContext'

export default function SiteLayout() {
  const { user, duongDanSauDangNhap } = useAuth()
  const toast = useToast()
  const { soLuong } = useShortlist()
  const [scrolled, setScrolled] = useState(false)
  const [mo, setMo] = useState(false)
  const [moMaison, setMoMaison] = useState(false)
  const [email, setEmail] = useState('')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const portal = user ? duongDanSauDangNhap : '/dang-nhap'

  function dangKyBrief(e) {
    e.preventDefault()
    toast.thanhCong('Đã ghi nhận. Research desk sẽ gửi market note định kỳ.')
    setEmail('')
  }

  return (
    <div className="site">
      <div className="site-topbar">
        <span>{VAN_PHONG.diaChi}</span>
        <span className="site-topbar__mid">{VAN_PHONG.dienThoai} · {VAN_PHONG.email}</span>
        <span>{VAN_PHONG.gio}</span>
      </div>
      <header className={`site-nav ${scrolled || mo ? 'is-solid' : ''}`}>
        <Link to="/" className="site-logo" onClick={() => setMo(false)}>
          <span className="brand-mark"><Icon name="home" size={18} /></span>
          <span>
            <strong>{VAN_PHONG.ten}</strong>
            <small>Est. leasing house</small>
          </span>
        </Link>
        <button type="button" className="icon-btn site-nav__toggle" onClick={() => setMo((v) => !v)} aria-label="Menu">
          <Icon name={mo ? 'close' : 'menu'} />
        </button>
        <nav className={mo ? 'open' : ''}>
          <NavLink to="/" end onClick={() => setMo(false)}>Trang chủ</NavLink>
          <NavLink to="/bat-dong-san" onClick={() => setMo(false)}>Quỹ căn</NavLink>
          <NavLink to="/dich-vu" onClick={() => setMo(false)}>Dịch vụ</NavLink>
          <NavLink to="/chu-nha" onClick={() => setMo(false)}>Chủ nhà</NavLink>
          <NavLink to="/thi-truong" onClick={() => setMo(false)}>Thị trường</NavLink>
          <div className={`nav-sub ${moMaison ? 'open' : ''}`}>
            <button type="button" className="nav-sub__btn" onClick={() => setMoMaison((v) => !v)}>
              Black Panther
            </button>
            <div className="nav-sub__menu">
              <NavLink to="/ve-chung-toi" onClick={() => { setMo(false); setMoMaison(false) }}>Về chúng tôi</NavLink>
              <NavLink to="/doi-ngu" onClick={() => { setMo(false); setMoMaison(false) }}>Đội ngũ</NavLink>
              <NavLink to="/quy-trinh" onClick={() => { setMo(false); setMoMaison(false) }}>Quy trình thuê</NavLink>
              <NavLink to="/tuyen-dung" onClick={() => { setMo(false); setMoMaison(false) }}>Tuyển dụng</NavLink>
              <NavLink to="/bao-chi" onClick={() => { setMo(false); setMoMaison(false) }}>Báo chí</NavLink>
              <NavLink to="/hoi-dap" onClick={() => { setMo(false); setMoMaison(false) }}>Hỏi đáp</NavLink>
            </div>
          </div>
          <NavLink to="/lien-he" onClick={() => setMo(false)}>Liên hệ</NavLink>
          <Link to="/quan-tam" className="nav-shortlist" onClick={() => setMo(false)} aria-label="Danh sách quan tâm">
            <Icon name="heart" size={16} />
            {soLuong > 0 && <em>{soLuong}</em>}
          </Link>
          <Link to={portal} className="btn btn--gold btn--sm" onClick={() => setMo(false)}>
            {user ? 'Cổng quản lý' : 'Đăng nhập'}
          </Link>
        </nav>
      </header>
      <Outlet />
      <footer className="site-foot">
        <div className="site-foot__grid site-foot__grid--4">
          <div>
            <p className="page-kicker">Black Panther</p>
            <h3>Vận hành không gian sống như một quỹ tài sản.</h3>
            <p className="muted">Tư vấn leasing, quản lý cư dân và hợp đồng dài hạn cho căn hộ, loft và nhà phố tại Hà Nội.</p>
          </div>
          <div>
            <h4>Văn phòng</h4>
            <p>{VAN_PHONG.diaChi}</p>
            <p>{VAN_PHONG.dienThoai}</p>
            <p>{VAN_PHONG.email}</p>
            <p>{VAN_PHONG.gio}</p>
          </div>
          <div>
            <h4>Danh mục</h4>
            <Link to="/bat-dong-san">Căn đang cho thuê</Link>
            <Link to="/ban-do">Bản đồ quỹ</Link>
            <Link to="/brief">Brief nhu cầu</Link>
            <Link to="/quan-tam">Danh sách quan tâm</Link>
            <Link to="/so-sanh">So sánh căn</Link>
            <Link to="/ngan-sach">Tính ngân sách</Link>
            <Link to="/khu-vuc">Khu vực</Link>
            <Link to="/loi-khach">Lời khách</Link>
            <Link to="/huong-dan">Hướng dẫn ở</Link>
            <Link to="/dich-vu">Dịch vụ leasing</Link>
            <Link to="/chu-nha">Gửi căn vào quỹ</Link>
            <Link to="/dat-lich">Đặt lịch xem nhà</Link>
            <Link to="/quy-trinh">Quy trình thuê</Link>
            <Link to="/doi-ngu">Đội ngũ</Link>
            <Link to="/tuyen-dung">Tuyển dụng</Link>
            <Link to="/bao-chi">Báo chí</Link>
            <Link to="/thi-truong">Ghi chép thị trường</Link>
            <Link to="/hoi-dap">Hỏi đáp</Link>
            <Link to="/chinh-sach">Điều khoản</Link>
            <Link to="/dang-nhap">Cổng thành viên</Link>
          </div>
          <div>
            <h4>Market brief</h4>
            <p className="muted">Nhận ghi chú định giá khu vực — không spam, không tin rao.</p>
            <form className="foot-brief" onSubmit={dangKyBrief}>
              <input
                type="email"
                required
                placeholder="Email công việc"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button className="btn btn--gold btn--sm" type="submit">Đăng ký</button>
            </form>
          </div>
        </div>
        <div className="site-foot__copy">
          <span>© {new Date().getFullYear()} Black Panther Property Desk</span>
          <span>
            <Link to="/chinh-sach">Điều khoản</Link>
            {' · '}
            Private leasing · Occupancy
          </span>
        </div>
      </footer>
      <div className="desk-bar">
        <a href={`tel:${VAN_PHONG.dienThoai.replace(/\s/g, '')}`}>
          <Icon name="phone" size={16} /> {VAN_PHONG.dienThoai}
        </a>
        <Link to="/dat-lich">Đặt lịch xem</Link>
        <Link to="/ngan-sach">Ngân sách</Link>
        <Link to="/quan-tam">Quan tâm{soLuong ? ` (${soLuong})` : ''}</Link>
      </div>
    </div>
  )
}


