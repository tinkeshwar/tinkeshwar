import { useEffect, useRef, useState } from 'react'
import { skills, projects, approach, about, contact } from '../data'
import { contactIcons } from './Icons'

// The shell command string shown for each section.
const cmdLabels = {
  skills: 'cat skills.json',
  projects: 'ls -l ./projects',
  approach: 'man philosophy',
  about: './about --verbose',
  contact: 'cat /etc/contact',
}

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Reveals its children (rows) one at a time, BIOS-boot style, then calls onDone.
function TypedRows({ rows, onDone }) {
  const reduced = prefersReducedMotion()
  const [count, setCount] = useState(reduced ? rows.length : 0)
  const doneRef = useRef(false)

  useEffect(() => {
    if (reduced) {
      if (!doneRef.current) {
        doneRef.current = true
        onDone && onDone()
      }
      return
    }
    if (count >= rows.length) {
      if (!doneRef.current) {
        doneRef.current = true
        onDone && onDone()
      }
      return
    }
    const t = setTimeout(() => setCount(c => c + 1), 90 + Math.random() * 90)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, reduced])

  return (
    <>
      {rows.slice(0, count).map((row, i) => (
        <div className="boot-row line" key={i}>
          {row}
        </div>
      ))}
    </>
  )
}

// Each section returns an array of row nodes (so they can stream in one by one).
function skillsRows() {
  const last = skills.length - 1
  return [
    <span className="js"><span className="js__p">{'{'}</span></span>,
    ...skills.map((row, r) => (
      <span className="js js--kv">
        <span className="js__key">"{row.group}"</span>
        <span className="js__p">: [</span>
        <span className="js__arr">
          {row.items.map((i, n) => (
            <span className="js__item" key={i}>
              <span className="js__str">"{i}"</span>
              {n < row.items.length - 1 && <span className="js__p">,</span>}
            </span>
          ))}
        </span>
        <span className="js__p">]{r < last && ','}</span>
      </span>
    )),
    <span className="js"><span className="js__p">{'}'}</span></span>,
  ]
}

// Box-drawing runs, clipped by CSS to whatever size the card ends up.
const H = '─'.repeat(300)
const V = '│\n'.repeat(120)

function projectsRows() {
  return projects.map(p => (
    <span className={`card card--${p.status === 'active' ? 'a' : 'b'}`}>
      <span className="card__edge">
        <span className="bx">┌─</span>
        <span className="card__path dim">
          ~/projects/<span className="k">{p.id}</span>
        </span>
        <span className="bx bx--run" aria-hidden="true">{H}</span>
        <span className={`st ${p.status === 'active' ? 'a' : 'b'}`}>
          <span className="st__dot" aria-hidden="true" />
          {p.status}
        </span>
        <span className="bx">─┐</span>
      </span>
      <span className="card__mid">
        <span className="bx bx--side" aria-hidden="true"><span>{V}</span></span>
        <span className="card__body">
          <span className="card__title">{p.name}</span>
          <span className="card__desc dim">{p.desc}</span>
          {p.stack && (
            <span className="card__stack">
              {p.stack.map(s => (
                <span className="tag" key={s}>
                  {s}
                </span>
              ))}
            </span>
          )}
        </span>
        <span className="bx bx--side" aria-hidden="true"><span>{V}</span></span>
      </span>
      <span className="card__edge" aria-hidden="true">
        <span className="bx">└</span>
        <span className="bx bx--run">{H}</span>
        <span className="bx">┘</span>
      </span>
    </span>
  ))
}

function approachRows() {
  const flags = approach.map(a => `--${a.key}`).join(' | ')
  return [
    <span className="man__hd"><b>PHILOSOPHY(7)</b><span className="dim">Engineer's Manual</span><b>PHILOSOPHY(7)</b></span>,
    <span className="man__sec">NAME</span>,
    <span className="man__in">philosophy — how tinkeshwar builds things</span>,
    <span className="man__sec">SYNOPSIS</span>,
    <span className="man__in"><b>philosophy</b> [<span className="man__fl">{flags}</span>]</span>,
    <span className="man__sec">OPTIONS</span>,
    ...approach.map(a => (
      <span className="man__opt">
        <span className="man__fl">--{a.key}</span>
        <span className="man__name"><b>{a.title}</b><span className="dim">{a.desc}.</span></span>
      </span>
    )),
    <span className="man__hd man__ft dim"><span>tinkeshwar.com</span><span>2026</span><span>PHILOSOPHY(7)</span></span>,
    <span className="man__less"> Manual page philosophy(7) line 1 (END) (press q to quit)</span>,
  ]
}

