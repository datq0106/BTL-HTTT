import { Link } from 'react-router-dom'
import SiteBanner from '../../components/site/SiteBanner'
import { DICH_VU, VAN_PHONG } from '../../data/listings'

export default function ServicesPage() {
  return (
    <>
      <SiteBanner
        kicker="Practice"
        title="Bốn việc một nhà leasing thực sự làm."
        desc="Không phải sàn rao. Black Panther ghép khách, chuẩn hóa căn, vận hành cư dân và định giá — cùng một desk."
        anh="/properties/office.jpg"
      />
      <div className="site-page">
        {DICH_VU.map((d, i) => (
          <article key={d.id} className={`split service-split ${i % 2 ? 'service-split--rev' : ''}`}>
            <div className="split-photo">
              <img src={d.anh} alt="" />
            </div>
            <div>
              <p className="page-kicker">0{i + 1}</p>
              <h2>{d.tieu}</h2>
              <p className="lead">{d.moTa}</p>
              <ul className="check-list">
                {d.diem.map((x) => <li key={x}>{x}</li>)}
              </ul>
              <div className="stack-btns">
                <Link to={`/dich-vu/${d.id}`} className="btn btn--ghost">Xem hạng mục</Link>
                {d.id === 'resident' ? (
                  <Link to="/dang-nhap" className="btn btn--gold">Vào cổng cư dân</Link>
                ) : d.id === 'advisory' ? (
                  <Link to="/chu-nha" className="btn btn--gold">Gửi căn vào quỹ</Link>
                ) : (
                  <Link to="/lien-he" className="btn btn--gold">Gặp leasing desk</Link>
                )}
              </div>
            </div>
          </article>
        ))}
        <div className="cta-band cta-band--flush">
          <div>
            <p className="page-kicker">Mandate</p>
            <h2>Muốn căn vào quỹ Black Panther?</h2>
            <p>Desk khảo sát checklist 42 mục trước khi nhận độc quyền. Gọi {VAN_PHONG.dienThoai}.</p>
          </div>
          <Link to="/chu-nha" className="btn btn--gold">Dành cho chủ nhà</Link>
        </div>
      </div>
    </>
  )
}


