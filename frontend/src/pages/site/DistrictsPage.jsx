import { Link } from 'react-router-dom'
import SiteBanner from '../../components/site/SiteBanner'
import { KHU_VUC } from '../../data/listings'
import { tien } from '../../utils/format'

export default function DistrictsPage() {
  return (
    <>
      <SiteBanner
        kicker="Districts"
        title="Khu vực desk am hiểu thật sự."
        desc="Năm địa bàn Black Panther nhận quỹ. Mỗi khu có khách điển hình, dải giá và căn đang vận hành."
        anh="/properties/04.jpg"
      />
      <div className="site-page">
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


