import { skills, projects, approach, about, contact } from '../data'

// The shell command string shown for each section.
const cmdLabels = {
  skills: 'cat skills.json',
  projects: 'ls -l ./projects',
  approach: 'man philosophy',
  about: './about --verbose',
  contact: 'cat /etc/contact',
}

function SkillsOut() {
  return (
    <table>
      <tbody>
        {skills.map(row => (
          <tr key={row.group}>
            <td className="k">{row.group}</td>
            <td>
              {row.items.map(i => (
                <span className="tag" key={i}>
                  {i}
                </span>
              ))}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function ProjectsOut() {
  return (
    <table>
      <tbody>
        {projects.map(p => (
          <tr key={p.id}>
            <td className="k">{p.id}</td>
            <td>
              {p.name}{' '}
              <span className={`st ${p.status === 'active' ? 'a' : 'b'}`}>{p.status}</span>
              <br />
              <span className="dim">{p.desc}</span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function ApproachOut() {
  return (
    <table>
      <tbody>
        {approach.map(a => (
          <tr key={a.key}>
            <td className="k">{a.key}</td>
            <td>{a.desc}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function AboutOut() {
  return (
    <>
      <span className="label"># known_bug:</span> {about.knownBug}
      <br />
      <br />
      <span className="label">strengths:</span> {about.strengths}
      <br />
      <span className="label">growth:</span> {about.growth}
    </>
  )
}

function ContactOut() {
  return (
    <table>
      <tbody>
        {contact.map(c => (
          <tr key={c.key}>
            <td className="k">{c.key}</td>
            <td>
              <a href={c.href} target="_blank" rel="noopener noreferrer">
                {c.label}
              </a>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

const bodies = {
  skills: SkillsOut,
  projects: ProjectsOut,
  approach: ApproachOut,
  about: AboutOut,
  contact: ContactOut,
}

export default function CommandOutput({ name }) {
  const Body = bodies[name]
  if (!Body) return null
  return (
    <div className="block">
      <div className="cmdline">
        <span className="prompt">$</span> <span className="cmd">{cmdLabels[name]}</span>
      </div>
      <div className="out">
        <Body />
      </div>
    </div>
  )
}
