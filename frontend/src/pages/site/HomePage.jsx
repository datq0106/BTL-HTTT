import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Icon } from '../../components/icons'
import PropertyCard from '../../components/site/PropertyCard'
import { BAO_CHI, DICH_VU, KHU_VUC, LISTINGS, LOI_KHACH, TIN_THI_TRUONG, VAN_PHONG } from '../../data/listings'
import { tien } from '../../utils/format'

const NOI_BAT = LISTINGS.filter((x) => x.noiBat)
const [FEATURE, ...CON_LAI] = NOI_BAT

export default function HomePage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ keyword: '', khuVuc: '', giaDen: '' })

  function tim(e) {
    e.preventDefault()
    const q = new URLSearchParams()
    if (form.keyword) q.set('q', form.keyword)
    if (form.khuVuc) q.set('khu', form.khuVuc)
    if (form.giaDen) q.set('gia', form.giaDen)
    navigate(`/bat-dong-san?${q.toString()}`)
  }

  return (
    <>
      <section className="hero-re">
        <img className="hero-re__bg" alt="" src="/properties/hero.jpg" />
        <div className="hero-re__shade" />
        <div className="hero-re__ornament" aria-hidden="true" />
        <div className="hero-re__content">
          <p className="page-kicker" style={{ color: 'var(--gold-2)' }}>TP. Hà Nội · Private leasing</p>
          <h1>Tìm nơi ở đúng chuẩn quỹ bất động sản.</h1>
          <p>Black Panther tuyển chọn, vận hành và cho thuê căn hộ, loft, penthouse — hợp đồng minh bạch, bàn giao đúng mô tả.</p>
          <form className="hero-search" onSubmit={tim}>
            <label>
              <span>Từ khóa</span>
              <input
                placeholder="The Marq, Thảo Điền…"
                value={form.keyword}
                onChange={(e) => setForm({ ...form, keyword: e.target.value })}
              />
            </label>
            <label>
              <span>Khu vực</span>
              <select value={form.khuVuc} onChange={(e) => setForm({ ...form, khuVuc: e.target.value })}>
                <option value="">Tất cả</option>
                {KHU_VUC.map((k) => <option key={k.id} value={k.id}>{k.ten}</option>)}
              </select>
            </label>
            <label>
              <span>Ngân sách /tháng</span>
              <select value={form.giaDen} onChange={(e) => setForm({ ...form, giaDen: e.target.value })}>
                <option value="">Không giới hạn</option>
                <option value="15000000">Đến 15 triệu</option>
                <option value="25000000">Đến 25 triệu</option>
                <option value="40000000">Đến 40 triệu</option>
                <option value="90000000">Đến 90 triệu</option>
              </select>
            </label>
            <button className="btn btn--gold" type="submit">
              <Icon name="search" size={16} /> Tìm căn
            </button>
          </form>
          <div className="hero-stats">
            <div><strong>{LISTINGS.length}</strong><span>Căn đang quản lý</span></div>
            <div><strong>12 năm</strong><span>Kinh nghiệm leasing</span></div>
            <div><strong>98%</strong><span>Tỷ lệ gia hạn</span></div>
          </div>
        </div>
      </section>

      <Link to="/bao-chi" className="press-strip">
        <span>Được trích dẫn bởi</span>
        {BAO_CHI.map((t) => <strong key={t}>{t}</strong>)}
      </Link>

      <section className="site-section">
        <div className="section-head">
          <div>
            <p className="page-kicker">Featured inventory</p>
            <h2>Căn nổi bật trong tuần</h2>
          </div>
          <Link to="/bat-dong-san" className="btn btn--ghost">Xem toàn bộ quỹ</Link>
        </div>
        {FEATURE && (
          <div className="mosaic">
            <Link to={`/bat-dong-san/${FEATURE.id}`} className="mosaic__hero">
              <img src={FEATURE.anh[0]} alt={FEATURE.tieuDe} />
              <div className="mosaic__cap">
                <p className="page-kicker">{FEATURE.ma}</p>
                <h3>{FEATURE.tieuDe}</h3>
                <p>{FEATURE.diaChi}</p>
                <strong>{tien(FEATURE.gia)} <span>/ tháng</span></strong>
              </div>
            </Link>
            <div className="mosaic__side">
              {CON_LAI.slice(0, 2).map((item) => <PropertyCard key={item.id} item={item} />)}
            </div>
          </div>
        )}
      </section>

      <section className="site-section site-section--cream">
        <div className="section-head">
          <div>
            <p className="page-kicker">Practice</p>
            <h2>Bốn việc một nhà leasing lâu năm thực sự làm</h2>
          </div>
          <Link to="/dich-vu" className="btn btn--ghost">Xem dịch vụ</Link>
        </div>
        <div className="service-grid">
          {DICH_VU.map((d, i) => (
            <Link key={d.id} to={`/dich-vu/${d.id}`} className="service-card">
              <span className="page-kicker">0{i + 1}</span>
              <h3>{d.tieu}</h3>
              <p className="muted">{d.moTa}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="site-section site-section--navy">
        <div className="split">
          <div>
            <p className="page-kicker">The house</p>
            <h2>Cách chúng tôi giữ quỹ căn đủ nhỏ để chịu trách nhiệm</h2>
            <p className="lead">Không đăng ồ ạt. Mỗi căn vào quỹ đều được đo đạc, chụp, kiểm tra pháp lý và chuẩn hóa hợp đồng trước khi lên listing.</p>
            <ul className="check-list">
              <li>Khảo sát hiện trạng và tiện nghi theo checklist 42 mục</li>
              <li>Hợp đồng song ngữ, điều khoản gia hạn rõ ràng</li>
              <li>Bàn giao có biên bản, ảnh và chỉ số điện nước</li>
              <li>Cổng cư dân theo dõi hợp đồng và thông báo</li>
            </ul>
            <div className="stack-btns">
              <Link to="/ve-chung-toi" className="btn btn--gold">Về Black Panther</Link>
              <Link to="/quy-trinh" className="btn btn--ghost">Quy trình thuê</Link>
            </div>
          </div>
          <div className="split-photo">
            <img src="/properties/interior.jpg" alt="Nội thất căn hộ Black Panther" />
          </div>
        </div>
      </section>

      <section className="site-section">
        <div className="section-head">
          <div>
            <p className="page-kicker">Districts</p>
            <h2>Khu vực chúng tôi am hiểu</h2>
          </div>
          <Link to="/khu-vuc" className="btn btn--ghost">Tất cả khu vực</Link>
        </div>
        <div className="district-grid">
          {KHU_VUC.map((k) => (
            <Link key={k.id} to={`/khu-vuc/${k.id}`} className="district district--photo">
              <img src={k.anh} alt="" />
              <span className="district__shade" />
              <span className="district__txt">
                <strong>{k.ten}</strong>
                <em>{k.moTa}</em>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="site-section site-section--cream">
        <div className="section-head">
          <div>
            <p className="page-kicker">Residents & owners</p>
            <h2>Lời từ người đã ký hợp đồng</h2>
          </div>
          <Link to="/loi-khach" className="btn btn--ghost">Tất cả lời khách</Link>
        </div>
        <div className="quote-grid">
          {LOI_KHACH.map((q) => (
            <blockquote key={q.ten} className="quote-card">
              <p>“{q.noi}”</p>
              <footer>
                <strong>{q.ten}</strong>
                <span>{q.vai}</span>
              </footer>
            </blockquote>
          ))}
        </div>
      </section>

      <section className="site-section">
        <div className="section-head">
          <div>
            <p className="page-kicker">Research</p>
            <h2>Ghi chép thị trường mới nhất</h2>
          </div>
          <Link to="/thi-truong" className="btn btn--ghost">Xem desk nghiên cứu</Link>
        </div>
        <div className="insight-row">
          {TIN_THI_TRUONG.slice(0, 3).map((b) => (
            <Link key={b.id} to={`/thi-truong/${b.id}`} className="insight-mini">
              <img src={b.anh} alt="" />
              <div>
                <p className="page-kicker">{b.nhan}</p>
                <h3>{b.tieu}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="cta-band">
        <div>
          <p className="page-kicker">Private viewing</p>
          <h2>Đặt lịch xem nhà trong 24 giờ.</h2>
          <p>Gọi {VAN_PHONG.dienThoai} hoặc để lại yêu cầu — leasing desk sẽ xác nhận khung giờ.</p>
        </div>
        <div className="stack-btns">
          <Link to="/dat-lich" className="btn btn--gold">Đặt lịch xem nhà</Link>
          <Link to="/brief" className="btn btn--ghost">Gửi brief nhu cầu</Link>
        </div>
      </section>
    </>
  )
}


