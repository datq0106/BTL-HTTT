import { Link, Navigate, useParams } from 'react-router-dom'
import PropertyCard from '../../components/site/PropertyCard'
import SiteBanner from '../../components/site/SiteBanner'
import { khuVucTheoId, locListings } from '../../data/listings'
import { tien } from '../../utils/format'

export default function DistrictDetailPage() {
  const { id } = useParams()
  const khu = khuVucTheoId(id)
  if (!khu) return <Navigate to="/khu-vuc" replace />
  const ds = locListings({ khuVuc: khu.id })

  return (
    <>
      <SiteBanner
        kicker="District brief"
        title={khu.ten}
        desc={khu.moTa}
        anh={khu.anh}
        compact
      />
      <div className="site-page">
        <p className="crumb">
          <Link to="/">Trang chủ</Link> / <Link to="/khu-vuc">Khu vực</Link> / {khu.ten}
        </p>
        <div className="stat-row">
          <div className="stat-lite"><strong>{ds.length}</strong><span>Căn trong quỹ</span></div>
          <div className="stat-lite"><strong>{tien(khu.giaTu)}</strong><span>Từ</span></div>
          <div className="stat-lite"><strong>{tien(khu.giaDen)}</strong><span>Đến</span></div>
          <div className="stat-lite"><strong>12 th</strong><span>Kỳ hạn gợi ý</span></div>
        </div>
        <div className="split" style={{ margin: '40px 0' }}>
          <div>
            <p className="page-kicker">Who rents here</p>
            <h2>Khách điển hình</h2>
            <p className="lead">{khu.khach}</p>
            <ul className="check-list">
              {khu.dacDiem.map((x) => <li key={x}>{x}</li>)}
            </ul>
            <Link to={`/bat-dong-san?khu=${khu.id}`} className="btn btn--gold">Lọc quỹ theo {khu.ten}</Link>
          </div>
          <div className="split-photo">
            <img src={khu.anh} alt={khu.ten} />
          </div>
        </div>
        <div className="section-head">
          <div>
            <p className="page-kicker">Inventory</p>
            <h2>Căn đang vận hành tại {khu.ten}</h2>
          </div>
        </div>
        {ds.length === 0 ? (
          <div className="card"><p className="empty">Chưa có căn mở tại khu này.</p></div>
        ) : (
          <div className="prop-grid">
            {ds.map((item) => <PropertyCard key={item.id} item={item} />)}
          </div>
        )}
      </div>
    </>
  )
}
