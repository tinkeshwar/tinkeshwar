const skills = [
  { title: 'Frontend & Full Stack', icon: '⚛', items: ['React.js', 'Next.js', 'Vue', 'Nuxt.js', 'Zustand', 'TypeScript', 'Tailwind CSS'], aug: 'tl-clip tr-round br-clip-x bl-scoop both' },
  { title: 'Backend & Systems', icon: '⚙', items: ['Node.js', 'SQL', 'PostgreSQL', 'Docker', 'REST APIs', 'Multi-service architectures'], aug: 'tl-round tr-clip bl-clip-y br-scoop both' },
  { title: 'Automation & Media', icon: '🤖', items: ['FFmpeg', 'SQLite', 'Worker pipelines', 'AI integration', 'FFprobe', 'Batch processing'], aug: 'tl-scoop tr-clip-y br-round bl-clip both' },
  { title: 'Embedded & IoT', icon: '📡', items: ['Arduino', 'ESP32', 'Home Assistant', 'Sensors', 'Motor drivers', 'MQTT', 'WiFi protocols'], aug: 'tl-clip-y tr-scoop br-clip bl-round both' },
]

export default function Skills() {
  return (
    <section id="skills">
      <h2>// Technical Expertise</h2>
      <div className="grid-skills">
        {skills.map((s, i) => (
          <div
            key={s.title}
            data-augmented-ui={s.aug}
            className={`aug-card aug-skill ${i % 2 === 1 ? 'aug-card-alt' : ''}`}
          >
            <h3><span style={{ marginRight: '0.5rem' }}>{s.icon}</span>{s.title}</h3>
            <div style={{ marginTop: '0.75rem' }}>
              {s.items.map(item => <span key={item} className={`tag ${i % 2 === 1 ? 'tag-alt' : ''}`}>{item}</span>)}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
