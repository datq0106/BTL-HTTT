import { Link } from 'react-router-dom'
import { PageHead } from '../../components/ui'
import { Icon } from '../../components/icons'
import { useAuth } from '../../context/AuthContext'
import { nhan } from '../../utils/format'

export default function HoSoPage() {
  const { user, laAdmin, laNhanVien, laKhach } = useAuth()
  const vai = nhan('vaiTro', user?.maVaiTro)
  const kicker = laKhach ? 'Resident file' : laAdmin ? 'Owner file' : 'Officer file'
  const desk = laKhach ? 'Cổng cư dân' : laAdmin ? 'Owner desk' : 'Leasing desk'

  return (
    <>
      <PageHead kicker={kicker} title="Hồ sơ thành viên" desc={`Tài khoản đang mở trên ${desk}.`} />
      <div className="detail-grid">
        <div className="card dossier">
          <div className="dossier__id">
            <span className="avatar avatar--lg">{(user?.hoTen || 'U').slice(0, 1).toUpperCase()}</span>
            <div>
              <p className="page-kicker">{vai}</p>
              <h3>{user?.hoTen}</h3>
              <p className="muted">@{user?.tenDangNhap}</p>
            </div>
          </div>
          <dl className="kv">
            <dt>Vai trò</dt><dd>{vai}</dd>
            <dt>Tên đăng nhập</dt><dd>{user?.tenDangNhap}</dd>
            <dt>Mã tài khoản</dt><dd>#{user?.id}</dd>
            {laKhach && (
              <>
                <dt>Mã cư dân</dt>
                <dd>{user?.khachThueId ? `#${user.khachThueId}` : 'Chưa gắn hồ sơ thuê'}</dd>
              </>
            )}
            <dt>Quyền trên desk</dt>
            <dd>
              {laAdmin && 'Toàn quyền quỹ căn, hợp đồng, dịch vụ và tài khoản.'}
              {laNhanVien && !laAdmin && 'Vận hành phòng, khách, hợp đồng. Không mở khóa tài khoản hệ thống.'}
              {laKhach && 'Xem hợp đồng của mình, thông báo và đổi mật khẩu.'}
            </dd>
          </dl>
        </div>
        <aside className="card">
          <h3>Bảo mật cổng</h3>
          <p className="muted">Mật khẩu tối thiểu 8 ký tự, gồm chữ và số. Không chia sẻ phiên đăng nhập với người ở cùng.</p>
          <div className="stack-btns">
            <Link className="btn btn--gold" to="/quan-ly/doi-mat-khau">
              <Icon name="key" size={14} /> Đổi mật khẩu
            </Link>
            {laKhach && (
              <Link className="btn btn--ghost" to="/quan-ly/hop-dong-cua-toi">
                <Icon name="file" size={14} /> Hồ sơ thuê
              </Link>
            )}
            {laNhanVien && (
              <Link className="btn btn--ghost" to="/quan-ly">
                <Icon name="overview" size={14} /> Về tổng quan
              </Link>
            )}
          </div>
        </aside>
      </div>
    </>
  )
}
