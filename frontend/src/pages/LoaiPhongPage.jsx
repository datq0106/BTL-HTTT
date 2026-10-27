import { useEffect, useState } from 'react'
import { LoaiPhongApi } from '../api/services'
import { thongBaoLoi } from '../api/client'
import { tien } from '../utils/format'
import { Actions, Empty, Field, Modal, PageHead } from '../components/ui'
import { useToast } from '../context/ToastContext'
import { useAuth } from '../context/AuthContext'

const TRONG = { tenLoai: '', giaThue: '', dienTich: '', moTa: '' }

export default function LoaiPhongPage() {
  const toast = useToast()
  const { laAdmin } = useAuth()
  const [ds, setDs] = useState([])
  const [form, setForm] = useState(null)
  const [suaId, setSuaId] = useState(null)
  const [dangGui, setDangGui] = useState(false)

  function tai() {
    LoaiPhongApi.danhSach().then((r) => setDs(r.data)).catch((e) => toast.loi(thongBaoLoi(e)))
  }
  useEffect(() => { tai() }, []) // eslint-disable-line

  async function luu(e) {
    e.preventDefault()
    setDangGui(true)
    const body = {
      tenLoai: form.tenLoai.trim(),
      giaThue: Number(form.giaThue),
      dienTich: form.dienTich === '' ? null : Number(form.dienTich),
      moTa: form.moTa || null,
    }
    try {
      if (suaId) await LoaiPhongApi.capNhat(suaId, body)
      else await LoaiPhongApi.tao(body)
      toast.thanhCong('Đã lưu loại phòng')
      setForm(null)
      setSuaId(null)
      tai()
    } catch (err) {
      toast.loi(thongBaoLoi(err))
    } finally {
      setDangGui(false)
    }
  }

  async function xoa(id) {
    if (!confirm('Xóa loại phòng này?')) return
    try {
      await LoaiPhongApi.xoa(id)
      toast.thanhCong('Đã xóa')
      tai()
    } catch (err) {
      toast.loi(thongBaoLoi(err))
    }
  }

  return (
    <>
      <PageHead
        kicker="Product line"
        title="Loại phòng"
        desc={laAdmin ? 'Giá thuê và diện tích mặc định theo từng hạng căn.' : 'Xem hạng căn. Chỉ chủ trọ được thêm hoặc sửa loại.'}
      >
        {laAdmin && <button className="btn" onClick={() => { setSuaId(null); setForm({ ...TRONG }) }}>Thêm loại</button>}
      </PageHead>
      {!ds.length ? (
        <div className="card"><Empty /></div>
      ) : (
        <div className="listing-grid">
          {ds.map((l) => (
            <article key={l.id} className="listing">
              <div className="listing-hero">
                <span>Typology</span>
                <strong>{l.tenLoai}</strong>
              </div>
              <div className="listing-body">
                <div className="listing-price">{tien(l.giaThue)}<span className="muted" style={{ fontSize: 13, fontFamily: 'var(--sans)' }}> /tháng</span></div>
                <div className="listing-meta">{l.dienTich ? `${l.dienTich} m²` : 'Chưa ghi diện tích'}</div>
                <div className="listing-meta">{l.moTa || '—'}</div>
                {laAdmin && (
                  <div className="listing-foot">
                    <div className="row-actions">
                      <button className="btn btn--ghost btn--sm" onClick={() => { setSuaId(l.id); setForm({ tenLoai: l.tenLoai, giaThue: l.giaThue, dienTich: l.dienTich ?? '', moTa: l.moTa || '' }) }}>Sửa</button>
                      <button className="btn btn--ghost btn--sm" onClick={() => xoa(l.id)}>Xóa</button>
                    </div>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
      {form && (
        <Modal title={suaId ? 'Sửa loại phòng' : 'Thêm loại phòng'} onClose={() => setForm(null)}>
          <form onSubmit={luu}>
            <div className="form-grid">
              <Field label="Tên loại" full><input required maxLength={100} value={form.tenLoai} onChange={(e) => setForm({ ...form, tenLoai: e.target.value })} /></Field>
              <Field label="Giá thuê"><input type="number" min={0} required value={form.giaThue} onChange={(e) => setForm({ ...form, giaThue: e.target.value })} /></Field>
              <Field label="Diện tích (m²)"><input type="number" min={0} step="0.1" value={form.dienTich} onChange={(e) => setForm({ ...form, dienTich: e.target.value })} /></Field>
              <Field label="Mô tả" full><textarea rows={3} value={form.moTa} onChange={(e) => setForm({ ...form, moTa: e.target.value })} /></Field>
            </div>
            <Actions onClose={() => setForm(null)} dangGui={dangGui} />
          </form>
        </Modal>
      )}
    </>
  )
}
