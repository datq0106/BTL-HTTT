import { useState } from 'react'
import { AuthApi } from '../api/services'
import { thongBaoLoi } from '../api/client'
import { useToast } from '../context/ToastContext'
import { PageHead } from '../components/ui'
import { Icon } from '../components/icons'

export default function DoiMatKhau() {
  const toast = useToast()
  const [form, setForm] = useState({ matKhauCu: '', matKhauMoi: '', xacNhanMatKhauMoi: '' })
  const [loi, setLoi] = useState('')
  const [dangGui, setDangGui] = useState(false)

  async function submit(e) {
    e.preventDefault()
    setLoi('')
    if (form.matKhauMoi !== form.xacNhanMatKhauMoi) {
      setLoi('Xác nhận mật khẩu mới không khớp')
      return
    }
    setDangGui(true)
    try {
      await AuthApi.doiMatKhau(form)
      toast.thanhCong('Đã đổi mật khẩu')
      setForm({ matKhauCu: '', matKhauMoi: '', xacNhanMatKhauMoi: '' })
    } catch (err) {
      setLoi(thongBaoLoi(err))
    } finally {
      setDangGui(false)
    }
  }

  return (
    <>
      <PageHead kicker="Security" title="Đổi mật khẩu" desc="Tối thiểu 8 ký tự, gồm chữ và số, không khoảng trắng." />
      <div className="detail-grid">
        <form className="card" onSubmit={submit}>
          <p className="page-kicker">Vault</p>
          <h3>Cập nhật khóa cổng</h3>
          <div className="field" style={{ marginBottom: 12 }}>
            <label>Mật khẩu hiện tại</label>
            <input type="password" required value={form.matKhauCu} onChange={(e) => setForm({ ...form, matKhauCu: e.target.value })} />
          </div>
          <div className="field" style={{ marginBottom: 12 }}>
            <label>Mật khẩu mới</label>
            <input type="password" required minLength={8} value={form.matKhauMoi} onChange={(e) => setForm({ ...form, matKhauMoi: e.target.value })} />
          </div>
          <div className="field" style={{ marginBottom: 12 }}>
            <label>Xác nhận mật khẩu mới</label>
            <input type="password" required value={form.xacNhanMatKhauMoi} onChange={(e) => setForm({ ...form, xacNhanMatKhauMoi: e.target.value })} />
          </div>
          <div className="error-line">{loi}</div>
          <button className="btn btn--gold" disabled={dangGui}>{dangGui ? 'Đang lưu…' : 'Cập nhật'}</button>
        </form>
        <aside className="card">
          <Icon name="shield" size={22} />
          <h3>Ghi nhớ</h3>
          <ul className="check-list">
            <li>Không dùng mật khẩu đã chia sẻ với người ở cùng</li>
            <li>Đổi ngay nếu đăng nhập trên máy công cộng</li>
            <li>Cư dân không thấy dữ liệu quỹ căn của chủ trọ</li>
          </ul>
        </aside>
      </div>
    </>
  )
}
