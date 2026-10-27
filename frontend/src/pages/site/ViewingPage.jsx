import { useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import SiteBanner from '../../components/site/SiteBanner'
import { LISTINGS, listingTheoId, VAN_PHONG } from '../../data/listings'
import { useToast } from '../../context/ToastContext'
import { themYeuCau } from '../../utils/yeuCauStore'

export default function ViewingPage() {
  const toast = useToast()
  const navigate = useNavigate()
  const [sp] = useSearchParams()
  const san = sp.get('can')
  const [form, setForm] = useState({
    ten: '', sdt: '', email: '', canId: san && listingTheoId(san) ? san : '', khung: 'sang', loiNhan: '',
  })

  const chon = useMemo(() => listingTheoId(form.canId), [form.canId])

  function gui(e) {
    e.preventDefault()
    themYeuCau({
      nguon: 'khach_ngoai',
      chuDe: 'xem-phong',
      tieuDe: `Đăng ký xem căn ${chon ? chon.ma : (form.canId || 'Căn hộ')}`,
      hoTen: form.ten.trim(),
      sdt: form.sdt.trim(),
      email: form.email.trim(),
      maPhong: chon?.ma || '',
      mucDo: 'binh_thuong',
      noiDung: `Khách đăng ký xem căn vào khung giờ: ${form.khung === 'sang' ? 'Sáng (09:00 - 11:30)' : form.khung === 'chieu' ? 'Chiều (14:00 - 17:00)' : 'Cuối tuần'}. Ghi chú: ${form.loiNhan || 'Không có'}`,
    })
    toast.thanhCong('Đã đặt lịch. Officer sẽ xác nhận khung giờ trong 24 giờ làm việc.')
    navigate('/dat-lich/xac-nhan', { state: { ten: form.ten, loai: 'xem' } })
  }

  return (
    <>
      <SiteBanner
        kicker="Private viewing"
        title="Đặt lịch xem nhà trong 24 giờ."
        desc={`Desk xác nhận trong ${VAN_PHONG.gio}. Penthouse chỉ mở lịch riêng.`}
        anh="/properties/06.jpg"
        compact
      />
      <div className="site-page">
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
                  {LISTINGS.map((x) => (
                    <option key={x.id} value={x.id}>{x.ma} — {x.tieuDe}</option>
                  ))}
                </select>
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
              <button className="btn btn--gold" type="submit">Gửi desk</button>
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
