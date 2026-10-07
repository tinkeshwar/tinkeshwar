import { whoami } from '../data'

export default function Whoami() {
  return (
    <div className="block">
      <div className="cmdline">
        <span className="prompt">$</span> <span className="cmd">whoami</span>
      </div>
      <div className="sub">{whoami.subtitle}</div>
      <h1>{whoami.name}</h1>
      <p className="bio">{whoami.bio}</p>
    </div>
  )
}
