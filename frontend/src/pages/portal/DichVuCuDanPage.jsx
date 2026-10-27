import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { KhachApi } from '../../api/services'
import { thongBaoLoi } from '../../api/client'
import { tien } from '../../utils/format'
import { Empty, PageHead } from '../../components/ui'
import { Icon } from '../../components/icons'
import { useToast } from '../../context/ToastContext'

export default function DichVuCuDanPage() {
  const toast = useToast()
  const [hd, setHd] = useState(undefined)

  // Bộ tính toán chi phí dự kiến
  const [soDien, setSoDien] = useState(50)
  const [soNuoc, setSoNuoc] = useState(4)

  useEffect(() => {
    KhachApi.hopDong()
      .then((r) => setHd(r.status === 204 ? null : r.data))
      .catch((e) => toast.loi(thongBaoLoi(e)))
  }, [toast])

  if (hd === undefined) return <div className="empty">Đang tải danh mục dịch vụ…</div>

  if (!hd) {
    return (
      <>
        <PageHead kicker="Amenities" title="Dịch vụ & Chi phí" desc="Chưa gắn hợp đồng thuê." />
        <div className="card">
          <Empty text="Tài khoản chưa gắn với phòng nào đang hiệu lực." />
          <Link to="/quan-ly/ho-tro" className="btn btn--gold" style={{ margin: '14px auto 0', display: 'flex', width: 'fit-content' }}>
            Liên hệ ban quản lý
          </Link>
        </div>
      </>
    )
  }

  const dsDichVu = hd.dichVu || []
  const dvDien = dsDichVu.find((d) => d.tenDichVu.toLowerCase().includes('điện'))
  const dvNuoc = dsDichVu.find((d) => d.tenDichVu.toLowerCase().includes('nước'))
  const cacDvCoDinh = dsDichVu.filter((d) => d !== dvDien && d !== dvNuoc)

  const giaDien = dvDien ? Number(dvDien.donGia) : 3800
  const giaNuoc = dvNuoc ? Number(dvNuoc.donGia) : 25000

  const tongCoDinh = cacDvCoDinh.reduce((sum, d) => sum + Number(d.thanhTien || (d.donGia * d.soLuong) || 0), 0)
  const tienDienTinh = soDien * giaDien
  const tienNuocTinh = soNuoc * giaNuoc
  const tongUocTinh = Number(hd.giaThue || 0) + tongCoDinh + tienDienTinh + tienNuocTinh

  return (
    <>
      <PageHead
        kicker="Resident Amenities"
        title="Dịch vụ & Dự toán chi phí"
        desc={`Danh mục các tiện ích đang đăng ký cho Căn ${hd.maPhong} và bảng dự tính chi phí hàng tháng.`}
      >
        <Link to="/quan-ly/ho-tro" className="btn btn--gold">
          <Icon name="phone" size={14} /> Yêu cầu thay đổi dịch vụ
        </Link>
      </PageHead>

      <div className="quick-grid">
        <div className="quick-card">
          <Icon name="spark" />
          <strong>{dsDichVu.length} hạng mục</strong>
          <span>Dịch vụ đang đăng ký kèm phòng</span>
        </div>
        <div className="quick-card">
          <Icon name="calc" />
          <strong>{tien(hd.giaThue)}</strong>
          <span>Tiền phòng cố định hàng tháng</span>
        </div>
        <div className="quick-card">
          <Icon name="layers" />
          <strong>{tien(tongCoDinh)}</strong>
          <span>Các phí cố định (Mạng, vệ sinh...)</span>
        </div>
        <div className="quick-card">
          <Icon name="spark" />
          <strong>{tien(tongUocTinh)}</strong>
          <span>Tổng dự kiến tháng này (ước tính)</span>
        </div>
      </div>

      <div className="detail-grid">
        <div className="card">
          <div className="card-head">
            <h3>Danh sách dịch vụ đang sử dụng</h3>
            <span className="muted">{dsDichVu.length} dịch vụ</span>
          </div>

          {!dsDichVu.length ? (
            <Empty text="Phòng chưa đăng ký dịch vụ kèm theo." />
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Tên dịch vụ</th>
                    <th>Đơn vị</th>
                    <th>Đơn giá</th>
                    <th>Số lượng / ĐK</th>
                    <th>Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {dsDichVu.map((d) => (
                    <tr key={d.dichVuId}>
                      <td><strong>{d.tenDichVu}</strong></td>
                      <td>{d.donVi}</td>
                      <td>{tien(d.donGia)}</td>
                      <td>{d.soLuong}</td>
                      <td>
                        <strong>{tien(d.thanhTien || (d.donGia * d.soLuong))}</strong>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div style={{ marginTop: 20, padding: '14px 18px', background: 'var(--brand-soft)', borderRadius: 'var(--radius)', border: '1px solid var(--line)' }}>
            <h4 style={{ margin: '0 0 6px', color: 'var(--navy)' }}>Chính sách chốt số và thu phí</h4>
            <ul className="check-list" style={{ margin: 0 }}>
              <li>Chốt chỉ số điện & nước vào ngày 28 - 30 hàng tháng.</li>
              <li>Hóa đơn chi tiết sẽ được gửi qua mục <strong>Thông báo</strong> vào ngày 01 đầu tháng.</li>
              <li>Hạn đóng tiền phòng từ ngày 01 đến ngày 05 hàng tháng.</li>
            </ul>
          </div>
        </div>

        <aside className="card">
          <p className="page-kicker">Interactive Simulator</p>
          <h3>Ước tính hóa đơn tháng này</h3>
          <p className="muted">Nhập số điện, nước ước lượng để dự trù khoản thanh toán sắp tới.</p>

          <div className="form-grid" style={{ marginTop: 16 }}>
            <div className="field field--full">
              <label>Điện dự tính (kWh): {soDien} số (× {tien(giaDien)}/số)</label>
              <input
                type="number"
                min="0"
                max="1000"
                value={soDien}
                onChange={(e) => setSoDien(Math.max(0, Number(e.target.value) || 0))}
              />
            </div>
            <div className="field field--full">
              <label>Nước dự tính ({dvNuoc?.donVi || 'khối'}): {soNuoc} số (× {tien(giaNuoc)}/{dvNuoc?.donVi || 'm³'})</label>
              <input
                type="number"
                min="0"
                max="100"
                value={soNuoc}
                onChange={(e) => setSoNuoc(Math.max(0, Number(e.target.value) || 0))}
              />
            </div>
          </div>

          <div style={{ marginTop: 20, borderTop: '1px solid var(--line)', paddingTop: 14 }}>
            <dl className="kv">
              <dt>Tiền phòng</dt>
              <dd>{tien(hd.giaThue)}</dd>
              <dt>Tiền điện dự kiến</dt>
              <dd>{tien(tienDienTinh)}</dd>
              <dt>Tiền nước dự kiến</dt>
              <dd>{tien(tienNuocTinh)}</dd>
              <dt>Phí dịch vụ cố định</dt>
              <dd>{tien(tongCoDinh)}</dd>
              <dt style={{ fontWeight: 700, color: 'var(--gold)' }}>Tổng thanh toán</dt>
              <dd style={{ fontWeight: 700, fontSize: 18, color: 'var(--gold)' }}>{tien(tongUocTinh)}</dd>
            </dl>
          </div>

          <p className="muted" style={{ fontSize: 12, marginTop: 14 }}>
            * Đây là bảng tính mô phỏng, hóa đơn chính thức sẽ dựa trên chỉ số công tơ thực tế được chốt bởi quản lý.
          </p>
        </aside>
      </div>
    </>
  )
}
