import { Link } from 'react-router-dom'
import SiteBanner from '../../components/site/SiteBanner'
import { DIEU_KHOAN, VAN_PHONG } from '../../data/listings'

export default function PolicyPage() {
  return (
    <>
      <SiteBanner
        kicker="House policy"
        title="Điều khoản niêm yết & dữ liệu."
        desc="Ngắn, đọc được. Black Panther không bán danh sách enquire và không đăng ồ ạt."
        anh="/properties/office.jpg"
        compact
      />
      <div className="site-page">
        <div className="policy-grid">
          {DIEU_KHOAN.map((d) => (
            <article key={d.tieu} className="card">
              <p className="page-kicker">Policy</p>
              <h3>{d.tieu}</h3>
              <p className="muted">{d.doan}</p>
            </article>
          ))}
        </div>
        <p className="muted" style={{ marginTop: 28 }}>
          Văn phòng: {VAN_PHONG.diaChi} · {VAN_PHONG.email}. Câu hỏi quyền dữ liệu gửi cùng form{' '}
          <Link to="/lien-he" className="text-link">liên hệ</Link>.
        </p>
      </div>
    </>
  )
}


