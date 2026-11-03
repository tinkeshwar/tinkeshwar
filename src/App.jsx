import { useEffect, useRef, useState } from 'react'
import BootSequence from './components/BootSequence'
import Shell from './components/Shell'
import ProjectPage from './components/ProjectPage'
import { projects } from './data'

// #/projects/u1 → the project, if it has a detail page.
const projectFromHash = () => {
  const id = location.hash.match(/^#\/projects\/([\w-]+)$/)?.[1]
  return projects.find(p => p.detail && p.id.toLowerCase() === id?.toLowerCase())
}

export default function App() {
  const [project, setProject] = useState(projectFromHash)
  // Deep links skip the boot animation.
  const [booted, setBooted] = useState(() => !!project)
  const homeScroll = useRef(0)

  useEffect(() => {
    const onHash = () => {
      const next = projectFromHash()
      if (next) homeScroll.current = window.scrollY
      setProject(next)
      if (!next) requestAnimationFrame(() => window.scrollTo(0, homeScroll.current))
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
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