function aboutRows() {
  const list = t => t.replace(/\.$/, '').split(', ')
  const lines = [
    ['info', 'init', 'loading profile=tinkeshwar mode=verbose'],
    ['warn', 'known_bug', about.knownBug],
    ...list(about.strengths).map(t => ['ok', 'strength', t]),
    ...list(about.growth).map(t => ['wip', 'growth', t]),
  ]
  const warns = lines.filter(l => l[0] === 'warn').length
  lines.push(['done', 'exit', `profile loaded · 0 errors, ${warns} warning`])
  return lines.map(([lvl, tag, text], i) => (
    <span className={`log log--${lvl}`}>
      <span className="log__ts">[{(0.004 + i * 0.0173).toFixed(4).padStart(9, '\u00a0')}]</span>
      <span className="log__lvl">{lvl.toUpperCase()}</span>
      <span className="log__tag">{tag}</span>
      <span className="log__msg">{text}</span>
    </span>
  ))
}

function contactRows() {
  return contact.map(c => {
    const Icon = contactIcons[c.key]
    return (
      <a className="link-row" href={c.href} target="_blank" rel="noopener noreferrer">
        <span className="contact-icon" aria-hidden="true">
          {Icon ? <Icon /> : c.icon}
        </span>
        <span className="k">{c.key}</span>
        <span className="link-row__label">{c.label}</span>
        <span className="link-row__go" aria-hidden="true">↗</span>
      </a>
    )
  })
}

const rowBuilders = {
  skills: skillsRows,
  projects: projectsRows,
  approach: approachRows,
  about: aboutRows,
  contact: contactRows,
}

export default function CommandOutput({ name, onReveal, onClose }) {
  const build = rowBuilders[name]
  // Phase: 'loading' shows a BIOS-style loading line briefly, then 'rows' streams output.
  const reduced = prefersReducedMotion()
  const [phase, setPhase] = useState(reduced ? 'rows' : 'loading')
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (phase !== 'loading') return
    const t = setTimeout(() => setPhase('rows'), 260)
    return () => clearTimeout(t)
  }, [phase])

  const ref = useRef(null)

  // Slow close: fade + sink, then collapse the gap so blocks below glide up.
  const close = () => {
    const el = ref.current
    if (reduced || !el.animate) return onClose && onClose()
    el.style.pointerEvents = 'none'
    const h = `${el.offsetHeight}px`
    const mb = getComputedStyle(el).marginBottom
    el.animate(
      [
        { opacity: 1, transform: 'none', height: h, marginBottom: mb, offset: 0 },
        { opacity: 0, transform: 'scale(0.96) translateY(-8px)', height: h, marginBottom: mb, offset: 0.5 },
        { opacity: 0, transform: 'scale(0.96) translateY(-8px)', height: '0px', marginBottom: '0px', borderWidth: '0px' },
      ],
      { duration: 900, easing: 'ease-in-out', fill: 'forwards' }
    ).onfinish = () => onClose && onClose()
  }

  if (!build) return null
  const rows = build()

  return (
    <section
      ref={ref}
      className="block"
      aria-label={`${name} output`}
    >
      <div className="live-term__bar">
        <button type="button" className="dot r dot--btn" aria-label={`close ${name} output`} onClick={close} />
        <span className="dot y" />
        <span className="dot g" />
        <span className="live-term__title">tinkeshwar@os: ~ $ {cmdLabels[name]}</span>
        <span className="cmdline__meta">{done ? `${rows.length} rows` : 'running…'}</span>
      </div>
      <div className={`out out--${name}`}>
        {phase === 'loading' ? (
          <div className="boot-row line dim">loading {name} module ... </div>
        ) : (
          <TypedRows
            rows={rows}
            onDone={() => {
              setDone(true)
              onReveal && onReveal()
            }}
          />
        )}
      </div>
      {done && <div className="block__exit dim">[exit 0] ✓ {name} loaded</div>}
    </section>
  )
}
