import { Link } from 'react-router-dom'
import SiteBanner from '../../components/site/SiteBanner'
import { DOI_NGU, VAN_PHONG } from '../../data/listings'

export default function AdvisorsPage() {
  return (
    <>
      <SiteBanner
        kicker="The desk"
        title="Advisor phụ trách quỹ, không phải sale ca."
        desc="Mỗi người một địa bàn. Họ dẫn xem, soạn hợp đồng và theo gia hạn — cùng một giọng Black Panther."
        anh="/properties/office.jpg"
      />
      <div className="site-page">
        <div className="advisor-stack">
          {DOI_NGU.map((p) => (
            <article key={p.id} className="advisor-row">
              <img src={p.anh} alt="" />
              <div>
                <p className="page-kicker">{p.chucVu} · {p.nam}</p>
                <h2>{p.ten}</h2>
                <p className="lead">{p.bio}</p>
                <p className="muted">{p.khu}</p>
                <p className="muted">{p.email}</p>
                <Link to={`/doi-ngu/${p.id}`} className="btn btn--ghost btn--sm" style={{ marginTop: 12 }}>Hồ sơ advisor</Link>
              </div>
            </article>
          ))}
        </div>
        <div className="cta-band cta-band--flush">
          <div>
            <p className="page-kicker">Enquire</p>
            <h2>Gặp đúng người phụ trách địa bàn.</h2>
            <p>Gọi {VAN_PHONG.dienThoai} hoặc để lại yêu cầu — desk chuyển nội bộ, không qua tổng đài ảo.</p>
          </div>
          <Link to="/lien-he" className="btn btn--gold">Gửi yêu cầu</Link>
        </div>
      </div>
    </>
  )
}


