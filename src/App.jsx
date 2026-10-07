import { useState } from 'react'
import BootSequence from './components/BootSequence'
import Shell from './components/Shell'

export default function App() {
  const [booted, setBooted] = useState(false)

  return (
    <>
      <div className="crt" aria-hidden="true" />
      {!booted && <BootSequence onDone={() => setBooted(true)} />}
      <Shell visible={booted} />
    </>
  )
}
