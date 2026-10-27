import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { HopDongApi } from '../api/services'
import { thongBaoLoi } from '../api/client'
import { ngay, ngayGio, tien } from '../utils/format'
import { Actions, Badge, Field, Modal, PageHead } from '../components/ui'
import { Icon } from '../components/icons'
import { useToast } from '../context/ToastContext'
import { useAuth } from '../context/AuthContext'

export default function HopDongChiTiet() {
  const { id } = useParams()
  const toast = useToast()
  const { laNhanVien } = useAuth()
  const [hd, setHd] = useState(null)
  const [loi, setLoi] = useState(null)
  const [giaHan, setGiaHan] = useState(null)
  const [thanhLy, setThanhLy] = useState(null)
  const [dangGui, setDangGui] = useState(false)

  function tai() {
    setLoi(null)
    HopDongApi.chiTiet(id)
      .then((r) => setHd(r.data))
      .catch((e) => {
        const msg = thongBaoLoi(e)
        setLoi(msg)
        toast.loi(msg)
      })
  }

  useEffect(() => { tai() }, [id]) // eslint-disable-line

  async function guiGiaHan(e) {
    e.preventDefault()
    setDangGui(true)
    try {
      await HopDongApi.giaHan(id, {
        ngayKetThucMoi: giaHan.ngayKetThucMoi,
        giaThueMoi: giaHan.giaThueMoi === '' ? null : Number(giaHan.giaThueMoi),
      })
      toast.thanhCong('Đã gia hạn hợp đồng thành công')
      setGiaHan(null)
      tai()
    } catch (err) {
      toast.loi(thongBaoLoi(err))
    } finally {
      setDangGui(false)
    }
  }

  async function guiThanhLy(e) {
    e.preventDefault()
    setDangGui(true)
    try {
      await HopDongApi.thanhLy(id, {
        tienKhauTru: Number(thanhLy.tienKhauTru),
        ghiChu: thanhLy.ghiChu || null,
      })
      toast.thanhCong('Đã thanh lý hợp đồng và giải phóng phòng')
      setThanhLy(null)
      tai()
    } catch (err) {
      toast.loi(thongBaoLoi(err))
    } finally {
      setDangGui(false)
    }
  }

  if (loi && !hd) {
    return (
      <div className="card" style={{ maxWidth: 500, margin: '60px auto', textAlign: 'center', padding: '32px 20px' }}>
        <p className="page-kicker" style={{ color: 'var(--danger)' }}>Lỗi tải dữ liệu</p>
        <h3 style={{ margin: '8px 0 12px' }}>Không thể hiển thị hồ sơ hợp đồng</h3>
        <p className="muted" style={{ marginBottom: 20 }}>{loi}</p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
          <button className="btn btn--gold" onClick={tai}>
            <Icon name="spark" size={14} /> Thử lại
          </button>
          <Link to="/quan-ly/hop-dong" className="btn btn--ghost">
            ← Về danh sách hợp đồng
          </Link>
        </div>
      </div>
    )
  }

  if (!hd) return <div className="empty">Đang tải chi tiết hồ sơ hợp đồng…</div>

  const hieuLuc = hd.trangThai === 'hieu_luc'
  const tongNguoi = (hd.nguoiOCung?.length || 0) + 1

  return (
    <>
      <PageHead
        kicker={laNhanVien ? 'Lease Dossier' : 'My Lease'}
        title={`Hợp đồng ${hd.maHopDong}`}
        desc={
          <>
            {laNhanVien ? <Link to="/quan-ly/hop-dong">← Danh sách hợp đồng</Link> : 'Hợp đồng của bạn'} &nbsp;·&nbsp;
            Căn phòng <strong>{hd.maPhong}</strong> &nbsp;·&nbsp;
            Lập lúc {ngayGio(hd.createdAt)}
          </>
        }
      >
        <div className="row-actions" style={{ flexWrap: 'wrap', gap: 8 }}>
          <button type="button" className="btn btn--ghost" onClick={() => window.print()}>
            <Icon name="file" size={14} /> In hợp đồng
          </button>
          <Badge nhom="hopDong" ma={hd.trangThai} />
          {laNhanVien && hieuLuc && (
            <>
              <button
                type="button"
                className="btn btn--ghost"
                onClick={() => setGiaHan({ ngayKetThucMoi: hd.ngayKetThuc, giaThueMoi: '' })}
              >
                Gia hạn
              </button>
              <button
                type="button"
                className="btn btn--warn"
                onClick={() => setThanhLy({ tienKhauTru: 0, ghiChu: '' })}
              >
                Thanh lý phòng
              </button>
            </>
          )}
        </div>
      </PageHead>

      {/* Hero tóm tắt nhanh hợp đồng */}
      <section className="portal-hero" style={{ marginBottom: 22 }}>
        <img src="/properties/interior.jpg" alt="" />
        <div>
          <p className="page-kicker" style={{ color: 'var(--gold-2)' }}>Căn hộ {hd.maPhong} · Black Panther</p>
          <h2>{tien(hd.giaThue)} <span>/ tháng</span></h2>
          <p>
            Thời hạn: {ngay(hd.ngayBatDau)} → {ngay(hd.ngayKetThuc)} &nbsp;·&nbsp;
            Còn <strong>{hd.soNgayConLai ?? '—'} ngày</strong> &nbsp;·&nbsp;
            {tongNguoi} người lưu trú
          </p>
          <div className="portal-hero__meta">
            <Badge nhom="hopDong" ma={hd.trangThai} />
            <span>Tiền cọc: {tien(hd.tienCoc)}</span>
            <span>Công nợ: {tien(hd.congNo || 0)}</span>
          </div>
        </div>
      </section>

      <div className="detail-grid">
        {/* Cột trái: Điều khoản pháp lý & Tài chính */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="card">
            <div className="card-head">
              <h3>Điều khoản hợp đồng</h3>
              <span className="badge badge--ok">{hd.trangThai}</span>
            </div>
            <dl className="kv">
              <dt>Mã số hợp đồng</dt><dd><strong>{hd.maHopDong}</strong></dd>
              <dt>Căn phòng</dt><dd>Phòng {hd.maPhong}</dd>
              <dt>Ngày bắt đầu</dt><dd>{ngay(hd.ngayBatDau)}</dd>
              <dt>Ngày kết thúc</dt><dd>{ngay(hd.ngayKetThuc)}</dd>
              <dt>Thời gian còn lại</dt><dd><strong>{hd.soNgayConLai} ngày</strong></dd>
              <dt>Giá thuê mỗi tháng</dt><dd><strong>{tien(hd.giaThue)}</strong></dd>
              <dt>Tiền đặt cọc</dt><dd><strong>{tien(hd.tienCoc)}</strong></dd>
              <dt>Công nợ hiện tại</dt><dd>{tien(hd.congNo || 0)}</dd>
              <dt>Ghi chú</dt><dd>{hd.ghiChu || 'Không có ghi chú thêm.'}</dd>
            </dl>
          </div>

          {/* Nếu đã thanh lý thì hiển thị bảng thanh lý */}
          {hd.ngayThanhLy && (
            <div className="card" style={{ borderLeft: '3px solid var(--danger)' }}>
              <div className="card-head">
                <h3>Biên bản thanh lý hợp đồng</h3>
                <span className="badge badge--danger">Đã thanh lý</span>
              </div>
              <dl className="kv">
                <dt>Ngày thanh lý</dt><dd>{ngay(hd.ngayThanhLy)}</dd>
                <dt>Tiền khấu trừ</dt><dd style={{ color: 'var(--danger)' }}>{tien(hd.tienKhauTru)}</dd>
                <dt>Tiền hoàn lại khách</dt><dd style={{ color: 'var(--ok)', fontWeight: 700 }}>{tien(hd.tienHoanCoc)}</dd>
              </dl>
            </div>
          )}
        </div>

        {/* Cột phải: Thông tin người thuê & Bạn cùng phòng */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="card">
            <div className="card-head">
              <h3>Khách thuê & Thành viên</h3>
              <span className="muted">{tongNguoi} người</span>
            </div>

            <div style={{ marginBottom: 16 }}>
              <p className="page-kicker" style={{ margin: '0 0 6px' }}>Đại diện ký hợp đồng</p>
              <div style={{ padding: '12px 14px', background: 'var(--brand-soft)', borderRadius: 'var(--radius)' }}>
                <strong style={{ fontSize: 16, color: 'var(--navy)' }}>{hd.khachThue?.hoTen}</strong>
                <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>
                  Số điện thoại: <strong>{hd.khachThue?.sdt || '—'}</strong>
                </div>
              </div>
            </div>

            <p className="page-kicker" style={{ margin: '0 0 6px' }}>Người ở cùng đăng ký ({hd.nguoiOCung?.length || 0})</p>
            {!hd.nguoiOCung?.length ? (
              <p className="muted">Không có người ở cùng đăng ký.</p>
            ) : (
              <div className="table-wrap">
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
          </div>
        </div>
      </div>

      {/* Bảng dịch vụ gắn kèm */}
      <div className="card" style={{ marginTop: 22 }}>
        <div className="card-head">
          <h3>Phụ lục dịch vụ gắn theo căn hộ</h3>
          <span className="muted">{hd.dichVu?.length || 0} dịch vụ</span>
        </div>
        {!hd.dichVu?.length ? (
          <p className="muted">Hợp đồng không đính kèm dịch vụ phụ trội.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Tên dịch vụ</th>
                  <th>Đơn vị tính</th>
                  <th>Đơn giá</th>
                  <th>Số lượng</th>
                  <th>Thành tiền dự kiến</th>
                </tr>
              </thead>
              <tbody>
                {hd.dichVu.map((dv) => (
                  <tr key={dv.dichVuId}>
                    <td><strong>{dv.tenDichVu}</strong></td>
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

      {/* Modal gia hạn */}
      {giaHan && (
        <Modal title="Gia hạn hợp đồng" onClose={() => setGiaHan(null)}>
          <form onSubmit={guiGiaHan}>
            <div className="form-grid">
              <Field label="Ngày kết thúc mới">
                <input
                  type="date"
                  required
                  value={giaHan.ngayKetThucMoi}
                  onChange={(e) => setGiaHan({ ...giaHan, ngayKetThucMoi: e.target.value })}
                />
              </Field>
              <Field label="Giá thuê mới (tùy chọn)">
                <input
                  type="number"
                  min={0}
                  placeholder={`Mặc định: ${tien(hd.giaThue)}`}
                  value={giaHan.giaThueMoi}
                  onChange={(e) => setGiaHan({ ...giaHan, giaThueMoi: e.target.value })}
                />
              </Field>
            </div>
            <Actions onClose={() => setGiaHan(null)} dangGui={dangGui} submitLabel="Xác nhận gia hạn" />
          </form>
        </Modal>
      )}

      {/* Modal thanh lý */}
      {thanhLy && (
        <Modal title="Thanh lý hợp đồng và trả phòng" onClose={() => setThanhLy(null)}>
          <form onSubmit={guiThanhLy}>
            <div className="form-grid">
              <Field label="Tiền cọc ban đầu">
                <input type="text" readOnly disabled value={tien(hd.tienCoc)} />
              </Field>
              <Field label="Tiền khấu trừ (hư hỏng, tiền nợ...)">
                <input
                  type="number"
                  min={0}
                  required
                  value={thanhLy.tienKhauTru}
                  onChange={(e) => setThanhLy({ ...thanhLy, tienKhauTru: e.target.value })}
                />
              </Field>
              <Field label="Số tiền ước tính hoàn lại cho khách" full>
                <div style={{ padding: '10px 14px', background: 'var(--brand-soft)', borderRadius: 'var(--radius)', fontWeight: 700, color: 'var(--ok)' }}>
                  {tien(Math.max(0, Number(hd.tienCoc) - Number(thanhLy.tienKhauTru || 0)))}
                </div>
              </Field>
              <Field label="Ghi chú thanh lý / lý do trả phòng" full>
                <textarea
                  rows={3}
                  placeholder="Khách chuyển công tác, phòng bàn giao nguyên vẹn..."
                  value={thanhLy.ghiChu}
                  onChange={(e) => setThanhLy({ ...thanhLy, ghiChu: e.target.value })}
                />
              </Field>
            </div>
            <p className="muted" style={{ fontSize: 13, marginTop: 10 }}>
              * Lưu ý: Sau khi xác nhận thanh lý, phòng {hd.maPhong} sẽ tự động chuyển về trạng thái &quot;Trống&quot; để sẵn sàng cho khách mới thuê.
            </p>
            <Actions onClose={() => setThanhLy(null)} dangGui={dangGui} submitLabel="Xác nhận thanh lý" />
          </form>
        </Modal>
      )}
    </>
  )
}


