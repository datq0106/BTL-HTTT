import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import SiteBanner from '../../components/site/SiteBanner'
import PropertyCard from '../../components/site/PropertyCard'
import { KHU_VUC, LISTINGS } from '../../data/listings'
import { tien } from '../../utils/format'

export default function BudgetPage() {
  const [form, setForm] = useState({ thuNhap: '40000000', tyLe: '30', nguoi: '2', khu: '' })
  const nganSach = Math.round(Number(form.thuNhap || 0) * (Number(form.tyLe || 0) / 100))

  const goiY = useMemo(() => {
    return LISTINGS
      .filter((x) => x.gia <= nganSach && (!form.khu || x.khuVuc === form.khu) && x.trangThai !== 'bao_tri')
      .sort((a, b) => b.gia - a.gia)
      .slice(0, 6)
  }, [nganSach, form.khu])

  const khuHop = KHU_VUC.filter((k) => k.giaTu <= nganSach)

  return (
    <>
      <SiteBanner
        kicker="Budget desk"
        title="Ngân sách thuê, nói bằng số."
        desc="Desk gợi ý căn dưới tỷ lệ thu nhập bạn chọn. Đây là công cụ nội bộ — không phải cam kết định giá."
        anh="/properties/office.jpg"
        compact
      />
      <div className="site-page">
        <div className="detail-grid">
          <form className="card" onSubmit={(e) => e.preventDefault()}>
            <p className="page-kicker">Inputs</p>
            <h3>Tính khung thuê tháng</h3>
            <div className="form-grid" style={{ marginTop: 16 }}>
              <div className="field">
                <label>Thu nhập hộ / tháng</label>
                <input
                  type="number"
                  min={0}
                  value={form.thuNhap}
                  onChange={(e) => setForm({ ...form, thuNhap: e.target.value })}
                />
              </div>
              <div className="field">
                <label>% dành cho thuê</label>
                <select value={form.tyLe} onChange={(e) => setForm({ ...form, tyLe: e.target.value })}>
                  <option value="25">25% — thận trọng</option>
                  <option value="30">30% — chuẩn desk</option>
                  <option value="35">35% — chấp nhận premium</option>
                </select>
              </div>
              <div className="field">
                <label>Số người ở</label>
                <select value={form.nguoi} onChange={(e) => setForm({ ...form, nguoi: e.target.value })}>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3–4</option>
                  <option value="5">Gia đình lớn</option>
                </select>
              </div>
              <div className="field">
                <label>Ưu tiên khu</label>
                <select value={form.khu} onChange={(e) => setForm({ ...form, khu: e.target.value })}>
                  <option value="">Mọi địa bàn</option>
                  {KHU_VUC.map((k) => <option key={k.id} value={k.id}>{k.ten}</option>)}
                </select>
              </div>
            </div>
          </form>
          <aside className="card budget-result">
            <p className="page-kicker">Ceiling</p>
            <strong>{tien(nganSach)}</strong>
            <span>/ tháng · chưa gồm điện nước</span>
            <p className="muted" style={{ marginTop: 12 }}>
              {form.nguoi === '1' && 'Studio hoặc 1 PN dịch vụ thường khớp.'}
              {form.nguoi === '2' && '1–2 PN, ưu tiên căn đã bàn giao full nội thất.'}
              {form.nguoi === '3' && '2 PN gần trường / compound.'}
              {form.nguoi === '5' && 'Townhouse hoặc penthouse — lọc private viewing.'}
            </p>
            <p className="muted">Khu còn trong tầm: {khuHop.map((k) => k.ten).join(', ') || 'nới tỷ lệ hoặc thu nhập.'}</p>
          </aside>
        </div>

        <div className="section-head" style={{ marginTop: 48 }}>
          <div>
            <p className="page-kicker">Within range</p>
            <h2>Căn đang mở dưới trần ngân sách</h2>
          </div>
          <Link to="/bat-dong-san" className="btn btn--ghost">Toàn bộ quỹ</Link>
        </div>
        {goiY.length === 0 ? (
          <div className="card"><p className="empty">Không có căn trống khớp. Thử nới % hoặc bỏ lọc khu.</p></div>
        ) : (
          <div className="prop-grid">
            {goiY.map((item) => <PropertyCard key={item.id} item={item} />)}
          </div>
        )}
      </div>
    </>
  )
}
