import { useEffect, useState } from 'react'
import { ThongBaoApi } from '../api/services'
import { thongBaoLoi } from '../api/client'
import { ngayGio } from '../utils/format'
import { Empty, PageHead, Pagination } from '../components/ui'
import { useToast } from '../context/ToastContext'
import { useAuth } from '../context/AuthContext'

export default function ThongBaoPage() {
  const toast = useToast()
  const { laKhach } = useAuth()
  const [ds, setDs] = useState({ noiDung: [], trang: 0, tongSoTrang: 0 })
  const [trang, setTrang] = useState(0)

  function tai(t = trang) {
    ThongBaoApi.danhSach({ trang: t, kichThuoc: 10 })
      .then((r) => setDs(r.data))
      .catch((e) => toast.loi(thongBaoLoi(e)))
  }
  useEffect(() => { tai(trang) }, [trang]) // eslint-disable-line

  async function doc(id, chuaDoc) {
    if (!chuaDoc) return
    try {
      await ThongBaoApi.daDoc(id)
      tai(trang)
    } catch (e) {
      toast.loi(thongBaoLoi(e))
    }
  }

  async function docHet() {
    try {
      await ThongBaoApi.daDocTatCa()
      toast.thanhCong('Đã đánh dấu tất cả đã đọc')
      tai(trang)
    } catch (e) {
      toast.loi(thongBaoLoi(e))
    }
  }

  return (
    <>
      <PageHead
        kicker={laKhach ? 'Resident inbox' : 'House inbox'}
        title="Thông báo"
        desc={laKhach ? 'Nhắc hạn hợp đồng và thư từ leasing desk.' : 'Nhắc hạn, bàn giao và thông tin vận hành.'}
      >
        <button className="btn btn--ghost" onClick={docHet}>Đánh dấu đã đọc hết</button>
      </PageHead>
      <div className="card">
        {!ds.noiDung?.length ? <Empty text="Chưa có thông báo." /> : (
          <div>
            {ds.noiDung.map((tb) => {
              const chuaDoc = !tb.createdAt
              const lucTao = tb.updatedAt
              return (
                <div key={tb.id} className={`notice ${chuaDoc ? 'unread' : ''}`} onClick={() => doc(tb.id, chuaDoc)}>
                  <span className="notice-dot" />
                  <div>
                    <strong>{tb.tieuDe}</strong>
                    <div className="muted">{tb.noiDung}</div>
                    <div className="muted" style={{ marginTop: 4, fontSize: 12 }}>{tb.nhanLoai || tb.loai} · {ngayGio(lucTao)}</div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
        <Pagination trang={ds.trang} tongSoTrang={ds.tongSoTrang} onChange={setTrang} />
      </div>
    </>
  )
}
