import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

// Fake power-off: CRT collapse → black → "fooled you" → power back on.
// With `reboot`, collapse → black → reload (the boot screen plays on every load).
export default function Shutdown({ onDone, reboot }) {
  const [phase, setPhase] = useState('off') // off | black | fooled | on

  useEffect(() => {
    const root = document.getElementById('root')
    root.style.transformOrigin = `50% ${window.scrollY + window.innerHeight / 2}px`
    document.body.classList.add('crt-off')
    const steps = reboot ? [
      [700, () => setPhase('black')],
      [1400, () => window.location.reload()],
    ] : [
      [700, () => setPhase('black')],
      [2600, () => setPhase('fooled')],
      [5000, () => { setPhase('on'); document.body.classList.replace('crt-off', 'crt-on') }],
      [5800, () => onDone()],
    ]
    const ts = steps.map(([ms, fn]) => setTimeout(fn, ms))
    return () => {
      ts.forEach(clearTimeout)
      document.body.classList.remove('crt-off', 'crt-on')
      root.style.transformOrigin = ''
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return createPortal(
    <div className={`poweroff poweroff--${phase}`} aria-live="assertive">
      {phase === 'fooled' && <p className="poweroff__msg">fooled you<span className="blink" /></p>}
    </div>,
    document.body
  )
}
