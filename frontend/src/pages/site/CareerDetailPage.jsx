import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import SiteBanner from '../../components/site/SiteBanner'
import { jobTheoId, TUYEN_DUNG, VAN_PHONG } from '../../data/listings'
import { useToast } from '../../context/ToastContext'

export default function CareerDetailPage() {
  const { id } = useParams()
  const job = jobTheoId(id)
  const toast = useToast()
  const [form, setForm] = useState({ ten: '', email: '', ghiChu: '' })

  if (!job) return <Navigate to="/tuyen-dung" replace />

  function gui(e) {
    e.preventDefault()
    toast.thanhCong('Đã nhận hồ sơ. People desk sẽ phản hồi nếu khớp bàn làm việc.')
    setForm({ ten: '', email: '', ghiChu: '' })
  }

  const khac = TUYEN_DUNG.filter((x) => x.id !== job.id)

  return (
    <>
      <SiteBanner kicker={`${job.nhom} · ${job.loai}`} title={job.viTri} desc={job.diaDiem} anh="/properties/office.jpg" compact />
      <div className="site-page">
        <p className="crumb">
          <Link to="/">Trang chủ</Link> / <Link to="/tuyen-dung">Tuyển dụng</Link> / {job.viTri}
        </p>
        <div className="detail-grid">
          <div className="card">
            <p className="lead">{job.tomTat}</p>
            <h3 style={{ marginTop: 22 }}>Yêu cầu bàn này</h3>
            <ul className="check-list">
              {job.yeuCau.map((x) => <li key={x}>{x}</li>)}
            </ul>
            <h3 style={{ marginTop: 22 }}>Cách chúng tôi tuyển</h3>
            <ul className="check-list">
              <li>Phỏng vấn tại {VAN_PHONG.diaChi}</li>
              <li>Thử việc trên quỹ thật, không kịch bản sale</li>
              <li>Không đăng tin ồ ạt — chỉ khi bàn có chỗ</li>
            </ul>
          </div>
          <form className="card" onSubmit={gui}>
            <p className="page-kicker">Apply</p>
            <h3>Gửi hồ sơ {job.viTri}</h3>
            <div className="form-grid" style={{ marginTop: 16 }}>
              <div className="field field--full">
                <label>Họ tên</label>
                <input required value={form.ten} onChange={(e) => setForm({ ...form, ten: e.target.value })} />
              </div>
              <div className="field field--full">
                <label>Email</label>
                <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="field field--full">
                <label>Vì sao hợp desk này</label>
                <textarea rows={5} required value={form.ghiChu} onChange={(e) => setForm({ ...form, ghiChu: e.target.value })} />
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn btn--gold" type="submit">Gửi people desk</button>
            </div>
          </form>
        </div>
        {khac.length > 0 && (
          <section style={{ marginTop: 48 }}>
            <p className="page-kicker">Other desks</p>
            <h2>Bàn đang mở khác</h2>
            <div className="job-list" style={{ marginTop: 16 }}>
              {khac.map((j) => (
                <Link key={j.id} to={`/tuyen-dung/${j.id}`} className="job-card">
                  <p className="page-kicker">{j.nhom} · {j.loai}</p>
                  <h3>{j.viTri}</h3>
                  <p className="muted">{j.diaDiem}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  )
}
