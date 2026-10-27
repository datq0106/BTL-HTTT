import { useEffect, useState } from 'react'
import { BatDongSanApi, PhongApi, TinDangApi } from '../../api/services'
import { thongBaoLoi } from '../../api/client'
import { tien } from '../../utils/format'
import { Actions, Badge, Empty, Field, Modal, PageHead, Pagination } from '../../components/ui'
import { useToast } from '../../context/ToastContext'
import { Icon } from '../../components/icons'

const TRONG_TIN = {
  slug: '', batDongSanId: '', phongId: '', ma: '', tieuDe: '', loai: '', phongNgu: 1, phongTam: 1,
  dienTich: '', tang: 1, gia: '', datCoc: '', tienNghi: '', moTa: '', noiBat: false, trangThaiCan: 'trong',
}
const TRONG_KHU = { slug: '', ten: '', moTa: '', anhUrl: '', khach: '', dacDiem: '', pinX: '', pinY: '', hienThi: true }
const TRONG_BDS = { khuVucSlug: '', ten: '', diaChi: '', pinX: '', pinY: '' }
const ANH_HOP_LE = ['image/jpeg', 'image/png', 'image/webp']
const TOI_DA_ANH = 5 * 1024 * 1024

function soHoacNull(v) {
  return v === '' || v == null ? null : Number(v)
}

function baoCatalog() {
  window.dispatchEvent(new Event('catalog_updated'))
}

