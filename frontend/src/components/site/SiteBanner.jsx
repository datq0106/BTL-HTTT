export default function SiteBanner({ kicker, title, desc, anh = '/properties/hero.jpg', compact }) {
  return (
    <section className={`page-banner ${compact ? 'page-banner--compact' : ''}`}>
      <img className="page-banner__bg" src={anh} alt="" />
      <div className="page-banner__shade" />
      <div className="page-banner__inner">
        {kicker && <p className="page-kicker" style={{ color: 'var(--gold-2)' }}>{kicker}</p>}
        <h1>{title}</h1>
        {desc && <p>{desc}</p>}
      </div>
    </section>
  )
}
