import { commands } from '../data'

export default function CommandBar({ onRun }) {
  return (
    <div className="cmdbar" role="group" aria-label="Run a section command">
      {commands.map(c => (
        <button key={c} type="button" onClick={() => onRun(c)}>
          ./{c}
        </button>
      ))}
    </div>
  )
}
