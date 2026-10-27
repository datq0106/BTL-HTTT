import { nhan } from '../utils/format'
import { Icon } from './icons'

export function Badge({ nhom, ma }) {
  const map = {
    dang_thue: 'ok',
    hieu_luc: 'ok',
    hoat_dong: 'ok',
    da_khai_bao: 'ok',
    trong: 'muted',
    bao_tri: 'warn',
    da_dat_coc: 'warn',
    het_han: 'warn',
    khoa: 'danger',
    thanh_ly: 'danger',
    chua_khai_bao: 'warn',
  }
  return <span className={`badge badge--${map[ma] || 'muted'}`}>{nhan(nhom, ma)}</span>
}

export function PageHead({ kicker, title, desc, children }) {
  return (
    <div className="page-head">
      <div>
        {kicker && <p className="page-kicker">{kicker}</p>}
        <h1>{title}</h1>
        {desc && <p>{desc}</p>}
      </div>
      {children && <div className="page-head__actions">{children}</div>}
    </div>
  )
}

export function Pagination({ trang, tongSoTrang, onChange }) {
  if (!tongSoTrang || tongSoTrang <= 1) return null
  return (
    <div className="pager">
      <span>Trang {trang + 1}/{tongSoTrang}</span>
      <button type="button" className="btn btn--ghost btn--sm" disabled={trang <= 0} onClick={() => onChange(trang - 1)}>Trước</button>
      <button type="button" className="btn btn--ghost btn--sm" disabled={trang + 1 >= tongSoTrang} onClick={() => onChange(trang + 1)}>Sau</button>
    </div>
  )
}

export function Modal({ title, onClose, children, wide }) {
  return (
    <div className="modal-bg" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={wide ? { width: 'min(880px, 100%)' } : undefined} role="dialog">
        <div className="modal-title">
          <h2>{title}</h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Đóng">
            <Icon name="close" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

export function Field({ label, children, full }) {
  return (
    <div className={`field ${full ? 'field--full' : ''}`}>
      <label>{label}</label>
      {children}
    </div>
  )
}

export function Empty({ text = 'Chưa có dữ liệu' }) {
  return (
    <div className="empty">
      <div className="empty-icon"><Icon name="building" size={22} /></div>
      {text}
    </div>
  )
}

export function Actions({ onClose, submitLabel = 'Lưu', dangGui }) {
  return (
    <div className="modal-actions">
      <button type="button" className="btn btn--ghost" onClick={onClose}>Hủy</button>
      <button type="submit" className="btn btn--gold" disabled={dangGui}>{dangGui ? 'Đang lưu…' : submitLabel}</button>
    </div>
  )
}
