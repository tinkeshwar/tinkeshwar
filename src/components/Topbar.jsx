import { useEffect, useRef, useState } from 'react'

export default function Topbar({ hint }) {
  const boxRef = useRef(null)
  const [shift, setShift] = useState(0)

  // Marquee only when the hint overflows its slot.
  useEffect(() => {
    const box = boxRef.current
    if (!box) return
    const measure = () => setShift(Math.max(0, box.firstChild.scrollWidth - box.clientWidth))
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [hint])

  return (
    <div className="topbar">
      <span className="dot r" aria-hidden="true" />
      <span className="dot y" aria-hidden="true" />
      <span className="dot g" aria-hidden="true" />
      <span className="path">tinkeshwar@os:~$</span>
      {hint && (
        <span
          ref={boxRef}
          className={`topbar__hint ${shift ? 'is-marquee' : ''}`}
          title={hint}
          style={shift ? { '--shift': `-${shift}px`, '--dur': `${Math.max(6, shift / 25)}s` } : undefined}
        >
          <span>// {hint}</span>
        </span>
      )}
      <span className="blink" aria-hidden="true" />
    </div>
  )
}
