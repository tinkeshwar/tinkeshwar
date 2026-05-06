const approaches = [
  { icon: '🧩', title: 'Modular Design', desc: 'Separation of concerns with scalable, reusable components', aug: 'tl-round bl-round br-clip both' },
  { icon: '⚡', title: 'Automation First', desc: 'Eliminate repetitive tasks through intelligent pipelines', aug: 'tr-scoop tl-clip br-round both' },
  { icon: '📊', title: 'Real-time Feedback', desc: 'Monitoring loops for continuous system optimization', aug: 'bl-scoop tr-clip tl-round both' },
  { icon: '🔗', title: 'HW + SW Integration', desc: 'Bridging physical and digital for complete solutions', aug: 'br-round tl-clip bl-clip-y both' },
]

export default function Approach() {
  return (
    <section id="approach">
      <h2>// Engineering Philosophy</h2>
      <div className="approach-grid">
        {approaches.map(a => (
          <div key={a.title} data-augmented-ui={a.aug} className="aug-card approach-item">
            <div className="approach-icon">{a.icon}</div>
            <h3>{a.title}</h3>
            <p>{a.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
