import { useCallback, useEffect, useState } from 'react'
import { PageHead } from '../../components/ui'
import { YeuCauApi } from '../../api/services'
import { thongBaoLoi } from '../../api/client'
import { useToast } from '../../context/ToastContext'
import { ngayGioVietNam } from '../../utils/format'

const LABEL = { cho_xu_ly: 'Chờ xử lý', dang_xu_ly: 'Đang xử lý', da_xu_ly: 'Đã xử lý', huy: 'Đã hủy' }
const EMPTY_FILTER = { keyword: '', nguon: '', chuDe: '', trangThai: '', mucDo: '' }
const EMPTY_NEW = { chuDe: 'bao-tri', tieuDe: '', hoTen: '', sdt: '', email: '', maPhong: '', mucDo: 'binh_thuong', noiDung: '' }

export default function YeuCauPage() {
  const toast = useToast()
  const [filter, setFilter] = useState(EMPTY_FILTER)
  const [applied, setApplied] = useState(EMPTY_FILTER)
  const [trang, setTrang] = useState(0)
  const [page, setPage] = useState({ noiDung: [], tongSoTrang: 0, tongSoBanGhi: 0 })
  const [stats, setStats] = useState(null)
  const [staff, setStaff] = useState([])
  const [detail, setDetail] = useState(null)
  const [edit, setEdit] = useState({ trangThai: '', phanHoi: '', nguoiXuLyId: '' })
  const [khungXacNhan, setKhungXacNhan] = useState('')
  const [create, setCreate] = useState(false)
  const [draft, setDraft] = useState(EMPTY_NEW)
  const [loadedKey, setLoadedKey] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const requestKey = JSON.stringify([applied, trang])
  const loading = loadedKey !== requestKey

  const load = useCallback(() => Promise.all([
    YeuCauApi.danhSach({ ...applied, trang, kichThuoc: 10 }), YeuCauApi.thongKe(),
  ])
    .then(([ds, thongKe]) => {
      setPage(ds.data)
      setStats(thongKe.data)
      setError('')
    })
    .catch((err) => setError(thongBaoLoi(err)))
    .finally(() => setLoadedKey(JSON.stringify([applied, trang]))), [applied, trang])

  useEffect(() => { load() }, [load])
  useEffect(() => {
    YeuCauApi.nhanVien()
      .then(({ data }) => setStaff(data || []))
      .catch(() => setStaff([]))
  }, [])

  async function open(id) {
    try {
      const { data } = await YeuCauApi.chiTiet(id)
      setDetail(data)
      setEdit({ trangThai: data.trangThai, phanHoi: data.phanHoi || '', nguoiXuLyId: data.nguoiXuLyId || '' })
      setKhungXacNhan(data.lichXem?.khungXacNhan || data.lichXem?.khungDeNghi || '')
    } catch (err) { toast.loi(thongBaoLoi(err)) }
  }

  async function save(e) {
    e.preventDefault()
    if (!detail || saving) return
    setSaving(true)
    try {
      await YeuCauApi.xuLy(detail.id, {
        trangThai: edit.trangThai,
        phanHoi: edit.phanHoi,
        nguoiXuLyId: edit.nguoiXuLyId ? Number(edit.nguoiXuLyId) : 0,
      })
      toast.thanhCong('Đã lưu xử lý yêu cầu.')
      await Promise.all([open(detail.id), load()])
      window.dispatchEvent(new Event('yeucau_updated'))
    } catch (err) { toast.loi(thongBaoLoi(err)) }
    finally { setSaving(false) }
  }

  async function saveNew(e) {
    e.preventDefault()
    if (saving) return
    setSaving(true)
    try {
      const { data } = await YeuCauApi.tao(draft)
      toast.thanhCong(`Đã tạo yêu cầu #${data.id}`)
      setCreate(false)
      setDraft(EMPTY_NEW)
      setTrang(0)
      await load()
      await open(data.id)
      window.dispatchEvent(new Event('yeucau_updated'))
    } catch (err) { toast.loi(thongBaoLoi(err)) }
    finally { setSaving(false) }
  }

  async function lich(action) {
    if (!detail || saving) return
    setSaving(true)
    try {
      if (action === 'xac-nhan') await YeuCauApi.xacNhanLich(detail.id, khungXacNhan)
      if (action === 'hoan-thanh') await YeuCauApi.hoanThanhLich(detail.id)
      if (action === 'huy') await YeuCauApi.huyLich(detail.id)
      toast.thanhCong('Đã cập nhật lịch xem.')
      await Promise.all([open(detail.id), load()])
      window.dispatchEvent(new Event('yeucau_updated'))
    } catch (err) { toast.loi(thongBaoLoi(err)) }
    finally { setSaving(false) }
  }

  return <>
    <PageHead kicker="Service desk" title="Yêu cầu & Lịch xem"
      desc="Tiếp nhận, phân công, phản hồi và theo dõi lịch sử xử lý." />
    {stats && <div className="stat-row">
      {[['Chờ xử lý', stats.choXuLy], ['Đang xử lý', stats.dangXuLy], ['Khẩn cấp', stats.khanCap], ['Đã xử lý', stats.daXuLy], ['Tổng', stats.tong]]
        .map(([label, value]) => <div className="stat-lite" key={label}><strong>{value}</strong><span>{label}</span></div>)}
    </div>}
    <div className="card" style={{ marginTop: 20 }}>
      <form className="form-grid" onSubmit={(e) => { e.preventDefault(); setTrang(0); setApplied({ ...filter }) }}>
        <div className="field"><label>Tìm kiếm</label><input value={filter.keyword} onChange={(e) => setFilter({ ...filter, keyword: e.target.value })} placeholder="Tên, điện thoại, căn, tiêu đề" /></div>
        <div className="field"><label>Nguồn</label><select value={filter.nguon} onChange={(e) => setFilter({ ...filter, nguon: e.target.value })}>
          <option value="">Tất cả</option><option value="khach_ngoai">Khách ngoài</option><option value="cu_dan">Cư dân</option><option value="noi_bo">Nội bộ</option>
        </select></div>
        <div className="field"><label>Chủ đề</label><select value={filter.chuDe} onChange={(e) => setFilter({ ...filter, chuDe: e.target.value })}>
          <option value="">Tất cả</option>{['lien-he', 'brief', 'chu-nha', 'quan-tam', 'xem-phong', 'bao-tri', 'gia-han', 'tam-tru', 'nguoi-o-cung', 'khac'].map((x) => <option key={x} value={x}>{x}</option>)}
        </select></div>
        <div className="field"><label>Trạng thái</label><select value={filter.trangThai} onChange={(e) => setFilter({ ...filter, trangThai: e.target.value })}>
          <option value="">Tất cả</option>{Object.entries(LABEL).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
        </select></div>
        <div className="field"><label>Mức độ</label><select value={filter.mucDo} onChange={(e) => setFilter({ ...filter, mucDo: e.target.value })}>
          <option value="">Tất cả</option><option value="binh_thuong">Bình thường</option><option value="can_gap">Cần gấp</option><option value="khan_cap">Khẩn cấp</option>
        </select></div>
        <div className="modal-actions"><button type="submit" className="btn btn--gold">Lọc</button>
          <button type="button" className="btn btn--ghost" onClick={() => setCreate(!create)}>Tạo phiếu thủ công</button></div>
      </form>
    </div>
    {create && <form className="card" style={{ marginTop: 20 }} onSubmit={saveNew}>
      <h3>Phiếu tiếp nhận thủ công</h3><div className="form-grid">
        {[['tieuDe', 'Tiêu đề'], ['hoTen', 'Họ tên'], ['sdt', 'Điện thoại'], ['email', 'Email'], ['maPhong', 'Mã phòng']].map(([key, label]) =>
          <div className="field" key={key}><label>{label}</label><input required={['tieuDe', 'hoTen', 'sdt'].includes(key)} value={draft[key]}
            onChange={(e) => setDraft({ ...draft, [key]: e.target.value })} /></div>)}
        <div className="field"><label>Chủ đề</label><select value={draft.chuDe} onChange={(e) => setDraft({ ...draft, chuDe: e.target.value })}>
          {['bao-tri', 'gia-han', 'tam-tru', 'nguoi-o-cung', 'khac'].map((x) => <option key={x} value={x}>{x}</option>)}</select></div>
        <div className="field"><label>Mức độ</label><select value={draft.mucDo} onChange={(e) => setDraft({ ...draft, mucDo: e.target.value })}>
          <option value="binh_thuong">Bình thường</option><option value="can_gap">Cần gấp</option><option value="khan_cap">Khẩn cấp</option></select></div>
        <div className="field field--full"><label>Nội dung</label><textarea required rows={4} value={draft.noiDung}
          onChange={(e) => setDraft({ ...draft, noiDung: e.target.value })} /></div>
      </div><button className="btn btn--gold" disabled={saving}>Tạo phiếu</button>
    </form>}
    <div className="detail-grid" style={{ marginTop: 20 }}>
      <div className="card"><div className="card-head"><h3>Danh sách ({page.tongSoBanGhi})</h3><button type="button" onClick={load}>Làm mới</button></div>
        {error && <p role="alert">{error}</p>}
        {loading ? <p>Đang tải...</p> : (page.noiDung || []).length === 0 ? <p>Không có yêu cầu phù hợp.</p> :
          page.noiDung.map((x) => <button className="card" type="button" key={x.id} onClick={() => open(x.id)}
            style={{ display: 'block', width: '100%', textAlign: 'left', marginBottom: 10 }}>
            <strong>#{x.id} · {x.tieuDe}</strong><p>{x.hoTen} · {x.sdt} · {x.maPhong || x.nguon}</p>
            <small>{LABEL[x.trangThai] || x.trangThai} · {x.mucDo} · {ngayGioVietNam(x.createdAt)}</small>
          </button>)}
        <div className="modal-actions"><button type="button" disabled={trang === 0} onClick={() => setTrang(trang - 1)}>Trước</button>
          <span>Trang {trang + 1}/{Math.max(page.tongSoTrang, 1)}</span>
          <button type="button" disabled={trang + 1 >= page.tongSoTrang} onClick={() => setTrang(trang + 1)}>Sau</button></div>
      </div>
      <aside className="card">
        {!detail ? <p>Chọn một yêu cầu để xem và xử lý.</p> : <>
          <h3>Phiếu #{detail.id}</h3><p><strong>{detail.tieuDe}</strong></p>
          <dl className="kv"><dt>Người gửi</dt><dd>{detail.hoTen}</dd><dt>Điện thoại</dt><dd>{detail.sdt}</dd>
            <dt>Email</dt><dd>{detail.email || '—'}</dd><dt>Căn</dt><dd>{detail.maPhong || '—'}</dd>
            <dt>Nguồn</dt><dd>{detail.nguon}</dd>
            <dt>Mã tra cứu</dt><dd style={{ overflowWrap: 'anywhere' }}>{detail.maTraCuu}</dd></dl>
          <p style={{ whiteSpace: 'pre-wrap' }}>{detail.noiDung}</p>
          <form onSubmit={save}>
            <div className="field"><label>Trạng thái</label><select disabled={Boolean(detail.lichXem)} value={edit.trangThai} onChange={(e) => setEdit({ ...edit, trangThai: e.target.value })}>
              {Object.entries(LABEL).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></div>
            <div className="field"><label>Phân công</label><select value={edit.nguoiXuLyId} onChange={(e) => setEdit({ ...edit, nguoiXuLyId: e.target.value })}>
              <option value="">Chưa phân công</option>{staff.map((x) => <option key={x.id} value={x.id}>{x.hoTen}</option>)}
            </select></div>
            <div className="field"><label>Phản hồi</label><textarea rows={4} value={edit.phanHoi}
              onChange={(e) => setEdit({ ...edit, phanHoi: e.target.value })} /></div>
            <div className="modal-actions"><button className="btn btn--gold" disabled={saving}>Lưu xử lý</button></div>
          </form>
          {detail.lichXem && <div style={{ marginTop: 20 }}>
            <h3>Lịch xem</h3><p>Căn: {detail.lichXem.listingKey}</p>
            <p>Đề nghị: {ngayGioVietNam(detail.lichXem.khungDeNghi)}</p>
            <p>Trạng thái: {detail.lichXem.trangThai}</p>
            {detail.lichXem.trangThai !== 'huy' && detail.lichXem.trangThai !== 'da_hoan_thanh' && <>
              <div className="field"><label>Giờ xác nhận</label><input type="datetime-local" value={khungXacNhan.slice(0, 16)}
                onChange={(e) => setKhungXacNhan(e.target.value)} /></div>
              <div className="modal-actions"><button type="button" disabled={saving} onClick={() => lich('xac-nhan')}>Xác nhận</button>
                {detail.lichXem.trangThai === 'da_xac_nhan' && <button type="button" disabled={saving} onClick={() => lich('hoan-thanh')}>Hoàn thành</button>}
                <button type="button" disabled={saving} onClick={() => lich('huy')}>Hủy lịch</button></div>
            </>}
          </div>}
          <h3 style={{ marginTop: 24 }}>Lịch sử xử lý</h3>
          {(detail.lichSu || []).map((x) => <p key={x.id}><small>{ngayGioVietNam(x.createdAt)} · {x.nguoiThucHien || 'Hệ thống'} · {x.hanhDong}</small><br />{x.noiDung}</p>)}
        </>}
      </aside>
    </div>
  </>
}
