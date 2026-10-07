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
      <span className="k">{row.group.padEnd(12, ' ')}</span>
      <span>
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
    <span className="row-kv">
      <span className="k">{p.id}</span>
      <span>
        {p.name} <span className={`st ${p.status === 'active' ? 'a' : 'b'}`}>{p.status}</span>
        <br />
        <span className="dim">{p.desc}</span>
      </span>
    </span>
  ))
}

function approachRows() {
  return approach.map(a => (
    <span className="row-kv">
      <span className="k">{a.key.padEnd(10, ' ')}</span>
      <span>{a.desc}</span>
    </span>
  ))
}

function aboutRows() {
  return [
    <>
      <span className="label"># known_bug:</span> {about.knownBug}
    </>,
    <>
      <span className="label">strengths:</span> {about.strengths}
    </>,
    <>
      <span className="label">growth:</span> {about.growth}
    </>,
  ]
}

function contactRows() {
  return contact.map(c => {
    const Icon = contactIcons[c.key]
    return (
      <span className="row-kv">
        <span className="contact-icon" aria-hidden="true">
          {Icon ? <Icon /> : c.icon}
        </span>
        <span className="k">{c.key.padEnd(10, ' ')}</span>
        <a href={c.href} target="_blank" rel="noopener noreferrer">
          {c.label}
        </a>
      </span>
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

  useEffect(() => {
    if (phase !== 'loading') return
    const t = setTimeout(() => setPhase('rows'), 260)
    return () => clearTimeout(t)
  }, [phase])

  if (!build) return null
  const rows = build()

  return (
    <div className="block">
      <div className="cmdline">
        <span className="prompt">$</span> <span className="cmd">{cmdLabels[name]}</span>
      </div>
      <div className="out">
        {phase === 'loading' ? (
          <div className="boot-row line dim">loading {name} module ... </div>
        ) : (
          <TypedRows rows={rows} onDone={onReveal} />
        )}
      </div>
    </div>
  )
}
