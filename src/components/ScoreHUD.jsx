export default function ScoreHUD({ score, gameOver, onRestart }) {
  return (
    <div className="score-hud">
      {gameOver ? (
        <div className="game-over">
          <span className="game-over-text">GAME OVER</span>
          <button className="restart-btn" onClick={onRestart}>RESTART</button>
        </div>
      ) : score > 0 ? (
        <>
          <span className="score-label">CAUGHT:</span>
          <span className="score-value">{score}</span>
        </>
      ) : null}
    </div>
  )
}
