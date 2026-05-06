export default function Hero() {
  return (
    <section className="hero">
      <div data-augmented-ui="tl-clip-x tr-2-clip-y br-clip-x bl-2-clip-y both" className="aug-card aug-hero">
        <p className="subtitle">Full Stack Developer • IoT Engineer • Automation Architect</p>
        <h1>Tinkeshwar Singh</h1>
        <p>
          Builder-engineer hybrid thriving at the intersection of automation,
          embedded systems, and modern web technologies. I design intelligent,
          well-structured systems that reduce manual effort and scale efficiently.
        </p>
        <p className="status-line">SYSTEM ONLINE — Available for collaboration</p>
      </div>

      <div className="stats" style={{ marginTop: '2.5rem' }}>
        {[
          { value: '5+', label: 'Active Projects' },
          { value: '10+', label: 'Years Experience' },
          { value: '4', label: 'Tech Domains' },
          { value: '∞', label: 'Curiosity' },
        ].map(s => (
          <div key={s.label} data-augmented-ui="br-round tl-round both" className="aug-card stat-item aug-stat">
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
