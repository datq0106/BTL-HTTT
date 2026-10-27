import { useEffect, useState } from 'react'
import { KhachThueApi, TaiKhoanApi } from '../api/services'
import { thongBaoLoi } from '../api/client'
import { ngayGio, nhan } from '../utils/format'
import { Actions, Badge, Empty, Field, Modal, PageHead, Pagination } from '../components/ui'
import { useToast } from '../context/ToastContext'

const TRONG = { tenDangNhap: '', matKhau: '', hoTen: '', vaiTroId: '', khachThueId: '' }

export default function TaiKhoanPage() {
  const toast = useToast()
  const [ds, setDs] = useState({ noiDung: [], trang: 0, tongSoTrang: 0, tongSoBanGhi: 0 })
  const [vaiTro, setVaiTro] = useState([])
  const [khach, setKhach] = useState([])
  const [boLoc, setBoLoc] = useState({ keyword: '', vaiTroId: '', trang: 0 })
  const [form, setForm] = useState(null)
  const [suaId, setSuaId] = useState(null)
  const [sua, setSua] = useState(null)
  const [dangGui, setDangGui] = useState(false)

  function tai(bo = boLoc) {
    TaiKhoanApi.danhSach({
      keyword: bo.keyword || undefined,
      vaiTroId: bo.vaiTroId || undefined,
      trang: bo.trang,
      kichThuoc: 10,
    }).then((r) => setDs(r.data)).catch((e) => toast.loi(thongBaoLoi(e)))
  }

  useEffect(() => {
    TaiKhoanApi.vaiTro().then((r) => setVaiTro(r.data)).catch((e) => toast.loi(thongBaoLoi(e)))
    tai()
  }, []) // eslint-disable-line

  function capNhatLoc(k, v) {
    const next = { ...boLoc, [k]: v, trang: k === 'trang' ? v : 0 }
    setBoLoc(next)
    tai(next)
  }

  async function moTao() {
    try {
      const k = await KhachThueApi.danhSach({ kichThuoc: 100 })
      setKhach(k.data.noiDung || [])
      setSuaId(null)
      setForm({ ...TRONG, vaiTroId: vaiTro[0]?.id || '' })
    } catch (e) {
      toast.loi(thongBaoLoi(e))
    }
  }

  async function luuTao(e) {
    e.preventDefault()
    setDangGui(true)
    try {
      await TaiKhoanApi.tao({
        tenDangNhap: form.tenDangNhap.trim(),
        matKhau: form.matKhau,
        hoTen: form.hoTen.trim(),
        vaiTroId: Number(form.vaiTroId),
        khachThueId: form.khachThueId ? Number(form.khachThueId) : null,
      })
      toast.thanhCong('Đã tạo tài khoản')
      setForm(null)
      tai(boLoc)
    } catch (err) {
      toast.loi(thongBaoLoi(err))
    } finally {
      setDangGui(false)
    }
  }

  async function luuSua(e) {
    e.preventDefault()
    setDangGui(true)
    try {
      await TaiKhoanApi.capNhat(suaId, {
        hoTen: sua.hoTen.trim(),
        vaiTroId: Number(sua.vaiTroId),
        trangThai: sua.trangThai,
      })
      toast.thanhCong('Đã cập nhật')
      setSua(null)
      setSuaId(null)
      tai(boLoc)
    } catch (err) {
      toast.loi(thongBaoLoi(err))
    } finally {
      setDangGui(false)
    }
  }

  async function khoa(tk) {
    try {
      if (tk.trangThai === 'khoa') await TaiKhoanApi.moKhoa(tk.id)
      else await TaiKhoanApi.khoa(tk.id)
      tai(boLoc)
    } catch (e) {
      toast.loi(thongBaoLoi(e))
    }
  }

  return (
    <>
      <PageHead kicker="Access control" title="Tài khoản" desc="Chỉ chủ trọ cấp quyền. Quản lý vận hành quỹ; cư dân chỉ thấy hợp đồng của mình.">
        <button className="btn" onClick={moTao}>Thêm tài khoản</button>
      </PageHead>
      <div className="access-legend">
        <article>
          <p className="page-kicker">Owner</p>
          <h3>Chủ trọ</h3>
          <p>Toàn quyền quỹ căn, loại phòng, dịch vụ và khóa tài khoản.</p>
        </article>
        <article>
          <p className="page-kicker">Leasing</p>
          <h3>Quản lý</h3>
          <p>Phòng, khách, hợp đồng. Không mở mục tài khoản này.</p>
        </article>
        <article>
          <p className="page-kicker">Resident</p>
          <h3>Khách thuê</h3>
          <p>Cổng cư dân — gắn với hồ sơ khách sau khi ký HĐ.</p>
        </article>
      </div>
      <div className="toolbar">
        <input className="grow" placeholder="Tên đăng nhập, họ tên…" value={boLoc.keyword} onChange={(e) => capNhatLoc('keyword', e.target.value)} />
        <select value={boLoc.vaiTroId} onChange={(e) => capNhatLoc('vaiTroId', e.target.value)}>
          <option value="">Mọi vai trò</option>
          {vaiTro.map((v) => <option key={v.id} value={v.id}>{v.tenVaiTro}</option>)}
        </select>
      </div>
      <div className="card">
        {!ds.noiDung?.length ? <Empty /> : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Đăng nhập</th><th>Họ tên</th><th>Vai trò</th><th>Trạng thái</th>
                  <th>Lần đăng nhập</th><th></th>
                </tr>
              </thead>
              <tbody>
                {ds.noiDung.map((tk) => (
                  <tr key={tk.id}>
                    <td>{tk.tenDangNhap}</td>
                    <td>{tk.hoTen}</td>
                    <td>{tk.tenVaiTro || nhan('vaiTro', tk.maVaiTro)}</td>
                    <td><Badge nhom="taiKhoan" ma={tk.trangThai} /></td>
                    <td>{ngayGio(tk.lanDangNhapCuoi)}</td>
                    <td className="row-actions">
                      <button className="btn btn--ghost btn--sm" onClick={() => {
                        setSuaId(tk.id)
                        const vt = vaiTro.find((v) => v.maVaiTro === tk.maVaiTro)
                        setSua({ hoTen: tk.hoTen, vaiTroId: vt?.id || '', trangThai: tk.trangThai })
                      }}>Sửa</button>
                      <button className="btn btn--ghost btn--sm" onClick={() => khoa(tk)}>
                        {tk.trangThai === 'khoa' ? 'Mở khóa' : 'Khóa'}
                      </button>
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
        <Modal title="Thêm tài khoản" onClose={() => setForm(null)}>
          <form onSubmit={luuTao}>
            <div className="form-grid">
              <Field label="Tên đăng nhập"><input required minLength={4} value={form.tenDangNhap} onChange={(e) => setForm({ ...form, tenDangNhap: e.target.value })} /></Field>
              <Field label="Mật khẩu"><input type="password" required minLength={8} value={form.matKhau} onChange={(e) => setForm({ ...form, matKhau: e.target.value })} /></Field>
              <Field label="Họ tên" full><input required value={form.hoTen} onChange={(e) => setForm({ ...form, hoTen: e.target.value })} /></Field>
              <Field label="Vai trò">
                <select required value={form.vaiTroId} onChange={(e) => setForm({ ...form, vaiTroId: e.target.value })}>
                  {vaiTro.map((v) => <option key={v.id} value={v.id}>{v.tenVaiTro}</option>)}
                </select>
              </Field>
              <Field label="Gắn khách thuê (nếu là ROLE_KHACH)">
                <select value={form.khachThueId} onChange={(e) => setForm({ ...form, khachThueId: e.target.value })}>
                  <option value="">Không</option>
                  {khach.map((k) => <option key={k.id} value={k.id}>{k.hoTen}</option>)}
                </select>
              </Field>
            </div>
            <Actions onClose={() => setForm(null)} dangGui={dangGui} submitLabel="Tạo" />
          </form>
        </Modal>
      )}
      {sua && (
        <Modal title="Sửa tài khoản" onClose={() => setSua(null)}>
          <form onSubmit={luuSua}>
            <div className="form-grid">
              <Field label="Họ tên" full><input required value={sua.hoTen} onChange={(e) => setSua({ ...sua, hoTen: e.target.value })} /></Field>
              <Field label="Vai trò">
                <select required value={sua.vaiTroId} onChange={(e) => setSua({ ...sua, vaiTroId: e.target.value })}>
                  {vaiTro.map((v) => <option key={v.id} value={v.id}>{v.tenVaiTro}</option>)}
                </select>
              </Field>
              <Field label="Trạng thái">
                <select value={sua.trangThai} onChange={(e) => setSua({ ...sua, trangThai: e.target.value })}>
                  <option value="hoat_dong">Hoạt động</option>
                  <option value="khoa">Khóa</option>
                </select>
              </Field>
            </div>
            <Actions onClose={() => setSua(null)} dangGui={dangGui} />
          </form>
        </Modal>
      )}
    </>
  )
}
