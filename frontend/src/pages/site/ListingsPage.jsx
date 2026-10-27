import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import PropertyCard from '../../components/site/PropertyCard'
import SiteBanner from '../../components/site/SiteBanner'
import { useCatalog } from '../../context/CatalogContext'
import { PublicTinDangApi } from '../../api/services'
import { thongBaoLoi } from '../../api/client'
import { Icon } from '../../components/icons'
import { tien } from '../../utils/format'
import { Badge } from '../../components/ui'
import ShortlistBtn from '../../components/site/ShortlistBtn'
import MapBoard from '../../components/site/MapBoard'

export default function ListingsPage() {
  const [sp, setSp] = useSearchParams()
  const { khuVuc: KHU_VUC, loaiCan: LOAI_CAN } = useCatalog()
  const [keyword, setKeyword] = useState(sp.get('q') || '')
  const sapXep = sp.get('sx') || 'noi-bat'
  const [kieu, setKieu] = useState('luoi')
  const [ds, setDs] = useState([])
  const [tong, setTong] = useState(0)
  const [tongTrang, setTongTrang] = useState(0)
  const [loadedQuery, setLoadedQuery] = useState(null)
  const [error, setError] = useState('')
  const trang = Math.max(0, Number(sp.get('trang') || 0) || 0)
  const loc = {
    keyword: sp.get('q') || '',
    khuVuc: sp.get('khu') || '',
    loai: sp.get('loai') || '',
    giaDen: sp.get('gia') || '',
    phongNgu: sp.get('pn') || '',
  }

  const query = sp.toString()
  const loading = loadedQuery !== query
  useEffect(() => {
    let active = true
    PublicTinDangApi.danhSach({ q: loc.keyword, khuVuc: loc.khuVuc, loai: loc.loai,
      giaDen: loc.giaDen || undefined, phongNgu: loc.phongNgu || undefined,
      sapXep, trang, kichThuoc: 12 })
      .then(({ data }) => { if (active) { setDs(data.noiDung || []); setTong(data.tongSoBanGhi || 0); setTongTrang(data.tongSoTrang || 0); setError('') } })
      .catch((err) => { if (active) setError(thongBaoLoi(err)) })
      .finally(() => { if (active) setLoadedQuery(query) })
    return () => { active = false }
  }, [query]) // eslint-disable-line react-hooks/exhaustive-deps

  function gan(k, v) {
    const next = new URLSearchParams(sp)
    if (v) next.set(k, v)
    else next.delete(k)
    if (k !== 'trang') next.delete('trang')
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
        anh="/properties/nha-pho-mat-tien.jpg"
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
          <p className="muted">{tong} căn phù hợp</p>
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
        {error && <div className="card" role="alert"><p>{error}</p></div>}
        {loading ? <div className="card"><p>Đang tải quỹ căn...</p></div> : ds.length === 0 ? (
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
        {!loading && tongTrang > 1 && <div className="modal-actions">
          <button type="button" disabled={trang === 0} onClick={() => gan('trang', String(trang - 1))}>Trước</button>
          <span>Trang {trang + 1}/{tongTrang}</span>
          <button type="button" disabled={trang + 1 >= tongTrang} onClick={() => gan('trang', String(trang + 1))}>Sau</button>
        </div>}
      </div>
    </>
  )
}


