import { useEffect, useRef, useState } from 'react'
import { bootLines } from '../data'

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function BootSequence({ onDone }) {
  const reduced = prefersReducedMotion()
  // With reduced motion, show every line immediately.
  const [count, setCount] = useState(reduced ? bootLines.length : 0)
  const [leaving, setLeaving] = useState(false)
  const doneRef = useRef(false)

  // Finish the boot: fade out, then notify parent.
  const finish = () => {
    if (doneRef.current) return
    doneRef.current = true
    if (reduced) {
      onDone()
      return
    }
    setLeaving(true)
    setTimeout(onDone, 500)
  }

  // Sequence the lines on with randomized timing (skipped when reduced motion).
  useEffect(() => {
    if (reduced) {
      const t = setTimeout(finish, 400)
      return () => clearTimeout(t)
    }
    if (count >= bootLines.length) {
      const t = setTimeout(finish, 700)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => setCount(c => c + 1), 180 + Math.random() * 160)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, reduced])

  // Any click or keypress skips straight to the shell.
  useEffect(() => {
    const skip = () => finish()
    window.addEventListener('keydown', skip)
    window.addEventListener('pointerdown', skip)
    return () => {
      window.removeEventListener('keydown', skip)
      window.removeEventListener('pointerdown', skip)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      id="boot"
      className={leaving ? 'leaving' : ''}
      role="status"
      aria-label="System boot sequence. Press any key to skip."
    >
      {bootLines.slice(0, count).map(([txt, cls, tail], idx) => (
        <div className={`line ${cls || ''}`} key={idx}>
          {txt}
          {tail || ''}
        </div>
      ))}
    </div>
  )
}
