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
  { group: 'frontend', items: ['React', 'Next.js', 'Vue', 'Nuxt.js', 'TypeScript', 'Tailwind', 'Vite'] },
  { group: 'backend', items: ['Rust', 'Node.js', 'Python', 'FastAPI', 'REST', 'OpenAPI'] },
  { group: 'data', items: ['PostgreSQL', 'MongoDB', 'SQLite'] },
  { group: 'desktop', items: ['Tauri', 'Electron', 'pdf-lib'] },
  { group: 'ai', items: ['OpenAI', 'Claude', 'MCP', 'Ollama', 'Prompt pipelines'] },
  { group: 'automation', items: ['FFmpeg', 'FFprobe', 'Workers', 'Docker', 'CI/CD'] },
  { group: 'embedded', items: ['ESP32', 'Arduino', 'Motor drivers', 'Sensors', 'BMS'] },
]

export const projects = [
  {
    id: 'U1',
    name: 'AI Video Optimization System',
    slug: 'ai-video-optimization-system',
    status: 'active',
    desc: 'Scans a library, has OpenAI write per-video FFmpeg commands, and runs them on parallel workers, re-prompting itself when output comes out too big. React dashboard for approvals and audio/subtitle picks.',
    stack: ['Python', 'FastAPI', 'OpenAI', 'FFmpeg', 'React', 'SQLite', 'Docker'],
    // `slug` is the permanent page URL (/projects/<slug>); keep it when renaming.
    // Optional long-form page at that URL. Sections render in order:
    // `text` = paragraphs, `list` = bullets, `pre` = monospace block.
    detail: {
      meta: [
        ['version', 'v1.17.0'],
        ['since', 'Jun 2026'],
        ['commits', '77'],
        ['runs on', 'home server, Docker'],
        ['license', 'MIT'],
      ],
      sections: [
        {
          title: 'overview',
          text: [
            "A media library grows faster than the disk it lives on. This system watches the library, works out which videos are worth shrinking, and asks an LLM to write the exact FFmpeg command for each file — based on its ffprobe metadata, the chosen audio/subtitle tracks and the host's actual hardware.",
            "Encodes run on parallel GPU and CPU workers. If a result is shaping up too big, the job aborts early and the AI is told what went wrong and asked for something more aggressive. A React dashboard keeps a human in the loop for approvals, or the whole thing can run hands-off.",
          ],
        },
        {
          title: 'pipeline',
          pre: [
            'scanner   → walk /video-input, ffprobe metadata + streams   [pending]',
            'dashboard → pick audio/subtitle, confirm or reject         [confirmed]',
            'prepare   → OpenAI writes a per-video ffmpeg command        [ready]',
            'processor → claim atomically, encode, track progress      [processing]',
            'dashboard → review result, accept or skip                  [optimized]',
            'mover     → swap the original for the optimized file       [replaced]',
          ].join('\n'),
        },
        {
          title: 'smart abort & self-correction',
          list: [
            "Projects the final size while ffmpeg runs; once the estimate stabilises and it's bigger than the source (or saves under 20%), the encode is killed.",
            'Aborted videos are re-queued with the previous command and the projected size, and the AI retries with a more aggressive one. Same command twice, or too many tries → skipped.',
            "Encode errors feed ffmpeg's stderr back to the AI: 1st retry fixes the cause, 2nd must fall back to libx265, 3rd marks it failed.",
            'Catches the classic VAAPI trap: sources that change resolution mid-stream get probed per keyframe and must scale to the largest size.',
            "Cheap pre-checks (file size, bits-per-pixel for HEVC/AV1/VP9) skip already-efficient files before spending an AI call.",
          ],
        },
        {
          title: 'hardware scheduling',
          list: [
            'GPU slots per VAAPI device with per-device job limits, filled in order; the AI always writes renderD128 and the processor swaps in the assigned device.',
            'Exclusive slots for devices that share resources — an iGPU that shares the CPU never runs alongside a libx265 job.',
            'SQLite in WAL mode with atomic claiming so concurrent workers never pick the same file.',
          ],
        },
        {
          title: 'dashboard',
          list: [
            'Videos are colour-tiered by stream complexity (single/multi audio × single/multi subtitle); only single-audio files can be bulk- or auto-confirmed.',
            'Visual compare: streams a 30s split-screen clip — original on the left, optimized on the right — before you accept.',
            'Full status history per video, with the reason for every abort, retry and skip.',
          ],
        },
        {
          title: 'extras',
          list: [
            'Episode splitter: lossless keyframe cuts for combined episode files, with black-frame / scene detection to suggest split points.',
            'Rename webhook: movie-tracker and show-tracker (U4/U5) report renames so files keep their history instead of being re-scanned.',
            'Telegram notifications on chosen status changes.',
          ],
        },
        {
          title: 'shipping',
          list: [
            'Single multi-stage Docker image: Python workers + FastAPI, React build, nginx in front, ffmpeg and GPU tools baked in.',
            'Prompts live as plain text files with placeholder substitution, so tuning the AI is an edit, not a code change.',
            'CI builds and publishes on every push; versions bump automatically from conventional commits.',
          ],
        },
      ],
    },
  },
  {
    id: 'U2',
    name: 'Remote-Controlled Ride-On Car',
    status: 'building',
    desc: 'ESP32, 4 motors + steering, camera, music system, battery monitoring (BMS).',
    stack: ['ESP32', 'Motor drivers', 'Camera', 'BMS'],
  },
  {
    id: 'U3',
    name: 'School Management Platform',
    slug: 'school-management-platform',
    status: 'active',
    desc: 'Admissions, fees, academics, transport, library + planned AI chatbot.',
    stack: ['TypeScript', 'Koa', 'Next.js', 'MySQL', 'Python', 'OR-Tools'],
    detail: {
      meta: [
        ['services', '12 + solver'],
        ['repos', '19'],
        ['commits', '2,300+'],
        ['since', 'Mar 2026'],
      ],
      sections: [
        {
          title: 'overview',
          text: [
            'A full school ERP split into one service per domain: admissions, academics, fees, exams, staff and payroll, timetable, transport, hostel, library and inventory. Each service owns its own MySQL database; nothing reads another service\'s tables.',
            'Administrators run the school from a Next.js console, and teachers get their own portal for attendance, homework, results, timetable and leave.',
          ],
        },
        {
          title: 'architecture',
          pre: [
            'browser ── school-app (Next.js BFF, httpOnly JWT cookies)',
            '              │  server-side proxy, x-trace-id on every hop',
            '              ▼',
            '  auth ─ academic ─ admission ─ fee ─ exam ─ staff',
            '  timetable ─ transport ─ hostel ─ library ─ inventory ─ upload',
            '              │',
            '              ▼',
            '  timetable-solver (Python, OR-Tools CP-SAT)',
          ].join('\n'),
        },
        {
          title: 'how the services fit',
          list: [
            'auth-service issues JWTs; every other service validates them locally, so a login never fans out into network calls.',
            'Services talk over HTTP with service tokens: admission auto-enrolls students in academic and checks fee clearance before a transfer certificate; transport and hostel generate fees and push them to fee-service, and staff deductions to payroll.',
            'A shared package (@school-admin/common) holds the base controller/service/repository classes, Koa middleware, Zod-with-OpenAPI schemas and structured pino logging, so all twelve services look the same inside.',
            'Every service publishes Swagger docs generated from the same Zod schemas that validate its requests.',
          ],
        },
        {
          title: 'highlights',
          list: [
            'Automatic timetables: a CP-SAT solver builds a clash-free week from teacher assignments, availability, fixed periods and limits like max periods per day or consecutive classes.',
            'Fees end to end: fee structures, vouchers, offline counter and online gateway payments, waivers, reminders, PDF receipts and ledger reports.',
            'Payroll with salary structures, leave balances and monthly runs, fed by attendance and the holiday calendar.',
            'Distributed tracing: each request carries a trace id through every service, and a small trace viewer shows the calls as a waterfall.',
            'Pluggable file storage (local disk or S3, with presigned URLs) in a stateless upload service.',
          ],
        },
        {
          title: 'testing',
          list: [
            'Per-service unit tests in CI on every push.',
            'A black-box regression suite boots all twelve services against fresh MySQL databases and tests them over HTTP. Nothing is mocked.',
            'Playwright end-to-end tests drive the real app against the real backends, seeded by a data-factory that generates a believable school.',
          ],
        },
      ],
    },
  },
  {
    id: 'U4',
    name: 'movie-tracker',
    slug: 'movie-tracker',
    status: 'active',
    desc: 'Headless Radarr replacement in Rust. Speaks the Radarr v3 API so Prowlarr, Seerr & Recyclarr plug in unchanged; one static binary, hardlink imports.',
    stack: ['Rust', 'SQLite', 'Docker', 'qBittorrent', 'TMDb'],
    detail: {
      meta: [
        ['since', 'Oct 2026'],
        ['commits', '35'],
        ['size', '~19k lines of Rust'],
        ['license', 'GPL-3.0'],
      ],
      sections: [
        {
          title: 'overview',
          text: [
            'Radarr does a lot, and it costs a .NET runtime and a web UI I never open. movie-tracker does the same job headlessly: it serves Radarr\'s v3 API, so Prowlarr, Seerr, Recyclarr and other Radarr clients connect to it without knowing the difference.',
            'It ships as one static binary on a distroless image, with SQLite for storage.',
          ],
        },
        {
          title: 'what it does',
          list: [
            'Library from TMDb; searches Torznab/Newznab indexers; grabs through qBittorrent.',
            'Quality profiles, custom formats and scoring — Recyclarr syncs TRaSH\'s 41-format profile into it unchanged.',
            'Completed-download import with renaming and hardlinks (no copies when downloads and library share a mount), upgrades, editions and secondary files.',
            'Manual import, file editing, rename preview, calendar, webhook and Telegram notifications.',
          ],
        },
        {
          title: 'compatibility',
          list: [
            'An end-to-end suite runs real Prowlarr, Seerr, Recyclarr and qBittorrent containers against it: add the app, sync indexers, request a movie through to Available, sync a profile twice with no changes.',
            'Any request that hits no route can be logged, and the E2E run fails if one does — that\'s how missing endpoints get found.',
            'Matches Radarr\'s quirks where clients depend on them, like case-insensitive paths and "Name: Should be unique" instead of a 500 when Prowlarr races two syncs.',
          ],
        },
        {
          title: 'migration',
          list: [
            'import-radarr reads a stopped Radarr v5 database read-only and brings over movies, files and history, with path mapping and a dry run.',
            'import-library matches an existing folder of movies to TMDb and imports the exact matches.',
          ],
        },
        {
          title: 'shipping',
          list: [
            'Release profile with LTO and stripped symbols; musl binaries and a multi-arch image on tagged releases.',
            'Every push to main builds, pushes to my registry and redeploys on the home server.',
            'Integration tests against mocked indexers and qBittorrent, plus parser benchmarks.',
          ],
        },
      ],
    },
  },
  {
    id: 'U5',
    name: 'show-tracker',
    slug: 'show-tracker',
    status: 'active',
    desc: 'Headless Sonarr replacement in Rust. Serves the Sonarr v3 API: episode parsing, season-pack imports, RSS sync and one-command migration from Sonarr.',
    stack: ['Rust', 'SQLite', 'Docker', 'TMDb', 'TVmaze'],
    detail: {
      meta: [
        ['since', 'Oct 2026'],
        ['commits', '14'],
        ['size', '~21k lines of Rust'],
        ['license', 'GPL-3.0'],
      ],
      sections: [
        {
          title: 'overview',
          text: [
            'The TV half of the stack, and movie-tracker\'s sibling. show-tracker serves Sonarr\'s v3 API with no web UI, so Prowlarr, Seerr and Recyclarr keep working while the heavy app goes away.',
            'One static Rust binary and a SQLite file; it can even reuse movie-tracker\'s TMDb key.',
          ],
        },
        {
          title: 'what it does',
          list: [
            'Series, seasons and episodes from TMDb, with monitoring per series, season and episode.',
            'Episode parser for the messy real world: multi-episode files, season packs, anime-style numbering.',
            'RSS sync plus episode, season and series searches across Torznab/Newznab indexers; grabs through qBittorrent with a live queue.',
            'Completed-download import with renaming and upgrades, failed-download handling and a blocklist.',
            'History, wanted (missing and cutoff unmet), calendar, disk rescan, manual import, webhook and Telegram notifications.',
          ],
        },
        {
          title: 'compatibility',
          list: [
            'Covers the endpoints a headless stack actually calls, from series and episode files to custom formats, queue and blocklist; paths ignore case like Sonarr\'s.',
            'Client flows — Prowlarr sync, Seerr requests, Recyclarr profiles, qBittorrent grab → import → rename — are integration-tested against mocks and real files.',
            'Unmatched requests can be logged, so a client calling something missing shows up immediately.',
          ],
        },
        {
          title: 'migration',
          list: [
            'import-sonarr reads a stopped Sonarr database and imports the library in one command, with path mapping and a dry run first.',
          ],
        },
        {
          title: 'shipping',
          list: [
            'Same pipeline as movie-tracker: push to main → build, push to registry, redeploy on the home server.',
            'Tagged releases build musl binaries and a multi-arch image.',
          ],
        },
      ],
    },
  },
  {
    id: 'U6',
    name: 'API Bird',
    slug: 'api-bird',
    status: 'active',
    desc: 'Local API workbench: projects → services → endpoints, OpenAPI/cURL import, saved requests. Exposes an MCP server so Claude can run the APIs too.',
    stack: ['Next.js', 'React', 'MongoDB', 'MCP', 'Electron'],
    detail: {
      meta: [
        ['version', 'v1.0.0'],
        ['since', 'Oct 2026'],
        ['commits', '16'],
        ['ships as', 'web app, macOS + Windows desktop'],
      ],
      sections: [
        {
          title: 'overview',
          text: [
            'A local API workbench in the spirit of Postman, organised the way backends are actually built: projects → services → endpoints. Run requests, save them, replay them.',
            'It is also an MCP server, so Claude (or any MCP client) can browse the same collection and call the APIs itself — handy when an agent is building against a service and needs to try it.',
          ],
        },
        {
          title: 'how it is organised',
          pre: [
            'project   variables ({{name}}, optionally secret), shared headers',
            ' └ service   base URL + auth: bearer, basic, or API key (header/query)',
            '    └ endpoint   method + path, headers, query, body',
            '       └ request   saved, replayable; captures response values into variables',
          ].join('\n'),
        },
        {
          title: 'features',
          list: [
            'Import endpoints from an OpenAPI document (YAML or JSON) or a pasted cURL command.',
            'Variables resolve across the hierarchy, so one login request can capture a token every other request then uses.',
            'MCP tools to list and read projects, services, endpoints and saved requests, run them, import OpenAPI and create or update endpoints. Secrets are masked in everything the agent sees.',
          ],
        },
        {
          title: 'desktop app',
          list: [
            'Electron build for macOS (Apple Silicon and Intel) and Windows.',
            'First launch asks where to keep data: built-in file storage with nothing to install, or any MongoDB — local, Docker or Atlas.',
            'Serves on localhost only, since an MCP tool that sends requests anywhere should never be reachable from the network. File → Copy MCP URL hooks it into Claude in one step.',
          ],
        },
      ],
    },
  },
  {
    id: 'U7',
    name: 'Ai Git Commit',
    slug: 'ai-git-commit',
    status: 'active',
    desc: 'Desktop git client for one loop: pick files, get an AI-written Conventional Commit, commit, push. Works with API, local (Ollama) or CLI (claude/codex) models.',
    stack: ['Tauri', 'Rust', 'React', 'TypeScript', 'LLMs'],
    detail: {
      meta: [
        ['version', 'v1.1.1'],
        ['since', 'Oct 2026'],
        ['commits', '28'],
        ['ships as', 'macOS + Windows desktop'],
      ],
      sections: [
        {
          title: 'overview',
          text: [
            'A small desktop git client built around one loop: see what changed, pick the files, get an AI-written commit message, commit, push.',
            'The Rust backend shells out to your system git, so existing config, SSH keys and credential helpers just work — nothing is reimplemented.',
          ],
        },
        {
          title: 'features',
          list: [
            'Add local repositories or clone from a URL; the list persists between launches.',
            'Changed and untracked files with a per-file diff; commit only the files you pick, with a preview first.',
            'Fetch, pull and push each show what will happen before they run: incoming commits, push --dry-run.',
            'Commit messages follow Conventional Commits (summary + body), generated from the selected diff. Lockfiles are skipped and big diffs truncated so prompts stay small.',
          ],
        },
        {
          title: 'ai providers',
          pre: [
            'api     OpenAI · Anthropic · Gemini · Groq · OpenRouter · Mistral · DeepSeek',
            'local   Ollama · LM Studio · any OpenAI-compatible URL',
            'cli     claude · gemini · codex   (uses your existing login, auto-detected)',
          ].join('\n'),
        },
        {
          title: 'details that mattered',
          list: [
            'Finder-launched macOS apps get a bare PATH that hides Homebrew git and the AI CLIs, so the app adopts your login shell\'s PATH on startup.',
            'Git never prompts for credentials (it would hang a GUI); a missing credential fails fast with a clear error instead.',
            'Built with itself: its own history is Conventional Commits, which drive the automatic version bump, changelog and tag.',
          ],
        },
        {
          title: 'shipping',
          list: [
            'Developed on my Forgejo and mirrored to GitHub; a version tag builds a universal macOS .dmg and a Windows installer into a draft release.',
          ],
        },
      ],
    },
  },
  {
    id: 'U8',
    name: 'Photo Printer',
    slug: 'photo-printer',
    status: 'active',
    desc: 'Cross-platform app that lays out photos on A4 (grids or passport/4x6 sizes) with crop, rotate and cut lines, then exports a print-ready PDF.',
    stack: ['Tauri', 'Rust', 'React', 'TypeScript', 'pdf-lib'],
    detail: {
      meta: [
        ['version', 'v0.1.1'],
        ['since', 'Oct 2026'],
        ['ships as', 'macOS, Windows, Linux desktop'],
      ],
      sections: [
        {
          title: 'overview',
          text: [
            'Printing a sheet of passport photos, or four 4x6 prints on one A4, should not need a photo editor. Photo Printer lays photos out on A4 and produces a single print-ready PDF.',
          ],
        },
        {
          title: 'features',
          list: [
            'Grid presets (1, 2, 4, 6, 8 or 9 per page) or real photo sizes: passport, wallet, 4x6, 5x7 and more.',
            'Copies fill the sheet, and anything that doesn\'t fit spills onto extra pages.',
            'Per-photo crop (pan and zoom) and rotate; adjustable margins, gaps and cut lines.',
            'Export saves the PDF; Print opens it in your default viewer so the system print dialog does the rest.',
          ],
        },
        {
          title: 'getting sizes exactly right',
          list: [
            'A passport photo is only useful at exactly 35×45 mm, so layout works in real units and the PDF must print at 100%.',
            'A calibration page prints two 100 mm rulers. If a printer still scales slightly, a per-machine printer-scale setting (90–110%) corrects it.',
          ],
        },
        {
          title: 'shipping',
          list: [
            'Tauri 2 keeps the installers small: .dmg on macOS, .msi/.exe on Windows, .deb/.AppImage/.rpm on Linux.',
            'Layout maths is covered by tests run with Node\'s built-in test runner.',
          ],
        },
      ],
    },
  },
  {
    id: 'U9',
    name: 'ai-planner',
    slug: 'ai-planner',
    status: 'active',
    desc: 'Self-hosted dev docs manager that doubles as an MCP server: AI agents create and update plans, audits, issues and docs across projects; humans read and edit them in a markdown UI.',
    stack: ['Next.js', 'MongoDB', 'Mongoose', 'MCP', 'Docker'],
    detail: {
      meta: [
        ['version', 'v1.0.1'],
        ['since', 'Oct 2026'],
        ['commits', '44'],
        ['runs on', 'home server, Docker'],
      ],
      sections: [
        {
          title: 'overview',
          text: [
            'AI coding agents are good at writing plans and audits and bad at remembering them between sessions. ai-planner gives them a shared place to keep that work: a self-hosted docs manager with an MCP server built in.',
            'Agents create and update documents through MCP tools; I read, edit and triage them in a markdown UI. It is the source of truth for my own projects — the School platform and the media trackers are both planned through it.',
          ],
        },
        {
          title: 'document kinds',
          pre: [
            'plan    multi-phase design; may hold open questions, split into issues once approved',
            'audit   security / bug / performance review of one service',
            'issue   one self-contained unit of work: bug · feature · enhancement · task',
            'doc     guides, references and notes, per project or shared by all',
          ].join('\n'),
        },
        {
          title: 'features',
          list: [
            'Plans, issues and docs get per-project numbers, so "issue 44" or "plan 021" resolve directly — for agents and humans alike.',
            'Status lifecycles (plans: draft → active → done; issues: open → fixed → resolved / closed) with an issue board in the UI.',
            'Issues and audits are tagged by service, so one project can span many repos.',
            'Markdown editor and viewer, plus a REST API covering everything the MCP tools do.',
          ],
        },
        {
          title: 'mcp',
          list: [
            'Served as stateless Streamable HTTP straight from the Next.js app — no separate process. One command registers it with Claude Code.',
            'Tools for listing, reading, creating, updating and deleting every document kind. List calls leave out document bodies so agents don\'t burn context on them.',
            'A stdio mode is available for local use without the HTTP layer.',
          ],
        },
        {
          title: 'shipping',
          list: [
            'Docker image built on every push to main, pushed to my registry and redeployed on the home server; versions and changelog come from conventional commits.',
          ],
        },
      ],
    },
  },
]

