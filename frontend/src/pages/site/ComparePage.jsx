import { Link } from 'react-router-dom'
import SiteBanner from '../../components/site/SiteBanner'
import { useShortlist } from '../../context/ShortlistContext'
import { tien } from '../../utils/format'
import { KHU_VUC } from '../../data/listings'
import { Badge } from '../../components/ui'

export default function ComparePage() {
  const { ds, xoa } = useShortlist()
  const cols = ds.slice(0, 3)

  const hang = [
    { nhan: 'Khu vực', lay: (x) => KHU_VUC.find((k) => k.id === x.khuVuc)?.ten },
    { nhan: 'Loại', lay: (x) => x.loai },
    { nhan: 'Giá / tháng', lay: (x) => tien(x.gia) },
    { nhan: 'Đặt cọc', lay: (x) => tien(x.datCoc) },
    { nhan: 'Diện tích', lay: (x) => `${x.dienTich} m²` },
    { nhan: 'Phòng ngủ', lay: (x) => (x.phongNgu === 0 ? 'Studio' : x.phongNgu) },
    { nhan: 'Phòng tắm', lay: (x) => x.phongTam },
    { nhan: 'Tầng', lay: (x) => x.tang },
    { nhan: 'Tiện nghi', lay: (x) => x.tienNghi.join(', ') },
  ]

  return (
    <>
      <SiteBanner
        kicker="Side by side"
        title="So sánh tối đa ba căn."
        desc="Cùng một desk, cùng cách đo. Chọn từ danh sách quan tâm — không phải bảng rao lẫn lộn."
        anh="/properties/interior.jpg"
        compact
      />
      <div className="site-page">
        {cols.length < 2 ? (
          <div className="card empty-board">
            <p className="page-kicker">Need two files</p>
            <h2>Cần ít nhất hai căn đã lưu.</h2>
            <p className="muted">Thêm căn vào danh sách quan tâm rồi quay lại bảng này.</p>
            <div className="stack-btns">
              <Link to="/quan-tam" className="btn btn--gold">Danh sách quan tâm</Link>
              <Link to="/bat-dong-san" className="btn btn--ghost">Quỹ căn</Link>
            </div>
          </div>
        ) : (
          <div className="compare-wrap">
            <table className="compare-table">
              <thead>
                <tr>
                  <th>Hồ sơ</th>
                  {cols.map((x) => (
                    <th key={x.id}>
                      <img src={x.anh[0]} alt="" />
                      <p className="page-kicker">{x.ma}</p>
                      <Link to={`/bat-dong-san/${x.id}`}>{x.tieuDe}</Link>
                      <div className="stack-btns" style={{ marginTop: 8 }}>
                        <Badge nhom="phong" ma={x.trangThai} />
                        <button type="button" className="btn btn--ghost btn--sm" onClick={() => xoa(x.id)}>Bỏ</button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {hang.map((h) => (
                  <tr key={h.nhan}>
                    <th>{h.nhan}</th>
                    {cols.map((x) => <td key={x.id}>{h.lay(x)}</td>)}
                  </tr>
                ))}
                <tr>
                  <th></th>
                  {cols.map((x) => (
                    <td key={x.id}>
                      <Link to={`/dat-lich?can=${x.id}`} className="btn btn--gold btn--sm">Đặt lịch xem</Link>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
}
