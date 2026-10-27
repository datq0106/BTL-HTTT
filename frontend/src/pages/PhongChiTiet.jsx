import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { PhongApi } from '../api/services'
import { thongBaoLoi } from '../api/client'
import { tien } from '../utils/format'
import { Badge, PageHead } from '../components/ui'
import { useToast } from '../context/ToastContext'

const ANH = [
  '/properties/01.jpg',
  '/properties/02.jpg',
  '/properties/living.jpg',
  '/properties/kitchen.jpg',
  '/properties/interior.jpg',
  '/properties/07.jpg',
]

export default function PhongChiTiet() {
  const { id } = useParams()
  const toast = useToast()
  const [p, setP] = useState(null)

  useEffect(() => {
    PhongApi.chiTiet(id).then((r) => setP(r.data)).catch((e) => toast.loi(thongBaoLoi(e)))
  }, [id, toast])

  if (!p) return <div className="empty">Đang mở hồ sơ phòng…</div>
  const anh = ANH[Number(p.id) % ANH.length]

  return (
    <>
      <PageHead
        kicker="Room file"
        title={p.maPhong}
        desc={<Link to="/quan-ly/phong">← Quỹ phòng</Link>}
      >
        <Badge nhom="phong" ma={p.trangThai} />
      </PageHead>
      <div className="detail-grid">
        <div className="card">
          <img className="doc-img" src={anh} alt="" style={{ maxHeight: 280, marginBottom: 18 }} />
          <h3>Hồ sơ vận hành</h3>
          <dl className="kv">
            <dt>Loại</dt><dd>{p.tenLoai}</dd>
            <dt>Tầng</dt><dd>{p.tang}</dd>
            <dt>Diện tích</dt><dd>{p.dienTich ? `${p.dienTich} m²` : '—'}</dd>
            <dt>Giá thuê</dt><dd>{tien(p.giaThue)}</dd>
            <dt>Tiện nghi</dt><dd>{p.tienNghi || '—'}</dd>
            <dt>Ghi chú</dt><dd>{p.ghiChu || '—'}</dd>
          </dl>
        </div>
        <aside className="card">
          <p className="page-kicker">Occupancy</p>
          <h3>{p.tenKhachDangThue || 'Chưa có khách'}</h3>
          {p.hopDongId ? (
            <Link to={`/quan-ly/hop-dong/${p.hopDongId}`} className="btn btn--gold btn--sm">Mở hợp đồng</Link>
          ) : (
            <Link to="/quan-ly/hop-dong" className="btn btn--ghost btn--sm">Sổ leasing</Link>
          )}
        </aside>
      </div>
    </>
  )
}
