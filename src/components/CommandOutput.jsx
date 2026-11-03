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
  return skills.map(row => (
    <span className="row-kv">
      <span className="k">{row.group}</span>
      <span className="tags">
        {row.items.map(i => (
          <span className="tag" key={i}>
            {i}
          </span>
        ))}
      </span>
    </span>
  ))
}

function projectsRows() {
  return projects.map(p => (
    <span className="card">
      <span className="card__head">
        <span className="k">{p.id}</span>
        <span className={`st ${p.status === 'active' ? 'a' : 'b'}`}>{p.status}</span>
      </span>
      <span className="card__title">{p.name}</span>
      <span className="dim">{p.desc}</span>
    </span>
  ))
}

function approachRows() {
  return approach.map((a, i) => (
    <span className="row-kv">
      <span className="k">{String(i + 1).padStart(2, '0')}</span>
      <span>
        <span className="card__title">{a.title}</span>
        <span className="dim">{a.desc}</span>
      </span>
    </span>
  ))
}

function aboutRows() {
  return [
    ['# known_bug', about.knownBug],
    ['strengths', about.strengths],
    ['growth', about.growth],
  ].map(([label, text]) => (
    <span className="field">
      <span className="label">{label}:</span>
      <span>{text}</span>
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

export default function CommandOutput({ name, onReveal }) {
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

  if (!build) return null
  const rows = build()

  return (
    <section className="block" aria-label={`${name} output`}>
      <div className="cmdline">
        <span className="prompt">$</span> <span className="cmd">{cmdLabels[name]}</span>
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
