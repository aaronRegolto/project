const Hero = () => {
  return (
    <div className="container">
      <div className="hero-grid">
        <div className="hero-content">

          <h1 className="hero-title" id="hero-title">
            <span className="line1">See the World</span>
            <span className="line2">Through Different</span>
            <span className="line3">Eyes</span>
          </h1>
          <p className="hero-desc">
            Discover how color blindness affects millions of people worldwide.
            Simulate real visual experiences, test your own color vision, and
            gain deep empathy for those living with visual impairments.
          </p>
          <div className="hero-actions">
            <a href="#simulator" className="btn btn-primary">Try the Simulator</a>
            <a href="#test" className="btn btn-outline">Take the Test</a>
          </div>
          <div className="hero-stats">
            <div className="stat">
              <div className="stat-num">300M+</div>
              <div className="stat-label">People worldwide with color blindness</div>
            </div>
            <div className="stat">
              <div className="stat-num">1 in 12</div>
              <div className="stat-label">Males affected globally</div>
            </div>
            <div className="stat">
              <div className="stat-num">4+</div>
              <div className="stat-label">Types of color vision deficiency</div>
            </div>
          </div>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <div className="eye-svg-wrap">
            <div className="eye-rings"></div>
            <div className="eye-rings-2"></div>
            <svg viewBox="0 0 380 380" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <radialGradient id="eyeGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stop-color="#5b8dee" stop-opacity="0.9"/>
                  <stop offset="40%" stop-color="#3a5fa8" stop-opacity="0.8"/>
                  <stop offset="100%" stop-color="#1a2350" stop-opacity="0.5"/>
                </radialGradient>
                <radialGradient id="pupilGrad" cx="35%" cy="35%" r="65%">
                  <stop offset="0%" stop-color="#2a3060"/>
                  <stop offset="100%" stop-color="#050810"/>
                </radialGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="blur"/>
                  <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
              </defs>
              {/* Outer ring */}
              <circle cx="190" cy="190" r="160" fill="none" stroke="rgba(200,169,110,0.15)" stroke-width="1"/>
              <circle cx="190" cy="190" r="130" fill="none" stroke="rgba(91,141,238,0.1)" stroke-width="1"/>
              {/* Eye white */}
              <ellipse cx="190" cy="190" rx="140" ry="90" fill="rgba(20,24,48,0.9)" stroke="rgba(200,169,110,0.3)" stroke-width="1.5"/>
              {/* Iris */}
              <circle cx="190" cy="190" r="72" fill="url(#eyeGrad)" filter="url(#glow)"/>
              {/* Iris detail lines */}
              <circle cx="190" cy="190" r="72" fill="none" stroke="rgba(91,141,238,0.3)" stroke-width="0.5" stroke-dasharray="4 3"/>
              {/* Pupil */}
              <circle cx="190" cy="190" r="32" fill="url(#pupilGrad)"/>
              {/* Highlight */}
              <ellipse cx="170" cy="172" rx="10" ry="7" fill="rgba(255,255,255,0.4)" transform="rotate(-20,170,172)"/>
              {/* Lashes lines */}
              <line x1="50" y1="190" x2="72" y2="190" stroke="rgba(200,169,110,0.4)" stroke-width="1.5"/>
              <line x1="308" y1="190" x2="330" y2="190" stroke="rgba(200,169,110,0.4)" stroke-width="1.5"/>
              {/* Color spectrum arc */}
              <path d="M 120 240 Q 190 300 260 240" fill="none" stroke="url(#specGrad)" stroke-width="3" opacity="0.6"/>
              <defs>
                <linearGradient id="specGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stop-color="#e85d6b"/>
                  <stop offset="25%" stop-color="#f0a050"/>
                  <stop offset="50%" stop-color="#56c98a"/>
                  <stop offset="75%" stop-color="#5b8dee"/>
                  <stop offset="100%" stop-color="#9b6dff"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero
