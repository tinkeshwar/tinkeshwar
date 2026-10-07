import { useEffect, useRef, useState } from 'react'
import Topbar from './Topbar'
import Whoami from './Whoami'
import PhotoFrame from './PhotoFrame'
import CommandBar from './CommandBar'
import CommandOutput from './CommandOutput'
import LiveTerminal from './LiveTerminal'
import { hints } from '../data'

export default function Shell({ visible }) {
  // Feed is an array of { id, name } output blocks appended as commands run.
  const [feed, setFeed] = useState([])
  const nextId = useRef(0)
  const feedTopRef = useRef(null)
  const pendingScroll = useRef(false)
  // Pick one sarcastic hint at random, stable for this page load.
  const [hint] = useState(() => hints[Math.floor(Math.random(0, hints.length-1) * hints.length)])

  const run = name => {
    pendingScroll.current = true
    // Prepend: newest output appears at the top of the feed.
    setFeed(f => [{ id: nextId.current++, name }, ...f])
  }

  // Scroll the newest (top) block into view after it renders.
  useEffect(() => {
    if (pendingScroll.current && feedTopRef.current) {
      pendingScroll.current = false
      feedTopRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [feed])

  return (
    <div className={`shell ${visible ? 'on' : ''}`} id="shell">
      <Topbar />
      <div className="whoami">
        <div className="whoami-left">
          <Whoami />
          <CommandBar onRun={run} />
        </div>
        <PhotoFrame />
      </div>
      <div id="feed">
        <div ref={feedTopRef} />
        {feed.map(item => (
          <CommandOutput
            key={item.id}
            name={item.name}
            onReveal={() => {
              if (feedTopRef.current) {
                feedTopRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }
            }}
          />
        ))}
      </div>
      <div className="hint">// {hint}</div>
      <LiveTerminal />
    </div>
  )
}
