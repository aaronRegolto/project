import { useEffect } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import Types from './components/Types'
import Simulator from './components/Simulator'
import Test from './components/Test'
import VoicePanel from './components/VoicePanel'
import Footer from './components/Footer'

function App() {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
        }
      })
    }, { threshold: 0.15 })

    document.querySelectorAll('.reveal').forEach((el) => {
      observer.observe(el)
    })

    // Update nav on scroll
    const sections = document.querySelectorAll('section[id]')
    const handleScroll = () => {
      let current = ''
      sections.forEach(s => {
        if (window.scrollY >= s.offsetTop - 160) current = s.id
      })
      document.querySelectorAll('.nav-link').forEach(n => {
        n.classList.toggle('active', n.getAttribute('href') === '#' + current)
      })
    }
    window.addEventListener('scroll', handleScroll)
    handleScroll()

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <>
      <div id="reading-guide" role="presentation" aria-hidden="true"></div>
      <a href="#main-content" className="skip-link">Skip to main content</a>

      <Header />

      <main id="main-content">
        <section id="hero" className="section">
          <Hero />
        </section>

        <section id="types" className="section">
          <Types />
        </section>

        <section id="simulator" className="section">
          <Simulator />
        </section>

        <section id="test" className="section">
          <Test />
        </section>

        <section id="voice" className="section">
          <VoicePanel />
        </section>
      </main>

      <Footer />
    </>
  )
}

export default App
