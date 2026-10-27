import { Link, useNavigate } from 'react-router-dom'
import SiteBanner from '../../components/site/SiteBanner'
import { TUYEN_DUNG, VAN_PHONG } from '../../data/listings'
import { useToast } from '../../context/ToastContext'
import { useState } from 'react'
import { PublicYeuCauApi } from '../../api/services'
import { thongBaoLoi } from '../../api/client'

export default function CareersPage() {
  const toast = useToast()
  const navigate = useNavigate()
  const [sending, setSending] = useState(false)
  const [form, setForm] = useState({ ten: '', sdt: '', email: '', viTri: TUYEN_DUNG[0].id, ghiChu: '' })

  async function gui(e) {
    e.preventDefault()
    if (sending) return
    setSending(true)
    const job = TUYEN_DUNG.find((j) => j.id === form.viTri)
    try {
      const { data } = await PublicYeuCauApi.gui({
        chuDe: 'ung-tuyen', tieuDe: `Ứng tuyển ${job.viTri}`,
        hoTen: form.ten.trim(), sdt: form.sdt.trim(), email: form.email.trim(), noiDung: form.ghiChu.trim(),
      })
      navigate(`/dat-lich/xac-nhan?ma=${data.maTraCuu}`)
    } catch (err) { toast.loi(thongBaoLoi(err)) }
    finally { setSending(false) }
  }

  return (
    <>
      <SiteBanner
        kicker="Careers"
        title="Làm việc như một leasing house, không phải sàn ca."
        desc="Ít người, quỹ nhỏ, trách nhiệm rõ. Black Panther tuyển người chịu được biên bản và khách khó tính."
        anh="/properties/mat-tien-chung-cu.jpg"
      />
      <div className="site-page">
        <div className="job-list">
          {TUYEN_DUNG.map((j) => (
            <article key={j.id} className="job-card">
              <div>
                <p className="page-kicker">{j.nhom} · {j.loai}</p>
                <h3>{j.viTri}</h3>
                <p className="muted">{j.diaDiem}</p>
                <p>{j.tomTat}</p>
                <ul className="check-list">
                  {j.yeuCau.map((x) => <li key={x}>{x}</li>)}
                </ul>
                <Link to={`/tuyen-dung/${j.id}`} className="text-link">Mở mô tả bàn →</Link>
              </div>
            </article>
          ))}
        </div>
        <div className="detail-grid" style={{ marginTop: 48 }}>
          <form className="card" onSubmit={gui}>
            <p className="page-kicker">Apply</p>
            <h3>Gửi hồ sơ về people desk</h3>
            <div className="form-grid" style={{ marginTop: 16 }}>
              <div className="field">
                <label>Họ tên</label>
                <input required value={form.ten} onChange={(e) => setForm({ ...form, ten: e.target.value })} />
              </div>
              <div className="field">
                <label>Email</label>
                <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="field">
                <label>Điện thoại</label>
                <input required value={form.sdt} onChange={(e) => setForm({ ...form, sdt: e.target.value })} />
              </div>
              <div className="field field--full">
                <label>Vị trí</label>
                <select value={form.viTri} onChange={(e) => setForm({ ...form, viTri: e.target.value })}>
                  {TUYEN_DUNG.map((j) => <option key={j.id} value={j.id}>{j.viTri}</option>)}
                </select>
              </div>
              <div className="field field--full">
                <label>Vì sao hợp desk này</label>
                <textarea rows={4} required value={form.ghiChu} onChange={(e) => setForm({ ...form, ghiChu: e.target.value })} />
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn btn--gold" type="submit" disabled={sending}>{sending ? 'Đang gửi…' : 'Gửi hồ sơ'}</button>
            </div>
          </form>
          <aside className="card">
            <h3>Cách chúng tôi tuyển</h3>
            <ul className="check-list">
              <li>Không đăng tin ồ ạt — chỉ khi bàn có chỗ</li>
              <li>Phỏng vấn tại {VAN_PHONG.diaChi}</li>
              <li>Thử việc trên quỹ thật, không kịch bản sale</li>
            </ul>
            <Link to="/ve-chung-toi" className="text-link">Đọc về Black Panther →</Link>
          </aside>
        </div>
      </div>
    </>
  )
}


