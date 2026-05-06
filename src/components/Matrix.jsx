import { useEffect, useRef, useState, useCallback } from 'react'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*'
const MAX_ITEMS = 60
const SPAWN_INTERVAL = 150
const BOMB_CHANCE = 0.12

let idCounter = 0

function randomChar() {
  return CHARS.charAt(Math.floor(Math.random() * CHARS.length))
}

export default function Matrix({ cursorRef, onCatch, onBomb, gameOver }) {
  const [items, setItems] = useState([])
  const itemsRef = useRef([])
  const frameRef = useRef(null)

  const spawnItem = useCallback(() => {
    if (gameOver) return
    const isBomb = Math.random() < BOMB_CHANCE
    const item = {
      id: idCounter++,
      char: isBomb ? '💣' : randomChar(),
      bomb: isBomb,
      x: Math.random() * window.innerWidth,
      y: -20,
      speed: isBomb ? 1.5 + Math.random() * 2 : 1 + Math.random() * 3,
    }
    itemsRef.current = [...itemsRef.current.slice(-(MAX_ITEMS - 1)), item]
  }, [gameOver])

  useEffect(() => {
    if (gameOver) {
      cancelAnimationFrame(frameRef.current)
      return
    }

    const spawnTimer = setInterval(spawnItem, SPAWN_INTERVAL)

    const tick = () => {
      const cursor = cursorRef?.current
      const bx = cursor?.x ?? -100
      const by = cursor?.y ?? -100

      itemsRef.current = itemsRef.current.reduce((acc, c) => {
        c.y += c.speed
        if (
          c.x > bx - 20 && c.x < bx + 20 &&
          c.y > by - 15 && c.y < by + 15
        ) {
          if (c.bomb) onBomb?.()
          else onCatch?.(c.char)
          return acc
        }
        if (c.y > window.innerHeight) return acc
        acc.push(c)
        return acc
      }, [])

      setItems([...itemsRef.current])
      frameRef.current = requestAnimationFrame(tick)
    }

    frameRef.current = requestAnimationFrame(tick)

    return () => {
      clearInterval(spawnTimer)
      cancelAnimationFrame(frameRef.current)
    }
  }, [spawnItem, cursorRef, onCatch, onBomb, gameOver])

  return (
    <div className="matrix-code">
      {items.map(c => (
        <span
          key={c.id}
          className={c.bomb ? 'matrix-bomb' : `matrix-char ${charClass(c.char)}`}
          style={{ left: c.x, top: c.y }}
        >
          {c.char}
        </span>
      ))}
    </div>
  )
}

function charClass(ch) {
  if (/[0-9]/.test(ch)) return 'char-number'
  if (/[A-Z]/.test(ch)) return 'char-alpha'
  return 'char-special'
}
