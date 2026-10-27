import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { DichVuApi, HopDongApi, KhachThueApi, PhongApi } from '../api/services'
import { thongBaoLoi } from '../api/client'
import { ngay, tien } from '../utils/format'
import { Actions, Badge, Empty, Field, Modal, PageHead, Pagination } from '../components/ui'
import { useToast } from '../context/ToastContext'

const TRONG = {
  phongId: '', khachThueId: '', ngayBatDau: '', ngayKetThuc: '',
  giaThue: '', tienCoc: '', ghiChu: '', nguoiOCungIds: [], dichVu: [],
}

export default function HopDongPage() {
  const toast = useToast()
  const [ds, setDs] = useState({ noiDung: [], trang: 0, tongSoTrang: 0, tongSoBanGhi: 0 })
  const [boLoc, setBoLoc] = useState({ keyword: '', trangThai: '', sapHetHan: '', trang: 0 })
  const [form, setForm] = useState(null)
  const [phongTrong, setPhongTrong] = useState([])
  const [khach, setKhach] = useState([])
  const [dichVu, setDichVu] = useState([])
  const [dangGui, setDangGui] = useState(false)

  function tai(bo = boLoc) {
    HopDongApi.danhSach({
      keyword: bo.keyword || undefined,
      trangThai: bo.trangThai || undefined,
      sapHetHan: bo.sapHetHan === '' ? undefined : true,
      trang: bo.trang,
      kichThuoc: 10,
    }).then((r) => setDs(r.data)).catch((e) => toast.loi(thongBaoLoi(e)))
  }
  useEffect(() => { tai() }, []) // eslint-disable-line

  function capNhatLoc(k, v) {
    const next = { ...boLoc, [k]: v, trang: k === 'trang' ? v : 0 }
    setBoLoc(next)
    tai(next)
  }

  async function moTao() {
    try {
      const [p, k, dv] = await Promise.all([
        PhongApi.trong(),
        KhachThueApi.danhSach({ kichThuoc: 100 }),
        DichVuApi.danhSach({ dangApDung: true }),
      ])
      setPhongTrong(p.data)
      setKhach(k.data.noiDung || [])
      setDichVu(dv.data)
      setForm({ ...TRONG })
    } catch (e) {
      toast.loi(thongBaoLoi(e))
    }
  }

  function toggleOCung(id) {
    const ids = form.nguoiOCungIds.includes(id)
      ? form.nguoiOCungIds.filter((x) => x !== id)
      : [...form.nguoiOCungIds, id]
    setForm({ ...form, nguoiOCungIds: ids })
  }

  function toggleDv(id) {
    const co = form.dichVu.find((d) => d.dichVuId === id)
    const dichVuNext = co
      ? form.dichVu.filter((d) => d.dichVuId !== id)
      : [...form.dichVu, { dichVuId: id, soLuong: 1 }]
    setForm({ ...form, dichVu: dichVuNext })
  }

  async function luu(e) {
    e.preventDefault()
    setDangGui(true)
    const body = {
      phongId: Number(form.phongId),
      khachThueId: Number(form.khachThueId),
      ngayBatDau: form.ngayBatDau,
      ngayKetThuc: form.ngayKetThuc,
      giaThue: form.giaThue === '' ? null : Number(form.giaThue),
      tienCoc: Number(form.tienCoc),
      nguoiOCungIds: form.nguoiOCungIds.filter((id) => id !== Number(form.khachThueId)),
      dichVu: form.dichVu,
      ghiChu: form.ghiChu || null,
    }
    try {
      await HopDongApi.tao(body)
      toast.thanhCong('Đã lập hợp đồng')
      setForm(null)
      tai(boLoc)
    } catch (err) {
      toast.loi(thongBaoLoi(err))
    } finally {
      setDangGui(false)
    }
  }

  return (
    <>
      <PageHead kicker="Leasing desk" title="Hợp đồng" desc={`${ds.tongSoBanGhi} hồ sơ thuê.`}>
        <button className="btn" onClick={moTao}>Lập hợp đồng</button>
      </PageHead>
      <div className="toolbar">
        <input className="grow" placeholder="Mã HĐ, phòng, khách…" value={boLoc.keyword} onChange={(e) => capNhatLoc('keyword', e.target.value)} />
        <select value={boLoc.trangThai} onChange={(e) => capNhatLoc('trangThai', e.target.value)}>
          <option value="">Mọi trạng thái</option>
          <option value="hieu_luc">Hiệu lực</option>
          <option value="het_han">Hết hạn</option>
          <option value="thanh_ly">Thanh lý</option>
        </select>
        <select value={boLoc.sapHetHan} onChange={(e) => capNhatLoc('sapHetHan', e.target.value)}>
          <option value="">Mọi hạn</option>
          <option value="1">Sắp hết hạn</option>
        </select>
      </div>
      <div className="card">
        {!ds.noiDung?.length ? <Empty /> : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Mã</th><th>Phòng</th><th>Khách</th><th>Bắt đầu</th>
                  <th>Kết thúc</th><th>Giá</th><th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {ds.noiDung.map((hd) => (
                  <tr key={hd.id}>
                    <td><Link to={`/quan-ly/hop-dong/${hd.id}`}>{hd.maHopDong}</Link></td>
                    <td>{hd.maPhong}</td>
                    <td>{hd.khachThue?.hoTen}</td>
                    <td>{ngay(hd.ngayBatDau)}</td>
                    <td>{ngay(hd.ngayKetThuc)}</td>
                    <td>{tien(hd.giaThue)}</td>
                    <td><Badge nhom="hopDong" ma={hd.trangThai} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <Pagination trang={ds.trang} tongSoTrang={ds.tongSoTrang} onChange={(t) => capNhatLoc('trang', t)} />
      </div>

      {form && (
        <Modal title="Lập hợp đồng" wide onClose={() => setForm(null)}>
          <form onSubmit={luu}>
            <div className="form-grid">
              <Field label="Phòng trống">
                <select required value={form.phongId} onChange={(e) => setForm({ ...form, phongId: e.target.value })}>
                  <option value="">Chọn phòng</option>
                  {phongTrong.map((p) => <option key={p.id} value={p.id}>{p.maPhong} · {tien(p.giaThue)}</option>)}
                </select>
              </Field>
              <Field label="Khách đại diện">
                <select required value={form.khachThueId} onChange={(e) => setForm({ ...form, khachThueId: e.target.value })}>
                  <option value="">Chọn khách</option>
                  {khach.map((k) => <option key={k.id} value={k.id}>{k.hoTen} · {k.sdt}</option>)}
                </select>
              </Field>
              <Field label="Ngày bắt đầu"><input type="date" required value={form.ngayBatDau} onChange={(e) => setForm({ ...form, ngayBatDau: e.target.value })} /></Field>
              <Field label="Ngày kết thúc"><input type="date" required value={form.ngayKetThuc} onChange={(e) => setForm({ ...form, ngayKetThuc: e.target.value })} /></Field>
              <Field label="Giá thuê (để trống = giá loại phòng)"><input type="number" min={0} value={form.giaThue} onChange={(e) => setForm({ ...form, giaThue: e.target.value })} /></Field>
              <Field label="Tiền cọc"><input type="number" min={0} required value={form.tienCoc} onChange={(e) => setForm({ ...form, tienCoc: e.target.value })} /></Field>
              <Field label="Ghi chú" full><textarea rows={2} value={form.ghiChu} onChange={(e) => setForm({ ...form, ghiChu: e.target.value })} /></Field>
              <Field label="Người ở cùng" full>
                <div className="check-row">
                  {khach.filter((k) => String(k.id) !== String(form.khachThueId)).map((k) => (
                    <label key={k.id} className="check-chip">
                      <input type="checkbox" checked={form.nguoiOCungIds.includes(k.id)} onChange={() => toggleOCung(k.id)} />
                      {k.hoTen}
                    </label>
                  ))}
                  {khach.length <= 1 && <span className="muted">Không có khách khác.</span>}
                </div>
              </Field>
              <Field label="Dịch vụ đi kèm" full>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {dichVu.map((dv) => {
                    const chon = form.dichVu.find((x) => x.dichVuId === dv.id)
                    return (
                      <label key={dv.id} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <input type="checkbox" checked={!!chon} onChange={() => toggleDv(dv.id)} />
                        {dv.tenDichVu} ({tien(dv.donGia)}/{dv.donVi})
                        {chon && (
                          <input type="number" min={1} step="0.01" style={{ width: 90 }} value={chon.soLuong}
                            onChange={(e) => setForm({
                              ...form,
                              dichVu: form.dichVu.map((x) => x.dichVuId === dv.id ? { ...x, soLuong: Number(e.target.value) } : x),
                            })} />
                        )}
                      </label>
                    )
                  })}
                </div>
              </Field>
            </div>
            <Actions onClose={() => setForm(null)} dangGui={dangGui} submitLabel="Lập hợp đồng" />
          </form>
        </Modal>
      )}
    </>
  )
}
