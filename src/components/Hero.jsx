export default function Hero() {
  return (
    <section className="hero">
      <div data-augmented-ui="tl-clip-x tr-2-clip-y br-clip-x bl-2-clip-y both" className="aug-card aug-hero">
        <p className="subtitle">Full Stack Developer • IoT Engineer • Automation Architect</p>
        <h1>TINKESHWAR SINGH</h1>
        <p style={{ textAlign: 'justify' }}>
          Engineer. Builder. Systems thinker. <br/>
          I design and develop end-to-end solutions that combine modern web technologies, 
          automation, and hardware integration. Whether it's optimizing video processing with AI or building IoT-controlled systems, 
          I focus on creating efficient, scalable, and intelligent workflows that reduce manual effort.
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
