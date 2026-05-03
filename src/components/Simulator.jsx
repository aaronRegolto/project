import { useState, useEffect, useRef } from 'react'
import { applyColorFilter, applyFilterToHexColor } from '../utils/colorFilters'

const Simulator = () => {
  const [currentSimType, setCurrentSimType] = useState('normal')
  const [currentScene, setCurrentScene] = useState('nature')
  const normalCanvasRef = useRef(null)
  const simCanvasRef = useRef(null)

  const simulationTypes = [
    {
      id: 'normal',
      name: 'Normal Vision',
      description: 'Full color spectrum',
      dot: 'linear-gradient(135deg,#e85d6b,#56c98a,#5b8dee)',
    },
    {
      id: 'deuteranopia',
      name: 'Deuteranopia',
      description: 'No green cones',
      dot: '#a0a020',
    },
    {
      id: 'protanopia',
      name: 'Protanopia',
      description: 'No red cones',
      dot: '#606030',
    },
    {
      id: 'tritanopia',
      name: 'Tritanopia',
      description: 'No blue cones',
      dot: '#80a080',
    },
    {
      id: 'monochromacy',
      name: 'Monochromacy',
      description: 'No color at all',
      dot: '#808080',
    },
    {
      id: 'deuteranomaly',
      name: 'Deuteranomaly',
      description: 'Weak green cones',
      dot: '#b09030',
    },
  ]

  const simDescriptions = {
    'normal': 'Normal vision perceives all wavelengths of light fully. You can distinguish all colors in the rainbow clearly.',
    'deuteranopia': 'Deuteranopia (missing green cones): Red, orange, yellow, and green appear similar—often muddy yellow-brown shades. Blue and purple look alike.',
    'protanopia': 'Protanopia (missing red cones): Red appears very dark or black. Orange and green are confused. Warm colors lose their brightness dramatically.',
    'tritanopia': 'Tritanopia (missing blue cones): Blue-green and red are confused. Yellow appears pinkish. The world has a warm, red-green tint.',
    'monochromacy': 'Monochromacy (no color cones): All color is absent. The entire world is perceived only in shades of gray, like a black-and-white photograph.',
    'deuteranomaly': 'Deuteranomaly (weakened green cones): The most common type. Green is shifted toward red. Green and yellow appear redder and are hard to distinguish.'
  }

  const colorPalette = [
    { color: '#e85d6b', label: 'Red' },
    { color: '#f0a050', label: 'Orange' },
    { color: '#f0e050', label: 'Yellow' },
    { color: '#56c98a', label: 'Green' },
    { color: '#5b8dee', label: 'Blue' },
    { color: '#9b6dff', label: 'Violet' },
    { color: '#ff69b4', label: 'Pink' },
    { color: '#20d0c0', label: 'Teal' },
  ]

  const scenes = [
    { id: 'nature', name: 'Nature' },
    { id: 'city', name: 'City' },
    { id: 'abstract', name: 'Abstract' }
  ]

  const drawScene = (scene, ctx, w, h) => {
    ctx.clearRect(0, 0, w, h)
    if (scene === 'nature') {
      // Sky
      const sky = ctx.createLinearGradient(0, 0, 0, h * 0.55)
      sky.addColorStop(0, '#1a6dd0')
      sky.addColorStop(1, '#80c8f0')
      ctx.fillStyle = sky
      ctx.fillRect(0, 0, w, h * 0.55)
      // Sun
      ctx.fillStyle = '#f0e050'
      ctx.beginPath()
      ctx.arc(w * 0.8, h * 0.15, 22, 0, Math.PI * 2)
      ctx.fill()
      // Grass
      const grass = ctx.createLinearGradient(0, h * 0.55, 0, h)
      grass.addColorStop(0, '#22a850')
      grass.addColorStop(1, '#155a30')
      ctx.fillStyle = grass
      ctx.fillRect(0, h * 0.55, w, h)
      // Tree
      ctx.fillStyle = '#6b3a1f'
      ctx.fillRect(w * 0.15 - 8, h * 0.35, 16, h * 0.35)
      ctx.fillStyle = '#1a8a40'
      ctx.beginPath()
      ctx.arc(w * 0.15, h * 0.28, 38, 0, Math.PI * 2)
      ctx.fill()
      // Flowers
      const colors = ['#e85d6b', '#f0a050', '#f0e050', '#56c98a']
      for (let i = 0; i < 12; i++) {
        const x = 40 + i * (w - 80) / 11
        const y = h * 0.6 + Math.sin(i) * 8
        ctx.fillStyle = colors[i % 4]
        ctx.beginPath()
        ctx.arc(x, y, 5, 0, Math.PI * 2)
        ctx.fill()
      }
      // Cloud
      ctx.fillStyle = 'rgba(255,255,255,0.9)'
      ctx.beginPath()
      ctx.arc(w * 0.4, h * 0.15, 18, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.arc(w * 0.4 + 22, h * 0.16, 14, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.arc(w * 0.4 - 18, h * 0.17, 12, 0, Math.PI * 2)
      ctx.fill()
    } else if (scene === 'city') {
      // Sky
      ctx.fillStyle = '#1a1a3a'
      ctx.fillRect(0, 0, w, h * 0.65)
      // Stars
      ctx.fillStyle = '#fff'
      for (let i = 0; i < 20; i++) {
        ctx.beginPath()
        ctx.arc(Math.random() * w, Math.random() * h * 0.55, 1, 0, Math.PI * 2)
        ctx.fill()
      }
      // Ground
      ctx.fillStyle = '#222'
      ctx.fillRect(0, h * 0.65, w, h)
      // Buildings
      const bldgs = [
        [0, 0.3, 0.15, 0.55, '#2a2a4a'],
        [0.1, 0.2, 0.12, 0.65, '#1a3a5a'],
        [0.22, 0.35, 0.1, 0.5, '#3a1a4a'],
        [0.55, 0.25, 0.14, 0.6, '#1a2a3a'],
        [0.65, 0.15, 0.1, 0.7, '#2a3a5a'],
        [0.75, 0.3, 0.12, 0.55, '#1a1a4a'],
        [0.88, 0.2, 0.12, 0.65, '#3a2a4a']
      ]
      bldgs.forEach(([x, top, ww, bottom, c]) => {
        ctx.fillStyle = c
        ctx.fillRect(x * w, top * h, ww * w, (bottom - top) * h)
        // Windows
        ctx.fillStyle = '#f0e050'
        for (let wy = top * h + 8; wy < bottom * h - 8; wy += 12) {
          for (let wx = x * w + 5; wx < (x + ww) * w - 5; wx += 10) {
            if (Math.random() > 0.4) {
              ctx.fillRect(wx, wy, 5, 6)
            }
          }
        }
      })
      // Traffic light
      ctx.fillStyle = '#333'
      ctx.fillRect(w * 0.48, h * 0.4, 4, h * 0.3)
      ctx.fillStyle = '#e85d6b'
      ctx.beginPath()
      ctx.arc(w * 0.48 + 2, h * 0.44, 5, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#f0e050'
      ctx.beginPath()
      ctx.arc(w * 0.48 + 2, h * 0.52, 5, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#56c98a'
      ctx.beginPath()
      ctx.arc(w * 0.48 + 2, h * 0.60, 5, 0, Math.PI * 2)
      ctx.fill()
    } else if (scene === 'abstract') {
      ctx.fillStyle = '#111'
      ctx.fillRect(0, 0, w, h)
      const shapes = [
        { x: 0.2, y: 0.2, r: 60, c: '#e85d6b', a: 0.7 },
        { x: 0.5, y: 0.3, r: 80, c: '#56c98a', a: 0.6 },
        { x: 0.75, y: 0.5, r: 55, c: '#5b8dee', a: 0.7 },
        { x: 0.35, y: 0.65, r: 70, c: '#f0e050', a: 0.5 },
        { x: 0.65, y: 0.7, r: 65, c: '#9b6dff', a: 0.6 },
        { x: 0.1, y: 0.6, r: 45, c: '#f0a050', a: 0.7 },
        { x: 0.85, y: 0.25, r: 50, c: '#20d0c0', a: 0.6 },
      ]
      shapes.forEach(s => {
        const g = ctx.createRadialGradient(s.x * w, s.y * h, 0, s.x * w, s.y * h, s.r)
        g.addColorStop(0, s.c + 'cc')
        g.addColorStop(1, s.c + '00')
        ctx.fillStyle = g
        ctx.globalAlpha = s.a
        ctx.beginPath()
        ctx.arc(s.x * w, s.y * h, s.r, 0, Math.PI * 2)
        ctx.fill()
      })
      ctx.globalAlpha = 1
      // Grid lines
      ctx.strokeStyle = 'rgba(255,255,255,0.05)'
      ctx.lineWidth = 1
      for (let i = 0; i < w; i += 30) {
        ctx.beginPath()
        ctx.moveTo(i, 0)
        ctx.lineTo(i, h)
        ctx.stroke()
      }
      for (let i = 0; i < h; i += 30) {
        ctx.beginPath()
        ctx.moveTo(0, i)
        ctx.lineTo(w, i)
        ctx.stroke()
      }
    }
  }

  const applySimulation = (ctx, type, w, h) => {
    drawScene(currentScene, ctx, w, h)
    if (type && type !== 'normal') {
      const imageData = ctx.getImageData(0, 0, w, h)
      const filtered = applyColorFilter(imageData, type)
      ctx.putImageData(filtered, 0, 0)
    }
  }

  useEffect(() => {
    if (!normalCanvasRef.current || !simCanvasRef.current) return
    const normalCtx = normalCanvasRef.current.getContext('2d')
    const simCtx = simCanvasRef.current.getContext('2d')
    drawScene(currentScene, normalCtx, 300, 180)
    applySimulation(simCtx, currentSimType, 300, 180)
  }, [currentScene, currentSimType])

  const handleSimTypeChange = (type) => {
    setCurrentSimType(type)
  }

  const handleSceneChange = (scene) => {
    setCurrentScene(scene)
  }

  return (
    <div className="container">
      <div className="section-eyebrow reveal">Live Color Simulation</div>
      <h2 className="section-title reveal reveal-delay-1" id="sim-title">See Through <em>Their Eyes</em></h2>
      <p className="section-desc reveal reveal-delay-2">Select a color vision deficiency type to see how the same colors appear to someone with that condition. Compare side by side in real time.</p>

      <div className="sim-layout">
        <div className="sim-controls reveal">
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Choose a vision type to simulate:</p>
          <div className="sim-type-grid" role="group" aria-label="Color blindness simulation types">
            {simulationTypes.map((type) => (
              <button
                key={type.id}
                className={`sim-type-btn ${currentSimType === type.id ? 'active' : ''}`}
                onClick={() => handleSimTypeChange(type.id)}
                aria-pressed={currentSimType === type.id}
              >
                <div className="sim-dot" style={{ background: type.dot }} />
                <div className="sim-type-name">{type.name}</div>
                <div className="sim-type-desc">{type.description}</div>
              </button>
            ))}
          </div>

          <div style={{ marginTop: '2rem', padding: '1.25rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '10px' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>What changes</p>
            <p id="sim-description" style={{ fontSize: '0.85rem', color: 'var(--text-soft)', lineHeight: '1.7' }}>
              {simDescriptions[currentSimType]}
            </p>
          </div>
        </div>

        <div className="sim-preview-panel reveal reveal-delay-2">
          <div className="sim-preview-label">
            <span>Color Comparison</span>
            <span className="sim-badge">{simulationTypes.find(t => t.id === currentSimType).name}</span>
          </div>
          <div className="sim-compare-wrap">
            <div className="sim-panel">
              <div className="sim-panel-title">Normal Vision</div>
              <div className="color-swatches" id="swatches-normal">
                {colorPalette.map((swatch) => (
                  <div key={swatch.label} className="swatch" style={{ background: swatch.color }} data-label={swatch.label}></div>
                ))}
              </div>
              <div className="sim-scene">
                <canvas ref={normalCanvasRef} id="scene-normal" width="300" height="180"></canvas>
              </div>
            </div>
            <div className="sim-divider" aria-hidden="true"></div>
            <div className="sim-panel">
              <div className="sim-panel-title">{simulationTypes.find(t => t.id === currentSimType).name}</div>
              <div className={`color-swatches filter-${currentSimType}`} id="swatches-sim">
                {colorPalette.map((swatch) => (
                  <div key={swatch.label} className="swatch" style={{ background: applyFilterToHexColor(swatch.color, currentSimType) }} data-label={swatch.label}></div>
                ))}
              </div>
              <div className={`sim-scene filter-${currentSimType}`} id="sim-scene-filter">
                <canvas ref={simCanvasRef} id="scene-sim" width="300" height="180"></canvas>
              </div>
            </div>
          </div>
          <div className="scene-selector" role="group" aria-label="Scene selector">
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '600', alignSelf: 'center', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Scene:</span>
            {scenes.map((scene) => (
              <button
                key={scene.id}
                className={`scene-btn ${currentScene === scene.id ? 'active' : ''}`}
                onClick={() => handleSceneChange(scene.id)}
                aria-pressed={currentScene === scene.id}
              >
                {scene.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Simulator

