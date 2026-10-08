import { useEffect, useRef, useState } from 'react'
import { whoami, skills, projects, approach, about, contact, commands } from '../data'
import SnakeGame from './SnakeGame'
import PacmanGame from './PacmanGame'

// Build the text response for a given command.
function respond(cmd) {
  const c = cmd.trim().toLowerCase()
  if (!c) return null

  switch (c) {
    case 'help':
      return [
        'available commands:',
        '  skills      list technical expertise',
        '  projects    list current builds',
        '  approach    engineering philosophy',
        '  about       the operator, verbose',
        '  contact     how to reach me',
        '  whoami      identity readout',
        '  snake       be snake (arrows to move, esc to quit)',
        '  pacman      play pac-man (arrows to move, esc to quit)',
        '  date        current timestamp',
        '  echo <x>    print <x>',
        '  clear       wipe the screen',
        '  help        this list',
      ]
    case 'whoami':
      return [whoami.name, whoami.subtitle]
    case 'skills':
      return skills.map(s => `${s.group.padEnd(12)} ${s.items.join(', ')}`)
    case 'projects':
      return projects.map(p => `[${p.id}] ${p.name} (${p.status})\n       ${p.desc}`)
    case 'approach':
      return approach.map(a => `${a.key.padEnd(10)} ${a.desc}`)
    case 'about':
      return [`# known_bug: ${about.knownBug}`, `strengths: ${about.strengths}`, `growth: ${about.growth}`]
    case 'contact':
      return contact.map(x => `${x.icon.padEnd(3)} ${x.key.padEnd(10)} ${x.label}`)
    case 'date':
      return [new Date().toString()]
    case 'ls':
      return [commands.join('  ')]
    case 'sudo':
    case 'sudo su':
      return ['nice try. operator privileges are not for sale.']
    case 'rm -rf /':
    case 'rm -rf /*':
      return ['request denied. this is a museum piece, not a sandbox.']
    case 'exit':
    case 'quit':
      return ["there's no escape. this is cruel world. (try: help)"]
    default:
      if (c.startsWith('echo ')) return [cmd.trim().slice(5)]
      return [`command not found: ${c}. type 'help'.`]
  }
}

export default function LiveTerminal() {
  const [lines, setLines] = useState([
    { kind: 'sys', text: "interactive shell ready. type 'help' to list commands." },
  ])
  const [input, setInput] = useState('')
  const [history, setHistory] = useState([])
  const [histIdx, setHistIdx] = useState(-1)
  const [game, setGame] = useState(null) // null | 'snake' | 'pacman'
  const bodyRef = useRef(null)
  const inputRef = useRef(null)
  const rootRef = useRef(null)
  const [height, setHeight] = useState(null)

  // Measure the space from the terminal's top edge to the bottom of the
  // viewport, so it fills exactly the remaining height (no page scrollbar).
  useEffect(() => {
    const measure = () => {
      if (!rootRef.current) return
      const top = rootRef.current.getBoundingClientRect().top
      const gap = 16 // breathing room at the bottom edge
      const h = Math.max(220, window.innerHeight - top - gap)
      setHeight(h)
    }
    measure()
    window.addEventListener('resize', measure)
    // Re-measure when content above changes size (feed grows, image loads, etc.)
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null
    if (ro && document.querySelector('.shell')) ro.observe(document.querySelector('.shell'))
    return () => {
      window.removeEventListener('resize', measure)
      if (ro) ro.disconnect()
    }
  }, [])

  // Keep the view pinned to the newest line.
  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight
  }, [lines])

  const submit = () => {
    const cmd = input
    const c = cmd.trim().toLowerCase()
    const next = [...lines, { kind: 'cmd', text: cmd }]
    if (c === 'clear') {
      setLines([])
    } else if (c === 'snake') {
      next.push({ kind: 'sys', text: 'launching snake… steer with arrow keys, esc to quit.' })
      setLines(next)
      setGame('snake')
    } else if (c === 'pacman') {
      next.push({ kind: 'sys', text: 'launching pac-man… steer with arrow keys, esc to quit.' })
      setLines(next)
      setGame('pacman')
    } else {
      const out = respond(cmd)
      if (out) out.forEach(t => next.push({ kind: 'out', text: t }))
      setLines(next)
    }
    if (cmd.trim()) setHistory(h => [...h, cmd])
    setHistIdx(-1)
    setInput('')
  }

  const exitGame = () => {
    const name = game === 'pacman' ? 'pac-man' : 'snake'
    setGame(null)
    setLines(l => [...l, { kind: 'sys', text: `${name} terminated. back to the shell.` }])
    // refocus the input after returning
    setTimeout(() => inputRef.current && inputRef.current.focus(), 0)
  }

  const onKeyDown = e => {
    if (e.key === 'Enter') {
      submit()
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (!history.length) return
      const idx = histIdx === -1 ? history.length - 1 : Math.max(0, histIdx - 1)
      setHistIdx(idx)
      setInput(history[idx])
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (histIdx === -1) return
      const idx = histIdx + 1
      if (idx >= history.length) {
        setHistIdx(-1)
        setInput('')
      } else {
        setHistIdx(idx)
        setInput(history[idx])
      }
    }
  }

  return (
    <section
      className="live-term"
      aria-label="Interactive terminal"
      ref={rootRef}
      style={height ? { height: `${height}px` } : undefined}
      onClick={() => inputRef.current && inputRef.current.focus()}
    >
      <div className="live-term__bar">
        <span className="dot r" />
        <span className="dot y" />
        <span className="dot g" />
        <span className="live-term__title">tinkeshwar@os: ~/shell</span>
      </div>
      <div className="live-term__body" ref={bodyRef}>
        {game === 'snake' && <SnakeGame onExit={exitGame} />}
        {game === 'pacman' && <PacmanGame onExit={exitGame} />}
        {!game && lines.map((l, i) => {
          if (l.kind === 'cmd')
            return (
              <div className="live-term__line" key={i}>
                <span className="prompt">❯</span> <span className="cmd">{l.text}</span>
              </div>
            )
          return (
            <div className={`live-term__line ${l.kind === 'sys' ? 'dim' : 'out'}`} key={i}>
              {l.text}
            </div>
          )
        })}
        {!game && (
          <div className="live-term__prompt">
            <span className="prompt">❯</span>
            <input
              ref={inputRef}
              className="live-term__input"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              spellCheck="false"
              autoCapitalize="off"
              autoComplete="off"
              aria-label="Terminal command input"
              placeholder="type a command… (try: help)"
            />
          </div>
        )}
      </div>
    </section>
  )
}
