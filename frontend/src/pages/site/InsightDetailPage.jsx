import { Link, Navigate, useParams } from 'react-router-dom'
import { tinTheoId, TIN_THI_TRUONG } from '../../data/listings'

export default function InsightDetailPage() {
  const { id } = useParams()
  const b = tinTheoId(id)
  if (!b) return <Navigate to="/thi-truong" replace />
  const khac = TIN_THI_TRUONG.filter((x) => x.id !== b.id)

  return (
    <div className="site-page">
      <p className="crumb">
        <Link to="/">Trang chủ</Link> / <Link to="/thi-truong">Thị trường</Link> / {b.nhan}
      </p>
      <article className="article">
        <div className="article__hero">
          <img src={b.anh} alt="" />
        </div>
        <p className="page-kicker">{b.nhan}</p>
        <time className="muted">{new Date(b.ngay).toLocaleDateString('vi-VN')}</time>
        <h1>{b.tieu}</h1>
        <p className="lead">{b.tomTat}</p>
        {(b.noiDung || []).map((p) => <p key={p}>{p}</p>)}
        <p className="muted">Đây là brief nội bộ Black Panther — không phải tin rao. Định giá cụ thể liên hệ advisory desk.</p>
        <Link to="/chu-nha" className="btn btn--gold" style={{ marginTop: 8 }}>Nhờ định giá căn</Link>
      </article>
      {khac.length > 0 && (
        <section style={{ marginTop: 48 }}>
          <p className="page-kicker">Also on the desk</p>
          <h2>Ghi chép khác</h2>
          <div className="insight-row" style={{ marginTop: 18 }}>
            {khac.map((x) => (
              <Link key={x.id} to={`/thi-truong/${x.id}`} className="insight-mini">
                <img src={x.anh} alt="" />
                <div>
                  <p className="page-kicker">{x.nhan}</p>
                  <h3>{x.tieu}</h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}


