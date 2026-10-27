import { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { listingTheoId, listingsTuongTu, KHU_VUC, VAN_PHONG } from '../../data/listings'
import { tien } from '../../utils/format'
import { Badge } from '../../components/ui'
import { useToast } from '../../context/ToastContext'
import PropertyCard from '../../components/site/PropertyCard'
import FloorPlan from '../../components/site/FloorPlan'
import { useShortlist } from '../../context/ShortlistContext'
import { Icon } from '../../components/icons'
import { themYeuCau } from '../../utils/yeuCauStore'

export default function PropertyDetailPage() {
  const { id } = useParams()
  const item = listingTheoId(id)
  const toast = useToast()
  const { dao, coTrong, them } = useShortlist()
  const [anh, setAnh] = useState(0)
  const [form, setForm] = useState({ ten: '', sdt: '', email: '', loiNhan: '' })

  useEffect(() => { setAnh(0) }, [id])

  if (!item) return <Navigate to="/bat-dong-san" replace />
  const khu = KHU_VUC.find((k) => k.id === item.khuVuc)
  const tuongTu = listingsTuongTu(item)

  function gui(e) {
    e.preventDefault()
    themYeuCau({
      nguon: 'khach_ngoai',
      chuDe: 'xem-phong',
      tieuDe: `Khách hỏi thuê căn ${item.ma} - ${item.tieuDe}`,
      hoTen: form.ten.trim(),
      sdt: form.sdt.trim(),
      email: form.email.trim(),
      maPhong: item.ma,
      mucDo: 'binh_thuong',
      noiDung: form.loiNhan.trim() || `Khách quan tâm căn hộ ${item.ma} (${item.giaNiemYet} triệu/tháng). Cần tư vấn xem phòng.`,
    })
    toast.thanhCong('Đã gửi yêu cầu tới Leasing Desk. Đội ngũ sẽ liên hệ trong giờ hành chính.')
    setForm({ ten: '', sdt: '', email: '', loiNhan: '' })
  }

  return (
    <div className="site-page">
      <p className="crumb">
        <Link to="/">Trang chủ</Link> / <Link to="/bat-dong-san">Quỹ căn</Link> / {item.ma}
      </p>
      <div className="detail-hero">
        <div className="detail-gallery">
          <img src={item.anh[anh]} alt={item.tieuDe} />
          {item.anh.length > 1 && (
            <div className="thumbs">
              {item.anh.map((src, i) => (
                <button key={src} type="button" className={i === anh ? 'on' : ''} onClick={() => setAnh(i)}>
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
          <h3>Đặt lịch xem nhà</h3>
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
          <button className="btn btn--gold" type="submit" style={{ width: '100%', justifyContent: 'center' }}>Gửi yêu cầu</button>
          <p className="muted" style={{ marginTop: 10, textAlign: 'center' }}>
            <Link to={`/dat-lich?can=${item.id}`} className="text-link">Hoặc mở form đặt lịch đầy đủ</Link>
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
