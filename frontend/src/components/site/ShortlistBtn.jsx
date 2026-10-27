import { Icon } from '../icons'
import { useShortlist } from '../../context/ShortlistContext'

export default function ShortlistBtn({ id, className = '' }) {
  const { coTrong, dao } = useShortlist()
  const on = coTrong(id)
  return (
    <button
      type="button"
      className={`ghost-icon ${on ? 'is-on' : ''} ${className}`}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        dao(id)
      }}
      aria-label={on ? 'Bỏ khỏi danh sách quan tâm' : 'Thêm vào danh sách quan tâm'}
      title={on ? 'Đã lưu' : 'Lưu căn'}
    >
      <Icon name="heart" size={16} />
    </button>
  )
}
