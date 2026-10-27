export default function FloorPlan({ item }) {
  const pn = item.phongNgu
  const studio = pn === 0
  return (
    <div className="floorplan" aria-hidden="true">
      <div className={`fp fp--${studio ? 'studio' : pn >= 3 ? 'family' : pn === 2 ? 'two' : 'one'}`}>
        {studio ? (
          <>
            <span className="fp__cell fp--live">Living / sleep</span>
            <span className="fp__cell fp--bath">WC</span>
            <span className="fp__cell fp--kit">Kitchen</span>
          </>
        ) : pn === 1 ? (
          <>
            <span className="fp__cell fp--live">Living</span>
            <span className="fp__cell fp--bed">Bedroom</span>
            <span className="fp__cell fp--kit">Kitchen</span>
            <span className="fp__cell fp--bath">WC</span>
          </>
        ) : pn === 2 ? (
          <>
            <span className="fp__cell fp--live">Living</span>
            <span className="fp__cell fp--bed">PN 1</span>
            <span className="fp__cell fp--bed">PN 2</span>
            <span className="fp__cell fp--kit">Kitchen</span>
            <span className="fp__cell fp--bath">WC</span>
          </>
        ) : (
          <>
            <span className="fp__cell fp--live">Living</span>
            <span className="fp__cell fp--bed">Master</span>
            <span className="fp__cell fp--bed">PN 2</span>
            <span className="fp__cell fp--bed">PN 3+</span>
            <span className="fp__cell fp--kit">Kitchen</span>
            <span className="fp__cell fp--bath">WC</span>
          </>
        )}
      </div>
      <p>Sơ đồ minh họa theo số phòng — không thay bản vẽ bàn giao.</p>
    </div>
  )
}
