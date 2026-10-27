import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { PublicYeuCauApi } from '../../api/services'
import { thongBaoLoi } from '../../api/client'
import { ngayGioVietNam } from '../../utils/format'

const LOAI = {
  'lien-he': 'Liên hệ tư vấn', brief: 'Tìm căn theo nhu cầu',
  'chu-nha': 'Chủ nhà gửi căn', 'quan-tam': 'Quan tâm căn', 'xem-phong': 'Xem căn', 'ung-tuyen': 'Hồ sơ ứng tuyển',
}
const TRANG_THAI = {
  cho_xu_ly: 'Đã tiếp nhận, chờ xử lý', dang_xu_ly: 'Đang xử lý',
  da_xu_ly: 'Đã xử lý', cho_xac_nhan: 'Chờ xác nhận lịch',
  da_xac_nhan: 'Đã xác nhận lịch', da_hoan_thanh: 'Đã hoàn thành', huy: 'Đã hủy',
}

export default function ViewingConfirmPage() {
  const [params] = useSearchParams()
  const ma = params.get('ma')
  const [result, setResult] = useState({ ma: null, data: null, error: '' })

  useEffect(() => {
    if (!ma) return
    let active = true
    PublicYeuCauApi.traCuu(ma).then((res) => { if (active) setResult({ ma, data: res.data, error: '' }) })
      .catch((err) => { if (active) setResult({ ma, data: null, error: thongBaoLoi(err) }) })
    return () => { active = false }
  }, [ma])

  const loading = Boolean(ma) && result.ma !== ma
  const { data, error } = result.ma === ma ? result : { data: null, error: '' }

  return (
    <div className="site-page">
      <div className="confirm-sheet">
        <p className="page-kicker">Desk received</p>
        {loading && <h1>Đang kiểm tra yêu cầu...</h1>}
        {!loading && (!ma || error) && <><h1>Không xác nhận được yêu cầu</h1><p>{error || 'Thiếu mã tra cứu.'}</p></>}
        {data && <>
          <h1>Yêu cầu đã được tiếp nhận.</h1>
          <p className="lead">Lưu lại đường dẫn này để theo dõi trạng thái. Bộ phận phụ trách sẽ liên hệ với bạn.</p>
          <dl className="kv">
            <dt>Mã tra cứu</dt><dd style={{ overflowWrap: 'anywhere' }}>{data.maTraCuu}</dd>
            <dt>Loại yêu cầu</dt><dd>{LOAI[data.loai] || data.loai}</dd>
            <dt>Trạng thái</dt><dd>{TRANG_THAI[data.lichXem?.trangThai || data.trangThai] || data.trangThai}</dd>
            {data.lichXem && <><dt>Giờ đề nghị</dt><dd>{ngayGioVietNam(data.lichXem.khungDeNghi)}</dd></>}
            {data.lichXem?.khungXacNhan && <><dt>Giờ xác nhận</dt><dd>{ngayGioVietNam(data.lichXem.khungXacNhan)}</dd></>}
          </dl>
        </>}
        <div className="stack-btns">
          <Link to="/bat-dong-san" className="btn btn--gold">Tiếp tục xem căn</Link>
          <Link to="/" className="btn btn--ghost">Về trang chủ</Link>
        </div>
      </div>
    </div>
  )
}
