import { Link, useLocation } from 'react-router-dom'
import { VAN_PHONG } from '../../data/listings'

export default function ViewingConfirmPage() {
  const { state } = useLocation()
  const ten = state?.ten
  const loai = state?.loai === 'brief' ? 'brief' : 'xem nhà'

  return (
    <div className="site-page">
      <div className="confirm-sheet">
        <p className="page-kicker">Desk received</p>
        <h1>{ten ? `${ten}, yêu cầu đã vào bàn.` : 'Yêu cầu đã vào bàn.'}</h1>
        <p className="lead">
          {state?.moTa || 'Officer sẽ xác nhận khung giờ trong 24 giờ làm việc. Penthouse chỉ mở lịch riêng sau khi lọc hồ sơ.'}
        </p>
        <dl className="kv">
          <dt>Loại yêu cầu</dt><dd>{loai === 'brief' ? 'Private brief' : 'Private viewing'}</dd>
          <dt>Giờ desk</dt><dd>{VAN_PHONG.gio}</dd>
          <dt>Hotline</dt><dd>{VAN_PHONG.dienThoai}</dd>
        </dl>
        <div className="stack-btns">
          <Link to="/bat-dong-san" className="btn btn--gold">Tiếp tục xem quỹ</Link>
          <Link to="/quan-tam" className="btn btn--ghost">Danh sách quan tâm</Link>
          <Link to="/" className="btn btn--ghost">Về trang chủ</Link>
        </div>
      </div>
    </div>
  )
}
