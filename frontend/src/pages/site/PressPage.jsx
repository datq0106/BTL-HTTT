import { Link } from 'react-router-dom'
import SiteBanner from '../../components/site/SiteBanner'
import { BAO_CHI, BAO_CHI_BAI } from '../../data/listings'

export default function PressPage() {
  return (
    <>
      <SiteBanner
        kicker="Press room"
        title="Được trích dẫn, không phải tự khen."
        desc="Black Panther xuất hiện khi các desk nghiên cứu nói về thuê dịch vụ Hà Nội — không phải advertorial."
        anh="/properties/04.jpg"
        compact
      />
      <div className="site-page">
        <div className="press-strip press-strip--page">
          {BAO_CHI.map((t) => <strong key={t}>{t}</strong>)}
        </div>
        <div className="press-grid">
          {BAO_CHI_BAI.map((b) => (
            <article key={b.id} className="press-card">
              <p className="page-kicker">{b.nguon} · {b.nam}</p>
              <h3>{b.tieu}</h3>
              <blockquote>“{b.trich}”</blockquote>
            </article>
          ))}
        </div>
        <div className="cta-band cta-band--flush">
          <div>
            <p className="page-kicker">Research</p>
            <h2>Đọc brief thị trường của chính desk.</h2>
          </div>
          <Link to="/thi-truong" className="btn btn--gold">Ghi chép thị trường</Link>
        </div>
      </div>
    </>
  )
}


