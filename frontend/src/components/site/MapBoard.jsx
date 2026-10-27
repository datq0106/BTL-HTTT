import { KHU_VUC } from '../../data/listings'

export default function MapBoard({ items, activeId, onSelect }) {
  return (
    <div className="map-board">
      <div className="map-board__canvas" aria-label="Bản đồ quỹ căn Hà Nội">
        <span className="map-board__river" />
        {KHU_VUC.map((k) => (
          <em key={k.id} className="map-board__district" style={{ left: `${k.pin.x}%`, top: `${k.pin.y}%` }}>
            {k.ten}
          </em>
        ))}
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`map-pin ${activeId === item.id ? 'on' : ''} ${item.trangThai === 'bao_tri' ? 'is-off' : ''}`}
            style={{ left: `${item.pin.x}%`, top: `${item.pin.y}%` }}
            onClick={() => onSelect?.(item.id)}
            aria-label={item.tieuDe}
          >
            <span />
          </button>
        ))}
      </div>
    </div>
  )
}

