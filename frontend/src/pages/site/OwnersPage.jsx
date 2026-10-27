import { useState } from 'react'
import { Link } from 'react-router-dom'
import SiteBanner from '../../components/site/SiteBanner'
import { KHU_VUC, VAN_PHONG } from '../../data/listings'
import { useToast } from '../../context/ToastContext'
import { themYeuCau } from '../../utils/yeuCauStore'

const BUOC = [
  { so: '01', tieu: 'Gửi hồ sơ căn', moTa: 'Địa chỉ, loại, hiện trạng. Desk hẹn khảo sát trong 48 giờ làm việc.' },
  { so: '02', tieu: 'Khảo sát 42 mục', moTa: 'Đo đạc, chụp, pháp lý. Chỉ nhận căn đạt chuẩn quỹ.' },
  { so: '03', tieu: 'Niêm yết một giá', moTa: 'Cùng mức trên website và mọi kênh. Không cắt giá lén.' },
  { so: '04', tieu: 'Bàn giao & occupancy', moTa: 'Hợp đồng, cọc, báo cáo quý. Officer phụ trách tới gia hạn.' },
]

export default function OwnersPage() {
  const toast = useToast()
  const [form, setForm] = useState({
    ten: '', sdt: '', email: '', khu: '', loai: 'Căn hộ', giaMong: '', ghiChu: '',
  })

  function gui(e) {
    e.preventDefault()
    themYeuCau({
      nguon: 'khach_ngoai',
      chuDe: 'khac',
      tieuDe: `[Chủ nhà] Ký gửi căn hộ (${form.khu || 'Hà Nội'})`,
      hoTen: form.ten.trim(),
      sdt: form.sdt.trim(),
      email: form.email.trim(),
      mucDo: 'binh_thuong',
      noiDung: `Loại BĐS: ${form.loai}. Khu vực: ${form.khu}. Giá mong muốn: ${form.giaMong || 'Thương lượng'}. Ghi chú: ${form.ghiChu || 'Không có'}`,
    })
    toast.thanhCong('Đã nhận hồ sơ căn. Asset desk sẽ liên hệ để hẹn khảo sát.')
    setForm({ ten: '', sdt: '', email: '', khu: '', loai: 'Căn hộ', giaMong: '', ghiChu: '' })
  }

  return (
    <>
      <SiteBanner
        kicker="For owners"
        title="Đưa căn vào quỹ, không phải lên sàn rao."
        desc="Black Panther nhận độc quyền leasing tối thiểu 12 tháng. Ít căn, hồ sơ đủ, occupancy chịu trách nhiệm."
        anh="/properties/hero.jpg"
      />
      <div className="site-page">
        <div className="stat-row">
          <div className="stat-lite"><strong>12 tháng</strong><span>Độc quyền tối thiểu</span></div>
          <div className="stat-lite"><strong>42</strong><span>Hạng mục khảo sát</span></div>
          <div className="stat-lite"><strong>48h</strong><span>Hẹn khảo sát</span></div>
          <div className="stat-lite"><strong>98%</strong><span>Tỷ lệ gia hạn quỹ</span></div>
        </div>

        <p className="page-kicker" style={{ marginTop: 48 }}>Mandate</p>
        <h2>Quy trình nhận căn</h2>
        <div className="step-grid" style={{ marginTop: 18, marginBottom: 48 }}>
          {BUOC.map((b) => (
            <article key={b.so} className="card">
              <span className="page-kicker">{b.so}</span>
              <h3>{b.tieu}</h3>
              <p className="muted">{b.moTa}</p>
            </article>
          ))}
        </div>

        <div className="detail-grid">
          <form className="card" onSubmit={gui}>
            <p className="page-kicker">List with us</p>
            <h3>Gửi căn để khảo sát</h3>
            <div className="form-grid">
              <div className="field">
                <label>Họ tên chủ nhà</label>
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
                <label>Khu vực</label>
                <select required value={form.khu} onChange={(e) => setForm({ ...form, khu: e.target.value })}>
                  <option value="">Chọn khu</option>
                  {KHU_VUC.map((k) => <option key={k.id} value={k.id}>{k.ten}</option>)}
                </select>
              </div>
              <div className="field">
                <label>Loại căn</label>
                <select value={form.loai} onChange={(e) => setForm({ ...form, loai: e.target.value })}>
                  <option>Căn hộ</option>
                  <option>Loft</option>
                  <option>Penthouse</option>
                  <option>Nhà phố</option>
                  <option>Studio</option>
                </select>
              </div>
              <div className="field field--full">
                <label>Mức thuê kỳ vọng / tháng</label>
                <input value={form.giaMong} onChange={(e) => setForm({ ...form, giaMong: e.target.value })} placeholder="Ví dụ 28.000.000" />
              </div>
              <div className="field field--full">
                <label>Địa chỉ & hiện trạng</label>
                <textarea rows={4} required value={form.ghiChu} onChange={(e) => setForm({ ...form, ghiChu: e.target.value })} />
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn btn--gold" type="submit">Gửi asset desk</button>
            </div>
          </form>
          <aside className="card">
            <h3>Điều kiện nhận quỹ</h3>
            <ul className="check-list">
              <li>Pháp lý rõ, không tranh chấp cho thuê</li>
              <li>Hiện trạng khớp ảnh sau khi Black Panther chụp</li>
              <li>Độc quyền niêm yết tối thiểu 12 tháng</li>
              <li>Bàn giao có biên bản, không “xem xong tự vào”</li>
            </ul>
            <p className="muted">{VAN_PHONG.diaChi}</p>
            <Link to="/thi-truong" className="text-link" style={{ display: 'inline-block', marginTop: 12 }}>
              Đọc brief định giá khu vực →
            </Link>
          </aside>
        </div>
      </div>
    </>
  )
}


