import { useEffect, useRef, useState } from 'react'
import Topbar from './Topbar'
import Whoami from './Whoami'
import CommandBar from './CommandBar'
import CommandOutput from './CommandOutput'

export default function Shell({ visible }) {
  // Feed is an array of { id, name } output blocks appended as commands run.
  const [feed, setFeed] = useState([])
  const nextId = useRef(0)
  const feedEndRef = useRef(null)
  const pendingScroll = useRef(false)

  const run = name => {
    pendingScroll.current = true
    setFeed(f => [...f, { id: nextId.current++, name }])
  }

  // Scroll the newest block into view after it renders.
  useEffect(() => {
    if (pendingScroll.current && feedEndRef.current) {
      pendingScroll.current = false
      feedEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [feed])

  return (
    <div className={`shell ${visible ? 'on' : ''}`} id="shell">
      <Topbar />
      <Whoami />
      <CommandBar onRun={run} />
      <div id="feed">
        {feed.map(item => (
          <CommandOutput key={item.id} name={item.name} />
        ))}
        <div ref={feedEndRef} />
      </div>
      <div className="hint">
        // the site boots like a machine; "run" sections as commands. type-on output, scanlines, CRT glow.
      </div>
    </div>
  )
}