export const approach = [
  { key: 'modular', title: 'Modular Design', desc: 'Separation of concerns with scalable, reusable components' },
  { key: 'automate', title: 'Automation First', desc: 'Eliminate repetitive tasks through intelligent pipelines' },
  { key: 'feedback', title: 'Real-time Feedback', desc: 'Monitoring loops for continuous system optimization' },
  { key: 'hw+sw', title: 'HW + SW Integration', desc: 'Bridging physical and digital for complete solutions' },
]

export const about = {
  strengths: 'cross-domain problem solving, system architecture, rapid iteration, real-world constraints.',
  growth: 'advanced AI/ML, distributed systems, UI/UX polish, productization.',
  knownBug: "once I discover I can make something work, I sometimes keep going until I've built the most complicated possible version of it. 😎",
}

// `icon` is a terminal-style ASCII glyph shown before each contact entry.
export const contact = [
  { key: 'github', icon: '⌥', label: 'github.com/tinkeshwar', href: 'https://github.com/tinkeshwar' },
  { key: 'linkedin', icon: 'in', label: 'linkedin.com/in/tinkeshwar-singh', href: 'https://www.linkedin.com/in/tinkeshwar-singh-02071b94/' },
  { key: 'email', icon: '✉', label: 'hello@tinkeshwar.com', href: 'mailto:hello@tinkeshwar.com' },
]

// Projects with their own page at /projects/<slug>.
export const pages = projects.filter(p => p.detail)
