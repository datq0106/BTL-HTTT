import { Link } from 'react-router-dom'
import SiteBanner from '../../components/site/SiteBanner'
import { DOI_NGU, VAN_PHONG } from '../../data/listings'

const BUOC = [
  { so: '01', tieu: 'Tuyển chọn', moTa: 'Chỉ nhận căn đạt pháp lý, hiện trạng và vị trí. Chủ nhà ký độc quyền leasing tối thiểu 12 tháng.' },
  { so: '02', tieu: 'Chuẩn hóa', moTa: 'Chụp ảnh, đo đạc, lập hồ sơ tiện nghi. Giá niêm yết thống nhất trên mọi kênh.' },
  { so: '03', tieu: 'Ghép khách', moTa: 'Lọc nhu cầu, xếp lịch xem nhà, soạn hợp đồng song ngữ và biên bản bàn giao.' },
  { so: '04', tieu: 'Vận hành', moTa: 'Theo dõi gia hạn, bảo trì, thông báo cư dân qua cổng Black Panther.' },
]

const SO_LIEU = [
  { so: '12', nhan: 'Năm leasing desk' },
  { so: '98%', nhan: 'Tỷ lệ gia hạn' },
  { so: '42', nhan: 'Hạng mục khảo sát' },
  { so: '24h', nhan: 'Xác nhận xem nhà' },
]

export default function AboutPage() {
  return (
    <>
      <SiteBanner
        kicker="The house"
        title="Một bàn leasing, không phải sàn rao vặt."
        desc="Black Panther làm việc như văn phòng quản lý tài sản: ít căn, hồ sơ đầy đủ, hợp đồng chặt, bàn giao có biên bản."
        anh="/properties/office.jpg"
      />
      <div className="site-page">
        <div className="stat-row">
          {SO_LIEU.map((s) => (
            <div key={s.nhan} className="stat-lite">
              <strong>{s.so}</strong>
              <span>{s.nhan}</span>
            </div>
          ))}
        </div>
        <div className="split" style={{ margin: '48px 0' }}>
          <div className="split-photo">
            <img src="/properties/interior.jpg" alt="Văn phòng Black Panther" />
          </div>
          <div>
            <p className="page-kicker">Since desk</p>
            <h2>Vì sao chủ nhà và khách thuê ở lại</h2>
            <p className="lead">Chúng tôi không nhận mọi căn. Quỹ phòng đủ nhỏ để mỗi hợp đồng được một leasing officer phụ trách từ xem nhà đến thanh lý.</p>
            <p className="muted">{VAN_PHONG.diaChi}</p>
            <div className="stack-btns" style={{ marginTop: 18 }}>
              <Link to="/doi-ngu" className="btn btn--gold">Gặp advisor</Link>
              <Link to="/chu-nha" className="btn btn--ghost">Gửi căn vào quỹ</Link>
              <Link to="/tuyen-dung" className="btn btn--ghost">Tuyển dụng</Link>
            </div>
          </div>
        </div>
        <p className="page-kicker">Method</p>
        <h2>Quy trình bốn bước</h2>
        <div className="step-grid" style={{ marginTop: 18, marginBottom: 48 }}>
          {BUOC.map((b) => (
            <article key={b.so} className="card">
              <span className="page-kicker">{b.so}</span>
              <h3>{b.tieu}</h3>
              <p className="muted">{b.moTa}</p>
            </article>
          ))}
        </div>
        <div className="section-head">
          <div>
            <p className="page-kicker">Advisors</p>
            <h2>Đội phụ trách quỹ căn</h2>
          </div>
          <Link to="/doi-ngu" className="btn btn--ghost">Hồ sơ đầy đủ</Link>
        </div>
        <div className="team-grid">
          {DOI_NGU.map((p) => (
            <Link key={p.ten} to={`/doi-ngu/${p.id}`} className="team-card">
              <img src={p.anh} alt="" />
              <div>
                <h3>{p.ten}</h3>
                <p className="page-kicker">{p.chucVu}</p>
                <p className="muted">{p.khu}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}


