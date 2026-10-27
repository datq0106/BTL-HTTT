import { useCatalog } from '../../context/CatalogContext'

export default function MapBoard({ items, activeId, onSelect }) {
  const { khuVuc: KHU_VUC } = useCatalog()
  return (
    <div className="map-board">
      <div className="map-board__canvas" aria-label="Bản đồ quỹ căn TP. Hồ Chí Minh">
        <span className="map-board__river" />
        {KHU_VUC.filter((k) => k.pin).map((k) => (
          <em key={k.id} className="map-board__district" style={{ left: `${k.pin.x}%`, top: `${k.pin.y}%` }}>
            {k.ten}
          </em>
        ))}
        {items.filter((item) => item.pin).map((item) => (
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

