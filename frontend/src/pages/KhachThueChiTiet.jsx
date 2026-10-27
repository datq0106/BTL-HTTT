import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { KhachThueApi } from '../api/services'
import { api, thongBaoLoi } from '../api/client'
import { ngay, ngayGio } from '../utils/format'
import { Badge, PageHead } from '../components/ui'
import { useToast } from '../context/ToastContext'

export default function KhachThueChiTiet() {
  const { id } = useParams()
  const toast = useToast()
  const [k, setK] = useState(null)
  const [anh, setAnh] = useState({ cccd: null, tamTru: null })

  async function blobUrl(khachId, loai) {
    const res = await api.get(`/khach-thue/${khachId}/anh/${loai}`, { responseType: 'blob' })
    return URL.createObjectURL(res.data)
  }

  async function tai() {
    try {
      const { data } = await KhachThueApi.chiTiet(id)
      setK(data)
      const next = { cccd: null, tamTru: null }
      if (data.anhCccd) next.cccd = await blobUrl(id, 'cccd')
      if (data.anhTamTru) next.tamTru = await blobUrl(id, 'tam-tru')
      setAnh(next)
    } catch (e) {
      toast.loi(thongBaoLoi(e))
    }
  }

  useEffect(() => { tai() }, [id]) // eslint-disable-line

  async function taiFile(loai, file) {
    if (!file) return
    const fd = new FormData()
    fd.append(loai === 'cccd' ? 'anhCccd' : 'anhTamTru', file)
    try {
      await KhachThueApi.taiAnh(id, fd)
      toast.thanhCong('Đã tải ảnh')
      tai()
    } catch (e) {
      toast.loi(thongBaoLoi(e))
    }
  }

  if (!k) return <div className="empty">Đang tải…</div>

  return (
    <>
      <PageHead
        kicker="Resident file"
        title={k.hoTen}
        desc={<><Link to="/quan-ly/khach-thue">← Khách thuê</Link> · Tạo lúc {ngayGio(k.createdAt)}</>}
      >
        <Badge nhom="tamTru" ma={k.trangThaiTamTru} />
      </PageHead>
      <div className="dossier__id" style={{ marginBottom: 18 }}>
        <span className="avatar avatar--lg">{k.hoTen.slice(0, 1)}</span>
        <div>
          <p className="page-kicker">{k.maPhongHienTai || 'Chưa gắn căn'}</p>
          <p className="muted">{k.sdt} · {k.email || 'Chưa có email'}</p>
        </div>
      </div>
      <div className="detail-grid">
        <div className="card">
          <h3>Hồ sơ nhân thân</h3>
          <dl className="kv">
            <dt>CCCD</dt><dd>{k.cccd}</dd>
            <dt>SĐT</dt><dd>{k.sdt}</dd>
            <dt>Email</dt><dd>{k.email || '—'}</dd>
            <dt>Ngày sinh</dt><dd>{ngay(k.ngaySinh)}</dd>
            <dt>Giới tính</dt><dd>{k.gioiTinh === 'nu' ? 'Nữ' : k.gioiTinh === 'khac' ? 'Khác' : 'Nam'}</dd>
            <dt>Quê quán</dt><dd>{k.queQuan || '—'}</dd>
            <dt>Ngày khai báo</dt><dd>{ngay(k.ngayKhaiBao)}</dd>
            <dt>Phòng hiện tại</dt><dd>{k.maPhongHienTai || 'Chưa thuê'}</dd>
          </dl>
        </div>
        <div className="card">
          <h3 style={{ marginTop: 0 }}>Giấy tờ</h3>
          <p>Ảnh / PDF, tối đa 5MB.</p>
          <FieldAnh label="CCCD" src={anh.cccd} onChange={(f) => taiFile('cccd', f)} />
          <FieldAnh label="Tạm trú" src={anh.tamTru} onChange={(f) => taiFile('tam-tru', f)} />
        </div>
      </div>
    </>
  )
}

function FieldAnh({ label, src, onChange }) {
  return (
    <div className="field" style={{ marginBottom: 14 }}>
      <label>{label}</label>
      {src && <img className="doc-img" src={src} alt={label} />}
      <input type="file" accept="image/*,.pdf" onChange={(e) => onChange(e.target.files?.[0])} />
    </div>
  )
}
