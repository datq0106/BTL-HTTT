import { Link } from 'react-router-dom'
import { tien } from '../../utils/format'
import { Badge } from '../ui'
import { KHU_VUC } from '../../data/listings'
import ShortlistBtn from './ShortlistBtn'

export default function PropertyCard({ item, lon }) {
  const khu = KHU_VUC.find((k) => k.id === item.khuVuc)
  return (
    <article className={`prop-card ${lon ? 'prop-card--lg' : ''}`}>
      <Link to={`/bat-dong-san/${item.id}`} className="prop-card__media">
        <img src={item.anh[0]} alt={item.tieuDe} />
        <span className="prop-card__veil">Private viewing</span>
        <span className="prop-card__code">{item.ma}</span>
        <Badge nhom="phong" ma={item.trangThai} />
        <ShortlistBtn id={item.id} className="prop-card__save" />
      </Link>
      <div className="prop-card__body">
        <p className="prop-card__loc">{khu?.ten} · {item.loai}</p>
        <h3><Link to={`/bat-dong-san/${item.id}`}>{item.tieuDe}</Link></h3>
        <p className="prop-card__addr">{item.diaChi}</p>
        <ul className="prop-specs">
          <li>{item.phongNgu === 0 ? 'Studio' : `${item.phongNgu} PN`}</li>
          <li>{item.phongTam} WC</li>
          <li>{item.dienTich} m²</li>
        </ul>
        <div className="prop-card__foot">
          <strong>{tien(item.gia)}<span> /tháng</span></strong>
          <Link to={`/bat-dong-san/${item.id}`} className="text-link">Xem hồ sơ căn</Link>
        </div>
      </div>
    </article>
  )
}
