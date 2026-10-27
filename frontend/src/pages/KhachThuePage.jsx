import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { KhachThueApi } from '../api/services'
import { thongBaoLoi } from '../api/client'
import { Actions, Badge, Empty, Field, Modal, PageHead, Pagination } from '../components/ui'
import { useToast } from '../context/ToastContext'

const TRONG = {
  hoTen: '', cccd: '', sdt: '', email: '', ngaySinh: '',
  gioiTinh: 'nam', queQuan: '', trangThaiTamTru: 'chua_khai_bao', ngayKhaiBao: '',
}

export default function KhachThuePage() {
  const toast = useToast()
  const [ds, setDs] = useState({ noiDung: [], trang: 0, tongSoTrang: 0, tongSoBanGhi: 0 })
  const [boLoc, setBoLoc] = useState({ keyword: '', trangThaiTamTru: '', dangThue: '', trang: 0 })
  const [form, setForm] = useState(null)
  const [suaId, setSuaId] = useState(null)
  const [dangGui, setDangGui] = useState(false)

  function tai(bo = boLoc) {
    KhachThueApi.danhSach({
      keyword: bo.keyword || undefined,
      trangThaiTamTru: bo.trangThaiTamTru || undefined,
      dangThue: bo.dangThue === '' ? undefined : bo.dangThue === 'true',
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

  function bodyTuForm() {
    return {
      hoTen: form.hoTen.trim(),
      cccd: form.cccd.trim(),
      sdt: form.sdt.trim(),
      email: form.email || null,
      ngaySinh: form.ngaySinh || null,
      gioiTinh: form.gioiTinh || null,
      queQuan: form.queQuan || null,
      trangThaiTamTru: form.trangThaiTamTru || null,
      ngayKhaiBao: form.ngayKhaiBao || null,
    }
  }

  async function luu(e) {
    e.preventDefault()
    setDangGui(true)
    try {
      if (suaId) await KhachThueApi.capNhat(suaId, bodyTuForm())
      else await KhachThueApi.tao(bodyTuForm())
      toast.thanhCong('Đã lưu khách thuê')
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
    if (!confirm('Xóa khách thuê này?')) return
    try {
      await KhachThueApi.xoa(id)
      toast.thanhCong('Đã xóa')
      tai(boLoc)
    } catch (err) {
      toast.loi(thongBaoLoi(err))
    }
  }

  return (
    <>
      <PageHead kicker="Residents" title="Khách thuê" desc={`${ds.tongSoBanGhi} hồ sơ cư dân.`}>
        <button className="btn" onClick={() => { setSuaId(null); setForm({ ...TRONG }) }}>Thêm khách</button>
      </PageHead>
      <div className="toolbar">
        <input className="grow" placeholder="Tên, CCCD, SĐT…" value={boLoc.keyword} onChange={(e) => capNhatLoc('keyword', e.target.value)} />
        <select value={boLoc.trangThaiTamTru} onChange={(e) => capNhatLoc('trangThaiTamTru', e.target.value)}>
          <option value="">Mọi tạm trú</option>
          <option value="chua_khai_bao">Chưa khai báo</option>
          <option value="da_khai_bao">Đã khai báo</option>
          <option value="het_han">Hết hạn</option>
        </select>
        <select value={boLoc.dangThue} onChange={(e) => capNhatLoc('dangThue', e.target.value)}>
          <option value="">Tất cả</option>
          <option value="true">Đang thuê</option>
          <option value="false">Chưa thuê</option>
        </select>
      </div>
      <div className="card">
        {!ds.noiDung?.length ? <Empty /> : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Họ tên</th><th>CCCD</th><th>SĐT</th><th>Giới tính</th>
                  <th>Tạm trú</th><th>Phòng</th><th></th>
                </tr>
              </thead>
              <tbody>
                {ds.noiDung.map((k) => (
                  <tr key={k.id}>
                    <td><Link to={`/quan-ly/khach-thue/${k.id}`}>{k.hoTen}</Link></td>
                    <td>{k.cccd}</td>
                    <td>{k.sdt}</td>
                    <td>{k.gioiTinh === 'nu' ? 'Nữ' : k.gioiTinh === 'khac' ? 'Khác' : 'Nam'}</td>
                    <td><Badge nhom="tamTru" ma={k.trangThaiTamTru} /></td>
                    <td>{k.maPhongHienTai || '—'}</td>
                    <td className="row-actions">
                      <button className="btn btn--ghost btn--sm" onClick={() => {
                        setSuaId(k.id)
                        setForm({
                          hoTen: k.hoTen, cccd: k.cccd, sdt: k.sdt, email: k.email || '',
                          ngaySinh: k.ngaySinh || '', gioiTinh: k.gioiTinh || 'nam',
                          queQuan: k.queQuan || '', trangThaiTamTru: k.trangThaiTamTru || 'chua_khai_bao',
                          ngayKhaiBao: k.ngayKhaiBao || '',
                        })
                      }}>Sửa</button>
                      <button className="btn btn--ghost btn--sm" onClick={() => xoa(k.id)}>Xóa</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <Pagination trang={ds.trang} tongSoTrang={ds.tongSoTrang} onChange={(t) => capNhatLoc('trang', t)} />
      </div>
      {form && (
        <Modal title={suaId ? 'Sửa khách thuê' : 'Thêm khách thuê'} onClose={() => setForm(null)}>
          <form onSubmit={luu}>
            <div className="form-grid">
              <Field label="Họ tên"><input required value={form.hoTen} onChange={(e) => setForm({ ...form, hoTen: e.target.value })} /></Field>
              <Field label="CCCD (12 số)"><input required pattern="\d{12}" value={form.cccd} onChange={(e) => setForm({ ...form, cccd: e.target.value })} /></Field>
              <Field label="Số điện thoại"><input required value={form.sdt} onChange={(e) => setForm({ ...form, sdt: e.target.value })} /></Field>
              <Field label="Email"><input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
              <Field label="Ngày sinh"><input type="date" value={form.ngaySinh} onChange={(e) => setForm({ ...form, ngaySinh: e.target.value })} /></Field>
              <Field label="Giới tính">
                <select value={form.gioiTinh} onChange={(e) => setForm({ ...form, gioiTinh: e.target.value })}>
                  <option value="nam">Nam</option>
                  <option value="nu">Nữ</option>
                  <option value="khac">Khác</option>
                </select>
              </Field>
              <Field label="Quê quán" full><input value={form.queQuan} onChange={(e) => setForm({ ...form, queQuan: e.target.value })} /></Field>
              <Field label="Tạm trú">
                <select value={form.trangThaiTamTru} onChange={(e) => setForm({ ...form, trangThaiTamTru: e.target.value })}>
                  <option value="chua_khai_bao">Chưa khai báo</option>
                  <option value="da_khai_bao">Đã khai báo</option>
                  <option value="het_han">Hết hạn</option>
                </select>
              </Field>
              <Field label="Ngày khai báo"><input type="date" value={form.ngayKhaiBao} onChange={(e) => setForm({ ...form, ngayKhaiBao: e.target.value })} /></Field>
            </div>
            <p className="muted" style={{ marginTop: 8 }}>Ảnh CCCD / tạm trú tải sau khi tạo, trong trang chi tiết.</p>
            <Actions onClose={() => setForm(null)} dangGui={dangGui} />
          </form>
        </Modal>
      )}
    </>
  )
}
