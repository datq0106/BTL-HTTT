import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { KhachApi } from '../api/services'
import { thongBaoLoi } from '../api/client'
import { ngay, tien } from '../utils/format'
import { Badge, Empty, PageHead } from '../components/ui'
import { Icon } from '../components/icons'
import { useToast } from '../context/ToastContext'
import { VAN_PHONG } from '../data/listings'

export default function HopDongCuaToi() {
  const toast = useToast()
  const [hd, setHd] = useState(undefined)

  useEffect(() => {
    KhachApi.hopDong()
      .then((r) => setHd(r.status === 204 ? null : r.data))
      .catch((e) => toast.loi(thongBaoLoi(e)))
  }, [toast])

  if (hd === undefined) return <div className="empty">Đang tải hồ sơ thuê…</div>

  if (!hd) {
    return (
      <>
        <PageHead kicker="My Lease" title="Hồ sơ hợp đồng" desc="Chưa có hợp đồng nào đang hiệu lực." />
        <div className="card">
          <Empty text="Leasing desk chưa gắn căn với tài khoản này. Vui lòng liên hệ ban quản lý nếu bạn vừa ký hợp đồng." />
          <Link to="/quan-ly/ho-tro" className="btn btn--gold" style={{ margin: '14px auto 0', display: 'flex', width: 'fit-content' }}>
            <Icon name="phone" size={14} /> Gặp ban quản lý
          </Link>
        </div>
      </>
    )
  }

  function inHopDong() {
    window.print()
  }

  return (
    <>
      <PageHead
        kicker="Lease Dossier"
        title={`Hợp đồng ${hd.maHopDong}`}
        desc={`Căn phòng ${hd.maPhong} · Hồ sơ điện tử lưu trú cư dân Black Panther.`}
      >
        <button type="button" className="btn btn--ghost" onClick={inHopDong}>
          <Icon name="file" size={14} /> In / Lưu bản hợp đồng
        </button>
        <Link to="/quan-ly/ho-tro" className="btn btn--gold">
          <Icon name="spark" size={14} /> Yêu cầu gia hạn
        </Link>
      </PageHead>

      {/* Hero Căn hộ */}
      <section className="portal-hero">
        <img src="/properties/interior.jpg" alt="Không gian phòng" />
        <div>
          <p className="page-kicker" style={{ color: 'var(--gold-2)' }}>Phòng {hd.maPhong} · Đang hiệu lực</p>
          <h2>{tien(hd.giaThue)} <span>/ tháng</span></h2>
          <p>
            Thời hạn: {ngay(hd.ngayBatDau)} → {ngay(hd.ngayKetThuc)} &nbsp;·&nbsp; Còn <strong>{hd.soNgayConLai ?? '—'} ngày</strong>
          </p>
          <div className="portal-hero__meta">
            <Badge nhom="hopDong" ma={hd.trangThai} />
            <span>Tiền cọc: {tien(hd.tienCoc)}</span>
            <span>Tạo ngày: {ngay(hd.createdAt)}</span>
          </div>
        </div>
      </section>

      <div className="detail-grid">
        {/* Điều khoản pháp lý */}
        <div className="card">
          <div className="card-head">
            <h3>Điều khoản hợp đồng</h3>
            <span className="badge badge--ok">{hd.trangThai}</span>
          </div>
          <dl className="kv">
            <dt>Mã hợp đồng</dt><dd><strong>{hd.maHopDong}</strong></dd>
            <dt>Mã phòng thuê</dt><dd>Căn {hd.maPhong}</dd>
            <dt>Ngày bắt đầu</dt><dd>{ngay(hd.ngayBatDau)}</dd>
            <dt>Ngày kết thúc</dt><dd>{ngay(hd.ngayKetThuc)}</dd>
            <dt>Thời gian còn lại</dt><dd><strong>{hd.soNgayConLai} ngày</strong></dd>
            <dt>Giá thuê niêm yết</dt><dd><strong>{tien(hd.giaThue)}</strong> / tháng</dd>
            <dt>Tiền đặt cọc</dt><dd><strong>{tien(hd.tienCoc)}</strong> (Hoàn trả khi hết HĐ)</dd>
            <dt>Công nợ hiện tại</dt><dd>{hd.congNo ? tien(hd.congNo) : '0 đ (Đã thanh toán đủ)'}</dd>
            <dt>Ghi chú hợp đồng</dt><dd>{hd.ghiChu || 'Không có ghi chú bổ sung.'}</dd>
          </dl>
        </div>

        {/* Thông tin cư dân trên hợp đồng */}
        <div className="card">
          <div className="card-head">
            <h3>Thành viên trên hợp đồng</h3>
            <span className="muted">Hồ sơ pháp lý</span>
          </div>

          <div style={{ marginBottom: 16 }}>
            <p className="page-kicker" style={{ margin: 0 }}>Chủ hợp đồng (Đại diện thuê)</p>
            <div style={{ marginTop: 6, padding: '12px 14px', background: 'var(--brand-soft)', borderRadius: 'var(--radius)' }}>
              <strong>{hd.khachThue?.hoTen}</strong>
              <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>
                SĐT: {hd.khachThue?.sdt || '—'} &nbsp;·&nbsp; CCCD: {hd.khachThue?.cccd || '—'}
              </div>
            </div>
          </div>

          <p className="page-kicker" style={{ margin: 0 }}>Thành viên ở cùng đăng ký ({hd.nguoiOCung?.length || 0})</p>
          {!hd.nguoiOCung?.length ? (
            <p className="muted" style={{ marginTop: 8 }}>Chưa đăng ký thêm người ở cùng.</p>
          ) : (
            <div className="table-wrap" style={{ marginTop: 8 }}>
              <table>
                <thead>
                  <tr>
                    <th>Họ và tên</th>
                    <th>Số điện thoại</th>
                  </tr>
                </thead>
                <tbody>
                  {hd.nguoiOCung.map((n) => (
                    <tr key={n.id}>
                      <td><strong>{n.hoTen}</strong></td>
                      <td>{n.sdt || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div style={{ marginTop: 20 }}>
            <Link to="/quan-ly/ho-tro" className="btn btn--ghost btn--sm" style={{ width: '100%', justifyContent: 'center' }}>
              <Icon name="users" size={14} /> Khai báo thêm người ở cùng
            </Link>
          </div>
        </div>
      </div>

      {/* Bảng phụ lục dịch vụ */}
      <div className="card" style={{ marginTop: 22 }}>
        <div className="card-head">
          <h3>Phụ lục dịch vụ kèm theo căn hộ</h3>
          <Link to="/quan-ly/dich-vu-cu-dan" className="muted">Xem bảng dự toán chi phí →</Link>
        </div>
        {!hd.dichVu?.length ? (
          <p className="muted">Hợp đồng không đính kèm dịch vụ phụ trội.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Tên dịch vụ</th>
                  <th>Loại tính phí</th>
                  <th>Đơn vị tính</th>
                  <th>Đơn giá</th>
                  <th>Số lượng / Định mức</th>
                  <th>Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {hd.dichVu.map((dv) => (
                  <tr key={dv.dichVuId}>
                    <td><strong>{dv.tenDichVu}</strong></td>
                    <td>{dv.loaiTinh || 'Theo chỉ số / cố định'}</td>
                    <td>{dv.donVi}</td>
                    <td>{tien(dv.donGia)}</td>
                    <td>{dv.soLuong}</td>
                    <td><strong>{tien(dv.thanhTien || (dv.donGia * dv.soLuong))}</strong></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Chính sách quyền lợi */}
      <div className="card" style={{ marginTop: 22, background: 'var(--paper)' }}>
        <h4 style={{ margin: '0 0 10px', color: 'var(--navy)' }}>Chính sách hoàn cọc & thanh lý hợp đồng</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, fontSize: 13, color: 'var(--muted)' }}>
          <div>
            <strong style={{ color: 'var(--ink)' }}>1. Điều kiện hoàn cọc:</strong> Khách thuê hoàn thành đúng thời hạn hợp đồng, không làm hư hỏng tài sản và bàn giao lại phòng đầy đủ trang thiết bị ban đầu.
          </div>
          <div>
            <strong style={{ color: 'var(--ink)' }}>2. Thông báo trả phòng:</strong> Vui lòng gửi yêu cầu qua mục Hỗ trợ trước tối thiểu 30 ngày để ban quản lý sắp xếp nghiệm thu và hoàn tất thủ tục thanh lý.
          </div>
          <div>
            <strong style={{ color: 'var(--ink)' }}>3. Hỗ trợ giải quyết:</strong> Văn phòng quản lý tại {VAN_PHONG.diaChi} · Hotline {VAN_PHONG.dienThoai} ({VAN_PHONG.gio}).
          </div>
        </div>
      </div>
    </>
  )
}