export default function TinDangPage() {
  const toast = useToast()
  const [tab, setTab] = useState('tin')
  const [ds, setDs] = useState({ noiDung: [], trang: 0, tongSoTrang: 0, tongSoBanGhi: 0 })
  const [boLoc, setBoLoc] = useState({ q: '', trangThai: '', trang: 0 })
  const [khuVuc, setKhuVuc] = useState([])
  const [batDongSan, setBatDongSan] = useState([])
  const [phong, setPhong] = useState([])
  const [form, setForm] = useState(null)
  const [suaId, setSuaId] = useState(null)
  const [anhTin, setAnhTin] = useState(null)
  const [khuForm, setKhuForm] = useState(null)
  const [khuMoi, setKhuMoi] = useState(false)
  const [bdsForm, setBdsForm] = useState(null)
  const [bdsId, setBdsId] = useState(null)
  const [dangGui, setDangGui] = useState(false)

  function tai(bo = boLoc) {
    TinDangApi.danhSach({ q: bo.q || undefined, trangThai: bo.trangThai || undefined, trang: bo.trang, kichThuoc: 10 })
      .then((r) => setDs(r.data)).catch((e) => toast.loi(thongBaoLoi(e)))
  }

  function taiDanhMuc() {
    Promise.all([BatDongSanApi.khuVuc(), BatDongSanApi.danhSach()])
      .then(([k, b]) => { setKhuVuc(k.data || []); setBatDongSan(b.data || []) })
      .catch((e) => toast.loi(thongBaoLoi(e)))
  }

  useEffect(() => {
    tai(boLoc)
    taiDanhMuc()
    PhongApi.danhSach({ trang: 0, kichThuoc: 100 }).then((r) => setPhong(r.data.noiDung || [])).catch(() => setPhong([]))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function capNhatLoc(k, v) {
    const next = { ...boLoc, [k]: v, trang: k === 'trang' ? v : 0 }
    setBoLoc(next)
    tai(next)
  }

  function moTao() {
    if (!batDongSan.length) {
      toast.loi('Cần tạo khu vực và tòa nhà trước khi đăng tin')
      setTab('danh-muc')
      return
    }
    setSuaId(null)
    setForm({ ...TRONG_TIN, batDongSanId: batDongSan[0].id })
  }

  function moSua(t) {
    if (t.trangThaiTin === 'xuat_ban') {
      toast.loi('Ẩn tin trước khi sửa nội dung')
      return
    }
    setSuaId(t.dbId)
    setForm({
      slug: t.id, batDongSanId: t.batDongSanId, phongId: t.phongId || '', ma: t.ma, tieuDe: t.tieuDe,
      loai: t.loai, phongNgu: t.phongNgu, phongTam: t.phongTam, dienTich: t.dienTich, tang: t.tang,
      gia: t.gia, datCoc: t.datCoc, tienNghi: (t.tienNghi || []).join('\n'), moTa: t.moTa,
      noiBat: t.noiBat, trangThaiCan: t.phongId ? 'trong' : t.trangThai,
    })
  }

  async function luuTin(e) {
    e.preventDefault()
    setDangGui(true)
    const body = {
      ...form,
      slug: form.slug.trim(), ma: form.ma.trim(), tieuDe: form.tieuDe.trim(), loai: form.loai.trim(),
      batDongSanId: Number(form.batDongSanId), phongId: soHoacNull(form.phongId),
      phongNgu: Number(form.phongNgu), phongTam: Number(form.phongTam), dienTich: Number(form.dienTich),
      tang: Number(form.tang), gia: Number(form.gia), datCoc: Number(form.datCoc),
      tienNghi: form.tienNghi.trim() || null, moTa: form.moTa.trim(),
    }
    try {
      if (suaId) await TinDangApi.sua(suaId, body)
      else await TinDangApi.tao(body)
      toast.thanhCong(suaId ? 'Đã cập nhật tin' : 'Đã tạo tin nháp')
      setForm(null)
      setSuaId(null)
      tai(boLoc)
    } catch (err) {
      toast.loi(thongBaoLoi(err))
    } finally {
      setDangGui(false)
    }
  }

  async function doiTrangThai(t) {
    const xuatBan = t.trangThaiTin !== 'xuat_ban'
    if (!xuatBan && !confirm('Ẩn tin này khỏi website?')) return
    try {
      if (xuatBan) await TinDangApi.xuatBan(t.dbId)
      else await TinDangApi.an(t.dbId)
      toast.thanhCong(xuatBan ? 'Đã xuất bản tin' : 'Đã ẩn tin')
      baoCatalog()
      tai(boLoc)
    } catch (err) {
      toast.loi(thongBaoLoi(err))
    }
  }

  async function luuKhu(e) {
    e.preventDefault()
    setDangGui(true)
    const body = { ...khuForm, slug: khuForm.slug.trim(), pinX: soHoacNull(khuForm.pinX), pinY: soHoacNull(khuForm.pinY) }
    try {
      await BatDongSanApi.luuKhu(body.slug, body)
      toast.thanhCong('Đã lưu khu vực')
      setKhuForm(null)
      taiDanhMuc()
      baoCatalog()
    } catch (err) {
      toast.loi(thongBaoLoi(err))
    } finally {
      setDangGui(false)
    }
  }

  async function luuBds(e) {
    e.preventDefault()
    setDangGui(true)
    const body = { ...bdsForm, pinX: soHoacNull(bdsForm.pinX), pinY: soHoacNull(bdsForm.pinY) }
    try {
      if (bdsId) await BatDongSanApi.sua(bdsId, body)
      else await BatDongSanApi.tao(body)
      toast.thanhCong('Đã lưu tòa nhà')
      setBdsForm(null)
      setBdsId(null)
      taiDanhMuc()
      tai(boLoc)
    } catch (err) {
      toast.loi(thongBaoLoi(err))
    } finally {
      setDangGui(false)
    }
  }

  const tenBds = (id) => batDongSan.find((b) => b.id === id)?.ten || '—'
  const tenKhu = (slug) => khuVuc.find((k) => k.id === slug)?.ten || slug

  return (
    <>
      <PageHead kicker="Listings" title="Tin đăng" desc={`${ds.tongSoBanGhi} tin; chỉ tin đang xuất bản hiện trên website.`}>
        <div className="row-actions">
          <button type="button" className={`btn btn--ghost btn--sm ${tab === 'tin' ? 'btn--gold' : ''}`} onClick={() => setTab('tin')}>
            <Icon name="list" size={14} /> Tin đăng
          </button>
          <button type="button" className={`btn btn--ghost btn--sm ${tab === 'danh-muc' ? 'btn--gold' : ''}`} onClick={() => setTab('danh-muc')}>
            <Icon name="map" size={14} /> Khu vực & tòa nhà
          </button>
          {tab === 'tin' && <button className="btn" onClick={moTao}><Icon name="plus" size={14} /> Thêm tin</button>}
        </div>
      </PageHead>

      {tab === 'tin' ? (
        <>
          <div className="toolbar">
            <input className="grow" placeholder="Tìm mã, tiêu đề…" value={boLoc.q} onChange={(e) => capNhatLoc('q', e.target.value)} />
            <select value={boLoc.trangThai} onChange={(e) => capNhatLoc('trangThai', e.target.value)}>
              <option value="">Mọi trạng thái</option>
              <option value="nhap">Nháp</option>
              <option value="xuat_ban">Đang xuất bản</option>
              <option value="an">Đã ẩn</option>
            </select>
          </div>
          <div className="card">
            {!ds.noiDung?.length ? <Empty text="Chưa có tin đăng." /> : (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr><th>Mã</th><th>Tiêu đề</th><th>Tòa nhà</th><th>Giá niêm yết</th><th>Ảnh</th><th>Căn</th><th>Tin</th><th></th></tr>
                  </thead>
                  <tbody>
                    {ds.noiDung.map((t) => (
                      <tr key={t.dbId}>
                        <td>{t.ma}</td>
                        <td>{t.tieuDe}{t.noiBat && <span className="muted"> · nổi bật</span>}</td>
                        <td>{tenBds(t.batDongSanId)}</td>
                        <td>{tien(t.gia)}</td>
                        <td>{t.chiTietAnh.length}</td>
                        <td><Badge nhom="phong" ma={t.trangThai} /></td>
                        <td><Badge nhom="tinDang" ma={t.trangThaiTin} /></td>
                        <td className="row-actions">
                          {t.trangThaiTin === 'xuat_ban' && (
                            <a className="btn btn--ghost btn--sm" href={`/bat-dong-san/${t.id}`} target="_blank" rel="noreferrer">Xem</a>
                          )}
                          <button className="btn btn--ghost btn--sm" onClick={() => moSua(t)}>Sửa</button>
                          <button className="btn btn--ghost btn--sm" onClick={() => setAnhTin(t)}>Ảnh</button>
                          <button className="btn btn--ghost btn--sm" onClick={() => doiTrangThai(t)}>
                            {t.trangThaiTin === 'xuat_ban' ? 'Ẩn' : 'Xuất bản'}
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
        </>
      ) : (
        <div style={{ display: 'grid', gap: 16 }}>
          <div className="card">
            <div className="page-head">
              <div><h2>Khu vực</h2></div>
              <button className="btn btn--sm" onClick={() => { setKhuMoi(true); setKhuForm(TRONG_KHU) }}><Icon name="plus" size={14} /> Thêm</button>
            </div>
            {!khuVuc.length ? <Empty text="Chưa có khu vực." /> : (
              <div className="table-wrap">
                <table>
                  <thead><tr><th>Khu</th><th>Tin công khai</th><th>Hiển thị</th><th></th></tr></thead>
                  <tbody>
                    {khuVuc.map((k) => (
                      <tr key={k.id}>
                        <td>{k.ten}<div className="muted">{k.id}</div></td>
                        <td>{k.soTin}</td>
                        <td>{k.hienThi ? 'Có' : 'Ẩn'}</td>
                        <td className="row-actions">
                          <button className="btn btn--ghost btn--sm" onClick={() => {
                            setKhuMoi(false)
                            setKhuForm({
                              slug: k.id, ten: k.ten, moTa: k.moTa || '', anhUrl: k.anh || '', khach: k.khach || '',
                              dacDiem: (k.dacDiem || []).join('\n'), pinX: k.pin?.x ?? '', pinY: k.pin?.y ?? '', hienThi: k.hienThi,
                            })
                          }}>Sửa</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          <div className="card">
            <div className="page-head">
              <div><h2>Tòa nhà</h2></div>
              <button className="btn btn--sm" disabled={!khuVuc.length} onClick={() => { setBdsId(null); setBdsForm({ ...TRONG_BDS, khuVucSlug: khuVuc[0]?.id || '' }) }}>
                <Icon name="plus" size={14} /> Thêm
              </button>
            </div>
            {!batDongSan.length ? <Empty text="Chưa có tòa nhà." /> : (
              <div className="table-wrap">
                <table>
                  <thead><tr><th>Tòa nhà</th><th>Khu</th><th></th></tr></thead>
                  <tbody>
                    {batDongSan.map((b) => (
                      <tr key={b.id}>
                        <td>{b.ten}<div className="muted">{b.diaChi}</div></td>
                        <td>{tenKhu(b.khuVucSlug)}</td>
                        <td className="row-actions">
                          <button className="btn btn--ghost btn--sm" onClick={() => {
                            setBdsId(b.id)
                            setBdsForm({ khuVucSlug: b.khuVucSlug, ten: b.ten, diaChi: b.diaChi, pinX: b.pin?.x ?? '', pinY: b.pin?.y ?? '' })
                          }}>Sửa</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {form && (
        <Modal title={suaId ? 'Sửa tin đăng' : 'Thêm tin đăng'} onClose={() => setForm(null)} wide>
          <form onSubmit={luuTin}>
            <div className="form-grid">
              <Field label="Mã tin"><input required maxLength={30} value={form.ma} onChange={(e) => setForm({ ...form, ma: e.target.value })} /></Field>
              <Field label="Slug (đường dẫn)">
                <input required pattern="[a-z0-9-]{2,100}" title="Chữ thường không dấu, số và gạch ngang" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
              </Field>
              <Field label="Tiêu đề" full><input required maxLength={200} value={form.tieuDe} onChange={(e) => setForm({ ...form, tieuDe: e.target.value })} /></Field>
              <Field label="Tòa nhà">
                <select required value={form.batDongSanId} onChange={(e) => setForm({ ...form, batDongSanId: e.target.value })}>
                  {batDongSan.map((b) => <option key={b.id} value={b.id}>{b.ten} — {tenKhu(b.khuVucSlug)}</option>)}
                </select>
              </Field>
              <Field label="Phòng vận hành liên kết">
                <select value={form.phongId} onChange={(e) => setForm({ ...form, phongId: e.target.value })}>
                  <option value="">Không liên kết</option>
                  {phong.map((p) => <option key={p.id} value={p.id}>{p.maPhong} — {p.tenLoai}</option>)}
                </select>
              </Field>
              <Field label="Loại căn"><input required maxLength={80} placeholder="Căn hộ, Studio…" value={form.loai} onChange={(e) => setForm({ ...form, loai: e.target.value })} /></Field>
              <Field label="Tình trạng căn">
                <select value={form.trangThaiCan} disabled={Boolean(form.phongId)} onChange={(e) => setForm({ ...form, trangThaiCan: e.target.value })}>
                  <option value="trong">Trống</option>
                  <option value="da_dat_coc">Đã đặt cọc</option>
                  <option value="dang_thue">Đang thuê</option>
                  <option value="bao_tri">Bảo trì</option>
                </select>
              </Field>
              <Field label="Phòng ngủ"><input type="number" min={0} max={20} required value={form.phongNgu} onChange={(e) => setForm({ ...form, phongNgu: e.target.value })} /></Field>
              <Field label="Phòng tắm"><input type="number" min={0} max={20} required value={form.phongTam} onChange={(e) => setForm({ ...form, phongTam: e.target.value })} /></Field>
              <Field label="Diện tích (m²)"><input type="number" min={1} step="0.01" required value={form.dienTich} onChange={(e) => setForm({ ...form, dienTich: e.target.value })} /></Field>
              <Field label="Tầng"><input type="number" min={0} max={200} required value={form.tang} onChange={(e) => setForm({ ...form, tang: e.target.value })} /></Field>
              <Field label="Giá niêm yết (đ/tháng)"><input type="number" min={1} required value={form.gia} onChange={(e) => setForm({ ...form, gia: e.target.value })} /></Field>
              <Field label="Đặt cọc (đ)"><input type="number" min={0} required value={form.datCoc} onChange={(e) => setForm({ ...form, datCoc: e.target.value })} /></Field>
              <Field label="Tiện nghi (mỗi dòng một mục)" full><textarea rows={3} value={form.tienNghi} onChange={(e) => setForm({ ...form, tienNghi: e.target.value })} /></Field>
              <Field label="Mô tả" full><textarea rows={4} required maxLength={10000} value={form.moTa} onChange={(e) => setForm({ ...form, moTa: e.target.value })} /></Field>
              <Field label="Nổi bật" full>
                <label><input type="checkbox" checked={form.noiBat} onChange={(e) => setForm({ ...form, noiBat: e.target.checked })} /> Ưu tiên ở đầu danh sách</label>
              </Field>
            </div>
            {form.phongId && <p className="muted">Tình trạng căn lấy theo trạng thái phòng vận hành.</p>}
            <Actions onClose={() => setForm(null)} dangGui={dangGui} submitLabel={suaId ? 'Lưu' : 'Tạo tin nháp'} />
          </form>
        </Modal>
      )}

      {anhTin && <AnhTinModal tin={anhTin} onClose={() => setAnhTin(null)} onChange={() => tai(boLoc)} />}

      {khuForm && (
        <Modal title={khuMoi ? 'Thêm khu vực' : 'Sửa khu vực'} onClose={() => setKhuForm(null)}>
          <form onSubmit={luuKhu}>
            <div className="form-grid">
              <Field label="Slug">
                <input required disabled={!khuMoi} pattern="[a-z0-9-]{2,60}" title="Chữ thường không dấu, số và gạch ngang" value={khuForm.slug} onChange={(e) => setKhuForm({ ...khuForm, slug: e.target.value })} />
              </Field>
              <Field label="Tên"><input required maxLength={100} value={khuForm.ten} onChange={(e) => setKhuForm({ ...khuForm, ten: e.target.value })} /></Field>
              <Field label="Mô tả" full><textarea rows={2} maxLength={500} value={khuForm.moTa} onChange={(e) => setKhuForm({ ...khuForm, moTa: e.target.value })} /></Field>
              <Field label="Ảnh (URL)" full><input maxLength={500} value={khuForm.anhUrl} onChange={(e) => setKhuForm({ ...khuForm, anhUrl: e.target.value })} /></Field>
              <Field label="Phù hợp với" full><input maxLength={500} value={khuForm.khach} onChange={(e) => setKhuForm({ ...khuForm, khach: e.target.value })} /></Field>
              <Field label="Đặc điểm (mỗi dòng một mục)" full><textarea rows={3} maxLength={2000} value={khuForm.dacDiem} onChange={(e) => setKhuForm({ ...khuForm, dacDiem: e.target.value })} /></Field>
              <Field label="Vị trí bản đồ X (0–100)"><input type="number" min={0} max={100} step="0.01" value={khuForm.pinX} onChange={(e) => setKhuForm({ ...khuForm, pinX: e.target.value })} /></Field>
              <Field label="Vị trí bản đồ Y (0–100)"><input type="number" min={0} max={100} step="0.01" value={khuForm.pinY} onChange={(e) => setKhuForm({ ...khuForm, pinY: e.target.value })} /></Field>
              <Field label="Hiển thị" full>
                <label><input type="checkbox" checked={khuForm.hienThi} onChange={(e) => setKhuForm({ ...khuForm, hienThi: e.target.checked })} /> Hiện khu và các tin thuộc khu trên website</label>
              </Field>
            </div>
            <Actions onClose={() => setKhuForm(null)} dangGui={dangGui} />
          </form>
        </Modal>
      )}

      {bdsForm && (
        <Modal title={bdsId ? 'Sửa tòa nhà' : 'Thêm tòa nhà'} onClose={() => setBdsForm(null)}>
          <form onSubmit={luuBds}>
            <div className="form-grid">
              <Field label="Khu vực" full>
                <select required value={bdsForm.khuVucSlug} onChange={(e) => setBdsForm({ ...bdsForm, khuVucSlug: e.target.value })}>
                  {khuVuc.map((k) => <option key={k.id} value={k.id}>{k.ten}</option>)}
                </select>
              </Field>
              <Field label="Tên tòa nhà" full><input required maxLength={150} value={bdsForm.ten} onChange={(e) => setBdsForm({ ...bdsForm, ten: e.target.value })} /></Field>
              <Field label="Địa chỉ" full><input required maxLength={300} value={bdsForm.diaChi} onChange={(e) => setBdsForm({ ...bdsForm, diaChi: e.target.value })} /></Field>
              <Field label="Vị trí bản đồ X (0–100)"><input type="number" min={0} max={100} step="0.01" value={bdsForm.pinX} onChange={(e) => setBdsForm({ ...bdsForm, pinX: e.target.value })} /></Field>
              <Field label="Vị trí bản đồ Y (0–100)"><input type="number" min={0} max={100} step="0.01" value={bdsForm.pinY} onChange={(e) => setBdsForm({ ...bdsForm, pinY: e.target.value })} /></Field>
            </div>
            <Actions onClose={() => setBdsForm(null)} dangGui={dangGui} />
          </form>
        </Modal>
      )}
    </>
  )
}

function AnhTinModal({ tin: tinBanDau, onClose, onChange }) {
  const toast = useToast()
  const [tin, setTin] = useState(tinBanDau)
  const [file, setFile] = useState(null)
  const [xemTruoc, setXemTruoc] = useState('')
  const [altText, setAltText] = useState('')
  const [loi, setLoi] = useState('')
  const [dangGui, setDangGui] = useState(false)
  const khoa = tin.trangThaiTin === 'xuat_ban'

  useEffect(() => () => { if (xemTruoc) URL.revokeObjectURL(xemTruoc) }, [xemTruoc])

  function chonFile(f) {
    setLoi('')
    if (!f) { setFile(null); setXemTruoc(''); return }
    if (!ANH_HOP_LE.includes(f.type) || f.size > TOI_DA_ANH) {
      setFile(null)
      setXemTruoc('')
      setLoi(f.size > TOI_DA_ANH ? 'Ảnh vượt quá 5 MB.' : 'Chỉ nhận ảnh JPG, PNG hoặc WEBP.')
      return
    }
    setFile(f)
    setXemTruoc(URL.createObjectURL(f))
  }

  async function thucHien(viec, thongBao) {
    setDangGui(true)
    setLoi('')
    try {
      const { data } = await viec()
      setTin(data)
      onChange()
      if (thongBao) toast.thanhCong(thongBao)
      return true
    } catch (err) {
      setLoi(thongBaoLoi(err))
      return false
    } finally {
      setDangGui(false)
    }
  }

  async function taiLen(e) {
    e.preventDefault()
    if (!file) return
    if (await thucHien(() => TinDangApi.themAnh(tin.dbId, file, altText.trim()), 'Đã tải ảnh lên')) {
      setFile(null)
      setXemTruoc('')
      setAltText('')
      e.target.reset()
    }
  }

  function doiCho(index, buoc) {
    const ids = tin.chiTietAnh.map((a) => a.id)
    const j = index + buoc
    ;[ids[index], ids[j]] = [ids[j], ids[index]]
    thucHien(() => TinDangApi.sapXepAnh(tin.dbId, ids))
  }

  return (
    <Modal title={`Ảnh — ${tin.ma}`} onClose={onClose} wide>
      {khoa && <p className="muted">Tin đang xuất bản. Ẩn tin trước khi thêm, xóa hoặc đổi thứ tự ảnh.</p>}
      {loi && <div role="alert" className="error-line">{loi}</div>}
      {!tin.chiTietAnh.length ? <Empty text="Chưa có ảnh. Cần ít nhất một ảnh để xuất bản." /> : (
        <div className="listing-grid">
          {tin.chiTietAnh.map((a, i) => (
            <article key={a.id} className="listing">
              <img src={a.url} alt={a.altText || tin.tieuDe} style={{ width: '100%', height: 140, objectFit: 'cover' }} />
              <div className="listing-body">
                <div className="listing-meta">{i === 0 ? 'Ảnh bìa · ' : ''}{a.altText || 'Không có mô tả'}</div>
                <div className="row-actions">
                  <button type="button" className="btn btn--ghost btn--sm" disabled={khoa || dangGui || i === 0} onClick={() => doiCho(i, -1)}>Trước</button>
                  <button type="button" className="btn btn--ghost btn--sm" disabled={khoa || dangGui || i === tin.chiTietAnh.length - 1} onClick={() => doiCho(i, 1)}>Sau</button>
                  <button type="button" className="btn btn--ghost btn--sm" disabled={khoa || dangGui} onClick={() => {
                    if (confirm('Xóa ảnh này?')) thucHien(() => TinDangApi.xoaAnh(tin.dbId, a.id), 'Đã xóa ảnh')
                  }}>Xóa</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
      {!khoa && (
        <form onSubmit={taiLen}>
          <div className="form-grid">
            <Field label="Ảnh mới (JPG/PNG/WEBP, tối đa 5 MB)">
              <input type="file" accept={ANH_HOP_LE.join(',')} onChange={(e) => chonFile(e.target.files?.[0])} />
            </Field>
            <Field label="Mô tả ảnh"><input maxLength={200} value={altText} onChange={(e) => setAltText(e.target.value)} /></Field>
          </div>
          {xemTruoc && <img src={xemTruoc} alt="Xem trước" style={{ maxWidth: 240, maxHeight: 160, objectFit: 'cover' }} />}
          <div className="modal-actions">
            <button type="button" className="btn btn--ghost" onClick={onClose}>Đóng</button>
            <button type="submit" className="btn btn--gold" disabled={dangGui || !file}>{dangGui ? 'Đang tải…' : 'Tải lên'}</button>
          </div>
        </form>
      )}
    </Modal>
  )
}
