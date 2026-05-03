import React from 'react'

const types = [
  {
    accent: 'linear-gradient(90deg,#e85d6b,#c84455)',
    icon: ['#e85d6b', '#a0a020', '#5b8dee', '#808080'],
    subtitle: 'Red-Green Type',
    title: 'Deuteranopia',
    desc: 'Absence of green-sensitive cones. Red, orange, yellow, and green appear similar, often as shades of yellow-brown. The most common form among males.',
    prevalence: 80,
    pct: '5% of males'
  },
  {
    accent: 'linear-gradient(90deg,#f08040,#c06020)',
    icon: ['#808020', '#606060', '#5b8dee', '#404040'],
    subtitle: 'Red-Green Type',
    title: 'Protanopia',
    desc: 'Absence of red-sensitive cones. Red appears very dark, almost black. Green and orange can be confused with each other. Brightness of red is significantly reduced.',
    prevalence: 45,
    pct: '2.5% of males'
  },
  {
    accent: 'linear-gradient(90deg,#5b8dee,#3060c0)',
    icon: ['#e85d6b', '#a0c040', '#808080', '#c0c080'],
    subtitle: 'Blue-Yellow Type',
    title: 'Tritanopia',
    desc: 'Absence of blue-sensitive cones. Blue and green are confused; yellow and violet look similar. Rarer than red-green deficiencies and affects both sexes equally.',
    prevalence: 15,
    pct: '0.01% of population'
  },
  {
    accent: 'linear-gradient(90deg,#808080,#404040)',
    icon: ['#909090', '#606060', '#404040', '#b0b0b0'],
    subtitle: 'Complete Type',
    title: 'Monochromacy',
    desc: 'Total absence of color perception. The world appears only in shades of gray. Extremely rare—achromatopsia affects about 1 in 33,000 people worldwide.',
    prevalence: 5,
    pct: '0.003% of population'
  }
]

function Types() {
  return (
    <div className="container">
      <div className="section-eyebrow reveal">Understanding Color Vision</div>
      <h2 className="section-title reveal reveal-delay-1" id="types-title">Types of <em>Color Blindness</em></h2>
      <p className="section-desc reveal reveal-delay-2">Color blindness is not actually blindness—it is a deficiency in the ability to distinguish certain colors. Each type has distinct characteristics and affects people in unique ways.</p>

      <div className="types-grid">
        {types.map((type, index) => (
          <div key={type.title} className="type-card reveal reveal-delay-3">
            <div className="type-card-accent" style={{ background: type.accent }}></div>
            <div className="type-card-icon">
              {type.icon.map((color, i) => (
                <span key={i} style={{ background: color }}></span>
              ))}
            </div>
            <div className="type-card-subtitle">{type.subtitle}</div>
            <h3 className="type-card-title">{type.title}</h3>
            <p className="type-card-desc">{type.desc}</p>
            <div className="type-card-prevalence">
              <div className="prevalence-bar-track">
                <div className="prevalence-bar-fill" style={{ width: `${type.prevalence}%` }}></div>
              </div>
              <span className="prevalence-pct">{type.pct}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Types