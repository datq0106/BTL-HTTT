import { Link } from 'react-router-dom'
import SiteBanner from '../../components/site/SiteBanner'
import { HUONG_DAN_O, VAN_PHONG } from '../../data/listings'

export default function LivingGuidePage() {
  return (
    <>
      <SiteBanner
        kicker="Living with us"
        title="Hướng dẫn ở sau khi ký."
        desc="Từ bàn giao đến thanh lý. Cư dân dùng cổng thành viên; khẩn cấp ngoài giờ gọi quản lý tòa."
        anh="/properties/kitchen.jpg"
      />
      <div className="site-page">
        <ol className="process-rail">
          {HUONG_DAN_O.map((b) => (
            <li key={b.so}>
              <span className="page-kicker">{b.so}</span>
              <h3>{b.tieu}</h3>
              <p className="muted">{b.moTa}</p>
            </li>
          ))}
        </ol>
        <div className="split" style={{ marginTop: 56 }}>
          <div>
            <p className="page-kicker">Resident portal</p>
            <h2>Cổng cư dân mở khi hợp đồng hiệu lực</h2>
            <ul className="check-list">
              <li>Hồ sơ thuê, cọc, người ở cùng</li>
              <li>Thông báo desk, không nhóm chat loạn</li>
              <li>Concierge bảo trì trong giờ hành chính</li>
            </ul>
            <div className="stack-btns">
              <Link to="/dang-nhap" className="btn btn--gold">Vào cổng cư dân</Link>
              <Link to="/hoi-dap" className="btn btn--ghost">Hỏi đáp</Link>
            </div>
          </div>
          <div className="split-photo">
            <img src="/properties/interior.jpg" alt="" />
          </div>
        </div>
        <p className="muted" style={{ marginTop: 28 }}>Hotline {VAN_PHONG.dienThoai} · {VAN_PHONG.gio}</p>
      </div>
    </>
  )
}
