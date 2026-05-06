import Nav from './components/Nav'
import Hero from './components/Hero'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Approach from './components/Approach'
import About from './components/About'
import Footer from './components/Footer'

export default function App() {
  return (
    <>
      <Nav />
      <div className="container">
        <Hero />
        <Skills />
        <Projects />
        <Approach />
        <About />
      </div>
      <Footer />
    </>
  )
}
