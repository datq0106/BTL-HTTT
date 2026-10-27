import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import SiteBanner from '../../components/site/SiteBanner'
import { DOI_NGU, KHU_VUC, VAN_PHONG } from '../../data/listings'
import { useToast } from '../../context/ToastContext'
import { themYeuCau } from '../../utils/yeuCauStore'

export default function BriefPage() {
  const toast = useToast()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    ten: '', sdt: '', email: '', khu: '', pn: '', nganSach: '', thoiHan: '12', ghiChu: '',
  })

  function gui(e) {
    e.preventDefault()
    themYeuCau({
      nguon: 'khach_ngoai',
      chuDe: 'xem-phong',
      tieuDe: `[Tìm căn] Yêu cầu tìm căn theo ngân sách (${form.khu || 'Hà Nội'})`,
      hoTen: form.ten.trim(),
      sdt: form.sdt.trim(),
      email: form.email.trim(),
      mucDo: 'binh_thuong',
      noiDung: `Khu vực: ${form.khu || 'Tùy chọn'}. Số PN: ${form.pn || 'Tùy ý'}. Ngân sách: ${form.nganSach || 'Thương lượng'}. Thời hạn: ${form.thoiHan} tháng. Ghi chú: ${form.ghiChu || 'Không có'}`,
    })
    toast.thanhCong('Đã nhận brief. Officer địa bàn sẽ gọi trong giờ hành chính.')
    navigate('/dat-lich/xac-nhan', {
      state: {
        loai: 'brief',
        ten: form.ten,
        moTa: 'Desk sẽ ghép căn khớp ngân sách trước khi mở lịch xem.',
      },
    })
  }

  return (
    <>
      <SiteBanner
        kicker="Private brief"
        title="Để desk lọc căn trước khi bạn xem."
        desc="Không inbox môi giới. Một officer đọc nhu cầu, chỉ mở lịch với căn khớp."
        anh="/properties/office.jpg"
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
              <button className="btn btn--gold" type="submit">Gửi brief</button>
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
