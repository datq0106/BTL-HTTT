import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { VAN_PHONG } from '../../data/listings'
import { useCatalog } from '../../context/CatalogContext'
import { PublicTinDangApi } from '../../api/services'
import { tien } from '../../utils/format'
import { Badge } from '../../components/ui'
import { useToast } from '../../context/ToastContext'
import PropertyCard from '../../components/site/PropertyCard'
import FloorPlan from '../../components/site/FloorPlan'
import { useShortlist } from '../../context/ShortlistContext'
import { Icon } from '../../components/icons'
import { PublicYeuCauApi } from '../../api/services'
import { thongBaoLoi } from '../../api/client'

export default function PropertyDetailPage() {
  const { id } = useParams()
  const { khuVuc: KHU_VUC } = useCatalog()
  const [item, setItem] = useState(null)
  const [tuongTu, setTuongTu] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const toast = useToast()
  const navigate = useNavigate()
  const { dao, coTrong, them } = useShortlist()
  const [anh, setAnh] = useState({ id, index: 0 })
  const anhHienTai = anh.id === id ? anh.index : 0
  const [sending, setSending] = useState(false)
  const [form, setForm] = useState({ ten: '', sdt: '', email: '', loiNhan: '' })

  useEffect(() => {
    let active = true
    setLoading(true)
    setItem(null)
    setAnh({ id, index: 0 })
    Promise.all([PublicTinDangApi.chiTiet(id), PublicTinDangApi.tuongTu(id)])
      .then(([main, related]) => { if (active) { setItem(main.data); setTuongTu(related.data || []); setError('') } })
      .catch((err) => { if (active) setError(err?.response?.status === 404 ? 'Tin đăng không tồn tại hoặc đã được ẩn.' : thongBaoLoi(err)) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [id])

  if (loading) return <div className="site-page"><p>Đang tải hồ sơ căn...</p></div>
  if (!item) return <div className="site-page"><p role="alert">{error}</p><Link to="/bat-dong-san">Xem quỹ căn</Link></div>
  const khu = KHU_VUC.find((k) => k.id === item.khuVuc)

  async function gui(e) {
    e.preventDefault()
    if (sending) return
    setSending(true)
    try {
      const { data } = await PublicYeuCauApi.gui({
        chuDe: 'quan-tam', tieuDe: `Quan tâm căn ${item.ma} - ${item.tieuDe}`,
        hoTen: form.ten.trim(), sdt: form.sdt.trim(), email: form.email.trim(),
        maPhong: item.ma, listingKey: item.id,
        noiDung: form.loiNhan.trim() || `Cần tư vấn căn ${item.ma}`,
      })
      navigate(`/dat-lich/xac-nhan?ma=${data.maTraCuu}`)
    } catch (err) { toast.loi(thongBaoLoi(err)) }
    finally { setSending(false) }
  }

  return (
    <div className="site-page">
      <p className="crumb">
        <Link to="/">Trang chủ</Link> / <Link to="/bat-dong-san">Quỹ căn</Link> / {item.ma}
      </p>
      <div className="detail-hero">
        <div className="detail-gallery">
          <img src={item.anh[anhHienTai]} alt={item.tieuDe} />
          {item.anh.length > 1 && (
            <div className="thumbs">
              {item.anh.map((src, i) => (
                <button key={src} type="button" className={i === anhHienTai ? 'on' : ''} onClick={() => setAnh({ id, index: i })}>
                  <img src={src} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>
        <aside className="detail-side">
          <p className="page-kicker">{khu?.ten} · {item.loai}</p>
          <h1>{item.tieuDe}</h1>
          <p className="muted">{item.diaChi}</p>
          <div className="price-block">
            <strong>{tien(item.gia)}</strong>
            <span>/ tháng</span>
          </div>
          <Badge nhom="phong" ma={item.trangThai} />
          <div className="stack-btns" style={{ margin: '14px 0' }}>
            <button type="button" className={`btn btn--ghost btn--sm ${coTrong(item.id) ? 'btn--gold' : ''}`} onClick={() => dao(item.id)}>
              <Icon name="heart" size={14} /> {coTrong(item.id) ? 'Đã lưu' : 'Lưu căn'}
            </button>
            <button
              type="button"
              className="btn btn--ghost btn--sm"
              onClick={() => {
                them(item.id)
                toast.thanhCong('Đã thêm vào danh sách để so sánh.')
              }}
            >
              <Icon name="columns" size={14} /> So sánh
            </button>
            <button
              type="button"
              className="btn btn--ghost btn--sm"
              onClick={async () => {
                const url = window.location.href
                try {
                  await navigator.clipboard.writeText(url)
                  toast.thanhCong('Đã sao chép đường dẫn hồ sơ căn.')
                } catch {
                  toast.loi('Không sao chép được. Hãy copy từ thanh địa chỉ.')
                }
              }}
            >
              Sao chép link
            </button>
          </div>
          <ul className="prop-specs prop-specs--block">
            <li>{item.phongNgu === 0 ? 'Studio' : `${item.phongNgu} phòng ngủ`}</li>
            <li>{item.phongTam} phòng tắm</li>
            <li>{item.dienTich} m²</li>
            <li>Tầng {item.tang}</li>
          </ul>
          <dl className="kv">
            <dt>Mã căn</dt><dd>{item.ma}</dd>
            <dt>Đặt cọc</dt><dd>{tien(item.datCoc)}</dd>
            <dt>Hotline</dt><dd>{VAN_PHONG.dienThoai}</dd>
          </dl>
        </aside>
      </div>

      <div className="detail-grid" style={{ marginTop: 28 }}>
        <div className="card">
          <h3>Hồ sơ căn</h3>
          <p>{item.moTa}</p>
          <h3 style={{ marginTop: 22 }}>Thông số</h3>
          <table className="spec-table">
            <tbody>
              <tr><th>Loại</th><td>{item.loai}</td></tr>
              <tr><th>Diện tích</th><td>{item.dienTich} m² thông thủy</td></tr>
              <tr><th>Phòng ngủ / WC</th><td>{item.phongNgu === 0 ? 'Studio' : item.phongNgu} / {item.phongTam}</td></tr>
              <tr><th>Tầng</th><td>{item.tang}</td></tr>
              <tr><th>Kỳ hạn gợi ý</th><td>12 tháng, gia hạn trước 60 ngày</td></tr>
            </tbody>
          </table>
          <h3 style={{ marginTop: 22 }}>Tiện nghi</h3>
          <ul className="check-list">
            {item.tienNghi.map((t) => <li key={t}>{t}</li>)}
          </ul>
          <h3 style={{ marginTop: 22 }}>Chi phí tháng (ước tính desk)</h3>
          <table className="spec-table">
            <tbody>
              <tr><th>Thuê niêm yết</th><td>{tien(item.gia)} — đã gồm phí quản lý tòa</td></tr>
              <tr><th>Điện nước</th><td>Theo đồng hồ, thanh toán riêng</td></tr>
              <tr><th>Cọc giữ chỗ</th><td>{tien(item.datCoc)} · hoàn khi thanh lý đúng biên bản</td></tr>
            </tbody>
          </table>
          <h3 style={{ marginTop: 22 }}>Sơ đồ minh họa</h3>
          <FloorPlan item={item} />
        </div>
        <form className="card enquire enquire--sticky" onSubmit={gui}>
          <p className="page-kicker">Private viewing</p>
          <h3>Hỏi về căn này</h3>
          <p className="muted">Leasing officer xác nhận trong {VAN_PHONG.gio}.</p>
          <div className="field">
            <label>Họ tên</label>
            <input required value={form.ten} onChange={(e) => setForm({ ...form, ten: e.target.value })} />
          </div>
          <div className="field">
            <label>Điện thoại</label>
            <input required value={form.sdt} onChange={(e) => setForm({ ...form, sdt: e.target.value })} />
          </div>
          <div className="field">
            <label>Email</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="field">
            <label>Ghi chú</label>
            <textarea rows={3} value={form.loiNhan} onChange={(e) => setForm({ ...form, loiNhan: e.target.value })} placeholder="Khung giờ muốn xem…" />
          </div>
          <button className="btn btn--gold" type="submit" disabled={sending} style={{ width: '100%', justifyContent: 'center' }}>{sending ? 'Đang gửi...' : 'Gửi yêu cầu'}</button>
          <p className="muted" style={{ marginTop: 10, textAlign: 'center' }}>
            {item.nhanLich ? <Link to={`/dat-lich?can=${item.id}`} className="text-link">Hoặc mở form đặt lịch đầy đủ</Link> : 'Căn hiện chưa nhận lịch xem.'}
          </p>
        </form>
      </div>

      {tuongTu.length > 0 && (
        <section style={{ marginTop: 48 }}>
          <div className="section-head">
            <div>
              <p className="page-kicker">Similar stock</p>
              <h2>Căn cùng khu hoặc cùng loại</h2>
            </div>
            <Link to="/bat-dong-san" className="btn btn--ghost">Quỹ đầy đủ</Link>
          </div>
          <div className="prop-grid">
            {tuongTu.map((x) => <PropertyCard key={x.id} item={x} />)}
          </div>
        </section>
      )}
    </div>
  )
}
