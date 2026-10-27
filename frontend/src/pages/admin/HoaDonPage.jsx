import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { HoaDonApi, HopDongApi } from '../../api/services'
import { thongBaoLoi } from '../../api/client'
import { nhan, ngay, ngayGioVietNam, so, tien } from '../../utils/format'
import { Actions, Badge, Empty, Field, Modal, PageHead, Pagination } from '../../components/ui'
import { useToast } from '../../context/ToastContext'
import { Icon } from '../../components/icons'

function kyHienTai() {
  return new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Ho_Chi_Minh' }).format(new Date()).slice(0, 7)
}

function chiSoCu(d, lap) {
  return lap.goiY.kyDau ? Number(lap.chiSoCu[d.dichVuId] || 0) : Number(d.chiSoCu)
}

function thanhTien(d, lap) {
  if (!d.theoChiSo) return Number(d.thanhTien)
  const moi = lap.chiSoMoi[d.dichVuId]
  if (moi === '' || moi == null) return 0
  return Math.max(Number(moi) - chiSoCu(d, lap), 0) * Number(d.donGia)
}

export function BangDong({ dong }) {
  return (
    <div className="table-wrap">
      <table>
        <thead><tr><th>Khoản</th><th>Chỉ số</th><th>Số lượng</th><th>Đơn giá</th><th>Thành tiền</th></tr></thead>
        <tbody>
          {dong.map((d, i) => (
            <tr key={i}>
              <td>{d.noiDung}</td>
              <td>{d.theoChiSo ? `${so(d.chiSoCu)} → ${so(d.chiSoMoi)}` : '—'}</td>
              <td>{so(d.soLuong)} {d.donVi}</td>
              <td>{tien(d.donGia)}</td>
              <td>{tien(d.thanhTien)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function HoaDonPage() {
  const toast = useToast()
  const [ky, setKy] = useState(kyHienTai)
  const [boLoc, setBoLoc] = useState({ trangThai: '', keyword: '', trang: 0 })
  const [ds, setDs] = useState({ noiDung: [], trang: 0, tongSoTrang: 0, tongSoBanGhi: 0 })
  const [thongKe, setThongKe] = useState(null)
  const [lap, setLap] = useState(null)
  const [chiTiet, setChiTiet] = useState(null)
  const [phuongThuc, setPhuongThuc] = useState('chuyen_khoan')
  const [dangGui, setDangGui] = useState(false)

  function tai(k = ky, bo = boLoc) {
    HoaDonApi.danhSach({ ky: k || undefined, trangThai: bo.trangThai || undefined, keyword: bo.keyword || undefined, trang: bo.trang, kichThuoc: 10 })
      .then((r) => setDs(r.data)).catch((e) => toast.loi(thongBaoLoi(e)))
    HoaDonApi.thongKe(k || kyHienTai()).then((r) => setThongKe(r.data)).catch(() => setThongKe(null))
  }

  useEffect(() => { tai() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function capNhatLoc(k, v) {
    const next = { ...boLoc, [k]: v, trang: k === 'trang' ? v : 0 }
    setBoLoc(next)
    tai(ky, next)
  }

  function doiKy(v) {
    setKy(v)
    tai(v, { ...boLoc, trang: 0 })
  }

  async function moLap() {
    try {
      const { data } = await HopDongApi.danhSach({ trangThai: 'hieu_luc', kichThuoc: 100 })
      setLap({ hopDong: data.noiDung || [], hopDongId: '', ky: ky || kyHienTai(), goiY: null, chiSoCu: {}, chiSoMoi: {}, ghiChu: '' })
    } catch (e) { toast.loi(thongBaoLoi(e)) }
  }

  async function taiGoiY(hopDongId, kyLap) {
    setLap((x) => ({ ...x, hopDongId, ky: kyLap, goiY: null, chiSoCu: {}, chiSoMoi: {} }))
    if (!hopDongId || !kyLap) return
    try {
      const { data } = await HoaDonApi.goiY(hopDongId, kyLap)
      setLap((x) => ({ ...x, goiY: data }))
    } catch (e) { toast.loi(thongBaoLoi(e)) }
  }

  async function luuLap(e) {
    e.preventDefault()
    setDangGui(true)
    try {
      const chiSo = lap.goiY.dong.filter((d) => d.theoChiSo)
        .map((d) => ({ dichVuId: d.dichVuId, chiSoCu: lap.goiY.kyDau ? chiSoCu(d, lap) : null, chiSoMoi: Number(lap.chiSoMoi[d.dichVuId]) }))
      const { data } = await HoaDonApi.lap({ hopDongId: Number(lap.hopDongId), ky: lap.ky, chiSo, ghiChu: lap.ghiChu })
      toast.thanhCong(`Đã lập hóa đơn ${data.maHoaDon}`)
      setLap(null)
      tai()
    } catch (err) {
      toast.loi(thongBaoLoi(err))
    } finally {
      setDangGui(false)
    }
  }

  async function moChiTiet(id) {
    try { setChiTiet((await HoaDonApi.chiTiet(id)).data) } catch (e) { toast.loi(thongBaoLoi(e)) }
  }

  async function thanhToan() {
    setDangGui(true)
    try {
      const { data } = await HoaDonApi.thanhToan(chiTiet.id, phuongThuc)
      toast.thanhCong('Đã ghi nhận thanh toán')
      setChiTiet(data)
      tai()
    } catch (e) { toast.loi(thongBaoLoi(e)) } finally { setDangGui(false) }
  }

  async function huy() {
    if (!confirm(`Hủy hóa đơn ${chiTiet.maHoaDon}?`)) return
    try {
      await HoaDonApi.huy(chiTiet.id)
      toast.thanhCong('Đã hủy hóa đơn')
      setChiTiet(null)
      tai()
    } catch (e) { toast.loi(thongBaoLoi(e)) }
  }

  const tongDuKien = lap?.goiY ? lap.goiY.dong.reduce((s, d) => s + thanhTien(d, lap), 0) : 0

  return (
    <>
      <PageHead kicker="Billing" title="Hóa đơn" desc="Lập hóa đơn tháng theo hợp đồng và ghi nhận thu tiền.">
        <button className="btn" onClick={moLap}><Icon name="plus" size={14} /> Lập hóa đơn</button>
      </PageHead>

      {thongKe && (
        <div className="grid-cards">
          <div className="stat"><span>Hóa đơn kỳ {thongKe.ky}</span><strong>{so(thongKe.soHoaDon)}</strong></div>
          <div className="stat"><span>Phải thu</span><strong>{tien(thongKe.phaiThu)}</strong></div>
          <div className="stat"><span>Đã thu</span><strong>{tien(thongKe.daThu)}</strong></div>
          <div className="stat"><span>Còn nợ kỳ này</span><strong>{tien(thongKe.conNoKy)}</strong></div>
          <div className="stat"><span>Tổng công nợ</span><strong>{tien(thongKe.tongCongNo)}</strong><em>Mọi kỳ</em></div>
        </div>
      )}

      <div className="toolbar">
        <input type="month" value={ky} onChange={(e) => doiKy(e.target.value)} />
        <input className="grow" placeholder="Tìm mã hóa đơn, phòng, khách…" value={boLoc.keyword} onChange={(e) => capNhatLoc('keyword', e.target.value)} />
        <select value={boLoc.trangThai} onChange={(e) => capNhatLoc('trangThai', e.target.value)}>
          <option value="">Mọi trạng thái</option>
          <option value="da_chot">Chưa thanh toán</option>
          <option value="da_thanh_toan">Đã thanh toán</option>
        </select>
      </div>

      <div className="card">
        {!ds.noiDung?.length ? <Empty text="Chưa có hóa đơn trong kỳ này." /> : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Mã</th><th>Kỳ</th><th>Phòng</th><th>Khách</th><th>Tổng tiền</th><th>Hạn</th><th>Trạng thái</th><th></th></tr></thead>
              <tbody>
                {ds.noiDung.map((h) => (
                  <tr key={h.id}>
                    <td>{h.maHoaDon}</td>
                    <td>{h.ky}</td>
                    <td>{h.maPhong}</td>
                    <td>{h.khachThue}</td>
                    <td>{tien(h.tongTien)}</td>
                    <td>{ngay(h.hanThanhToan)}</td>
                    <td><Badge nhom="hoaDon" ma={h.trangThai} /></td>
                    <td className="row-actions"><button className="btn btn--ghost btn--sm" onClick={() => moChiTiet(h.id)}>Chi tiết</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <Pagination trang={ds.trang} tongSoTrang={ds.tongSoTrang} onChange={(t) => capNhatLoc('trang', t)} />
      </div>

      {lap && (
        <Modal title="Lập hóa đơn" onClose={() => setLap(null)} wide>
          <form onSubmit={luuLap}>
            <div className="form-grid">
              <Field label="Hợp đồng đang hiệu lực">
                <select required value={lap.hopDongId} onChange={(e) => taiGoiY(e.target.value, lap.ky)}>
                  <option value="">Chọn hợp đồng</option>
                  {lap.hopDong.map((h) => <option key={h.id} value={h.id}>{h.maPhong} — {h.khachThue?.hoTen} ({h.maHopDong})</option>)}
                </select>
              </Field>
              <Field label="Kỳ"><input type="month" required value={lap.ky} onChange={(e) => taiGoiY(lap.hopDongId, e.target.value)} /></Field>
            </div>
            {lap.goiY?.kyDau && <p className="muted">Hóa đơn đầu tiên của hợp đồng: nhập chỉ số lúc nhận phòng làm chỉ số cũ.</p>}
            {lap.goiY && (
              <div className="table-wrap">
                <table>
                  <thead><tr><th>Khoản</th><th>Chỉ số cũ</th><th>Chỉ số mới</th><th>Đơn giá</th><th>Thành tiền</th></tr></thead>
                  <tbody>
                    {lap.goiY.dong.map((d, i) => (
                      <tr key={i}>
                        <td>{d.noiDung}</td>
                        <td>{!d.theoChiSo ? '—' : lap.goiY.kyDau ? (
                          <input type="number" required min={0} step="0.01" style={{ width: 110 }}
                            value={lap.chiSoCu[d.dichVuId] ?? ''}
                            onChange={(e) => setLap({ ...lap, chiSoCu: { ...lap.chiSoCu, [d.dichVuId]: e.target.value } })} />
                        ) : so(d.chiSoCu)}</td>
                        <td>{d.theoChiSo ? (
                          <input type="number" required min={chiSoCu(d, lap)} step="0.01" style={{ width: 110 }}
                            value={lap.chiSoMoi[d.dichVuId] ?? ''}
                            onChange={(e) => setLap({ ...lap, chiSoMoi: { ...lap.chiSoMoi, [d.dichVuId]: e.target.value } })} />
                        ) : `${so(d.soLuong)} ${d.donVi}`}</td>
                        <td>{tien(d.donGia)}{d.theoChiSo ? ` /${d.donVi}` : ''}</td>
                        <td>{tien(thanhTien(d, lap))}</td>
                      </tr>
                    ))}
                    <tr><td colSpan={4}><strong>Tổng dự kiến</strong></td><td><strong>{tien(tongDuKien)}</strong></td></tr>
                  </tbody>
                </table>
              </div>
            )}
            <Field label="Ghi chú" full><input maxLength={500} value={lap.ghiChu} onChange={(e) => setLap({ ...lap, ghiChu: e.target.value })} /></Field>
            <Actions onClose={() => setLap(null)} dangGui={dangGui || !lap.goiY} submitLabel="Lập hóa đơn" />
          </form>
        </Modal>
      )}

      {chiTiet && (
        <Modal title={`Hóa đơn ${chiTiet.maHoaDon}`} onClose={() => setChiTiet(null)} wide>
          <dl className="kv">
            <dt>Phòng</dt><dd>{chiTiet.maPhong} — <Link to={`/quan-ly/hop-dong/${chiTiet.hopDongId}`}>{chiTiet.maHopDong}</Link></dd>
            <dt>Khách thuê</dt><dd>{chiTiet.khachThue}</dd>
            <dt>Kỳ</dt><dd>{chiTiet.ky}</dd>
            <dt>Hạn thanh toán</dt><dd>{ngay(chiTiet.hanThanhToan)}</dd>
            <dt>Trạng thái</dt><dd><Badge nhom="hoaDon" ma={chiTiet.trangThai} />
              {chiTiet.ngayThanhToan && ` ${ngayGioVietNam(chiTiet.ngayThanhToan)} · ${nhan('phuongThuc', chiTiet.phuongThuc)}`}</dd>
            {chiTiet.ghiChu && <><dt>Ghi chú</dt><dd>{chiTiet.ghiChu}</dd></>}
          </dl>
          <BangDong dong={chiTiet.dong} />
          <p><strong>Tổng cộng: {tien(chiTiet.tongTien)}</strong></p>
          {chiTiet.trangThai !== 'da_thanh_toan' && (
            <div className="modal-actions">
              <button type="button" className="btn btn--ghost" onClick={huy}>Hủy hóa đơn</button>
              <select value={phuongThuc} onChange={(e) => setPhuongThuc(e.target.value)}>
                <option value="chuyen_khoan">Chuyển khoản</option>
                <option value="tien_mat">Tiền mặt</option>
                <option value="vi_dien_tu">Ví điện tử</option>
              </select>
              <button type="button" className="btn btn--gold" disabled={dangGui} onClick={thanhToan}>Ghi nhận đã thu</button>
            </div>
          )}
        </Modal>
      )}
    </>
  )
}
