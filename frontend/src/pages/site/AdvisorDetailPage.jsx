import { Link, Navigate, useParams } from 'react-router-dom'
import SiteBanner from '../../components/site/SiteBanner'
import PropertyCard from '../../components/site/PropertyCard'
import { doiNguTheoId, listingsTheoAdvisor, VAN_PHONG } from '../../data/listings'

export default function AdvisorDetailPage() {
  const { id } = useParams()
  const p = doiNguTheoId(id)
  if (!p) return <Navigate to="/doi-ngu" replace />
  const ds = listingsTheoAdvisor(p)

  return (
    <>
      <SiteBanner kicker={p.chucVu} title={p.ten} desc={`${p.khu} · ${p.nam} trên bàn Black Panther.`} anh={p.anh} compact />
      <div className="site-page">
        <p className="crumb">
          <Link to="/">Trang chủ</Link> / <Link to="/doi-ngu">Đội ngũ</Link> / {p.ten}
        </p>
        <div className="split">
          <div className="split-photo">
            <img src={p.anh} alt={p.ten} />
          </div>
          <div>
            <p className="page-kicker">{p.nam} desk</p>
            <h2>Cách {p.ten.split(' ').slice(-1)[0]} phụ trách quỹ</h2>
            <p className="lead">{p.bio}</p>
            <dl className="kv">
              <dt>Địa bàn</dt><dd>{p.khu}</dd>
              <dt>Email</dt><dd>{p.email}</dd>
              <dt>Văn phòng</dt><dd>{VAN_PHONG.diaChi}</dd>
            </dl>
            <div className="stack-btns">
              <Link to={`/lien-he`} className="btn btn--gold">Gửi yêu cầu cho desk</Link>
              <a className="btn btn--ghost" href={`mailto:${p.email}`}>Email trực tiếp</a>
            </div>
          </div>
        </div>
        <div className="section-head" style={{ marginTop: 48 }}>
          <div>
            <p className="page-kicker">Mandate</p>
            <h2>Căn trên địa bàn phụ trách</h2>
          </div>
          <Link to="/bat-dong-san" className="btn btn--ghost">Toàn bộ quỹ</Link>
        </div>
        {ds.length === 0 ? (
          <div className="card"><p className="empty">Chưa gắn căn trên địa bàn này.</p></div>
        ) : (
          <div className="prop-grid">
            {ds.map((item) => <PropertyCard key={item.id} item={item} />)}
          </div>
        )}
      </div>
    </>
  )
}


