import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { PhongApi, TinDangApi } from '../../api/services'
import { thongBaoLoi } from '../../api/client'
import { nhan, tien } from '../../utils/format'
import { Badge, PageHead } from '../../components/ui'
import { useToast } from '../../context/ToastContext'

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
  const [tin, setTin] = useState(undefined)

  useEffect(() => {
    PhongApi.chiTiet(id).then((r) => setP(r.data)).catch((e) => toast.loi(thongBaoLoi(e)))
    TinDangApi.danhSach({ phongId: id, kichThuoc: 1 })
      .then((r) => setTin(r.data.noiDung?.[0] || null)).catch(() => setTin(null))
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
          <p className="page-kicker" style={{ marginTop: 28 }}>Website</p>
          {tin === undefined ? <p className="muted">Đang kiểm tra tin đăng…</p> : tin ? (
            <>
              <h3>{tin.ma} <Badge nhom="tinDang" ma={tin.trangThaiTin} /></h3>
              <p className="muted">Website hiển thị trạng thái “{nhan('phong', tin.trangThai)}” theo phòng này
                {tin.nhanLich ? ' và đang nhận lịch xem.' : '; căn không nhận lịch xem.'}</p>
              <div className="row-actions">
                <Link to={`/quan-ly/tin-dang?q=${encodeURIComponent(tin.ma)}`} className="btn btn--ghost btn--sm">Quản lý tin</Link>
                {tin.trangThaiTin === 'xuat_ban' && (
                  <a href={`/bat-dong-san/${tin.id}`} target="_blank" rel="noreferrer" className="btn btn--ghost btn--sm">Xem trên website</a>
                )}
              </div>
            </>
          ) : (
            <>
              <p className="muted">Phòng chưa được đăng lên website.</p>
              <Link to={`/quan-ly/tin-dang?phong=${p.id}`} className="btn btn--gold btn--sm">Đăng tin</Link>
            </>
          )}
        </aside>
      </div>
    </>
  )
}
