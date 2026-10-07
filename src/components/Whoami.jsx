import { whoami } from '../data'

export default function Whoami() {
  return (
    <div className="block whoami-text">
      <div className="cmdline">
        <span className="prompt">$</span> <span className="cmd">whoami</span>
      </div>
      <div className="sub">{whoami.subtitle}</div>
      <h1>{whoami.name}</h1>
      <div className="bio">
        {whoami.bio.map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>
    </div>
  )
}
