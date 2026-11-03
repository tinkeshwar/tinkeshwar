import { useEffect } from 'react'

// Read theme colors from CSS variables, with fallbacks.
export function themeColors() {
  const s = getComputedStyle(document.documentElement)
  const v = (name, fallback) => s.getPropertyValue(name).trim() || fallback
  return {
    accent: v('--accent', '#39ff14'),
    accent2: v('--accent2', '#00e5ff'),
    amber: v('--amber', '#ffb000'),
    red: v('--red', '#ff4d4d'),
    bg: v('--bg', '#05060a'),
  }
}

// Shared HUD + game-over overlay + Escape-to-exit for terminal games.
export default function ArcadeFrame({ frameRef, canvasRef, label, score, over, win, message, onExit }) {
  useEffect(() => {
    const onKey = e => e.key === 'Escape' && onExit()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onExit])

  return (
    <div className="arcade" ref={frameRef}>
      <div className="arcade__hud">
        <span>
          {label}: <b>{score}</b>
        </span>
        <span className="dim">↑ ↓ ← → to move · esc to quit</span>
      </div>
      <canvas ref={canvasRef} className="arcade__canvas" />
      {over && (
        <div className="arcade__over" role="alert">
          <div className={`arcade__over-msg ${win ? 'win' : ''}`}>{message}</div>
          <div className="dim">
            final {label}: {score}
          </div>
          <button type="button" className="arcade__btn" onClick={onExit}>
            [ exit to shell ]
          </button>
        </div>
      )}
    </div>
  )
}
