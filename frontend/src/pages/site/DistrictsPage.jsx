import { Link } from 'react-router-dom'
import SiteBanner from '../../components/site/SiteBanner'
import { useCatalog } from '../../context/CatalogContext'
import { tien } from '../../utils/format'

export default function DistrictsPage() {
  const { khuVuc: KHU_VUC, loading, error } = useCatalog()
  return (
    <>
      <SiteBanner
        kicker="Districts"
        title="Khu vực desk am hiểu thật sự."
        desc="Năm địa bàn Black Panther nhận quỹ. Mỗi khu có khách điển hình, dải giá và căn đang vận hành."
        anh="/properties/04.jpg"
      />
      <div className="site-page">
        {error && <p role="alert">{error}</p>}
        {loading && <p>Đang tải khu vực...</p>}
        {!loading && KHU_VUC.length === 0 && <p>Chưa có khu vực được công bố.</p>}
        <div className="district-grid district-grid--page">
          {KHU_VUC.map((k) => (
            <Link key={k.id} to={`/khu-vuc/${k.id}`} className="district district--photo">
              <img src={k.anh} alt="" />
              <span className="district__shade" />
              <span className="district__txt">
                <strong>{k.ten}</strong>
                <em>{k.moTa}</em>
                <em>{tien(k.giaTu)} – {tien(k.giaDen)}</em>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}


