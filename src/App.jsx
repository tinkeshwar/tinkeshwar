import { useEffect, useRef, useState } from 'react'
import BootSequence from './components/BootSequence'
import Shell from './components/Shell'
import ProjectPage from './components/ProjectPage'
import { pages } from './data'

// /projects/api-bird, /about, … → that page. Old #/projects/u1 links still resolve (by id).
const PROJECT_HASH = /^#\/projects\/([\w-]+)$/
const findPage = (pathname, hash = '') => {
  const path = pathname.toLowerCase().replace(/(\.html|\/)$/, '')
  const id = hash.match(PROJECT_HASH)?.[1].toLowerCase()
  return pages.find(p => p.path === path) ?? (id && pages.find(p => p.id?.toLowerCase() === id))
}
const pageFromUrl = () => findPage(location.pathname, location.hash)

export default function App() {
  const [project, setProject] = useState(pageFromUrl)
  // Deep links skip the boot animation.
  const [booted, setBooted] = useState(() => !!project)
  const homeScroll = useRef(0)

  useEffect(() => {
    // The app restores the home scroll itself; stop the browser competing with it.
    history.scrollRestoration = 'manual'
    const onRoute = () => {
      const next = pageFromUrl()
      // Move legacy hash links (and .html / trailing-slash variants) onto the canonical path.
      if (next && location.pathname + location.hash !== next.path) history.replaceState(null, '', next.path)
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
      if (a.pathname !== '/' && !findPage(a.pathname)) return
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
