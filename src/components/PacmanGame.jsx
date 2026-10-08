import { useEffect, useRef, useState } from 'react'

// Maze legend: '#' wall, '.' dot, 'o' power pellet, ' ' empty,
// 'P' pacman start, 'G' ghost start.
const MAZE = [
  '####################',
  '#........##........#',
  '#o##.###.##.###.##o#',
  '#.##.###.##.###.##.#',
  '#..................#',
  '#.##.#.######.#.##.#',
  '#....#...##...#....#',
  '####.###.##.###.####',
  '   #.#...GG...#.#   ',
  '####.#.######.#.####',
  '#........P.........#',
  '#.##.###.##.###.##.#',
  '#o.#.....##.....#.o#',
  '##.#.#.######.#.#.##',
  '#....#...##...#....#',
  '#.######.##.######.#',
  '#..................#',
  '####################',
]

const CELL = 15
const STEP_MS = 250 // pac + ghost move cadence
const GAME_OVER_MSG = 'Game over. The ghosts send their regards. 👻'
const WIN_MSG = 'Maze cleared! You are officially better at this than at touching grass.'

const DIRS = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
}

export default function PacmanGame({ onExit }) {
  const canvasRef = useRef(null)
  const [score, setScore] = useState(0)
  const [status, setStatus] = useState('playing') // 'playing' | 'dead' | 'won'
  const game = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const rows = MAZE.length
    const cols = MAZE[0].length
    canvas.width = cols * CELL
    canvas.height = rows * CELL

    const styles = getComputedStyle(document.documentElement)
    const accent = styles.getPropertyValue('--accent').trim() || '#39ff14'
    const accent2 = styles.getPropertyValue('--accent2').trim() || '#00e5ff'
    const amber = styles.getPropertyValue('--amber').trim() || '#ffb000'
    const red = styles.getPropertyValue('--red').trim() || '#ff4d4d'
    const bg = styles.getPropertyValue('--bg').trim() || '#05060a'

    // Parse the maze into a grid of walls + dots, and find spawns.
    const grid = []
    let pac = null
    const ghosts = []
    let dotsLeft = 0
    for (let y = 0; y < rows; y++) {
      const row = []
      for (let x = 0; x < cols; x++) {
        const ch = MAZE[y][x]
        if (ch === '#') row.push({ wall: true, dot: 0 })
        else if (ch === '.') {
          row.push({ wall: false, dot: 1 })
          dotsLeft++
        } else if (ch === 'o') {
          row.push({ wall: false, dot: 2 })
          dotsLeft++
        } else {
          row.push({ wall: false, dot: 0 })
          if (ch === 'P') pac = { x, y }
          if (ch === 'G') ghosts.push({ x, y, color: ghosts.length === 0 ? red : accent2 })
        }
      }
      grid.push(row)
    }

    game.current = {
      grid,
      rows,
      cols,
      pac: { ...pac, dir: DIRS.left, next: DIRS.left, mouth: 0 },
      ghosts: ghosts.map(g => ({ ...g, dir: DIRS.up })),
      dotsLeft,
      fright: 0, // frames of frightened mode remaining
      dead: false,
      won: false,
    }

    const canMove = (x, y) => {
      const g = game.current
      if (x < 0 || y < 0 || x >= g.cols || y >= g.rows) return false
      return !g.grid[y][x].wall
    }

    const draw = () => {
      const g = game.current
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      for (let y = 0; y < g.rows; y++) {
        for (let x = 0; x < g.cols; x++) {
          const c = g.grid[y][x]
          const px = x * CELL
          const py = y * CELL
          if (c.wall) {
            ctx.fillStyle = 'rgba(0,229,255,0.14)'
            ctx.strokeStyle = accent2
            ctx.lineWidth = 1
            ctx.fillRect(px + 2, py + 2, CELL - 4, CELL - 4)
            ctx.strokeRect(px + 2.5, py + 2.5, CELL - 5, CELL - 5)
          } else if (c.dot === 1) {
            ctx.fillStyle = amber
            ctx.beginPath()
            ctx.arc(px + CELL / 2, py + CELL / 2, 2, 0, Math.PI * 2)
            ctx.fill()
          } else if (c.dot === 2) {
            ctx.fillStyle = amber
            ctx.shadowColor = amber
            ctx.shadowBlur = 8
            ctx.beginPath()
            ctx.arc(px + CELL / 2, py + CELL / 2, 5, 0, Math.PI * 2)
            ctx.fill()
            ctx.shadowBlur = 0
          }
        }
      }

      // pac-man with animated mouth
      const p = g.pac
      const cx = p.x * CELL + CELL / 2
      const cy = p.y * CELL + CELL / 2
      const r = CELL / 2 - 1
      const open = 0.15 + 0.2 * Math.abs(Math.sin(p.mouth))
      let a0 = open * Math.PI
      let a1 = (2 - open) * Math.PI
      // rotate the mouth toward the direction of travel
      let rot = 0
      if (p.dir === DIRS.up) rot = -Math.PI / 2
      else if (p.dir === DIRS.down) rot = Math.PI / 2
      else if (p.dir === DIRS.left) rot = Math.PI
      ctx.save()
      ctx.translate(cx, cy)
      ctx.rotate(rot)
      ctx.fillStyle = accent
      ctx.shadowColor = accent
      ctx.shadowBlur = 10
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.arc(0, 0, r, a0, a1)
      ctx.closePath()
      ctx.fill()
      ctx.shadowBlur = 0
      ctx.restore()

      // ghosts
      g.ghosts.forEach(gh => {
        const gx = gh.x * CELL + CELL / 2
        const gy = gh.y * CELL + CELL / 2
        ctx.fillStyle = g.fright > 0 ? accent2 : gh.color
        ctx.shadowColor = ctx.fillStyle
        ctx.shadowBlur = 8
        ctx.beginPath()
        ctx.arc(gx, gy - 1, r - 1, Math.PI, 0)
        ctx.lineTo(gx + r - 1, gy + r - 2)
        ctx.lineTo(gx + (r - 1) / 2, gy + r - 4)
        ctx.lineTo(gx, gy + r - 2)
        ctx.lineTo(gx - (r - 1) / 2, gy + r - 4)
        ctx.lineTo(gx - (r - 1), gy + r - 2)
        ctx.closePath()
        ctx.fill()
        ctx.shadowBlur = 0
        // eyes
        ctx.fillStyle = '#fff'
        ctx.beginPath()
        ctx.arc(gx - 3, gy - 2, 2, 0, Math.PI * 2)
        ctx.arc(gx + 3, gy - 2, 2, 0, Math.PI * 2)
        ctx.fill()
      })
    }

    const moveGhost = gh => {
      const g = game.current
      // Choose among valid non-reverse moves; bias toward (or away from) pac.
      const opts = Object.values(DIRS).filter(d => {
        if (d.x === -gh.dir.x && d.y === -gh.dir.y) return false // no 180s
        return canMove(gh.x + d.x, gh.y + d.y)
      })
      const choices = opts.length ? opts : Object.values(DIRS).filter(d => canMove(gh.x + d.x, gh.y + d.y))
      if (!choices.length) return
      const chase = g.fright > 0 ? -1 : 1
      // 70% of the time pick the move that best reduces/increases distance to pac
      let pick
      if (Math.random() < 0.7) {
        pick = choices.reduce((best, d) => {
          const nd = Math.hypot(gh.x + d.x - g.pac.x, gh.y + d.y - g.pac.y) * chase
          const bd = Math.hypot(gh.x + best.x - g.pac.x, gh.y + best.y - g.pac.y) * chase
          return nd < bd ? d : best
        })
      } else {
        pick = choices[(Math.random() * choices.length) | 0]
      }
      gh.dir = pick
      gh.x += pick.x
      gh.y += pick.y
    }

    const collide = () => {
      const g = game.current
      for (const gh of g.ghosts) {
        if (gh.x === g.pac.x && gh.y === g.pac.y) {
          if (g.fright > 0) {
            // eat the ghost: send it back to center-ish
            gh.x = (g.cols / 2) | 0
            gh.y = (g.rows / 2) | 0
            setScore(s => s + 50)
          } else {
            g.dead = true
            setStatus('dead')
          }
        }
      }
    }

    const step = () => {
      const g = game.current
      if (g.dead || g.won) return

      // try queued direction, else continue current
      const p = g.pac
      if (canMove(p.x + p.next.x, p.y + p.next.y)) p.dir = p.next
      if (canMove(p.x + p.dir.x, p.y + p.dir.y)) {
        p.x += p.dir.x
        p.y += p.dir.y
      }
      p.mouth += 0.9

      // eat dot
      const cell = g.grid[p.y][p.x]
      if (cell.dot === 1) {
        cell.dot = 0
        g.dotsLeft--
        setScore(s => s + 10)
      } else if (cell.dot === 2) {
        cell.dot = 0
        g.dotsLeft--
        g.fright = 28 // frightened frames
        setScore(s => s + 20)
      }

      collide()
      if (g.fright > 0) g.fright--
      g.ghosts.forEach(moveGhost)
      collide()

      if (g.dotsLeft <= 0) {
        g.won = true
        setStatus('won')
      }
      draw()
    }

    draw()
    const timer = setInterval(step, STEP_MS)

    const onKey = e => {
      const g = game.current
      const k = e.key
      if (k === 'Escape') {
        onExit()
        return
      }
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(k)) {
        e.preventDefault()
        if (g.dead || g.won) return
        if (k === 'ArrowUp') g.pac.next = DIRS.up
        else if (k === 'ArrowDown') g.pac.next = DIRS.down
        else if (k === 'ArrowLeft') g.pac.next = DIRS.left
        else if (k === 'ArrowRight') g.pac.next = DIRS.right
      }
    }
    window.addEventListener('keydown', onKey)

    return () => {
      clearInterval(timer)
      window.removeEventListener('keydown', onKey)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="arcade">
      <div className="arcade__hud">
        <span>
          score: <b>{score}</b>
        </span>
        <span className="dim">↑ ↓ ← → to move · esc to quit</span>
      </div>
      <canvas ref={canvasRef} className="arcade__canvas" />
      {status !== 'playing' && (
        <div className="arcade__over" role="alert">
          <div className={`arcade__over-msg ${status === 'won' ? 'win' : ''}`}>
            {status === 'won' ? WIN_MSG : GAME_OVER_MSG}
          </div>
          <div className="dim">final score: {score}</div>
          <button type="button" className="arcade__btn" onClick={onExit}>
            [ exit to shell ]
          </button>
        </div>
      )}
    </div>
  )
}
