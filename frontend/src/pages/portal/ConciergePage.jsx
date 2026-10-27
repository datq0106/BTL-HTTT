import { useCallback, useEffect, useState } from 'react'
import { PageHead } from '../../components/ui'
import { useToast } from '../../context/ToastContext'
import { KhachApi } from '../../api/services'
import { thongBaoLoi } from '../../api/client'
import { ngayGioVietNam } from '../../utils/format'

const TRANG_THAI = { cho_xu_ly: 'Chờ xử lý', dang_xu_ly: 'Đang xử lý', da_xu_ly: 'Đã xử lý', huy: 'Đã hủy' }

export default function ConciergePage() {
  const toast = useToast()
  const [form, setForm] = useState({ chuDe: 'bao-tri', mucDo: 'binh_thuong', noiDung: '' })
  const [items, setItems] = useState([])
  const [trang, setTrang] = useState(0)
  const [tongTrang, setTongTrang] = useState(0)
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [detail, setDetail] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await KhachApi.yeuCau({ trang, kichThuoc: 10 })
      setItems(data.noiDung || [])
      setTongTrang(data.tongSoTrang || 0)
      setError('')
    } catch (err) { setError(thongBaoLoi(err)) }
    finally { setLoading(false) }
  }, [trang])

  useEffect(() => { load() }, [load])

  async function gui(e) {
    e.preventDefault()
    if (sending || !form.noiDung.trim()) return
    setSending(true)
    try {
      await KhachApi.guiYeuCau({ ...form, noiDung: form.noiDung.trim() })
      toast.thanhCong('Đã gửi yêu cầu tới Ban quản lý.')
      setForm({ chuDe: 'bao-tri', mucDo: 'binh_thuong', noiDung: '' })
      setTrang(0)
      await load()
    } catch (err) { toast.loi(thongBaoLoi(err)) }
    finally { setSending(false) }
  }

  async function xem(id) {
    try { setDetail((await KhachApi.chiTietYeuCau(id)).data) }
    catch (err) { toast.loi(thongBaoLoi(err)) }
  }

  return <>
    <PageHead kicker="Resident Concierge" title="Báo sự cố & Hỗ trợ cư dân"
      desc="Gửi yêu cầu trực tiếp tới Ban quản lý và theo dõi tiến độ xử lý." />
    <div className="detail-grid">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <form className="card" onSubmit={gui}>
          <h3>Tạo phiếu hỗ trợ</h3>
          <div className="form-grid">
            <div className="field"><label>Chủ đề</label>
              <select value={form.chuDe} onChange={(e) => setForm({ ...form, chuDe: e.target.value })}>
                <option value="bao-tri">Bảo trì / sự cố</option>
                <option value="gia-han">Gia hạn hợp đồng</option>
                <option value="tam-tru">Đăng ký tạm trú</option>
                <option value="nguoi-o-cung">Người ở cùng</option>
                <option value="khac">Yêu cầu khác</option>
              </select>
            </div>
            <div className="field"><label>Mức độ</label>
              <select value={form.mucDo} onChange={(e) => setForm({ ...form, mucDo: e.target.value })}>
                <option value="binh_thuong">Bình thường</option>
                <option value="can_gap">Cần gấp</option>
                <option value="khan_cap">Khẩn cấp</option>
              </select>
            </div>
            <div className="field field--full"><label>Nội dung</label>
              <textarea required rows={5} maxLength={5000} value={form.noiDung}
                onChange={(e) => setForm({ ...form, noiDung: e.target.value })} />
            </div>
          </div>
          <div className="modal-actions"><button className="btn btn--gold" type="submit" disabled={sending}>
            {sending ? 'Đang gửi...' : 'Gửi yêu cầu'}
          </button></div>
        </form>
        <div className="card">
          <div className="card-head"><h3>Yêu cầu của tôi</h3><button type="button" className="btn btn--ghost" onClick={load}>Làm mới</button></div>
          {error && <p role="alert">{error}</p>}
          {loading ? <p>Đang tải...</p> : items.length === 0 ? <p>Chưa có yêu cầu nào.</p> :
            items.map((item) => <button type="button" key={item.id} className="card" onClick={() => xem(item.id)}
              style={{ display: 'block', width: '100%', textAlign: 'left', marginBottom: 12 }}>
              <strong>#{item.id} · {item.tieuDe}</strong>
              <p>{item.noiDung}</p>
              <small>{TRANG_THAI[item.trangThai] || item.trangThai} · {ngayGioVietNam(item.createdAt)}</small>
              {item.phanHoi && <p><strong>Phản hồi:</strong> {item.phanHoi}</p>}
            </button>)}
          <div className="modal-actions">
            <button type="button" disabled={trang === 0} onClick={() => setTrang(trang - 1)}>Trước</button>
            <span>Trang {trang + 1}/{Math.max(tongTrang, 1)}</span>
            <button type="button" disabled={trang + 1 >= tongTrang} onClick={() => setTrang(trang + 1)}>Sau</button>
          </div>
        </div>
      </div>
      <aside className="card">
        <h3>{detail ? `Lịch sử yêu cầu #${detail.id}` : 'Chi tiết yêu cầu'}</h3>
        {detail ? <>
          <p>{detail.noiDung}</p><p><strong>Trạng thái:</strong> {TRANG_THAI[detail.trangThai]}</p>
          {detail.phanHoi && <p><strong>Phản hồi:</strong> {detail.phanHoi}</p>}
          {(detail.lichSu || []).map((h) => <p key={h.id}>
            <small>{ngayGioVietNam(h.createdAt)} · {h.hanhDong}</small><br />{h.noiDung}
          </p>)}
        </> : <p>Chọn một yêu cầu để xem lịch sử xử lý.</p>}
      </aside>
    </div>
  </>
}
