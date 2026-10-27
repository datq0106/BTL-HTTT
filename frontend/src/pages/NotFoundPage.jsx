import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function NotFoundPage({ embedded }) {
  const { user, duongDanSauDangNhap } = useAuth()
  const noiDung = (
    <>
      <p className="page-kicker">404</p>
      <h1>Trang này không nằm trong quỹ Black Panther.</h1>
      <p className="muted">Đường dẫn không tồn tại hoặc bạn không có quyền xem.</p>
      <div className="stack-btns">
        <Link className="btn btn--gold" to="/">Về trang chủ</Link>
        {user && <Link className="btn btn--ghost" to={duongDanSauDangNhap}>Vào cổng của bạn</Link>}
      </div>
    </>
  )
  if (embedded) return <div className="card">{noiDung}</div>
  return <div className="blank-page">{noiDung}</div>
}


