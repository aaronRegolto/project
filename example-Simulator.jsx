import { useState } from 'react';

/**
 * Simulator Component
 * Allows users to select a color blindness type and see how colors appear
 * Demonstrates: useState, .map(), conditional rendering
 */

const Simulator = () => {
  const [currentSimType, setCurrentSimType] = useState('normal');
  const [currentScene, setCurrentScene] = useState('nature');

  // Data-driven approach: Define simulation types as an array
  const simulationTypes = [
    {
      id: 'normal',
      name: 'Normal Vision',
      description: 'Full color spectrum',
      dot: 'linear-gradient(135deg,#e85d6b,#56c98a,#5b8dee)',
      explanation: 'Normal vision perceives all wavelengths of light fully. You can distinguish all colors in the rainbow clearly.',
    },
    {
      id: 'deuteranopia',
      name: 'Deuteranopia',
      description: 'No green cones',
      dot: '#a0a020',
      explanation: 'Absence of green-sensitive cones. Red, orange, yellow, and green appear similar, often as shades of yellow-brown.',
      filterClass: 'filter-deuteranopia',
    },
    {
      id: 'protanopia',
      name: 'Protanopia',
      description: 'No red cones',
      dot: '#606030',
      explanation: 'Absence of red-sensitive cones. Red appears very dark, almost black. Green and orange can be confused.',
      filterClass: 'filter-protanopia',
    },
    {
      id: 'tritanopia',
      name: 'Tritanopia',
      description: 'No blue cones',
      dot: '#80a080',
      explanation: 'Absence of blue-sensitive cones. Blue and green are confused; yellow and violet look similar.',
      filterClass: 'filter-tritanopia',
    },
    {
      id: 'monochromacy',
      name: 'Monochromacy',
      description: 'No color at all',
      dot: '#808080',
      explanation: 'Total absence of color perception. The world appears only in shades of gray.',
      filterClass: 'filter-monochromacy',
    },
    {
      id: 'deuteranomaly',
      name: 'Deuteranomaly',
      description: 'Weak green cones',
      dot: '#b09030',
      explanation: 'Partial deficiency in green-sensitive cones. Some reduction in green discrimination.',
      filterClass: 'filter-deuteranomaly',
    },
  ];

  // Color palette for swatches
  const colorPalette = [
    { color: '#e85d6b', label: 'Red' },
    { color: '#f0a050', label: 'Orange' },
    { color: '#f0e050', label: 'Yellow' },
    { color: '#56c98a', label: 'Green' },
    { color: '#5b8dee', label: 'Blue' },
    { color: '#9b6dff', label: 'Violet' },
    { color: '#ff69b4', label: 'Pink' },
    { color: '#20d0c0', label: 'Teal' },
  ];

  const scenes = ['Nature', 'City', 'Food', 'Abstract'];

  const currentType = simulationTypes.find(t => t.id === currentSimType);

  return (
    <section id="simulator" className="section" aria-labelledby="sim-title">
      <div className="container">
        <div className="section-eyebrow reveal">Live Color Simulation</div>
        <h2 className="section-title reveal reveal-delay-1" id="sim-title">
          See Through <em>Their Eyes</em>
        </h2>
        <p className="section-desc reveal reveal-delay-2">
          Select a color vision deficiency type to see how the same colors appear 
          to someone with that condition. Compare side by side in real time.
        </p>

        <div className="sim-layout">
          {/* Left Panel - Controls */}
          <div className="sim-controls reveal">
            <p style={{ 
              fontSize: '0.82rem', 
              color: 'var(--text-muted)', 
              marginBottom: '1rem' 
            }}>
              Choose a vision type to simulate:
            </p>
            
            <div className="sim-type-grid" role="group" aria-label="Color blindness simulation types">
              {simulationTypes.map(type => (
                <button
                  key={type.id}
                  className={`sim-type-btn ${currentSimType === type.id ? 'active' : ''}`}
                  onClick={() => setCurrentSimType(type.id)}
                  aria-pressed={currentSimType === type.id}
                >
                  <div 
                    className="sim-dot" 
                    style={{ background: type.dot }}
                  ></div>
                  <div className="sim-type-name">{type.name}</div>
                  <div className="sim-type-desc">{type.description}</div>
                </button>
              ))}
            </div>

            {/* Info Box */}
            <div style={{
              marginTop: '2rem',
              padding: '1.25rem',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '10px',
            }}>
              <p style={{
                fontSize: '0.75rem',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--text-muted)',
                marginBottom: '0.75rem',
              }}>What changes</p>
              <p id="sim-description" style={{
                fontSize: '0.85rem',
                color: 'var(--text-soft)',
                lineHeight: '1.7',
              }}>
                {currentType?.explanation}
              </p>
            </div>
          </div>

          {/* Right Panel - Preview */}
          <div className="sim-preview-panel reveal reveal-delay-2">
            <div className="sim-preview-label">
              <span>Color Comparison</span>
              <span className="sim-badge" id="sim-type-label">
                {currentType?.name}
              </span>
            </div>

            <div className="sim-compare-wrap">
              {/* Normal Vision Panel */}
              <div className="sim-panel">
                <div className="sim-panel-title">Normal Vision</div>
                <div className="color-swatches" id="swatches-normal">
                  {colorPalette.map(swatch => (
                    <div
                      key={swatch.label}
                      className="swatch"
                      style={{ background: swatch.color }}
                      data-label={swatch.label}
                    ></div>
                  ))}
                </div>
                <div className="sim-scene">
                  <canvas id="scene-normal" width="300" height="180"></canvas>
                </div>
              </div>

              {/* Divider */}
              <div className="sim-divider" aria-hidden="true"></div>

              {/* Simulated Panel */}
              <div className="sim-panel">
                <div className="sim-panel-title" id="sim-panel-label">
                  Simulated View
                </div>
                <div 
                  className="color-swatches"
                  id="swatches-sim"
                  style={currentType?.filterClass ? 
                    { filter: `url(#${currentType.id})` } : {}
                  }
                >
                  {colorPalette.map(swatch => (
                    <div
                      key={swatch.label}
                      className="swatch"
                      style={{ background: swatch.color }}
                      data-label={swatch.label}
                    ></div>
                  ))}
                </div>
                <div 
                  className="sim-scene"
                  id="sim-scene-filter"
                  style={currentType?.filterClass ? 
                    { filter: `url(#${currentType.id})` } : {}
                  }
                >
                  <canvas id="scene-sim" width="300" height="180"></canvas>
                </div>
              </div>
            </div>

            {/* Scene Selector */}
            <div className="scene-selector" role="group" aria-label="Scene selector">
              <span style={{
                fontSize: '0.72rem',
                color: 'var(--text-muted)',
                fontWeight: '600',
                alignSelf: 'center',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}>Scene:</span>
              {scenes.map(scene => (
                <button
                  key={scene}
                  className={`scene-btn ${currentScene === scene.toLowerCase() ? 'active' : ''}`}
                  onClick={() => setCurrentScene(scene.toLowerCase())}
                  aria-pressed={currentScene === scene.toLowerCase()}
                >
                  {scene}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Simulator;
