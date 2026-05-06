const projects = [
  {
    name: 'AI Video Optimization System',
    desc: 'Scans directories for videos, extracts metadata via FFprobe, uses AI to generate optimized FFmpeg commands, processes and validates outputs with efficiency thresholds.',
    tech: ['FFmpeg', 'SQLite', 'AI', 'Workers'],
    status: 'active',
    aug: 'tl-2-clip-x br-2-clip-x bl-clip-y both',
  },
  {
    name: 'Smart Home Control System',
    desc: 'Controls AC appliances using Arduino UNO R4 WiFi. Integrates IoT monitoring, manual controls, and Home Assistant for unified smart home management.',
    tech: ['Arduino', 'WiFi', 'Home Assistant', 'IoT'],
    status: 'active',
    aug: 'tr-clip-inset bl-clip-inset both',
  },
  {
    name: 'Remote-Controlled Ride-On Car',
    desc: 'ESP32-based system with 4 motors + steering, cameras, music system, battery monitoring, and planned autonomous driving features.',
    tech: ['ESP32', 'Motors', 'Camera', 'BMS'],
    status: 'building',
    aug: 'tl-round tr-round br-scoop bl-scoop both',
  },
  {
    name: 'Custom UPS System',
    desc: 'Multi-voltage DC outputs (5V, 12V) with battery monitoring, IoT control, and real-time power usage tracking dashboard.',
    tech: ['Power Electronics', 'IoT', 'Monitoring'],
    status: 'building',
    aug: 'tl-scoop tr-scoop br-round bl-round both',
  },
  {
    name: 'School Management Platform',
    desc: 'Comprehensive platform covering admissions, fees, academics, transport, and library with planned AI chatbot integration.',
    tech: ['React', 'Node.js', 'PostgreSQL', 'AI'],
    status: 'active',
    aug: 't-clip-x b-clip-x bl-clip tr-clip both',
  },
]

export default function Projects() {
  return (
    <section id="projects">
      <h2>// Current Projects</h2>
      <div className="grid">
        {projects.map(p => (
          <div key={p.name} data-augmented-ui={p.aug} className="aug-card project-card">
            <h3>
              {p.name}
              <span className={`project-status ${p.status === 'active' ? 'status-active' : 'status-building'}`}>
                {p.status}
              </span>
            </h3>
            <p>{p.desc}</p>
            <div>
              {p.tech.map(t => <span key={t} className="tag">{t}</span>)}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
