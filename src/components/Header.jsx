import { useState } from 'react'

const navItems = [
  { href: '#hero', label: 'Home' },
  { href: '#types', label: 'Types' },
  { href: '#simulator', label: 'Simulator' },
  { href: '#test', label: 'Test' },
  { href: '#voice', label: 'Voice' },
];

const Header = () => {
  const [fontSize, setFontSize] = useState(16)
  const [theme, setTheme] = useState('dark')
  const [readingGuideActive, setReadingGuideActive] = useState(false)
  const [readingGuideHeight, setReadingGuideHeight] = useState(36)

  const handleFontSize = (size) => {
    setFontSize(size)
    document.documentElement.style.setProperty('--font-size', size + 'px')
  }

  const handleTheme = (newTheme) => {
    setTheme(newTheme)
    const root = document.documentElement
    if (newTheme === 'hc') {
      root.classList.add('hc')
      root.style.setProperty('--bg', '#000')
      root.style.setProperty('--bg2', '#000')
      root.style.setProperty('--bg3', '#111')
      root.style.setProperty('--surface', '#111')
      root.style.setProperty('--surface2', '#1a1a1a')
      root.style.setProperty('--border', '#fff')
      root.style.setProperty('--text', '#fff')
      root.style.setProperty('--text-muted', '#ffff00')
      root.style.setProperty('--text-soft', '#eee')
      root.style.setProperty('--accent', '#ffff00')
      root.style.setProperty('--accent2', '#ffff00')
      root.style.setProperty('--accent-glow', 'rgba(255,255,0,0.2)')
    } else {
      root.classList.remove('hc')
      const vars = newTheme === 'light' ? {
        '--bg': '#f4f1ec',
        '--bg2': '#ede9e2',
        '--bg3': '#e6e0d6',
        '--surface': '#fff',
        '--surface2': '#f8f5f0',
        '--border': '#ddd8ce',
        '--text': '#1a1a1a',
        '--text-muted': '#6b6050',
        '--text-soft': '#3d3830',
        '--accent': '#8b6820',
        '--accent2': '#a07830',
        '--accent-glow': 'rgba(139,104,32,0.1)'
      } : {
        '--bg': '#0a0c14',
        '--bg2': '#0f1220',
        '--bg3': '#161929',
        '--surface': '#1c2035',
        '--surface2': '#232840',
        '--border': '#2e3558',
        '--text': '#e8eaf6',
        '--text-muted': '#8891b8',
        '--text-soft': '#bcc2e0',
        '--accent': '#c8a96e',
        '--accent2': '#e8c98a',
        '--accent-glow': 'rgba(200,169,110,0.15)'
      }
      Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v))
    }
  }

  const toggleReadingGuide = () => {
    setReadingGuideActive(!readingGuideActive)
    const guide = document.getElementById('reading-guide')
    if (!readingGuideActive) {
      guide.classList.add('active')
      document.addEventListener('mousemove', (e) => {
        guide.style.top = e.clientY + 'px'
      })
    } else {
      guide.classList.remove('active')
      document.removeEventListener('mousemove', () => {})
    }
  }

  const handleReadingGuideHeight = (e) => {
    const height = e.target.value
    setReadingGuideHeight(height)
    document.documentElement.style.setProperty('--rg-height', height + 'px')
  }

  return (
    <header className="header" aria-label="Site header">
      <div className="header-content">
        <a href="#hero" className="header-logo">Visual<span>Aid</span></a>

        <nav id="main-nav" className="header-nav" aria-label="Main navigation">
          <div className="nav-links">
            {navItems.map((item) => (
              <a key={item.href} className="nav-link" href={item.href} onClick={(e) => {
                e.preventDefault()
                document.querySelector(item.href).scrollIntoView({ behavior: 'smooth' })
              }}>
                {item.label}
              </a>
            ))}
          </div>
        </nav>

        <div className="header-toolbar" role="banner" aria-label="Accessibility controls">
          <div className="tb-group" role="group" aria-label="Text size">
            <span className="tb-label">Text</span>
            <button className={`tb-btn ${fontSize === 13 ? 'active' : ''}`} onClick={() => handleFontSize(13)} aria-label="Small text">A-</button>
            <button className={`tb-btn ${fontSize === 16 ? 'active' : ''}`} onClick={() => handleFontSize(16)} aria-label="Normal text">A</button>
            <button className={`tb-btn ${fontSize === 19 ? 'active' : ''}`} onClick={() => handleFontSize(19)} aria-label="Large text">A+</button>
            <button className={`tb-btn ${fontSize === 23 ? 'active' : ''}`} onClick={() => handleFontSize(23)} aria-label="Extra large text">A++</button>
          </div>

          <div className="tb-group" role="group" aria-label="Color theme">
            <span className="tb-label">Theme</span>
            <button className={`tb-btn ${theme === 'dark' ? 'active' : ''}`} onClick={() => handleTheme('dark')} aria-pressed={theme === 'dark'} aria-label="Dark theme">Dark</button>
            <button className={`tb-btn ${theme === 'light' ? 'active' : ''}`} onClick={() => handleTheme('light')} aria-pressed={theme === 'light'} aria-label="Light theme">Light</button>
            <button className={`tb-btn ${theme === 'hc' ? 'active' : ''}`} onClick={() => handleTheme('hc')} aria-pressed={theme === 'hc'} aria-label="High contrast theme">High Contrast</button>
          </div>

          <div className="tb-group">
            <span className="tb-label">Tools</span>
            <button className={`tb-btn ${readingGuideActive ? 'active' : ''}`} id="rg-btn" onClick={toggleReadingGuide} aria-pressed={readingGuideActive} aria-label="Toggle reading guide">Reading Guide</button>
            <div className="dial-group" title="Adjust reading guide height">
              <input type="range" id="rg-dial" className="dial-input" min="15" max="80" value={readingGuideHeight} onChange={handleReadingGuideHeight} aria-label={`Reading guide height: ${readingGuideHeight} pixels`} />
              <span className="dial-label" id="rg-label">{readingGuideHeight}px</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
