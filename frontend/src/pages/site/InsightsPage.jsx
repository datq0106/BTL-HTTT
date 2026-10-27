import { Link } from 'react-router-dom'
import SiteBanner from '../../components/site/SiteBanner'
import { TIN_THI_TRUONG } from '../../data/listings'

export default function InsightsPage() {
  return (
    <>
      <SiteBanner
        kicker="Research desk"
        title="Ghi chép thị trường thuê."
        desc="Không phải tin rao. Đây là brief nội bộ Black Panther gửi khách và chủ nhà — ngắn, có địa bàn, có hàm ý định giá."
        anh="/properties/office.jpg"
      />
      <div className="site-page">
        <div className="insight-grid">
          {TIN_THI_TRUONG.map((b) => (
            <Link key={b.id} to={`/thi-truong/${b.id}`} className="insight-card">
              <div className="insight-card__media">
                <img src={b.anh} alt="" />
              </div>
              <div className="insight-card__body">
                <p className="page-kicker">{b.nhan}</p>
                <time className="muted">{new Date(b.ngay).toLocaleDateString('vi-VN')}</time>
                <h3>{b.tieu}</h3>
                <p>{b.tomTat}</p>
              </div>
            </Link>
          ))}
        </div>
        <div className="cta-band cta-band--flush">
          <div>
            <p className="page-kicker">Advisory</p>
            <h2>Cần định giá căn của bạn?</h2>
            <p>Leasing desk đối chiếu occupancy khu vực và đề xuất mức niêm yết trong 48 giờ.</p>
          </div>
          <Link to="/lien-he" className="btn btn--gold">Gặp advisor</Link>
        </div>
      </div>
    </>
  )
}


