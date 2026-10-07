import { useState } from 'react'

export default function PhotoFrame() {
  // Uses the real photo at public/terminal-me.jpeg; falls back to the
  // terminal ASCII portrait if it ever fails to load.
  const [hasPhoto, setHasPhoto] = useState(true)

  return (
    <figure className="photo-frame" aria-label="Portrait of Tinkeshwar Singh">
      <div className="photo-frame__bar">
        <span className="dot r" />
        <span className="dot y" />
        <span className="dot g" />
        <span className="photo-frame__title">~/terminal-me.jpeg</span>
      </div>
      <div className="photo-frame__body">
        {hasPhoto ? (
          <img
            src="/terminal-me.jpeg"
            alt="Tinkeshwar Singh"
            className="photo-frame__img"
            onError={() => setHasPhoto(false)}
          />
        ) : (
          // Fallback shown only if public/terminal-me.jpeg fails to load.
          <pre className="photo-frame__ascii" aria-hidden="true">{`
      .----------------.
     |  ___________     |
     | |  ^     ^  |    |
     | |     >     |    |
     | |   \\___/   |    |
     |  \\_________/     |
     |    |  TS   |      |
      '----------------'
   [ img not found :: /terminal-me.jpeg ]
   check public/terminal-me.jpeg
`}</pre>
        )}
      </div>
      <figcaption className="photo-frame__caption">
        <span className="prompt">$</span> file terminal-me.jpeg → portrait/operator
      </figcaption>
    </figure>
  )
}
