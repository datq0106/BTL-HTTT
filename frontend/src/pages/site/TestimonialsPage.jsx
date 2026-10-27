import { Link } from 'react-router-dom'
import SiteBanner from '../../components/site/SiteBanner'
import { LOI_KHACH } from '../../data/listings'

export default function TestimonialsPage() {
  return (
    <>
      <SiteBanner
        kicker="House voices"
        title="Lời từ người đã ký hợp đồng."
        desc="Cư dân và chủ nhà trên quỹ Black Panther — không phải review sàn rao."
        anh="/properties/living.jpg"
        compact
      />
      <div className="site-page">
        <div className="quote-grid quote-grid--page">
          {LOI_KHACH.map((q) => (
            <blockquote key={q.ten} className="quote-card">
              <p>“{q.noi}”</p>
              <footer>
                <strong>{q.ten}</strong>
                <span>{q.vai}</span>
              </footer>
            </blockquote>
          ))}
        </div>
        <div className="cta-band cta-band--flush">
          <div>
            <p className="page-kicker">Next</p>
            <h2>Muốn cùng giọng này trên căn của bạn?</h2>
          </div>
          <div className="stack-btns">
            <Link to="/dat-lich" className="btn btn--gold">Đặt lịch xem</Link>
            <Link to="/chu-nha" className="btn btn--ghost">Gửi căn vào quỹ</Link>
          </div>
        </div>
      </div>
    </>
  )
}


