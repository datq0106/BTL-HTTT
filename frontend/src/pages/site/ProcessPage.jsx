import { Link } from 'react-router-dom'
import SiteBanner from '../../components/site/SiteBanner'
import { QUY_TRINH_THUE, VAN_PHONG } from '../../data/listings'

export default function ProcessPage() {
  return (
    <>
      <SiteBanner
        kicker="How we lease"
        title="Năm bước, một officer, không vòng vo."
        desc="Từ lọc nhu cầu đến gia hạn. Black Panther không đưa bạn vào nhóm xem nhà đông hay inbox môi giới."
        anh="/properties/06.jpg"
      />
      <div className="site-page">
        <ol className="process-rail">
          {QUY_TRINH_THUE.map((b) => (
            <li key={b.so}>
              <span className="page-kicker">{b.so}</span>
              <h3>{b.tieu}</h3>
              <p className="muted">{b.moTa}</p>
            </li>
          ))}
        </ol>
        <div className="split" style={{ marginTop: 56 }}>
          <div>
            <p className="page-kicker">What you prepare</p>
            <h2>Mang gì khi xem nhà</h2>
            <ul className="check-list">
              <li>Khung ngân sách và thời hạn ở dự kiến</li>
              <li>Số người và thú cưng (nếu có)</li>
              <li>Giấy tờ tuỳ thân khi chốt cọc</li>
            </ul>
            <div className="stack-btns">
              <Link to="/dat-lich" className="btn btn--gold">Đặt lịch xem nhà</Link>
              <Link to="/ngan-sach" className="btn btn--ghost">Tính ngân sách</Link>
              <Link to="/huong-dan" className="btn btn--ghost">Hướng dẫn ở</Link>
            </div>
          </div>
          <div className="split-photo">
            <img src="/properties/living.jpg" alt="" />
          </div>
        </div>
        <p className="muted" style={{ marginTop: 28 }}>Hotline {VAN_PHONG.dienThoai} · {VAN_PHONG.gio}</p>
      </div>
    </>
  )
}


