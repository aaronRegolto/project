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
      </div>
    </div>
  )
}

export default Hero
