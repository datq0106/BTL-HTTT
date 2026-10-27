import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import PropertyCard from '../../components/site/PropertyCard'
import SiteBanner from '../../components/site/SiteBanner'
import { KHU_VUC, LOAI_CAN, locListings } from '../../data/listings'
import { Icon } from '../../components/icons'
import { tien } from '../../utils/format'
import { Badge } from '../../components/ui'
import ShortlistBtn from '../../components/site/ShortlistBtn'
import MapBoard from '../../components/site/MapBoard'

export default function ListingsPage() {
  const [sp, setSp] = useSearchParams()
  const [keyword, setKeyword] = useState(sp.get('q') || '')
  const sapXep = sp.get('sx') || 'noi-bat'
  const [kieu, setKieu] = useState('luoi')
  const loc = {
    keyword: sp.get('q') || '',
    khuVuc: sp.get('khu') || '',
    loai: sp.get('loai') || '',
    giaDen: sp.get('gia') || '',
    phongNgu: sp.get('pn') || '',
  }

  const ds = useMemo(() => {
    const raw = locListings(loc)
    const copy = [...raw]
    if (sapXep === 'gia-tang') copy.sort((a, b) => a.gia - b.gia)
    else if (sapXep === 'gia-giam') copy.sort((a, b) => b.gia - a.gia)
    else if (sapXep === 'dien-tich') copy.sort((a, b) => b.dienTich - a.dienTich)
    else copy.sort((a, b) => Number(b.noiBat) - Number(a.noiBat) || a.gia - b.gia)
    return copy
  }, [sp]) // eslint-disable-line react-hooks/exhaustive-deps

  function gan(k, v) {
    const next = new URLSearchParams(sp)
    if (v) next.set(k, v)
    else next.delete(k)
    setSp(next)
  }

  function submitTim(e) {
    e.preventDefault()
    gan('q', keyword)
  }

  return (
    <>
      <SiteBanner
        kicker="Inventory"
        title="Quỹ căn đang vận hành"
        desc="Giá đã gồm phí quản lý tòa nhà, chưa gồm điện nước. Mỗi căn có hồ sơ đo đạc và hợp đồng chuẩn Black Panther."
        anh="/properties/living.jpg"
        compact
      />
      <div className="site-page">
        <form className="listing-filter" onSubmit={submitTim}>
          <input
            placeholder="Tìm theo tên căn, địa chỉ, mã…"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <select value={loc.khuVuc} onChange={(e) => gan('khu', e.target.value)}>
            <option value="">Khu vực</option>
            {KHU_VUC.map((k) => <option key={k.id} value={k.id}>{k.ten}</option>)}
          </select>
          <select value={loc.loai} onChange={(e) => gan('loai', e.target.value)}>
            <option value="">Loại căn</option>
            {LOAI_CAN.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
          <select value={loc.phongNgu} onChange={(e) => gan('pn', e.target.value)}>
            <option value="">Phòng ngủ</option>
            <option value="0">Studio</option>
            <option value="1">1 PN</option>
            <option value="2">2 PN</option>
            <option value="3">3+ PN</option>
          </select>
          <select value={loc.giaDen} onChange={(e) => gan('gia', e.target.value)}>
            <option value="">Mức giá</option>
            <option value="15000000">≤ 15 triệu</option>
            <option value="25000000">≤ 25 triệu</option>
            <option value="40000000">≤ 40 triệu</option>
            <option value="90000000">≤ 90 triệu</option>
          </select>
          <button className="btn" type="submit">Lọc</button>
        </form>
        <div className="result-bar">
          <p className="muted">{ds.length} căn phù hợp</p>
          <div className="result-bar__tools">
            <label className="sort-field">
              <span>Sắp xếp</span>
              <select value={sapXep} onChange={(e) => gan('sx', e.target.value)}>
                <option value="noi-bat">Nổi bật</option>
                <option value="gia-tang">Giá tăng dần</option>
                <option value="gia-giam">Giá giảm dần</option>
                <option value="dien-tich">Diện tích lớn</option>
              </select>
            </label>
            <div className="view-toggle">
              <button type="button" className={kieu === 'luoi' ? 'on' : ''} onClick={() => setKieu('luoi')} aria-label="Lưới">
                <Icon name="grid" size={16} />
              </button>
              <button type="button" className={kieu === 'hang' ? 'on' : ''} onClick={() => setKieu('hang')} aria-label="Hàng">
                <Icon name="list" size={16} />
              </button>
              <button type="button" className={kieu === 'ban-do' ? 'on' : ''} onClick={() => setKieu('ban-do')} aria-label="Bản đồ">
                <Icon name="map" size={16} />
              </button>
            </div>
          </div>
        </div>
        {ds.length === 0 ? (
          <div className="card"><p className="empty">Không có căn khớp bộ lọc. Thử nới ngân sách hoặc khu vực.</p></div>
        ) : kieu === 'luoi' ? (
          <div className="prop-grid">
            {ds.map((item) => <PropertyCard key={item.id} item={item} />)}
          </div>
        ) : kieu === 'ban-do' ? (
          <div className="map-layout">
            <MapBoard items={ds} />
            <aside className="card">
              <p className="page-kicker">On map</p>
              <h3>{ds.length} căn đang lọc</h3>
              <p className="muted">Mở trang bản đồ đầy đủ để chọn pin và xem hồ sơ.</p>
              <Link to="/ban-do" className="btn btn--gold btn--sm">Mở bản đồ quỹ</Link>
            </aside>
          </div>
        ) : (
          <div className="prop-rows">
            {ds.map((item) => (
              <article key={item.id} className="prop-row">
                <Link to={`/bat-dong-san/${item.id}`} className="prop-row__media">
                  <img src={item.anh[0]} alt="" />
                </Link>
                <div>
                  <p className="prop-card__loc">{item.loai} · {item.ma}</p>
                  <h3><Link to={`/bat-dong-san/${item.id}`}>{item.tieuDe}</Link></h3>
                  <p className="muted">{item.diaChi}</p>
                  <ul className="prop-specs">
                    <li>{item.phongNgu === 0 ? 'Studio' : `${item.phongNgu} PN`}</li>
                    <li>{item.phongTam} WC</li>
                    <li>{item.dienTich} m²</li>
                  </ul>
                </div>
                <div className="prop-row__side">
                  <Badge nhom="phong" ma={item.trangThai} />
                  <strong>{tien(item.gia)}</strong>
                  <span className="muted">/ tháng</span>
                  <div className="stack-btns">
                    <ShortlistBtn id={item.id} />
                    <Link to={`/bat-dong-san/${item.id}`} className="btn btn--gold btn--sm">Hồ sơ căn</Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </>
  )
}


