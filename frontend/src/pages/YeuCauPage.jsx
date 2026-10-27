import { useEffect, useMemo, useState } from 'react'
import { PageHead, Empty, Modal, Field, Actions } from '../components/ui'
import { Icon } from '../components/icons'
import { useToast } from '../context/ToastContext'
import { useAuth } from '../context/AuthContext'
import {
  getYeuCauList,
  capNhatYeuCau,
  themYeuCau,
  xoaYeuCau,
} from '../utils/yeuCauStore'

export default function YeuCauPage() {
  const toast = useToast()
  const { user } = useAuth()
  const [ds, setDs] = useState([])
  const [dangChon, setDangChon] = useState(null)
  const [taoMoi, setTaoMoi] = useState(false)
  const [formTao, setFormTao] = useState({
    hoTen: '',
    sdt: '',
    maPhong: '',
    chuDe: 'bao-tri',
    mucDo: 'binh_thuong',
    noiDung: '',
    nguon: 'cu_dan',
  })

  // Bộ lọc
  const [boLoc, setBoLoc] = useState({
    keyword: '',
    nguon: '',
    chuDe: '',
    trangThai: '',
    mucDo: '',
  })

  function tai() {
    setDs(getYeuCauList())
  }

  useEffect(() => {
    tai()
    const handleUpdate = () => tai()
    window.addEventListener('yeucau_updated', handleUpdate)
    window.addEventListener('storage', handleUpdate)
    return () => {
      window.removeEventListener('yeucau_updated', handleUpdate)
      window.removeEventListener('storage', handleUpdate)
    }
  }, [])

  // Thống kê nhanh
  const stats = useMemo(() => {
    const choXuLy = ds.filter((x) => x.trangThai === 'cho_xu_ly').length
    const dangXuLy = ds.filter((x) => x.trangThai === 'dang_xu_ly').length
    const khanCap = ds.filter((x) => x.mucDo === 'khan_cap' && x.trangThai !== 'da_xu_ly').length
    const daXuLy = ds.filter((x) => x.trangThai === 'da_xu_ly').length
    return { choXuLy, dangXuLy, khanCap, daXuLy, tong: ds.length }
  }, [ds])

  // Lọc dữ liệu
  const dsLoc = useMemo(() => {
    return ds.filter((item) => {
      if (boLoc.nguon && item.nguon !== boLoc.nguon) return false
      if (boLoc.chuDe && item.chuDe !== boLoc.chuDe) return false
      if (boLoc.trangThai && item.trangThai !== boLoc.trangThai) return false
      if (boLoc.mucDo && item.mucDo !== boLoc.mucDo) return false
      if (boLoc.keyword) {
        const kw = boLoc.keyword.toLowerCase()
        const text = `${item.id} ${item.hoTen} ${item.sdt} ${item.maPhong || ''} ${item.tieuDe} ${item.noiDung}`.toLowerCase()
        if (!text.includes(kw)) return false
      }
      return true
    })
  }, [ds, boLoc])

  // Lưu xử lý phiếu
  function luuXuLy(e) {
    e.preventDefault()
    if (!dangChon) return
    capNhatYeuCau(dangChon.id, {
      trangThai: dangChon.trangThai,
      phanHoi: dangChon.phanHoi || '',
      nguoiXuLy: dangChon.nguoiXuLy || user?.hoTen || 'Ban quản lý',
    })
    toast.thanhCong(`Đã cập nhật trạng thái phiếu ${dangChon.id}`)
    setDangChon(null)
    tai()
  }

  // Tạo phiếu mới
  function luuTaoMoi(e) {
    e.preventDefault()
    if (!formTao.hoTen.trim() || !formTao.noiDung.trim()) return

    const tieuDeMap = {
      'bao-tri': 'Yêu cầu bảo trì / sửa chữa căn hộ',
      'gia-han': 'Hỏi thủ tục và thời hạn gia hạn HĐ',
      'tam-tru': 'Hỗ trợ thủ tục đăng ký tạm trú',
      'xem-phong': `Đăng ký xem căn ${formTao.maPhong || ''}`,
      'khac': 'Yêu cầu hỗ trợ cư dân',
    }

    themYeuCau({
      nguon: formTao.nguon,
      chuDe: formTao.chuDe,
      tieuDe: tieuDeMap[formTao.chuDe] || 'Yêu cầu hỗ trợ',
      hoTen: formTao.hoTen.trim(),
      sdt: formTao.sdt.trim(),
      maPhong: formTao.maPhong.trim() || undefined,
      mucDo: formTao.mucDo,
      noiDung: formTao.noiDung.trim(),
      nguoiXuLy: user?.hoTen || 'Ban quản lý',
    })

    toast.thanhCong('Đã tạo phiếu tiếp nhận thành công!')
    setTaoMoi(false)
    setFormTao({
      hoTen: '',
      sdt: '',
      maPhong: '',
      chuDe: 'bao-tri',
      mucDo: 'binh_thuong',
      noiDung: '',
      nguon: 'cu_dan',
    })
    tai()
  }

  // Xóa phiếu
  function xuLyXoa(id) {
    if (window.confirm(`Bạn có chắc muốn xóa phiếu ${id}?`)) {
      xoaYeuCau(id)
      toast.thanhCong('Đã xóa phiếu yêu cầu')
      setDangChon(null)
      tai()
    }
  }

  return (
    <>
      <PageHead
        kicker="Service & Leasing Desk"
        title="Yêu cầu khách hàng & Cư dân"
        desc="Tiếp nhận, phân công và xử lý các phản ánh bảo trì căn hộ, gia hạn hợp đồng và đăng ký xem phòng."
      >
        <button className="btn btn--gold" onClick={() => setTaoMoi(true)}>
          <Icon name="plus" size={14} /> Tiếp nhận phiếu mới
        </button>
      </PageHead>

      {/* Thẻ KPI thống kê nhanh */}
      <div className="quick-grid" style={{ marginBottom: 22 }}>
        <div
          className="quick-card"
          style={{
            cursor: 'pointer',
            borderColor: boLoc.trangThai === 'cho_xu_ly' ? 'var(--gold)' : undefined,
          }}
          onClick={() => setBoLoc({ ...boLoc, trangThai: boLoc.trangThai === 'cho_xu_ly' ? '' : 'cho_xu_ly' })}
        >
          <Icon name="bell" />
          <strong style={{ color: stats.choXuLy > 0 ? 'var(--warn)' : 'inherit' }}>
            {stats.choXuLy} phiếu
          </strong>
          <span>Chờ tiếp nhận & xử lý</span>
        </div>

        <div
          className="quick-card"
          style={{
            cursor: 'pointer',
            borderColor: boLoc.trangThai === 'dang_xu_ly' ? 'var(--gold)' : undefined,
          }}
          onClick={() => setBoLoc({ ...boLoc, trangThai: boLoc.trangThai === 'dang_xu_ly' ? '' : 'dang_xu_ly' })}
        >
          <Icon name="spark" />
          <strong>{stats.dangXuLy} phiếu</strong>
          <span>Đang trong quá trình xử lý</span>
        </div>

        <div
          className="quick-card"
          style={{
            cursor: 'pointer',
            borderColor: boLoc.mucDo === 'khan_cap' ? 'var(--danger)' : undefined,
          }}
          onClick={() => setBoLoc({ ...boLoc, mucDo: boLoc.mucDo === 'khan_cap' ? '' : 'khan_cap' })}
        >
          <Icon name="phone" />
          <strong style={{ color: stats.khanCap > 0 ? 'var(--danger)' : 'inherit' }}>
            {stats.khanCap} khẩn cấp
          </strong>
          <span>Cần ưu tiên xử lý ngay</span>
        </div>

        <div
          className="quick-card"
          style={{
            cursor: 'pointer',
            borderColor: boLoc.trangThai === 'da_xu_ly' ? 'var(--gold)' : undefined,
          }}
          onClick={() => setBoLoc({ ...boLoc, trangThai: boLoc.trangThai === 'da_xu_ly' ? '' : 'da_xu_ly' })}
        >
          <Icon name="file" />
          <strong style={{ color: 'var(--ok)' }}>{stats.daXuLy} phiếu</strong>
          <span>Đã hoàn thành / giải quyết</span>
        </div>
      </div>

      {/* Toolbar bộ lọc */}
      <div className="toolbar" style={{ flexWrap: 'wrap', gap: 10 }}>
        <input
          className="grow"
          placeholder="Tìm mã phiếu, họ tên, SĐT, căn phòng, nội dung…"
          value={boLoc.keyword}
          onChange={(e) => setBoLoc({ ...boLoc, keyword: e.target.value })}
        />

        <select value={boLoc.nguon} onChange={(e) => setBoLoc({ ...boLoc, nguon: e.target.value })}>
          <option value="">Mọi nguồn gửi</option>
          <option value="cu_dan">🏠 Cư dân tòa nhà</option>
          <option value="khach_ngoai">🌐 Khách xem phòng website</option>
        </select>

        <select value={boLoc.chuDe} onChange={(e) => setBoLoc({ ...boLoc, chuDe: e.target.value })}>
          <option value="">Mọi chủ đề</option>
          <option value="bao-tri">🛠️ Bảo trì / Sự cố</option>
          <option value="gia-han">📄 Gia hạn hợp đồng</option>
          <option value="tam-tru">📑 Thủ tục tạm trú</option>
          <option value="xem-phong">👀 Đặt lịch xem phòng</option>
          <option value="khac">💬 Việc khác</option>
        </select>

        <select value={boLoc.mucDo} onChange={(e) => setBoLoc({ ...boLoc, mucDo: e.target.value })}>
          <option value="">Mọi mức độ</option>
          <option value="khan_cap">🚨 Khẩn cấp</option>
          <option value="can_gap">⚠️ Cần gấp</option>
          <option value="binh_thuong">🟢 Tiêu chuẩn</option>
        </select>

        <select value={boLoc.trangThai} onChange={(e) => setBoLoc({ ...boLoc, trangThai: e.target.value })}>
          <option value="">Mọi trạng thái</option>
          <option value="cho_xu_ly">Chờ tiếp nhận</option>
          <option value="dang_xu_ly">Đang xử lý</option>
          <option value="da_xu_ly">Đã hoàn thành</option>
          <option value="da_huy">Đã hủy</option>
        </select>

        {(boLoc.keyword || boLoc.nguon || boLoc.chuDe || boLoc.trangThai || boLoc.mucDo) && (
          <button
            type="button"
            className="btn btn--ghost btn--sm"
            onClick={() => setBoLoc({ keyword: '', nguon: '', chuDe: '', trangThai: '', mucDo: '' })}
          >
            Đặt lại lọc
          </button>
        )}
      </div>

      {/* Bảng danh sách phiếu */}
      <div className="card">
        {!dsLoc.length ? (
          <Empty text="Không tìm thấy phiếu yêu cầu nào phù hợp với bộ lọc." />
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Mã phiếu</th>
                  <th>Người gửi & Căn</th>
                  <th>Chủ đề & Nội dung</th>
                  <th>Mức độ</th>
                  <th>Thời gian</th>
                  <th>Trạng thái</th>
                  <th>Người xử lý</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {dsLoc.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <code style={{ fontWeight: 700, color: 'var(--navy)' }}>{item.id}</code>
                    </td>
                    <td>
                      <strong>{item.hoTen}</strong>
                      <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                        {item.maPhong ? (
                          <span style={{ color: 'var(--gold-2)', fontWeight: 600 }}>Căn {item.maPhong} · </span>
                        ) : null}
                        {item.sdt}
                      </div>
                    </td>
                    <td style={{ maxWidth: 300 }}>
                      <strong style={{ display: 'block', fontSize: 14 }}>{item.tieuDe}</strong>
                      <span
                        style={{
                          fontSize: 13,
                          color: 'var(--muted)',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {item.noiDung}
                      </span>
                    </td>
                    <td>
                      {item.mucDo === 'khan_cap' ? (
                        <span className="badge badge--danger">Khẩn cấp</span>
                      ) : item.mucDo === 'can_gap' ? (
                        <span className="badge badge--warn">Cần gấp</span>
                      ) : (
                        <span className="badge badge--muted">Tiêu chuẩn</span>
                      )}
                    </td>
                    <td style={{ fontSize: 13, color: 'var(--muted)', whiteSpace: 'nowrap' }}>
                      {item.thoiGian}
                    </td>
                    <td>
                      {item.trangThai === 'cho_xu_ly' ? (
                        <span className="badge badge--warn">Chờ xử lý</span>
                      ) : item.trangThai === 'dang_xu_ly' ? (
                        <span className="badge badge--muted">Đang xử lý</span>
                      ) : item.trangThai === 'da_xu_ly' ? (
                        <span className="badge badge--ok">Đã xử lý</span>
                      ) : (
                        <span className="badge badge--danger">Đã hủy</span>
                      )}
                    </td>
                    <td style={{ fontSize: 13, color: 'var(--muted)' }}>
                      {item.nguoiXuLy || '—'}
                    </td>
                    <td className="row-actions">
                      <button
                        type="button"
                        className="btn btn--gold btn--sm"
                        onClick={() => setDangChon({ ...item })}
                      >
                        Xử lý
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Xem chi tiết & Xử lý phiếu */}
      {dangChon && (
        <Modal title={`Xử lý phiếu yêu cầu ${dangChon.id}`} wide onClose={() => setDangChon(null)}>
          <form onSubmit={luuXuLy}>
            <div className="detail-grid" style={{ marginBottom: 16 }}>
              {/* Thông tin phiếu */}
              <div style={{ background: 'var(--paper)', padding: 16, borderRadius: 'var(--radius)', border: '1px solid var(--line)' }}>
                <p className="page-kicker" style={{ margin: 0 }}>Thông tin người gửi</p>
                <h3 style={{ margin: '4px 0 10px', fontSize: 18 }}>{dangChon.hoTen}</h3>
                <dl className="kv" style={{ margin: 0 }}>
                  <dt>Số điện thoại</dt>
                  <dd>
                    <a href={`tel:${dangChon.sdt}`} style={{ color: 'var(--gold)', fontWeight: 600 }}>
                      {dangChon.sdt}
                    </a>
                  </dd>
                  <dt>Email</dt>
                  <dd>{dangChon.email || '—'}</dd>
                  <dt>Căn phòng</dt>
                  <dd>
                    {dangChon.maPhong ? (
                      <strong>Phòng {dangChon.maPhong}</strong>
                    ) : (
                      'Khách ngoài (Website)'
                    )}
                  </dd>
                  <dt>Nguồn gửi</dt>
                  <dd>{dangChon.nguon === 'cu_dan' ? 'Cư dân tòa nhà' : 'Khách vãng lai'}</dd>
                  <dt>Mức độ</dt>
                  <dd>
                    {dangChon.mucDo === 'khan_cap' ? (
                      <span className="badge badge--danger">Khẩn cấp</span>
                    ) : (
                      <span className="badge badge--muted">Tiêu chuẩn</span>
                    )}
                  </dd>
                </dl>
              </div>

              {/* Nội dung yêu cầu */}
              <div style={{ background: 'var(--brand-soft)', padding: 16, borderRadius: 'var(--radius)', border: '1px solid var(--line)' }}>
                <p className="page-kicker" style={{ margin: 0 }}>Nội dung phản ánh</p>
                <h4 style={{ margin: '4px 0 8px', color: 'var(--navy)' }}>{dangChon.tieuDe}</h4>
                <p style={{ margin: 0, fontSize: 14, color: 'var(--ink)', lineHeight: 1.6 }}>
                  {dangChon.noiDung}
                </p>
                <div style={{ marginTop: 12, fontSize: 12, color: 'var(--muted)' }}>
                  Gửi lúc: {dangChon.thoiGian}
                </div>
              </div>
            </div>

            {/* Form thao tác tiếp nhận */}
            <div className="form-grid">
              <Field label="Cập nhật trạng thái phiếu">
                <select
                  value={dangChon.trangThai}
                  onChange={(e) => setDangChon({ ...dangChon, trangThai: e.target.value })}
                >
                  <option value="cho_xu_ly">Chờ tiếp nhận</option>
                  <option value="dang_xu_ly">Đang xử lý (Đã nhận việc)</option>
                  <option value="da_xu_ly">Đã hoàn thành / Đã giải quyết</option>
                  <option value="da_huy">Hủy phiếu</option>
                </select>
              </Field>

              <Field label="Cán bộ phụ trách xử lý">
                <input
                  type="text"
                  placeholder="Họ tên người phụ trách..."
                  value={dangChon.nguoiXuLy || user?.hoTen || ''}
                  onChange={(e) => setDangChon({ ...dangChon, nguoiXuLy: e.target.value })}
                />
              </Field>

              <Field label="Phản hồi gửi lại cho cư dân / khách hàng" full>
                <textarea
                  rows={4}
                  placeholder="Ví dụ: Đã cử kỹ thuật viên Tuấn qua kiểm tra và thay vòi nước lúc 14h30..."
                  value={dangChon.phanHoi || ''}
                  onChange={(e) => setDangChon({ ...dangChon, phanHoi: e.target.value })}
                />
              </Field>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 18 }}>
              <button
                type="button"
                className="btn btn--warn btn--sm"
                onClick={() => xuLyXoa(dangChon.id)}
              >
                Xóa phiếu
              </button>
              <Actions onClose={() => setDangChon(null)} submitLabel="Lưu cập nhật" />
            </div>
          </form>
        </Modal>
      )}

      {/* Modal Tạo phiếu mới (khi khách gọi điện trực tiếp) */}
      {taoMoi && (
        <Modal title="Tiếp nhận phiếu yêu cầu mới" wide onClose={() => setTaoMoi(false)}>
          <form onSubmit={luuTaoMoi}>
            <div className="form-grid">
              <Field label="Họ tên khách hàng / cư dân">
                <input
                  required
                  placeholder="Nguyễn Văn A..."
                  value={formTao.hoTen}
                  onChange={(e) => setFormTao({ ...formTao, hoTen: e.target.value })}
                />
              </Field>

              <Field label="Số điện thoại">
                <input
                  required
                  placeholder="0912..."
                  value={formTao.sdt}
                  onChange={(e) => setFormTao({ ...formTao, sdt: e.target.value })}
                />
              </Field>

              <Field label="Căn phòng (nếu là cư dân)">
                <input
                  placeholder="P.101, P.201..."
                  value={formTao.maPhong}
                  onChange={(e) => setFormTao({ ...formTao, maPhong: e.target.value })}
                />
              </Field>

              <Field label="Nguồn yêu cầu">
                <select
                  value={formTao.nguon}
                  onChange={(e) => setFormTao({ ...formTao, nguon: e.target.value })}
                >
                  <option value="cu_dan">Cư dân trong tòa nhà</option>
                  <option value="khach_ngoai">Khách hàng bên ngoài</option>
                </select>
              </Field>

              <Field label="Phân loại chủ đề">
                <select
                  value={formTao.chuDe}
                  onChange={(e) => setFormTao({ ...formTao, chuDe: e.target.value })}
                >
                  <option value="bao-tri">🛠️ Bảo trì / Sự cố thiết bị</option>
                  <option value="gia-han">📄 Gia hạn hợp đồng</option>
                  <option value="tam-tru">📑 Thủ tục đăng ký tạm trú</option>
                  <option value="xem-phong">👀 Đặt lịch xem phòng</option>
                  <option value="khac">💬 Việc khác</option>
                </select>
              </Field>

              <Field label="Mức độ khẩn cấp">
                <select
                  value={formTao.mucDo}
                  onChange={(e) => setFormTao({ ...formTao, mucDo: e.target.value })}
                >
                  <option value="binh_thuong">Tiêu chuẩn (Trong 24h)</option>
                  <option value="can_gap">Cần gấp (Trong ngày)</option>
                  <option value="khan_cap">Khẩn cấp</option>
                </select>
              </Field>

              <Field label="Nội dung yêu cầu chi tiết" full>
                <textarea
                  rows={4}
                  required
                  placeholder="Mô tả sự cố hoặc yêu cầu của khách hàng..."
                  value={formTao.noiDung}
                  onChange={(e) => setFormTao({ ...formTao, noiDung: e.target.value })}
                />
              </Field>
            </div>

            <Actions onClose={() => setTaoMoi(false)} submitLabel="Tạo phiếu tiếp nhận" />
          </form>
        </Modal>
      )}
    </>
  )
}
