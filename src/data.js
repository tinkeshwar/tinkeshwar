// Boot sequence lines: [text, className, tail]
export const bootLines = [
  ['BIOS v3.14 — Tinkeshwar Systems', 'dim'],
  ['Copyright (c) Tinkeshwar Singh. All rights reserved.', 'dim'],
  ['', 'dim'],
  ['CPU .... Curiosity Core @ ∞ GHz ', 'ok', '[OK]'],
  ['GPU .... Imagination Engine @ ∞ FPS', 'warn', '[TOO HIGH]'],
  ['MEM .... 10+ yrs cached ......... ', 'ok', '[OK]'],
  ['POST ........................... ', 'ok', '[OK]'],
  ['', 'dim'],['', 'dim'],
  ['Mounting /dev/curiosity ........ ', 'ok', '[OK]'],
  ['Loading full-stack modules ..... ', 'ok', '[OK]'],
  ['Spinning up IoT bus (esp32) .... ', 'cy', '[LINK]'],
  ['Detecting hardware peripherals . ', 'cy', '[LINK]'],
  ['Checking automation daemons .... ', 'ok', '[OK]'],
  ['Mounting self-hosted volumes ... ', 'ok', '[OK]'],
  ['Calibrating coffee levels ...... ', 'warn', '[LOW]'],
  ['', 'dim'],['', 'dim'],['', 'dim'],
  ['WARN: over-engineering risk high ', 'warn', '[!]'],
  ['WARN: temprature rising risk high ', 'warn', '[!]'],
  ['Starting tinkeshwar-os ......... ', 'ok', '[OK]'],
  ['', 'dim'],['', 'dim'],['', 'dim'],['', 'dim'],['', 'dim'],
  ['welcome, operator. booting shell...', 'ok'],
]

export const whoami = {
  name: 'TINKESHWAR SINGH',
  subtitle: 'Full Stack Developer • IoT Engineer • Automation Architect',
  bio: [
    "I'm a Full Stack Developer and technology enthusiast who enjoys building, experimenting, and solving complex problems. I work across modern web technologies, cloud infrastructure, automation, and self-hosted systems — driven by curiosity and a hands-on approach.",
    "I like living at the seam where software meets hardware: wiring up IoT devices, standing up self-hosted services, and building automation pipelines that quietly handle the boring parts. If something can be measured, scripted, or improved, I'll usually end up tinkering with it until it is.",
  ],
}

// The command bar entries, in display order.
export const commands = ['skills', 'projects', 'approach', 'about', 'contact']

// Sarcastic footer hints — one is picked at random on each load.
// Add more lines here anytime; they get included automatically.
export const hints = [
  '100% hand-crafted, artisanal divs. no AI was harmed, several were consulted.',
  "yes, it's a portfolio pretending to be a terminal. no, there isn't a package.json to npm audit. click a button; it won't rm -rf anything, probably.",
  'warning: this terminal is read-only. unlike my side projects, it actually ships.',
  'works on my machine™ — and apparently yours too. you\'re welcome.',
  'sudo make me a sandwich. (permission denied. nice try.)',
]

export const skills = [
  { group: 'frontend', items: ['React', 'Next.js', 'Vue', 'Nuxt.js', 'TypeScript', 'Tailwind', 'Zustand'] },
  { group: 'backend', items: ['Node.js', 'Python', 'SQL', 'PostgreSQL', 'Docker', 'REST'] },
  { group: 'automation', items: ['FFmpeg', 'SQLite', 'Workers', 'AI', 'FFprobe'] },
  { group: 'embedded', items: ['Arduino', 'ESP32', 'Home Assistant', 'Sensors', 'Motor drivers', 'MQTT'] },
]

export const projects = [
  {
    id: 'U1',
    name: 'AI Video Optimization System',
    status: 'active',
    desc: 'Scans directories, extracts FFprobe metadata, AI-generates optimized FFmpeg commands, validates outputs.',
  },
  {
    id: 'U2',
    name: 'Smart Home Control System',
    status: 'active',
    desc: 'Arduino UNO R4 WiFi + Home Assistant for unified AC appliance control and IoT monitoring.',
  },
  {
    id: 'U3',
    name: 'Remote-Controlled Ride-On Car',
    status: 'building',
    desc: 'ESP32, 4 motors + steering, camera, music system, battery monitoring (BMS).',
  },
  {
    id: 'U4',
    name: 'Custom UPS System',
    status: 'building',
    desc: 'Multi-voltage DC outputs (5V/12V), battery telemetry, IoT power usage tracking.',
  },
  {
    id: 'U5',
    name: 'School Management Platform',
    status: 'active',
    desc: 'Admissions, fees, academics, transport, library + planned AI chatbot.',
  },
]

export const approach = [
  { key: 'modular', title: 'Modular Design', desc: 'Separation of concerns with scalable, reusable components' },
  { key: 'automate', title: 'Automation First', desc: 'Eliminate repetitive tasks through intelligent pipelines' },
  { key: 'feedback', title: 'Real-time Feedback', desc: 'Monitoring loops for continuous system optimization' },
  { key: 'hw+sw', title: 'HW + SW Integration', desc: 'Bridging physical and digital for complete solutions' },
]

export const about = {
  knownBug: "once I discover I can make something work, I sometimes keep going until I've built the most complicated possible version of it. 😎",
  strengths: 'cross-domain problem solving, system architecture, rapid iteration, real-world constraints.',
  growth: 'advanced AI/ML, distributed systems, UI/UX polish, productization.',
}

// `icon` is a terminal-style ASCII glyph shown before each contact entry.
export const contact = [
  { key: 'github', icon: '⌥', label: 'github.com/tinkeshwar', href: 'https://github.com/tinkeshwar' },
  { key: 'linkedin', icon: 'in', label: 'linkedin.com/in/tinkeshwar-singh', href: 'https://www.linkedin.com/in/tinkeshwar-singh-02071b94/' },
  { key: 'email', icon: '✉', label: 'hello@tinkeshwar.com', href: 'mailto:hello@tinkeshwar.com' },
]
