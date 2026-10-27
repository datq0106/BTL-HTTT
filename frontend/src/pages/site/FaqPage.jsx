import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import SiteBanner from '../../components/site/SiteBanner'
import { CAU_HOI } from '../../data/listings'

export default function FaqPage() {
  const nhom = useMemo(() => [...new Set(CAU_HOI.map((x) => x.nhom))], [])
  const [mo, setMo] = useState(0)

  return (
    <>
      <SiteBanner
        kicker="FAQ"
        title="Hỏi desk trước khi xem nhà."
        desc="Thuê căn, gửi quỹ, cổng cư dân — trả lời ngắn, đúng ngôn ngữ Black Panther."
        anh="/properties/interior.jpg"
        compact
      />
      <div className="site-page">
        {nhom.map((n) => (
          <section key={n} style={{ marginBottom: 36 }}>
            <p className="page-kicker">{n}</p>
            <div className="faq-list">
              {CAU_HOI.filter((x) => x.nhom === n).map((item) => {
                const idx = CAU_HOI.indexOf(item)
                const open = mo === idx
                return (
                  <button
                    key={item.q}
                    type="button"
                    className={`faq-item ${open ? 'on' : ''}`}
                    onClick={() => setMo(open ? -1 : idx)}
                  >
                    <strong>{item.q}</strong>
                    {open && <p>{item.a}</p>}
                  </button>
                )
              })}
            </div>
          </section>
        ))}
        <div className="cta-band cta-band--flush">
          <div>
            <p className="page-kicker">Still unclear</p>
            <h2>Chưa có câu của bạn?</h2>
            <p>Leasing desk trả lời trong giờ hành chính, không chatbot.</p>
          </div>
          <Link to="/lien-he" className="btn btn--gold">Liên hệ</Link>
        </div>
      </div>
    </>
  )
}


