import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import SiteBanner from '../../components/site/SiteBanner'
import { DOI_NGU, VAN_PHONG } from '../../data/listings'
import { useCatalog } from '../../context/CatalogContext'
import { useToast } from '../../context/ToastContext'
import { PublicYeuCauApi } from '../../api/services'
import { thongBaoLoi } from '../../api/client'

export default function BriefPage() {
  const { khuVuc: KHU_VUC } = useCatalog()
  const toast = useToast()
  const navigate = useNavigate()
  const [sending, setSending] = useState(false)
  const [form, setForm] = useState({
    ten: '', sdt: '', email: '', khu: '', pn: '', nganSach: '', thoiHan: '12', ghiChu: '',
  })

  async function gui(e) {
    e.preventDefault()
    if (sending) return
    setSending(true)
    try {
      const { data } = await PublicYeuCauApi.gui({
        chuDe: 'brief', tieuDe: 'Yêu cầu tìm căn theo ngân sách',
        hoTen: form.ten.trim(), sdt: form.sdt.trim(), email: form.email.trim(),
        noiDung: `Khu vực: ${form.khu || 'Linh hoạt'}. Số PN: ${form.pn || 'Linh hoạt'}. Ngân sách: ${form.nganSach}. Thời hạn: ${form.thoiHan} tháng. Ghi chú: ${form.ghiChu || 'Không có'}`,
      })
      navigate(`/dat-lich/xac-nhan?ma=${data.maTraCuu}`)
    } catch (err) { toast.loi(thongBaoLoi(err)) }
    finally { setSending(false) }
  }

  return (
    <>
      <SiteBanner
        kicker="Private brief"
        title="Để desk lọc căn trước khi bạn xem."
        desc="Không inbox môi giới. Một officer đọc nhu cầu, chỉ mở lịch với căn khớp."
        anh="/properties/van-phong.jpg"
        compact
      />
      <div className="site-page">
        <div className="detail-grid">
          <form className="card" onSubmit={gui}>
            <p className="page-kicker">Client intake</p>
            <h3>Brief thuê căn</h3>
            <div className="form-grid" style={{ marginTop: 16 }}>
              <div className="field">
                <label>Họ tên</label>
                <input required value={form.ten} onChange={(e) => setForm({ ...form, ten: e.target.value })} />
              </div>
              <div className="field">
                <label>Điện thoại</label>
                <input required value={form.sdt} onChange={(e) => setForm({ ...form, sdt: e.target.value })} />
              </div>
              <div className="field field--full">
                <label>Email</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="field">
                <label>Khu vực ưu tiên</label>
                <select value={form.khu} onChange={(e) => setForm({ ...form, khu: e.target.value })}>
                  <option value="">Linh hoạt</option>
                  {KHU_VUC.map((k) => <option key={k.id} value={k.id}>{k.ten}</option>)}
                </select>
              </div>
              <div className="field">
                <label>Phòng ngủ</label>
                <select value={form.pn} onChange={(e) => setForm({ ...form, pn: e.target.value })}>
                  <option value="">Chưa chốt</option>
                  <option value="0">Studio</option>
                  <option value="1">1 PN</option>
                  <option value="2">2 PN</option>
                  <option value="3">3+ PN / nhà phố</option>
                </select>
              </div>
              <div className="field">
                <label>Ngân sách / tháng</label>
                <select required value={form.nganSach} onChange={(e) => setForm({ ...form, nganSach: e.target.value })}>
                  <option value="">Chọn mức</option>
                  <option value="15">Đến 15 triệu</option>
                  <option value="25">Đến 25 triệu</option>
                  <option value="40">Đến 40 triệu</option>
                  <option value="90">Đến 90 triệu</option>
                </select>
              </div>
              <div className="field">
                <label>Kỳ hạn</label>
                <select value={form.thoiHan} onChange={(e) => setForm({ ...form, thoiHan: e.target.value })}>
                  <option value="12">12 tháng</option>
                  <option value="24">24 tháng</option>
                  <option value="linh">Linh hoạt</option>
                </select>
              </div>
              <div className="field field--full">
                <label>Ghi chú (thú cưng, người ở cùng, thời điểm vào)</label>
                <textarea rows={4} value={form.ghiChu} onChange={(e) => setForm({ ...form, ghiChu: e.target.value })} />
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn btn--gold" type="submit" disabled={sending}>{sending ? 'Đang gửi...' : 'Gửi brief'}</button>
            </div>
          </form>
          <aside className="card">
            <h3>Ai đọc brief</h3>
            <ul className="check-list">
              {DOI_NGU.map((p) => (
                <li key={p.id}>
                  <Link to={`/doi-ngu/${p.id}`}>{p.ten}</Link> — {p.khu}
                </li>
              ))}
            </ul>
            <p className="muted" style={{ marginTop: 16 }}>{VAN_PHONG.gio} · {VAN_PHONG.dienThoai}</p>
            <Link to="/ngan-sach" className="text-link">Tính ngân sách trước →</Link>
          </aside>
        </div>
      </div>
    </>
  )
}
