import { Link } from 'react-router-dom'
import SiteBanner from '../../components/site/SiteBanner'
import PropertyCard from '../../components/site/PropertyCard'
import { useShortlist } from '../../context/ShortlistContext'

export default function ShortlistPage() {
  const { ds, xoaHet } = useShortlist()

  return (
    <>
      <SiteBanner
        kicker="Private shortlist"
        title="Căn bạn đang cân nhắc."
        desc="Lưu trên trình duyệt này. Desk không thấy danh sách cho đến khi bạn gửi yêu cầu xem nhà."
        anh="/properties/living.jpg"
        compact
      />
      <div className="site-page">
        <div className="result-bar">
          <p className="muted">{ds.length} căn trong danh sách quan tâm</p>
          <div className="stack-btns" style={{ margin: 0 }}>
            {ds.length >= 2 && <Link to="/so-sanh" className="btn btn--gold">So sánh căn</Link>}
            {ds.length > 0 && (
              <button type="button" className="btn btn--ghost" onClick={xoaHet}>Xóa hết</button>
            )}
          </div>
        </div>
        {ds.length === 0 ? (
          <div className="card empty-board">
            <p className="page-kicker">Empty desk</p>
            <h2>Chưa lưu căn nào.</h2>
            <p className="muted">Mở quỹ căn và nhấn trái tim trên thẻ — tối đa 12 căn.</p>
            <Link to="/bat-dong-san" className="btn btn--gold" style={{ marginTop: 16 }}>Xem quỹ căn</Link>
          </div>
        ) : (
          <div className="prop-grid">
            {ds.map((item) => <PropertyCard key={item.id} item={item} />)}
          </div>
        )}
      </div>
    </>
  )
}
