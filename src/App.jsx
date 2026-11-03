import { useEffect, useRef, useState } from 'react'
import BootSequence from './components/BootSequence'
import Shell from './components/Shell'
import ProjectPage from './components/ProjectPage'
import { pages } from './data'

// /projects/api-bird → that project. Old #/projects/u1 links still resolve (by id).
const PROJECT_PATH = /^\/projects\/([\w-]+?)(?:\.html)?\/?$/
const PROJECT_HASH = /^#\/projects\/([\w-]+)$/
const findProject = key =>
  key && pages.find(p => [p.slug, p.id.toLowerCase()].includes(key.toLowerCase()))
const projectFromUrl = () =>
  findProject(location.pathname.match(PROJECT_PATH)?.[1] ?? location.hash.match(PROJECT_HASH)?.[1])

export default function App() {
  const [project, setProject] = useState(projectFromUrl)
  // Deep links skip the boot animation.
  const [booted, setBooted] = useState(() => !!project)
  const homeScroll = useRef(0)

  useEffect(() => {
    // The app restores the home scroll itself; stop the browser competing with it.
    history.scrollRestoration = 'manual'
    const onRoute = () => {
      const next = projectFromUrl()
      // Move legacy hash links (and id/.html variants) onto the canonical path.
      if (next && location.pathname + location.hash !== `/projects/${next.slug}`)
        history.replaceState(null, '', `/projects/${next.slug}`)
      if (next) homeScroll.current = window.scrollY
      setProject(next)
      if (!next) requestAnimationFrame(() => window.scrollTo(0, homeScroll.current))
    }
    onRoute()
    // Real links for crawlers, but in-app clicks stay client-side so the shell isn't rebooted.
    const onClick = e => {
      const a = e.target.closest('a')
      if (!a || a.target || a.origin !== location.origin || a.hash) return
      if (e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      if (a.pathname !== '/' && !findProject(a.pathname.match(PROJECT_PATH)?.[1])) return
      e.preventDefault()
      history.pushState(null, '', a.href)
      onRoute()
    }
    window.addEventListener('popstate', onRoute)
    window.addEventListener('hashchange', onRoute)
    document.addEventListener('click', onClick)
    return () => {
      window.removeEventListener('popstate', onRoute)
      window.removeEventListener('hashchange', onRoute)
      document.removeEventListener('click', onClick)
    }
  }, [])

  return (
    <>
      <div className="crt" aria-hidden="true" />
      {!booted && <BootSequence onDone={() => setBooted(true)} />}
      {project && <ProjectPage project={project} />}
      {/* stays mounted (hidden) so the command feed survives a visit to a project */}
      <div hidden={!!project}>
        <Shell visible={booted} />
      </div>
    </>
  )
}
