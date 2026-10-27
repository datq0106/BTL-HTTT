import { useState, useEffect } from 'react'
import { PageHead } from '../../components/ui'
import { Icon } from '../../components/icons'
import { useToast } from '../../context/ToastContext'
import { useAuth } from '../../context/AuthContext'
import { VAN_PHONG, DOI_NGU } from '../../data/listings'
import { KhachApi } from '../../api/services'
import { getYeuCauList, themYeuCau } from '../../utils/yeuCauStore'

export default function ConciergePage() {
  const toast = useToast()
  const { user } = useAuth()
  const [hd, setHd] = useState(null)
  const [form, setForm] = useState({ chuDe: 'bao-tri', mucDo: 'binh_thuong', noiDung: '' })
  const [lichSu, setLichSu] = useState([])

  function loadRequests() {
    const all = getYeuCauList()
    // Lọc các yêu cầu của cư dân
    const myRequests = all.filter((x) => x.nguon === 'cu_dan')
    setLichSu(myRequests)
  }

  useEffect(() => {
    loadRequests()
    const handleUpdate = () => loadRequests()
    window.addEventListener('yeucau_updated', handleUpdate)
    KhachApi.hopDong().then((r) => setHd(r.data)).catch(() => {})
    return () => window.removeEventListener('yeucau_updated', handleUpdate)
  }, [])

  function gui(e) {
    e.preventDefault()
    if (!form.noiDung.trim()) return

    const tieuDeMap = {
      'bao-tri': 'Yêu cầu bảo trì / sửa chữa sự cố căn hộ',
      'gia-han': 'Hỏi thủ tục và thời hạn gia hạn hợp đồng',
      'tam-tru': 'Hỗ trợ thủ tục đăng ký tạm trú',
      'nguoi-o-cung': 'Đăng ký bổ sung người ở cùng',
      'khac': 'Ý kiến đóng góp / Yêu cầu khác',
    }

    themYeuCau({
      nguon: 'cu_dan',
      chuDe: form.chuDe,
      tieuDe: tieuDeMap[form.chuDe] || 'Yêu cầu cư dân',
      noiDung: form.noiDung.trim(),
      mucDo: form.mucDo,
      hoTen: user?.hoTen || 'Đỗ Quang Đạt',
      sdt: user?.tenDangNhap === 'admin' ? '0987988807' : (hd?.khachThue?.sdt || '0987988807'),
      maPhong: hd?.maPhong || 'P.101',
      email: user?.tenDangNhap + '@gmail.com',
    })

    toast.thanhCong('Đã gửi yêu cầu tới Ban quản lý tòa nhà!')
    setForm({ chuDe: 'bao-tri', mucDo: 'binh_thuong', noiDung: '' })
    loadRequests()
  }

  return (
    <>
      <PageHead
        kicker="Resident Concierge"
        title="Báo sự cố & Hỗ trợ cư dân"
        desc={`Tiếp nhận yêu cầu bảo trì kỹ thuật, đăng ký tạm trú và giải đáp thủ tục lưu trú · ${VAN_PHONG.gio}`}
      />

      <div className="detail-grid">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Form gửi yêu cầu */}
          <form className="card" onSubmit={gui}>
            <div className="card-head">
              <div>
                <p className="page-kicker" style={{ margin: 0 }}>Gửi yêu cầu trực tuyến</p>
                <h3 style={{ margin: '4px 0 0' }}>Tạo phiếu hỗ trợ mới</h3>
              </div>
            </div>
            <p className="muted" style={{ fontSize: 13, marginTop: 4 }}>
              Kỹ thuật viên và lễ tân tòa nhà trực tiếp theo dõi và xử lý phiếu trong giờ làm việc.
            </p>

            <div className="form-grid" style={{ marginTop: 16 }}>
              <div className="field">
                <label>Phân loại yêu cầu</label>
                <select value={form.chuDe} onChange={(e) => setForm({ ...form, chuDe: e.target.value })}>
                  <option value="bao-tri">🛠️ Bảo trì / Sự cố điện nước, thiết bị</option>
                  <option value="gia-han">📄 Gia hạn hợp đồng thuê</option>
                  <option value="tam-tru">📑 Thủ tục đăng ký tạm trú (Công an)</option>
                  <option value="nguoi-o-cung">👥 Bổ sung người ở cùng phòng</option>
                  <option value="khac">💬 Ý kiến đóng góp & việc khác</option>
                </select>
              </div>

              <div className="field">
                <label>Mức độ khẩn cấp</label>
                <select value={form.mucDo} onChange={(e) => setForm({ ...form, mucDo: e.target.value })}>
                  <option value="binh_thuong">Tiêu chuẩn (Trong vòng 24h)</option>
                  <option value="can_gap">Cần gấp (Trong ngày)</option>
                  <option value="khan_cap">Khẩn cấp (Rò rỉ nước, mất điện toàn căn)</option>
                </select>
              </div>

              <div className="field field--full">
                <label>Mô tả chi tiết vấn đề</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Vui lòng nêu rõ vị trí sự cố (ví dụ: bồn rửa bát rò nước, điều hòa không mát...) hoặc nội dung cần ban quản lý hỗ trợ."
                  value={form.noiDung}
                  onChange={(e) => setForm({ ...form, noiDung: e.target.value })}
                />
              </div>
            </div>

            <div className="modal-actions" style={{ marginTop: 16 }}>
              <button className="btn btn--gold" type="submit">
                <Icon name="phone" size={14} /> Gửi phiếu tới BQL
              </button>
            </div>
          </form>

          {/* Lịch sử yêu cầu */}
          <div className="card">
            <div className="card-head">
              <h3>Lịch sử phiếu đã gửi ({lichSu.length})</h3>
              <span className="muted">Cập nhật thời gian thực</span>
            </div>

            {!lichSu.length ? (
              <p className="muted">Bạn chưa gửi yêu cầu hỗ trợ nào.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {lichSu.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      padding: '14px 16px',
                      background: 'var(--paper)',
                      borderRadius: 'var(--radius)',
                      border: '1px solid var(--line)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <strong style={{ fontSize: 15, color: 'var(--navy)' }}>{item.tieuDe}</strong>
                      <span className={`badge badge--${item.trangThai === 'da_xu_ly' ? 'ok' : 'warn'}`}>
                        {item.trangThai === 'da_xu_ly' ? 'Đã xử lý' : 'Đang xử lý'}
                      </span>
                    </div>
                    <p style={{ margin: '0 0 8px', fontSize: 14, color: 'var(--ink)' }}>{item.noiDung}</p>
                    <div style={{ fontSize: 12, color: 'var(--muted)', display: 'flex', justifyContent: 'space-between' }}>
                      <span>Gửi lúc: {item.thoiGian}</span>
                      {item.mucDo === 'khan_cap' && <span style={{ color: 'var(--danger)', fontWeight: 600 }}>Khẩn cấp</span>}
                    </div>
                    {item.phanHoi && (
                      <div style={{ marginTop: 8, padding: '8px 12px', background: 'var(--brand-soft)', borderRadius: 8, fontSize: 13 }}>
                        <span style={{ fontWeight: 600, color: 'var(--navy)' }}>Phản hồi từ BQL: </span>
                        <span>{item.phanHoi}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Cột phải: Thông tin liên hệ trực tiếp & Đội ngũ */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="card">
            <p className="page-kicker">Emergency Contact</p>
            <h3>Đường dây nóng 24/7</h3>
            <p className="muted" style={{ fontSize: 13 }}>Trong trường hợp khẩn cấp ngoài giờ hành chính (chập điện, vỡ ống nước):</p>

            <dl className="kv" style={{ marginTop: 14 }}>
              <dt>Hotline Quản lý</dt><dd><strong>{VAN_PHONG.dienThoai}</strong></dd>
              <dt>Kỹ thuật tòa nhà</dt><dd><strong>0912 345 678</strong></dd>
              <dt>Bảo vệ trực ca</dt><dd><strong>024 3822 9999</strong> (24/24)</dd>
              <dt>Email hỗ trợ</dt><dd>{VAN_PHONG.email}</dd>
              <dt>Văn phòng trực</dt><dd>{VAN_PHONG.diaChi}</dd>
              <dt>Giờ làm việc</dt><dd>{VAN_PHONG.gio}</dd>
            </dl>
          </div>

          <div className="card">
            <p className="page-kicker">Resident Desk</p>
            <h3>Quản lý phụ trách cư dân</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 12 }}>
              {DOI_NGU.filter((p) => p.chucVu.includes('Resident') || p.chucVu.includes('Leasing')).slice(0, 2).map((p) => (
                <article key={p.ten} className="mini-advisor">
                  <img src={p.anh} alt={p.ten} style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover' }} />
                  <div>
                    <strong>{p.ten}</strong>
                    <span style={{ display: 'block', fontSize: 12, color: 'var(--muted)' }}>{p.chucVu}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </>
  )
}
