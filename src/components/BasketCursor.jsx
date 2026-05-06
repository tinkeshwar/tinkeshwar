import { useEffect, useState, forwardRef, useImperativeHandle } from 'react'

const BasketCursor = forwardRef((_, ref) => {
  const [pos, setPos] = useState({ x: -100, y: -100 })

  useImperativeHandle(ref, () => pos, [pos])

  useEffect(() => {
    const onMove = (e) => setPos({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <div className="basket-cursor" style={{ left: pos.x, top: pos.y }}>
      ⌇⏣⌇
    </div>
  )
})

BasketCursor.displayName = 'BasketCursor'
export default BasketCursor
