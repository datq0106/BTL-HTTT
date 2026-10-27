import { Link, Navigate, useParams } from 'react-router-dom'
import SiteBanner from '../../components/site/SiteBanner'
import { DICH_VU, dichVuTheoId } from '../../data/listings'

export default function ServiceDetailPage() {
  const { id } = useParams()
  const d = dichVuTheoId(id)
  if (!d) return <Navigate to="/dich-vu" replace />
  const idx = DICH_VU.findIndex((x) => x.id === d.id)
  const cta = d.id === 'resident'
    ? { to: '/dang-nhap', label: 'Vào cổng cư dân' }
    : d.id === 'advisory'
      ? { to: '/chu-nha', label: 'Gửi căn vào quỹ' }
      : { to: '/lien-he', label: 'Gặp leasing desk' }

  return (
    <>
      <SiteBanner kicker={`0${idx + 1} · Practice`} title={d.tieu} desc={d.moTa} anh={d.anh} />
      <div className="site-page">
        <p className="crumb">
          <Link to="/">Trang chủ</Link> / <Link to="/dich-vu">Dịch vụ</Link> / {d.tieu}
        </p>
        <div className="split">
          <div>
            <p className="page-kicker">Mandate</p>
            <h2>Việc desk cam kết trên hạng mục này</h2>
            <ul className="check-list">
              {d.diem.map((x) => <li key={x}>{x}</li>)}
            </ul>
            <Link to={cta.to} className="btn btn--gold">{cta.label}</Link>
          </div>
          <div className="split-photo">
            <img src={d.anh} alt="" />
          </div>
        </div>
        <div className="section-head" style={{ marginTop: 56 }}>
          <div>
            <p className="page-kicker">Also on the mandate</p>
            <h2>Ba việc còn lại</h2>
          </div>
        </div>
        <div className="service-grid">
          {DICH_VU.filter((x) => x.id !== d.id).map((x, i) => (
            <Link key={x.id} to={`/dich-vu/${x.id}`} className="service-card">
              <span className="page-kicker">0{i + 1}</span>
              <h3>{x.tieu}</h3>
              <p className="muted">{x.moTa}</p>
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}
