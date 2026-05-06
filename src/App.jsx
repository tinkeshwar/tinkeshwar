import { useRef, useState, useCallback } from 'react'
import Matrix from './components/Matrix'
import BasketCursor from './components/BasketCursor'
import ScoreHUD from './components/ScoreHUD'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Approach from './components/Approach'
import About from './components/About'
import Footer from './components/Footer'

export default function App() {
  const cursorRef = useRef({ x: -100, y: -100 })
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)

  const handleCatch = useCallback(() => {
    setScore(s => s + 1)
  }, [])

  const handleBomb = useCallback(() => {
    setScore(s => {
      const next = s - 10
      if (next < 0) setGameOver(true)
      return next
    })
  }, [])

  const handleRestart = useCallback(() => {
    setScore(0)
    setGameOver(false)
  }, [])

  return (
    <>
      <BasketCursor ref={cursorRef} />
      <Matrix cursorRef={cursorRef} onCatch={handleCatch} onBomb={handleBomb} gameOver={gameOver} />
      <ScoreHUD score={score} gameOver={gameOver} onRestart={handleRestart} />
      <Nav />
      <div className="container">
        <Hero />
        <Skills />
        <Projects />
        <Approach />
        <About />
      </div>
      <Footer />
    </>
  )
}
