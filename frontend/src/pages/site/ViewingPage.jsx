import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import SiteBanner from '../../components/site/SiteBanner'
import { VAN_PHONG } from '../../data/listings'
import { useCatalog } from '../../context/CatalogContext'
import { useToast } from '../../context/ToastContext'
import { PublicYeuCauApi } from '../../api/services'
import { thongBaoLoi } from '../../api/client'

export default function ViewingPage() {
  const toast = useToast()
  const { listings: LISTINGS, listingTheoId, loading, error } = useCatalog()
  const navigate = useNavigate()
  const [sp] = useSearchParams()
  const san = sp.get('can')
  const [sending, setSending] = useState(false)
  const [ngayToiThieu] = useState(() => new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Ho_Chi_Minh' })
    .format(new Date(Date.now() + 86400000)))
  const [form, setForm] = useState({
    ten: '', sdt: '', email: '', canId: san || '', ngay: '', khung: 'sang', loiNhan: '',
  })

  const chon = listingTheoId(form.canId)

  async function gui(e) {
    e.preventDefault()
    if (sending || !chon?.nhanLich || !form.ngay) return
    setSending(true)
    try {
      const gio = { sang: '09:00:00', chieu: '14:00:00', toi: '18:00:00' }[form.khung]
      const { data } = await PublicYeuCauApi.datLich({
        listingKey: chon.id, maPhong: chon.ma,
        hoTen: form.ten.trim(), sdt: form.sdt.trim(), email: form.email.trim(),
        khungDeNghi: `${form.ngay}T${gio}`, ghiChu: form.loiNhan.trim(),
      })
      navigate(`/dat-lich/xac-nhan?ma=${data.maTraCuu}`)
    } catch (err) { toast.loi(thongBaoLoi(err)) }
    finally { setSending(false) }
  }

  return (
    <>
      <SiteBanner
        kicker="Private viewing"
        title="Đặt lịch xem nhà trong 24 giờ."
        desc={`Desk xác nhận trong ${VAN_PHONG.gio}. Penthouse chỉ mở lịch riêng.`}
        anh="/properties/studio-bep-nho.jpg"
        compact
      />
      <div className="site-page">
        {error && <p role="alert">{error}</p>}
        {loading && <p>Đang tải căn nhận lịch...</p>}
        <div className="detail-grid">
          <form className="card" onSubmit={gui}>
            <p className="page-kicker">Book a slot</p>
            <h3>Yêu cầu xem căn</h3>
            <div className="form-grid">
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
              <div className="field field--full">
                <label>Căn muốn xem</label>
                <select required value={form.canId} onChange={(e) => setForm({ ...form, canId: e.target.value })}>
                  <option value="">Chọn căn</option>
                  {LISTINGS.filter((x) => x.nhanLich).map((x) => (
                    <option key={x.id} value={x.id}>{x.ma} — {x.tieuDe}</option>
                  ))}
                </select>
              </div>
              <div className="field field--full">
                <label>Ngày muốn xem</label>
                <input type="date" required min={ngayToiThieu} value={form.ngay} onChange={(e) => setForm({ ...form, ngay: e.target.value })} />
              </div>
              <div className="field field--full">
                <label>Khung giờ ưu tiên</label>
                <select value={form.khung} onChange={(e) => setForm({ ...form, khung: e.target.value })}>
                  <option value="sang">Buổi sáng</option>
                  <option value="chieu">Buổi chiều</option>
                  <option value="toi">Sau 17:00 (T2–T6)</option>
                </select>
              </div>
              <div className="field field--full">
                <label>Ghi chú</label>
                <textarea rows={4} value={form.loiNhan} onChange={(e) => setForm({ ...form, loiNhan: e.target.value })} />
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn btn--gold" type="submit" disabled={sending || !chon?.nhanLich}>{sending ? 'Đang gửi...' : 'Gửi desk'}</button>
            </div>
          </form>
          <aside className="card">
            {chon ? (
              <>
                <p className="page-kicker">{chon.ma}</p>
                <h3>{chon.tieuDe}</h3>
                <p className="muted">{chon.diaChi}</p>
                <img className="doc-img" src={chon.anh[0]} alt="" style={{ marginTop: 14, maxHeight: 180 }} />
                <Link to={`/bat-dong-san/${chon.id}`} className="text-link">Mở hồ sơ căn →</Link>
              </>
            ) : (
              <>
                <h3>Cách desk xếp lịch</h3>
                <ul className="check-list">
                  <li>Xác nhận trong 24 giờ làm việc</li>
                  <li>Một officer dẫn xem, không nhóm đông</li>
                  <li>Căn bảo trì chỉ mở khi hoàn thiện</li>
                </ul>
                <Link to="/bat-dong-san" className="btn btn--ghost" style={{ marginTop: 12 }}>Chọn từ quỹ căn</Link>
              </>
            )}
          </aside>
        </div>
      </div>
    </>
  )
}
