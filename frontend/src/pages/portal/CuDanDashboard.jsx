import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { KhachApi, ThongBaoApi } from '../../api/services'
import { thongBaoLoi } from '../../api/client'
import { ngay, so, tien } from '../../utils/format'
import { Badge, Empty, PageHead } from '../../components/ui'
import { Icon } from '../../components/icons'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { VAN_PHONG } from '../../data/listings'

export default function CuDanDashboard() {
  const { user } = useAuth()
  const toast = useToast()
  const [hd, setHd] = useState(undefined)
  const [chuaDoc, setChuaDoc] = useState(0)

  useEffect(() => {
    KhachApi.hopDong()
      .then((r) => setHd(r.status === 204 ? null : r.data))
      .catch((e) => toast.loi(thongBaoLoi(e)))
    ThongBaoApi.chuaDoc()
      .then(({ data }) => setChuaDoc(data.soChuaDoc || 0))
      .catch(() => {})
  }, [toast])

  if (hd === undefined) return <div className="empty">Đang kết nối cổng cư dân…</div>

  // Tính phần trăm thời gian hợp đồng đã sử dụng
  let pct = 0
  if (hd?.ngayBatDau && hd?.ngayKetThuc) {
    const start = new Date(hd.ngayBatDau).getTime()
    const end = new Date(hd.ngayKetThuc).getTime()
    const now = Date.now()
    if (end > start) {
      pct = Math.min(100, Math.max(0, Math.round(((now - start) / (end - start)) * 100)))
    }
  }

  const soDichVu = hd?.dichVu?.length || 0
  const tongNguoi = (hd?.nguoiOCung?.length || 0) + 1

  return (
    <>
      <PageHead
        kicker="Resident Portal"
        title={`Xin chào, ${user?.hoTen || 'Cư dân'}`}
        desc="Cổng thông tin cư dân Black Panther · Tra cứu căn hộ, hợp đồng, dịch vụ và hỗ trợ lưu trú."
      >
        <Link to="/quan-ly/ho-tro" className="btn btn--gold">
          <Icon name="phone" size={14} /> Gửi yêu cầu hỗ trợ
        </Link>
      </PageHead>

      {/* Hero căn phòng */}
      <section className="portal-hero">
        <img src="/properties/living.jpg" alt="Phòng thuê" />
        <div>
          <p className="page-kicker" style={{ color: 'var(--gold-2)' }}>Black Panther · Resident Living</p>
          {hd ? (
            <>
              <h2>Căn phòng {hd.maPhong}</h2>
              <p>Mã HĐ: <strong>{hd.maHopDong}</strong> · Thời hạn còn <strong>{hd.soNgayConLai ?? '—'} ngày</strong></p>
              <div className="portal-hero__meta">
                <Badge nhom="hopDong" ma={hd.trangThai} />
                <span>{ngay(hd.ngayBatDau)} → {ngay(hd.ngayKetThuc)}</span>
                <strong>{tien(hd.giaThue)} / tháng</strong>
              </div>
            </>
          ) : (
            <>
              <h2>Chưa gắn phòng đang thuê</h2>
              <p>Hồ sơ của bạn chưa được liên kết với hợp đồng phòng nào. Vui lòng liên hệ quản lý để kích hoạt.</p>
            </>
          )}
        </div>
      </section>

      {/* Thống kê chỉ số dành riêng cho cư dân (phong cách giống occupancy của Dashboard quản lý) */}
      {hd && (
        <div className="occupancy" style={{ marginTop: 22, marginBottom: 22 }}>
          <div className="ring-wrap">
            <div className="ring" style={{ '--pct': `${pct}%` }}>
              <span>{pct}%</span>
            </div>
            <small>Tiến độ hợp đồng</small>
          </div>
          <div className="grid-cards" style={{ margin: 0 }}>
            <div className="stat">
              <span>Căn hộ đang ở</span>
              <strong>{hd.maPhong}</strong>
              <em>Phòng tiêu chuẩn</em>
            </div>
            <div className="stat">
              <span>Giá thuê cố định</span>
              <strong>{tien(hd.giaThue)}</strong>
              <em>/ tháng</em>
            </div>
            <div className="stat">
              <span>Tiền cọc lưu giữ</span>
              <strong>{tien(hd.tienCoc)}</strong>
              <em>Đảm bảo an toàn</em>
            </div>
            <div className="stat">
              <span>Thời gian còn lại</span>
              <strong>{so(hd.soNgayConLai)}</strong>
              <em>ngày hết hạn</em>
            </div>
            <div className="stat">
              <span>Dịch vụ đăng ký</span>
              <strong>{so(soDichVu)}</strong>
              <em>hạng mục kèm theo</em>
            </div>
            <div className="stat">
              <span>Thành viên ở phòng</span>
              <strong>{so(tongNguoi)}</strong>
              <em>người đăng ký</em>
            </div>
          </div>
        </div>
      )}

      {/* 4 Thẻ thao tác nhanh */}
      <div className="quick-grid" style={{ marginBottom: 22 }}>
        <Link to="/quan-ly/hop-dong-cua-toi" className="quick-card">
          <Icon name="file" />
          <strong>Hồ sơ hợp đồng</strong>
          <span>Xem chi tiết điều khoản, tiền cọc và bản in hợp đồng.</span>
        </Link>
        <Link to="/quan-ly/dich-vu-cu-dan" className="quick-card">
          <Icon name="spark" />
          <strong>Dịch vụ & Chi phí</strong>
          <span>Bảng kê giá dịch vụ và công cụ dự toán tiền phòng.</span>
        </Link>
        <Link to="/quan-ly/ho-tro" className="quick-card">
          <Icon name="phone" />
          <strong>Báo hỏng & Hỗ trợ</strong>
          <span>Gửi yêu cầu sửa chữa, bảo trì hoặc gia hạn phòng.</span>
        </Link>
        <Link to="/quan-ly/thong-bao" className="quick-card">
          <Icon name="bell" />
          <strong>Thông báo BQL</strong>
          <span>{chuaDoc > 0 ? `${chuaDoc} thông báo mới chưa đọc` : 'Hộp thư ban quản lý.'}</span>
        </Link>
      </div>

      {/* Chi tiết 2 cột */}
      <div className="detail-grid">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Căn hộ & Bạn cùng phòng */}
          <div className="card">
            <div className="card-head">
              <h3>Thành viên đăng ký lưu trú</h3>
              {hd && <span className="badge badge--ok">{tongNguoi} thành viên</span>}
            </div>
            {!hd ? (
              <Empty text="Chưa có thông tin phòng thuê." />
            ) : (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Họ và tên</th>
                      <th>Số điện thoại</th>
                      <th>Vai trò</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <strong>{hd.khachThue?.hoTen || user?.hoTen}</strong>
                      </td>
                      <td>{hd.khachThue?.sdt || '—'}</td>
                      <td>
                        <span className="badge badge--ok">Chủ hợp đồng</span>
                      </td>
                    </tr>
                    {hd.nguoiOCung?.map((n) => (
                      <tr key={n.id}>
                        <td>{n.hoTen}</td>
                        <td>{n.sdt || '—'}</td>
                        <td>
                          <span className="badge badge--muted">Người ở cùng</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Dịch vụ đính kèm */}
          <div className="card">
            <div className="card-head">
              <h3>Dịch vụ gắn kèm căn hộ</h3>
              <Link to="/quan-ly/dich-vu-cu-dan" className="muted">Chi tiết & Dự toán →</Link>
            </div>
            {!hd?.dichVu?.length ? (
              <p className="muted">Phòng chưa gắn dịch vụ nào.</p>
            ) : (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Dịch vụ</th>
                      <th>Đơn giá</th>
                      <th>Đơn vị</th>
                      <th>Số lượng / Định mức</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hd.dichVu.map((dv) => (
                      <tr key={dv.dichVuId}>
                        <td><strong>{dv.tenDichVu}</strong></td>
                        <td>{tien(dv.donGia)}</td>
                        <td>/{dv.donVi}</td>
                        <td>{dv.soLuong}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Cột phải: Nội quy & Thanh toán */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <aside className="card">
            <p className="page-kicker">Payment Info</p>
            <h3>Thanh toán tiền phòng</h3>
            <p className="muted">Thông tin chuyển khoản chính thức của ban quản lý:</p>
            <dl className="kv" style={{ marginTop: 12 }}>
              <dt>Ngân hàng</dt><dd>MB Bank (Quân Đội)</dd>
              <dt>Số tài khoản</dt><dd><strong>0987988807</strong></dd>
              <dt>Chủ tài khoản</dt><dd>Black Panther RENTAL</dd>
              <dt>Cú pháp CK</dt>
              <dd><code style={{ background: 'var(--brand-soft)', padding: '2px 6px', borderRadius: 4 }}>P.{hd?.maPhong || 'XXX'} - [TenKhach]</code></dd>
              <dt>Thời gian đóng</dt><dd>Ngày 01 đến 05 hàng tháng</dd>
            </dl>
          </aside>

          <aside className="card">
            <p className="page-kicker">House Rules</p>
            <h3>Nội quy cư dân lưu ý</h3>
            <ul className="check-list">
              <li><strong>An ninh trật tự:</strong> Giữ yên tĩnh chung sau 23h00 hàng ngày.</li>
              <li><strong>PCCC & An toàn:</strong> Tắt bếp, bình nóng lạnh và điều hòa khi ra khỏi phòng.</li>
              <li><strong>Khách lưu trú qua đêm:</strong> Thông báo trước cho quản lý qua mục Concierge.</li>
              <li><strong>Gia hạn / Trả phòng:</strong> Báo trước tối thiểu 30 ngày trước khi hết hợp đồng.</li>
            </ul>
            <div style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <Link to="/quan-ly/ho-tro" className="btn btn--ghost btn--sm">
                <Icon name="phone" size={13} /> Gặp ban quản lý
              </Link>
              <Link to="/quan-ly/doi-mat-khau" className="btn btn--ghost btn--sm">
                <Icon name="key" size={13} /> Đổi mật khẩu
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}


