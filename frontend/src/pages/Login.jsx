import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { thongBaoLoi } from '../api/client'
import { Icon } from '../components/icons'

const DESKS = [
  { ma: 'owner', ten: 'Chủ trọ', moTa: 'Owner desk · quỹ căn & tài khoản' },
  { ma: 'staff', ten: 'Quản lý', moTa: 'Leasing desk · vận hành hàng ngày' },
  { ma: 'resident', ten: 'Cư dân', moTa: 'Resident portal · hợp đồng của bạn' },
]

export default function Login() {
  const { dangNhap } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [tenDangNhap, setTen] = useState('admin')
  const [matKhau, setMk] = useState('')
  const [loi, setLoi] = useState('')
  const [dangGui, setDangGui] = useState(false)

  async function submit(e) {
    e.preventDefault()
    setLoi('')
    setDangGui(true)
    try {
      const user = await dangNhap(tenDangNhap.trim(), matKhau)
      const ve = location.state?.from?.pathname
      if (ve) navigate(ve, { replace: true })
      else navigate(user.maVaiTro === 'ROLE_KHACH' ? '/quan-ly/cong-cu-dan' : '/quan-ly', { replace: true })
    } catch (err) {
      setLoi(thongBaoLoi(err))
    } finally {
      setDangGui(false)
    }
  }

  return (
    <div className="login-page">
      <section className="login-visual">
        <div className="brand" style={{ border: 0, padding: 0, margin: 0 }}>
          <div className="brand-mark"><Icon name="home" size={20} /></div>
          <div>
            <strong>Black Panther</strong>
            <small>Member access</small>
          </div>
        </div>
        <div>
          <p className="page-kicker" style={{ color: 'var(--gold-2)' }}>Three desks, one house</p>
          <h2>Cổng thành viên theo đúng vai trên quỹ căn.</h2>
          <p>Chủ trọ xem occupancy, quản lý vận hành leasing, cư dân mở hồ sơ thuê — cùng ngôn ngữ Black Panther.</p>
        </div>
        <div className="login-roles">
          {DESKS.map((d) => (
            <div key={d.ma}>
              <strong>{d.ten}</strong>
              <span>{d.moTa}</span>
            </div>
          ))}
        </div>
      </section>
      <section className="login-panel">
        <form className="login-card" onSubmit={submit}>
          <p className="page-kicker">Member access</p>
          <h1>Đăng nhập</h1>
          <p>Dùng tài khoản desk đã cấp. Cư dân được gắn sau khi ký hợp đồng.</p>
          <div className="field">
            <label>Tên đăng nhập</label>
            <input value={tenDangNhap} onChange={(e) => setTen(e.target.value)} autoComplete="username" required />
          </div>
          <div className="field">
            <label>Mật khẩu</label>
            <input type="password" value={matKhau} onChange={(e) => setMk(e.target.value)} autoComplete="current-password" required />
          </div>
          <div className="error-line">{loi}</div>
          <button className="btn btn--gold" disabled={dangGui}>{dangGui ? 'Đang xác thực…' : 'Vào cổng của bạn'}</button>
          <p className="muted" style={{ marginTop: 18 }}>
            <Link to="/" className="text-link">← Về trang chủ Black Panther</Link>
          </p>
        </form>
      </section>
    </div>
  )
}


