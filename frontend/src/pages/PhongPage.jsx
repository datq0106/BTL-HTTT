import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { LoaiPhongApi, PhongApi } from '../api/services'
import { thongBaoLoi } from '../api/client'
import { tien } from '../utils/format'
import { Actions, Badge, Empty, Field, Modal, PageHead, Pagination } from '../components/ui'
import { useToast } from '../context/ToastContext'
import { Icon } from '../components/icons'

const TRONG_FORM = { maPhong: '', tang: 1, loaiPhongId: '', tienNghi: '', ghiChu: '' }

const ANH_PHONG = [
  '/properties/01.jpg',
  '/properties/02.jpg',
  '/properties/living.jpg',
  '/properties/kitchen.jpg',
  '/properties/interior.jpg',
  '/properties/07.jpg',
]

function anhPhong(id) {
  return ANH_PHONG[Number(id) % ANH_PHONG.length]
}

export default function PhongPage() {
  const toast = useToast()
  const [ds, setDs] = useState({ noiDung: [], trang: 0, tongSoTrang: 0, tongSoBanGhi: 0 })
  const [loai, setLoai] = useState([])
  const [boLoc, setBoLoc] = useState({ keyword: '', tang: '', trangThai: '', giaTu: '', giaDen: '', trang: 0 })
  const [form, setForm] = useState(null)
  const [suaId, setSuaId] = useState(null)
  const [dangGui, setDangGui] = useState(false)
  const [kieu, setKieu] = useState('the')

  function tai(bo = boLoc) {
    PhongApi.danhSach({
      keyword: bo.keyword || undefined,
      tang: bo.tang || undefined,
      trangThai: bo.trangThai || undefined,
      giaTu: bo.giaTu || undefined,
      giaDen: bo.giaDen || undefined,
      trang: bo.trang,
      kichThuoc: 12,
    }).then((r) => setDs(r.data)).catch((e) => toast.loi(thongBaoLoi(e)))
  }

  useEffect(() => {
    LoaiPhongApi.danhSach().then((r) => setLoai(r.data)).catch((e) => toast.loi(thongBaoLoi(e)))
  }, [toast])

  useEffect(() => { tai(boLoc) }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function capNhatLoc(k, v) {
    const next = { ...boLoc, [k]: v, trang: k === 'trang' ? v : 0 }
    setBoLoc(next)
    tai(next)
  }

  async function luu(e) {
    e.preventDefault()
    setDangGui(true)
    const body = {
      maPhong: form.maPhong.trim(),
      tang: Number(form.tang),
      loaiPhongId: Number(form.loaiPhongId),
      tienNghi: form.tienNghi || null,
      ghiChu: form.ghiChu || null,
    }
    try {
      if (suaId) await PhongApi.capNhat(suaId, body)
      else await PhongApi.tao(body)
      toast.thanhCong(suaId ? 'Đã cập nhật phòng' : 'Đã thêm phòng')
      setForm(null)
      setSuaId(null)
      tai(boLoc)
    } catch (err) {
      toast.loi(thongBaoLoi(err))
    } finally {
      setDangGui(false)
    }
  }

  async function xoa(id) {
    if (!confirm('Xóa phòng này?')) return
    try {
      await PhongApi.xoa(id)
      toast.thanhCong('Đã xóa phòng')
      tai(boLoc)
    } catch (err) {
      toast.loi(thongBaoLoi(err))
    }
  }

  async function doiTt(id, trangThai) {
    try {
      await PhongApi.doiTrangThai(id, trangThai)
      toast.thanhCong('Đã đổi trạng thái')
      tai(boLoc)
    } catch (err) {
      toast.loi(thongBaoLoi(err))
    }
  }

  function moSua(p) {
    setSuaId(p.id)
    setForm({
      maPhong: p.maPhong,
      tang: p.tang,
      loaiPhongId: p.loaiPhongId,
      tienNghi: p.tienNghi || '',
      ghiChu: p.ghiChu || '',
    })
  }

  return (
    <>
      <PageHead kicker="Inventory" title="Phòng" desc={`${ds.tongSoBanGhi} căn trong quỹ phòng.`}>
        <div className="row-actions">
          <button type="button" className={`btn btn--ghost btn--sm ${kieu === 'the' ? 'btn--gold' : ''}`} onClick={() => setKieu('the')}>
            <Icon name="grid" size={14} /> Thẻ
          </button>
          <button type="button" className={`btn btn--ghost btn--sm ${kieu === 'bang' ? 'btn--gold' : ''}`} onClick={() => setKieu('bang')}>
            <Icon name="list" size={14} /> Bảng
          </button>
          <button className="btn" onClick={() => { setSuaId(null); setForm({ ...TRONG_FORM, loaiPhongId: loai[0]?.id || '' }) }}>
            <Icon name="plus" size={14} /> Thêm phòng
          </button>
        </div>
      </PageHead>
      <div className="toolbar">
        <input className="grow" placeholder="Tìm mã phòng, khách…" value={boLoc.keyword} onChange={(e) => capNhatLoc('keyword', e.target.value)} />
        <input type="number" placeholder="Tầng" style={{ width: 90 }} value={boLoc.tang} onChange={(e) => capNhatLoc('tang', e.target.value)} />
        <select value={boLoc.trangThai} onChange={(e) => capNhatLoc('trangThai', e.target.value)}>
          <option value="">Mọi trạng thái</option>
          <option value="trong">Trống</option>
          <option value="dang_thue">Đang thuê</option>
          <option value="bao_tri">Bảo trì</option>
          <option value="da_dat_coc">Đã đặt cọc</option>
        </select>
        <input type="number" placeholder="Giá từ" style={{ width: 120 }} value={boLoc.giaTu} onChange={(e) => capNhatLoc('giaTu', e.target.value)} />
        <input type="number" placeholder="Giá đến" style={{ width: 120 }} value={boLoc.giaDen} onChange={(e) => capNhatLoc('giaDen', e.target.value)} />
      </div>

      {!ds.noiDung?.length ? (
        <div className="card"><Empty /></div>
      ) : kieu === 'the' ? (
        <>
          <div className="listing-grid">
            {ds.noiDung.map((p) => (
              <article key={p.id} className="listing">
                <div
                  className="listing-hero"
                  style={{ backgroundImage: `linear-gradient(180deg, rgba(12,27,51,.08), rgba(12,27,51,.62)), url(${anhPhong(p.id)})` }}
                >
                  <span>Tầng {p.tang}</span>
                  <strong><Link to={`/quan-ly/phong/${p.id}`} style={{ color: '#fff' }}>{p.maPhong}</Link></strong>
                </div>
                <div className="listing-body">
                  <div className="listing-price">{tien(p.giaThue)}<span className="muted" style={{ fontSize: 13, fontFamily: 'var(--sans)' }}> /tháng</span></div>
                  <div className="listing-meta">{p.tenLoai} · {p.dienTich ? `${p.dienTich} m²` : '—'}</div>
                  <div className="listing-meta">{p.tenKhachDangThue || 'Chưa có khách'}</div>
                  <div className="listing-foot">
                    <Badge nhom="phong" ma={p.trangThai} />
                    <div className="row-actions">
                      <Link to={`/quan-ly/phong/${p.id}`} className="btn btn--ghost btn--sm">Hồ sơ</Link>
                      <button className="btn btn--ghost btn--sm" onClick={() => moSua(p)}>Sửa</button>
                      {p.trangThai !== 'dang_thue' && (
                        <button className="btn btn--ghost btn--sm" onClick={() => doiTt(p.id, p.trangThai === 'bao_tri' ? 'trong' : 'bao_tri')}>
                          {p.trangThai === 'bao_tri' ? 'Hết BT' : 'BT'}
                        </button>
                      )}
                      <button className="btn btn--ghost btn--sm" onClick={() => xoa(p.id)}>Xóa</button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <Pagination trang={ds.trang} tongSoTrang={ds.tongSoTrang} onChange={(t) => capNhatLoc('trang', t)} />
        </>
      ) : (
        <div className="card">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Mã</th><th>Tầng</th><th>Loại</th><th>Giá</th><th>Diện tích</th>
                  <th>Trạng thái</th><th>Khách</th><th></th>
                </tr>
              </thead>
              <tbody>
                {ds.noiDung.map((p) => (
                  <tr key={p.id}>
                    <td><Link to={`/quan-ly/phong/${p.id}`}>{p.maPhong}</Link></td>
                    <td>{p.tang}</td>
                    <td>{p.tenLoai}</td>
                    <td>{tien(p.giaThue)}</td>
                    <td>{p.dienTich ? `${p.dienTich} m²` : '—'}</td>
                    <td><Badge nhom="phong" ma={p.trangThai} /></td>
                    <td>{p.tenKhachDangThue || '—'}</td>
                    <td className="row-actions">
                      <Link to={`/quan-ly/phong/${p.id}`} className="btn btn--ghost btn--sm">Hồ sơ</Link>
                      <button className="btn btn--ghost btn--sm" onClick={() => moSua(p)}>Sửa</button>
                      {p.trangThai !== 'dang_thue' && (
                        <button className="btn btn--ghost btn--sm" onClick={() => doiTt(p.id, p.trangThai === 'bao_tri' ? 'trong' : 'bao_tri')}>
                          {p.trangThai === 'bao_tri' ? 'Hết bảo trì' : 'Bảo trì'}
                        </button>
                      )}
                      <button className="btn btn--ghost btn--sm" onClick={() => xoa(p.id)}>Xóa</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination trang={ds.trang} tongSoTrang={ds.tongSoTrang} onChange={(t) => capNhatLoc('trang', t)} />
        </div>
      )}

      {form && (
        <Modal title={suaId ? 'Sửa phòng' : 'Thêm phòng'} onClose={() => setForm(null)}>
          <form onSubmit={luu}>
            <div className="form-grid">
              <Field label="Mã phòng"><input required maxLength={20} value={form.maPhong} onChange={(e) => setForm({ ...form, maPhong: e.target.value })} /></Field>
              <Field label="Tầng"><input type="number" min={0} max={50} required value={form.tang} onChange={(e) => setForm({ ...form, tang: e.target.value })} /></Field>
              <Field label="Loại phòng" full>
                <select required value={form.loaiPhongId} onChange={(e) => setForm({ ...form, loaiPhongId: e.target.value })}>
                  <option value="">Chọn loại</option>
                  {loai.map((l) => <option key={l.id} value={l.id}>{l.tenLoai} — {tien(l.giaThue)}</option>)}
                </select>
              </Field>
              <Field label="Tiện nghi" full><input value={form.tienNghi} onChange={(e) => setForm({ ...form, tienNghi: e.target.value })} /></Field>
              <Field label="Ghi chú" full><textarea rows={3} value={form.ghiChu} onChange={(e) => setForm({ ...form, ghiChu: e.target.value })} /></Field>
            </div>
            <Actions onClose={() => setForm(null)} dangGui={dangGui} />
          </form>
        </Modal>
      )}
    </>
  )
}
