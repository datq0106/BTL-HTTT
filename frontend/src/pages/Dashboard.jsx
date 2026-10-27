import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { DashboardApi } from '../api/services'
import { thongBaoLoi } from '../api/client'
import { ngay, so, tien } from '../utils/format'
import { Badge, Empty, PageHead } from '../components/ui'
import { Icon } from '../components/icons'
import { useToast } from '../context/ToastContext'
import { useAuth } from '../context/AuthContext'

export default function Dashboard() {
  const [data, setData] = useState(null)
  const toast = useToast()
  const { user, laAdmin } = useAuth()

  useEffect(() => {
    DashboardApi.tongQuan()
      .then((r) => setData(r.data))
      .catch((e) => toast.loi(thongBaoLoi(e)))
  }, [toast])

  if (!data) return <div className="empty">Đang tải tổng quan…</div>

  const tyLe = Number(data.tyLeLapDay || 0)
  const pct = Math.max(0, Math.min(100, Math.round(tyLe <= 1 ? tyLe * 100 : tyLe)))

  return (
    <>
      <PageHead
        kicker={laAdmin ? 'Owner snapshot' : 'Operating snapshot'}
        title={laAdmin ? 'Quỹ căn trong tầm kiểm soát' : 'Tổng quan vận hành'}
        desc={laAdmin
          ? `Xin chào ${user?.hoTen}. Occupancy, leasing và quyền truy cập hệ thống.`
          : `Xin chào ${user?.hoTen}. Tình trạng quỹ phòng và hợp đồng sắp đáo hạn.`}
      />
      <div className="occupancy">
        <div className="ring-wrap">
          <div className="ring" style={{ '--pct': `${pct}%` }}>
            <span>{pct}%</span>
          </div>
          <small>Tỷ lệ lấp đầy</small>
        </div>
        <div className="grid-cards" style={{ margin: 0 }}>
          <div className="stat"><span>Tổng phòng</span><strong>{so(data.tongPhong)}</strong></div>
          <div className="stat"><span>Đang thuê</span><strong>{so(data.phongDangThue)}</strong><em>Occupied</em></div>
          <div className="stat"><span>Trống</span><strong>{so(data.phongTrong)}</strong><em>Available</em></div>
          <div className="stat"><span>Bảo trì</span><strong>{so(data.phongBaoTri)}</strong></div>
          <div className="stat"><span>Đã đặt cọc</span><strong>{so(data.phongDaDatCoc)}</strong></div>
          <div className="stat">
            <span>Hợp đồng hiệu lực</span>
            <strong>{so(data.hopDongHieuLuc)}</strong>
            <em>Active leases</em>
          </div>
        </div>
      </div>

      <div className="quick-grid" style={{ marginBottom: 22 }}>
        <Link to="/quan-ly/phong" className="quick-card">
          <Icon name="building" />
          <strong>Quỹ phòng</strong>
          <span>Thẻ căn, trạng thái, bảo trì.</span>
        </Link>
        <Link to="/quan-ly/hop-dong" className="quick-card">
          <Icon name="file" />
          <strong>Sổ leasing</strong>
          <span>Lập, gia hạn, thanh lý hợp đồng.</span>
        </Link>
        <Link to="/quan-ly/khach-thue" className="quick-card">
          <Icon name="users" />
          <strong>Hồ sơ cư dân</strong>
          <span>CCCD, tạm trú, phòng hiện tại.</span>
        </Link>
        {laAdmin ? (
          <Link to="/quan-ly/tai-khoan" className="quick-card">
            <Icon name="shield" />
            <strong>Quyền truy cập</strong>
            <span>Cấp tài khoản quản lý và cư dân.</span>
          </Link>
        ) : (
          <Link to="/quan-ly/dich-vu" className="quick-card">
            <Icon name="spark" />
            <strong>Dịch vụ</strong>
            <span>Điện, nước, internet, gửi xe.</span>
          </Link>
        )}
      </div>

      <div className="card">
        <div className="card-head">
          <h3>Hợp đồng sắp hết hạn</h3>
          <Link to="/quan-ly/hop-dong" className="muted">Xem sổ leasing →</Link>
        </div>
        {!data.hopDongSapHetHan?.length ? (
          <Empty text="Không có hợp đồng nào sắp hết hạn." />
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Mã HĐ</th>
                  <th>Phòng</th>
                  <th>Khách</th>
                  <th>Hết hạn</th>
                  <th>Còn</th>
                  <th>Giá thuê</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {data.hopDongSapHetHan.map((hd) => (
                  <tr key={hd.id}>
                    <td><Link to={`/quan-ly/hop-dong/${hd.id}`}>{hd.maHopDong}</Link></td>
                    <td>{hd.maPhong}</td>
                    <td>{hd.khachThue?.hoTen}</td>
                    <td>{ngay(hd.ngayKetThuc)}</td>
                    <td>{hd.soNgayConLai} ngày</td>
                    <td>{tien(hd.giaThue)}</td>
                    <td><Badge nhom="hopDong" ma={hd.trangThai} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
}
