import { useEffect, useState } from 'react'
import { DichVuApi } from '../api/services'
import { thongBaoLoi } from '../api/client'
import { nhan, tien } from '../utils/format'
import { Actions, Empty, Field, Modal, PageHead } from '../components/ui'
import { useToast } from '../context/ToastContext'
import { useAuth } from '../context/AuthContext'

const TRONG = { tenDichVu: '', donGia: '', donVi: 'tháng', loaiTinh: 'co_dinh', dangApDung: true }

export default function DichVuPage() {
  const toast = useToast()
  const { laAdmin } = useAuth()
  const [ds, setDs] = useState([])
  const [form, setForm] = useState(null)
  const [suaId, setSuaId] = useState(null)
  const [dangGui, setDangGui] = useState(false)

  function tai() {
    DichVuApi.danhSach().then((r) => setDs(r.data)).catch((e) => toast.loi(thongBaoLoi(e)))
  }
  useEffect(() => { tai() }, []) // eslint-disable-line

  async function luu(e) {
    e.preventDefault()
    setDangGui(true)
    const body = {
      tenDichVu: form.tenDichVu.trim(),
      donGia: Number(form.donGia),
      donVi: form.donVi.trim(),
      loaiTinh: form.loaiTinh,
      dangApDung: !!form.dangApDung,
    }
    try {
      if (suaId) await DichVuApi.capNhat(suaId, body)
      else await DichVuApi.tao(body)
      toast.thanhCong('Đã lưu dịch vụ')
      setForm(null)
      setSuaId(null)
      tai()
    } catch (err) {
      toast.loi(thongBaoLoi(err))
    } finally {
      setDangGui(false)
    }
  }

  async function apDung(id, apDung) {
    try {
      await DichVuApi.datApDung(id, apDung)
      tai()
    } catch (e) {
      toast.loi(thongBaoLoi(e))
    }
  }

  async function xoa(id) {
    if (!confirm('Xóa dịch vụ này?')) return
    try {
      await DichVuApi.xoa(id)
      toast.thanhCong('Đã xóa')
      tai()
    } catch (e) {
      toast.loi(thongBaoLoi(e))
    }
  }

  return (
    <>
      <PageHead
        kicker="Amenities"
        title="Dịch vụ"
        desc={laAdmin ? 'Điện, nước, internet, gửi xe và các khoản phát sinh.' : 'Bảng giá đang áp dụng. Chỉ chủ trọ chỉnh đơn giá và ngưng dịch vụ.'}
      >
        {laAdmin && <button className="btn" onClick={() => { setSuaId(null); setForm({ ...TRONG }) }}>Thêm dịch vụ</button>}
      </PageHead>
      <div className="card">
        {!ds.length ? <Empty /> : (
          <table>
            <thead>
              <tr>
                <th>Tên</th><th>Đơn giá</th><th>Đơn vị</th><th>Cách tính</th><th>Áp dụng</th>
                {laAdmin && <th></th>}
              </tr>
            </thead>
            <tbody>
              {ds.map((dv) => (
                <tr key={dv.id}>
                  <td>{dv.tenDichVu}</td>
                  <td>{tien(dv.donGia)}</td>
                  <td>{dv.donVi}</td>
                  <td>{nhan('loaiTinh', dv.loaiTinh)}</td>
                  <td>{dv.dangApDung ? 'Có' : 'Không'}</td>
                  {laAdmin && (
                    <td className="row-actions">
                      <button className="btn btn--ghost btn--sm" onClick={() => {
                        setSuaId(dv.id)
                        setForm({ tenDichVu: dv.tenDichVu, donGia: dv.donGia, donVi: dv.donVi, loaiTinh: dv.loaiTinh, dangApDung: dv.dangApDung })
                      }}>Sửa</button>
                      <button className="btn btn--ghost btn--sm" onClick={() => apDung(dv.id, !dv.dangApDung)}>
                        {dv.dangApDung ? 'Ngưng' : 'Áp dụng'}
                      </button>
                      <button className="btn btn--ghost btn--sm" onClick={() => xoa(dv.id)}>Xóa</button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {form && (
        <Modal title={suaId ? 'Sửa dịch vụ' : 'Thêm dịch vụ'} onClose={() => setForm(null)}>
          <form onSubmit={luu}>
            <div className="form-grid">
              <Field label="Tên dịch vụ" full><input required value={form.tenDichVu} onChange={(e) => setForm({ ...form, tenDichVu: e.target.value })} /></Field>
              <Field label="Đơn giá"><input type="number" min={0} required value={form.donGia} onChange={(e) => setForm({ ...form, donGia: e.target.value })} /></Field>
              <Field label="Đơn vị"><input required value={form.donVi} onChange={(e) => setForm({ ...form, donVi: e.target.value })} /></Field>
              <Field label="Cách tính">
                <select value={form.loaiTinh} onChange={(e) => setForm({ ...form, loaiTinh: e.target.value })}>
                  <option value="co_dinh">Cố định tháng</option>
                  <option value="theo_chi_so">Theo chỉ số</option>
                </select>
              </Field>
              <Field label="Áp dụng">
                <select value={form.dangApDung ? '1' : '0'} onChange={(e) => setForm({ ...form, dangApDung: e.target.value === '1' })}>
                  <option value="1">Có</option>
                  <option value="0">Không</option>
                </select>
              </Field>
            </div>
            <Actions onClose={() => setForm(null)} dangGui={dangGui} />
          </form>
        </Modal>
      )}
    </>
  )
}
