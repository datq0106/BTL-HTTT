import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import SiteBanner from '../../components/site/SiteBanner'
import MapBoard from '../../components/site/MapBoard'
import { KHU_VUC, LISTINGS, locListings } from '../../data/listings'
import { tien } from '../../utils/format'
import { Badge } from '../../components/ui'

export default function MapPage() {
  const [sp, setSp] = useSearchParams()
  const khu = sp.get('khu') || ''
  const ds = useMemo(() => locListings({ khuVuc: khu }), [khu])
  const [chon, setChon] = useState(ds[0]?.id || '')
  const item = LISTINGS.find((x) => x.id === chon) || ds[0]

  function ganKhu(v) {
    const next = new URLSearchParams(sp)
    if (v) next.set('khu', v)
    else next.delete('khu')
    setSp(next)
    const loc = locListings({ khuVuc: v })
    setChon(loc[0]?.id || '')
  }

  return (
    <>
      <SiteBanner
        kicker="Inventory map"
        title="Quỹ căn trên bản đồ bàn làm việc."
        desc="Năm địa bàn Black Panther. Pin vàng là căn đang vận hành — chọn để mở hồ sơ."
        anh="/properties/hero.jpg"
        compact
      />
      <div className="site-page">
        <div className="map-toolbar">
          <button type="button" className={!khu ? 'on' : ''} onClick={() => ganKhu('')}>Tất cả</button>
          {KHU_VUC.map((k) => (
            <button key={k.id} type="button" className={khu === k.id ? 'on' : ''} onClick={() => ganKhu(k.id)}>
              {k.ten}
            </button>
          ))}
        </div>
        <div className="map-layout">
          <MapBoard items={ds} activeId={item?.id} onSelect={setChon} />
          <aside className="card">
            {item ? (
              <>
                <p className="page-kicker">{item.ma}</p>
                <h3>{item.tieuDe}</h3>
                <p className="muted">{item.diaChi}</p>
                <img className="doc-img" src={item.anh[0]} alt="" style={{ margin: '14px 0', maxHeight: 180 }} />
                <Badge nhom="phong" ma={item.trangThai} />
                <p className="price-block" style={{ marginTop: 12 }}>
                  <strong>{tien(item.gia)}</strong>
                  <span>/ tháng</span>
                </p>
                <div className="stack-btns">
                  <Link to={`/bat-dong-san/${item.id}`} className="btn btn--gold btn--sm">Hồ sơ căn</Link>
                  <Link to={`/dat-lich?can=${item.id}`} className="btn btn--ghost btn--sm">Đặt lịch</Link>
                </div>
              </>
            ) : (
              <p className="empty">Không có căn trên địa bàn này.</p>
            )}
          </aside>
        </div>
        <p className="muted" style={{ marginTop: 18 }}>{ds.length} căn trên bản đồ · pin mờ là căn đang bảo trì.</p>
      </div>
    </>
  )
}


