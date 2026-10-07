import { useEffect, useRef, useState } from 'react'

const CELL = 20 // px per grid cell
const BASE_INTERVAL = 140 // ms per step at start
const MIN_INTERVAL = 55 // fastest it can get
const SPEEDUP_EVERY = 5 // bites between speed increases
const SPEEDUP_STEP = 12 // ms shaved off per speed-up

const GAME_OVER_MSG = 'You should never try to pet a snake, they disss..'

export default function SnakeGame({ onExit }) {
  const canvasRef = useRef(null)
  const wrapRef = useRef(null)
  const [score, setScore] = useState(0)
  const [over, setOver] = useState(false)

  // All fast-changing game state lives in a ref so the loop isn't re-created.
  const game = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return
    const ctx = canvas.getContext('2d')

    // Size the board to the space left for the canvas (wrapper minus the HUD),
    // snapped to the grid.
    const rect = wrap.getBoundingClientRect()
    const hud = wrap.querySelector('.snake__hud')
    const hudH = hud ? hud.getBoundingClientRect().height + 8 : 0
    const availW = rect.width
    const availH = rect.height - hudH
    const cols = Math.max(10, Math.floor(availW / CELL))
    const rows = Math.max(10, Math.floor(availH / CELL))
    canvas.width = cols * CELL
    canvas.height = rows * CELL

    const styles = getComputedStyle(document.documentElement)
    const accent = styles.getPropertyValue('--accent').trim() || '#39ff14'
    const accent2 = styles.getPropertyValue('--accent2').trim() || '#00e5ff'
    const amber = styles.getPropertyValue('--amber').trim() || '#ffb000'
    const bg = styles.getPropertyValue('--bg').trim() || '#05060a'

    const randFood = snake => {
      let f
      do {
        f = { x: (Math.random() * cols) | 0, y: (Math.random() * rows) | 0 }
      } while (snake.some(s => s.x === f.x && s.y === f.y))
      return f
    }

    const start = {
      snake: [
        { x: (cols / 2) | 0, y: (rows / 2) | 0 },
        { x: ((cols / 2) | 0) - 1, y: (rows / 2) | 0 },
        { x: ((cols / 2) | 0) - 2, y: (rows / 2) | 0 },
      ],
      dir: { x: 1, y: 0 },
      nextDir: { x: 1, y: 0 },
      food: null,
      bites: 0,
      interval: BASE_INTERVAL,
      dead: false,
      cols,
      rows,
    }
    start.food = randFood(start.snake)
    game.current = start

    const draw = () => {
      const g = game.current
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // subtle grid
      ctx.strokeStyle = 'rgba(57,255,20,0.06)'
      ctx.lineWidth = 1
      for (let x = 0; x <= cols; x++) {
        ctx.beginPath()
        ctx.moveTo(x * CELL + 0.5, 0)
        ctx.lineTo(x * CELL + 0.5, canvas.height)
        ctx.stroke()
      }
      for (let y = 0; y <= rows; y++) {
        ctx.beginPath()
        ctx.moveTo(0, y * CELL + 0.5)
        ctx.lineTo(canvas.width, y * CELL + 0.5)
        ctx.stroke()
      }

      // food
      ctx.fillStyle = amber
      ctx.shadowColor = amber
      ctx.shadowBlur = 10
      ctx.fillRect(g.food.x * CELL + 3, g.food.y * CELL + 3, CELL - 6, CELL - 6)
      ctx.shadowBlur = 0

      // snake
      g.snake.forEach((s, i) => {
        ctx.fillStyle = i === 0 ? accent2 : accent
        ctx.shadowColor = i === 0 ? accent2 : accent
        ctx.shadowBlur = i === 0 ? 12 : 6
        ctx.fillRect(s.x * CELL + 1, s.y * CELL + 1, CELL - 2, CELL - 2)
      })
      ctx.shadowBlur = 0
    }

    const step = () => {
      const g = game.current
      if (g.dead) return

      // apply queued direction (prevents reversing into self mid-tick)
      g.dir = g.nextDir
      const head = g.snake[0]
      const nx = head.x + g.dir.x
      const ny = head.y + g.dir.y

      // wall collision = death
      if (nx < 0 || ny < 0 || nx >= g.cols || ny >= g.rows) {
        g.dead = true
        setOver(true)
        return
      }
      // self collision = death
      if (g.snake.some(s => s.x === nx && s.y === ny)) {
        g.dead = true
        setOver(true)
        return
      }

      const newHead = { x: nx, y: ny }
      g.snake.unshift(newHead)

      if (nx === g.food.x && ny === g.food.y) {
        // eat: grow (don't pop tail), count bite, maybe speed up
        g.bites += 1
        setScore(g.bites)
        g.food = randFood(g.snake)
        if (g.bites % SPEEDUP_EVERY === 0) {
          g.interval = Math.max(MIN_INTERVAL, g.interval - SPEEDUP_STEP)
          restartLoop()
        }
      } else {
        g.snake.pop()
      }
      draw()
    }

    let timer = null
    const restartLoop = () => {
      if (timer) clearInterval(timer)
      timer = setInterval(step, game.current.interval)
    }

    draw()
    restartLoop()

    const onKey = e => {
      const g = game.current
      const k = e.key
      if (k === 'Escape') {
        onExit()
        return
      }
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(k)) e.preventDefault()
      if (g.dead) return
      const d = g.dir
      if (k === 'ArrowUp' && d.y !== 1) g.nextDir = { x: 0, y: -1 }
      else if (k === 'ArrowDown' && d.y !== -1) g.nextDir = { x: 0, y: 1 }
      else if (k === 'ArrowLeft' && d.x !== 1) g.nextDir = { x: -1, y: 0 }
      else if (k === 'ArrowRight' && d.x !== -1) g.nextDir = { x: 1, y: 0 }
    }
    window.addEventListener('keydown', onKey)

    return () => {
      if (timer) clearInterval(timer)
      window.removeEventListener('keydown', onKey)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="snake" ref={wrapRef}>
      <div className="snake__hud">
        <span>
          bites: <b>{score}</b>
        </span>
        <span className="dim">↑ ↓ ← → to move · esc to quit</span>
      </div>
      <canvas ref={canvasRef} className="snake__canvas" />
      {over && (
        <div className="snake__over" role="alert">
          <div className="snake__over-msg">{GAME_OVER_MSG}</div>
          <div className="dim">final bites: {score}</div>
          <button type="button" className="snake__btn" onClick={onExit}>
            [ exit to shell ]
          </button>
        </div>
      )}
    </div>
  )
}
