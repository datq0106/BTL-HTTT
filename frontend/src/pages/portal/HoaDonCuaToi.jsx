import { useEffect, useState } from 'react'
import { KhachApi } from '../../api/services'
import { thongBaoLoi } from '../../api/client'
import { nhan, ngay, ngayGioVietNam, tien } from '../../utils/format'
import { Badge, Empty, Modal, PageHead } from '../../components/ui'
import { useToast } from '../../context/ToastContext'
import { BangDong } from '../admin/HoaDonPage'

export default function HoaDonCuaToi() {
  const toast = useToast()
  const [ds, setDs] = useState(null)
  const [chiTiet, setChiTiet] = useState(null)

  useEffect(() => {
    KhachApi.hoaDon().then((r) => setDs(r.data || [])).catch((e) => { setDs([]); toast.loi(thongBaoLoi(e)) })
  }, [toast])

  async function mo(id) {
    try { setChiTiet((await KhachApi.chiTietHoaDon(id)).data) } catch (e) { toast.loi(thongBaoLoi(e)) }
  }

  if (ds === null) return <div className="empty">Đang tải hóa đơn…</div>
  const conNo = ds.filter((h) => h.trangThai !== 'da_thanh_toan').reduce((s, h) => s + Number(h.tongTien), 0)

  return (
    <>
      <PageHead kicker="Billing" title="Hóa đơn của tôi"
        desc={conNo ? `Còn ${tien(conNo)} chưa thanh toán.` : 'Không có khoản nào chưa thanh toán.'} />
      <div className="card">
        {!ds.length ? <Empty text="Chưa có hóa đơn." /> : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Kỳ</th><th>Phòng</th><th>Tổng tiền</th><th>Hạn</th><th>Trạng thái</th><th></th></tr></thead>
              <tbody>
                {ds.map((h) => (
                  <tr key={h.id}>
                    <td>{h.ky}</td>
                    <td>{h.maPhong}</td>
                    <td>{tien(h.tongTien)}</td>
                    <td>{ngay(h.hanThanhToan)}</td>
                    <td><Badge nhom="hoaDon" ma={h.trangThai} /></td>
                    <td className="row-actions"><button className="btn btn--ghost btn--sm" onClick={() => mo(h.id)}>Chi tiết</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {chiTiet && (
        <Modal title={`Hóa đơn kỳ ${chiTiet.ky}`} onClose={() => setChiTiet(null)} wide>
          <dl className="kv">
            <dt>Mã hóa đơn</dt><dd>{chiTiet.maHoaDon}</dd>
            <dt>Hạn thanh toán</dt><dd>{ngay(chiTiet.hanThanhToan)}</dd>
            <dt>Trạng thái</dt><dd><Badge nhom="hoaDon" ma={chiTiet.trangThai} />
              {chiTiet.ngayThanhToan && ` ${ngayGioVietNam(chiTiet.ngayThanhToan)} · ${nhan('phuongThuc', chiTiet.phuongThuc)}`}</dd>
          </dl>
          <BangDong dong={chiTiet.dong} />
          <p><strong>Tổng cộng: {tien(chiTiet.tongTien)}</strong></p>
          {chiTiet.trangThai !== 'da_thanh_toan' && <p className="muted">Vui lòng thanh toán tại văn phòng hoặc chuyển khoản; ban quản lý sẽ xác nhận sau khi nhận tiền.</p>}
        </Modal>
      )}
    </>
  )
}
