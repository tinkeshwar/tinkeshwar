import { useEffect } from 'react'

export default function ProjectPage({ project: p }) {
  useEffect(() => {
    const prev = document.title
    document.title = `${p.name} — Tinkeshwar Singh`
    window.scrollTo(0, 0)
    return () => {
      document.title = prev
    }
  }, [p])

  return (
    <div className="shell on project">
      <div className="topbar">
        <span className="dot r" aria-hidden="true" />
        <span className="dot y" aria-hidden="true" />
        <span className="dot g" aria-hidden="true" />
        <span className="path">tinkeshwar@os:~/projects/{p.id}$</span>
        <a className="project__back" href="#/">cd ..</a>
      </div>

      <article className="block project__doc">
        <div className="live-term__bar">
          <span className="live-term__title">tinkeshwar@os: ~ $ cat ./projects/{p.id}/README.md</span>
        </div>
        <div className="out">
          <header className="project__hd">
            <span className="dim">~/projects/<span className="k">{p.id}</span></span>
            <h1>{p.name}</h1>
            <p className="card__desc dim">{p.desc}</p>
            <div className="project__meta">
              <span className="st a">
                <span className="st__dot" aria-hidden="true" />
                {p.status}
              </span>
              {p.detail.meta?.map(([k, v]) => (
                <span key={k}>
                  <span className="dim">{k}=</span>
                  {v}
                </span>
              ))}
            </div>
            <div>
              {p.stack.map(s => (
                <span className="tag" key={s}>{s}</span>
              ))}
            </div>
          </header>

          {p.detail.sections.map(s => (
            <section className="project__sec" key={s.title}>
              <h2>
                <span className="dim">## </span>
                {s.title}
              </h2>
              {s.text?.map((t, i) => <p key={i}>{t}</p>)}
              {s.list && (
                <ul>
                  {s.list.map((t, i) => <li key={i}>{t}</li>)}
                </ul>
              )}
              {s.pre && <pre>{s.pre}</pre>}
            </section>
          ))}
        </div>
        <div className="block__exit dim">
          [exit 0] ✓ EOF · <a href="#/">cd ..</a>
        </div>
      </article>
    </div>
  )
}
