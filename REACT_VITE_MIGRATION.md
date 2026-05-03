# VisualAid: HTML to React + Vite Migration Guide

## Executive Summary
This guide converts your VisualAid static HTML/CSS prototype into a modular React application using Vite as the build tool. The migration maintains all functionality while providing a modern, scalable architecture.

---

## Part 1: Project Setup

### Step 1: Create a New Vite + React Project

```bash
npm create vite@latest visualaid-react -- --template react
cd visualaid-react
npm install
```

### Step 2: Project Structure
```
visualaid-react/
├── public/
│   └── plates/
│       └── plate9.avif
├── src/
│   ├── components/
│   │   ├── Toolbar.jsx
│   │   ├── Navigation.jsx
│   │   ├── Hero.jsx
│   │   ├── Types.jsx
│   │   ├── Simulator.jsx
│   │   ├── Test.jsx
│   │   ├── VoicePanel.jsx
│   │   ├── Footer.jsx
│   │   ├── Cards/
│   │   │   ├── TypeCard.jsx
│   │   │   └── StatCard.jsx
│   │   └── Shared/
│   │       ├── Button.jsx
│   │       └── Section.jsx
│   ├── pages/
│   │   └── Home.jsx
│   ├── styles/
│   │   ├── index.css
│   │   └── variables.css
│   ├── utils/
│   │   ├── colorFilters.js
│   │   ├── voiceManager.js
│   │   └── plateGenerator.js
│   ├── App.jsx
│   └── main.jsx
├── vite.config.js
├── package.json
└── index.html
```

### Step 3: Key Dependencies
```bash
npm install react-router-dom  # For navigation (optional)
npm install canvas             # For plate rendering
```

---

## Part 2: Implementation Guide

### 1. Color Theme & CSS Variables

**src/styles/variables.css**
```css
:root {
  --bg: #0a0c14;
  --bg2: #0f1220;
  --bg3: #161929;
  --surface: #1c2035;
  --surface2: #232840;
  --border: #2e3558;
  --text: #e8eaf6;
  --text-muted: #8891b8;
  --text-soft: #bcc2e0;
  --accent: #c8a96e;
  --accent2: #e8c98a;
  --accent-glow: rgba(200,169,110,0.15);
  --red: #e85d6b;
  --green: #56c98a;
  --blue: #5b8dee;
  --purple: #9b6dff;
  --font-size: 16px;
  --radius: 14px;
  --shadow: 0 8px 40px rgba(0,0,0,0.5);
  --rg-height: 36px;
}

.hc {
  --bg: #000; --bg2: #000; --bg3: #111;
  --surface: #111; --surface2: #1a1a1a;
  --border: #fff; --text: #fff; --text-muted: #ffff00;
  --text-soft: #eee; --accent: #ffff00; --accent2: #ffff00;
  --accent-glow: rgba(255,255,0,0.2);
}
```

### 2. Toolbar Component

**src/components/Toolbar.jsx**
```jsx
import { useState } from 'react';

const Toolbar = () => {
  const [fontSize, setFontSize] = useState(16);
  const [theme, setTheme] = useState('dark');
  const [showReadingGuide, setShowReadingGuide] = useState(false);
  const [rgHeight, setRgHeight] = useState(36);

  const handleFontSize = (size) => {
    setFontSize(size);
    document.documentElement.style.fontSize = `${size}px`;
  };

  const handleTheme = (newTheme) => {
    setTheme(newTheme);
    document.body.className = newTheme === 'hc' ? 'hc' : '';
  };

  const handleReadingGuideHeight = (e) => {
    const height = e.target.value;
    setRgHeight(height);
    const guide = document.getElementById('reading-guide');
    if (guide) {
      guide.style.height = `${height}px`;
      guide.style.transform = `translateY(calc(-50% + ${height / 2}px))`;
    }
  };

  return (
    <div id="toolbar" role="banner" aria-label="Accessibility controls">
      <div className="toolbar-brand">Visual<span>Aid</span></div>

      <div className="tb-group" role="group" aria-label="Text size">
        <span className="tb-label">Text</span>
        <button 
          className={`tb-btn ${fontSize === 13 ? 'active' : ''}`}
          onClick={() => handleFontSize(13)}
          aria-label="Small text"
        >A-</button>
        <button 
          className={`tb-btn ${fontSize === 16 ? 'active' : ''}`}
          onClick={() => handleFontSize(16)}
          aria-label="Normal text"
        >A</button>
        <button 
          className={`tb-btn ${fontSize === 19 ? 'active' : ''}`}
          onClick={() => handleFontSize(19)}
          aria-label="Large text"
        >A+</button>
        <button 
          className={`tb-btn ${fontSize === 23 ? 'active' : ''}`}
          onClick={() => handleFontSize(23)}
          aria-label="Extra large text"
        >A++</button>
      </div>

      <div className="tb-group" role="group" aria-label="Color theme">
        <span className="tb-label">Theme</span>
        <button 
          className={`tb-btn ${theme === 'dark' ? 'active' : ''}`}
          onClick={() => handleTheme('dark')}
          aria-pressed={theme === 'dark'}
          aria-label="Dark theme"
        >Dark</button>
        <button 
          className={`tb-btn ${theme === 'light' ? 'active' : ''}`}
          onClick={() => handleTheme('light')}
          aria-pressed={theme === 'light'}
          aria-label="Light theme"
        >Light</button>
        <button 
          className={`tb-btn ${theme === 'hc' ? 'active' : ''}`}
          onClick={() => handleTheme('hc')}
          aria-pressed={theme === 'hc'}
          aria-label="High contrast theme"
        >High Contrast</button>
      </div>

      <div className="tb-group">
        <span className="tb-label">Tools</span>
        <button 
          className={`tb-btn ${showReadingGuide ? 'active' : ''}`}
          onClick={() => setShowReadingGuide(!showReadingGuide)}
          aria-pressed={showReadingGuide}
          aria-label="Toggle reading guide"
        >Reading Guide</button>
        <div className="dial-group">
          <input 
            type="range" 
            className="dial-input" 
            min="15" 
            max="80" 
            value={rgHeight}
            onChange={handleReadingGuideHeight}
            aria-label="Reading guide height"
          />
          <span className="dial-label">{rgHeight}px</span>
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
```

### 3. Navigation Component

**src/components/Navigation.jsx**
```jsx
import { useState, useEffect } from 'react';

const Navigation = () => {
  const [activeLink, setActiveLink] = useState('home');

  const navLinks = [
    { id: 'home', label: 'Home', href: '#hero' },
    { id: 'types', label: 'Types', href: '#types' },
    { id: 'simulator', label: 'Simulator', href: '#simulator' },
    { id: 'test', label: 'Take the Test', href: '#test' },
    { id: 'voice', label: 'Voice Panel', href: '#voice' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section');
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top >= 110 && rect.top < 300) {
          setActiveLink(section.id);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav id="main-nav" aria-label="Main navigation">
      {navLinks.map((link) => (
        <a
          key={link.id}
          href={link.href}
          className={`nav-link ${activeLink === link.id ? 'active' : ''}`}
          onClick={() => setActiveLink(link.id)}
        >
          {link.label}
        </a>
      ))}
    </nav>
  );
};

export default Navigation;
```

### 4. Hero Component

**src/components/Hero.jsx**
```jsx
const Hero = () => {
  const stats = [
    { num: '300M+', label: 'People worldwide with color blindness' },
    { num: '1 in 12', label: 'Males affected globally' },
    { num: '4+', label: 'Types of color vision deficiency' },
  ];

  return (
    <section id="hero" className="section" aria-labelledby="hero-title">
      <div className="hero-bg"></div>
      <div className="container">
        <div className="hero-grid">
          <div className="hero-content">
            <div className="hero-badge">Visual Impairment Awareness Project</div>
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
              {stats.map((stat, idx) => (
                <div key={idx} className="stat">
                  <div className="stat-num">{stat.num}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="hero-visual" aria-hidden="true">
            {/* SVG eye illustration - same as HTML */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
```

### 5. Reusable Components

**src/components/Cards/TypeCard.jsx**
```jsx
const TypeCard = ({ 
  type, 
  title, 
  subtitle, 
  description, 
  prevalence, 
  colors 
}) => {
  return (
    <div className="type-card">
      <div 
        className="type-card-accent" 
        style={{ 
          background: `linear-gradient(90deg,${colors.join(',')})` 
        }}
      ></div>
      <div className="type-card-icon">
        {colors.map((color, idx) => (
          <span key={idx} style={{ background: color }}></span>
        ))}
      </div>
      <div className="type-card-subtitle">{subtitle}</div>
      <h3 className="type-card-title">{title}</h3>
      <p className="type-card-desc">{description}</p>
      <div className="type-card-prevalence">
        <div className="prevalence-bar-track">
          <div 
            className="prevalence-bar-fill" 
            style={{ width: `${prevalence.percent}%` }}
          ></div>
        </div>
        <span className="prevalence-pct">{prevalence.text}</span>
      </div>
    </div>
  );
};

export default TypeCard;
```

### 6. Types Section with Data Mapping

**src/components/Types.jsx**
```jsx
import TypeCard from './Cards/TypeCard';

const Types = () => {
  const colorBlindnessTypes = [
    {
      type: 'deuteranopia',
      title: 'Deuteranopia',
      subtitle: 'Red-Green Type',
      description: 'Absence of green-sensitive cones. Red, orange, yellow, and green appear similar.',
      colors: ['#e85d6b', '#c84455'],
      colorSwatches: ['#e85d6b', '#a0a020', '#5b8dee', '#808080'],
      prevalence: { percent: 80, text: '5% of males' },
    },
    {
      type: 'protanopia',
      title: 'Protanopia',
      subtitle: 'Red-Green Type',
      description: 'Absence of red-sensitive cones. Red appears very dark, almost black.',
      colors: ['#f08040', '#c06020'],
      colorSwatches: ['#808020', '#606060', '#5b8dee', '#404040'],
      prevalence: { percent: 45, text: '2.5% of males' },
    },
    {
      type: 'tritanopia',
      title: 'Tritanopia',
      subtitle: 'Blue-Yellow Type',
      description: 'Absence of blue-sensitive cones. Blue and green are confused.',
      colors: ['#5b8dee', '#3060c0'],
      colorSwatches: ['#e85d6b', '#a0c040', '#808080', '#c0c080'],
      prevalence: { percent: 15, text: '0.01% of population' },
    },
    {
      type: 'monochromacy',
      title: 'Monochromacy',
      subtitle: 'Complete Type',
      description: 'Total absence of color perception. The world appears in shades of gray.',
      colors: ['#808080', '#404040'],
      colorSwatches: ['#909090', '#606060', '#404040', '#b0b0b0'],
      prevalence: { percent: 5, text: '0.003% of population' },
    },
  ];

  return (
    <section id="types" className="section" aria-labelledby="types-title">
      <div className="container">
        <div className="section-eyebrow reveal">Understanding Color Vision</div>
        <h2 className="section-title reveal reveal-delay-1" id="types-title">
          Types of <em>Color Blindness</em>
        </h2>
        <p className="section-desc reveal reveal-delay-2">
          Color blindness is not actually blindness—it is a deficiency in the ability to 
          distinguish certain colors.
        </p>

        <div className="types-grid">
          {colorBlindnessTypes.map((colorType, idx) => (
            <TypeCard
              key={colorType.type}
              {...colorType}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Types;
```

### 7. Utility: Color Filter Functions

**src/utils/colorFilters.js**
```javascript
export const colorFilters = {
  deuteranopia: (r, g, b) => {
    const l = 0.299 * r + 0.587 * g + 0.114 * b;
    return {
      r: 0.367 * r + 0.861 * g - 0.228 * b,
      g: 0.280 * r + 0.673 * g + 0.047 * b,
      b: -0.012 * r + 0.043 * g + 0.969 * b,
    };
  },
  protanopia: (r, g, b) => {
    return {
      r: 0.152 * r + 1.053 * g - 0.205 * b,
      g: 0.115 * r + 0.786 * g + 0.099 * b,
      b: -0.004 * r - 0.048 * g + 1.052 * b,
    };
  },
  tritanopia: (r, g, b) => {
    return {
      r: 1.256 * r - 0.077 * g - 0.179 * b,
      g: -0.078 * r + 0.931 * g + 0.148 * b,
      b: 0.005 * r + 0.691 * g + 0.304 * b,
    };
  },
  monochromacy: (r, g, b) => {
    const gray = 0.299 * r + 0.587 * g + 0.114 * b;
    return { r: gray, g: gray, b: gray };
  },
};

export const applyColorFilter = (imageData, filterType) => {
  const filter = colorFilters[filterType];
  if (!filter) return imageData;

  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const filtered = filter(r, g, b);

    data[i] = Math.max(0, Math.min(255, filtered.r));
    data[i + 1] = Math.max(0, Math.min(255, filtered.g));
    data[i + 2] = Math.max(0, Math.min(255, filtered.b));
  }

  return imageData;
};
```

### 8. Utility: Plate Generator

**src/utils/plateGenerator.js**
```javascript
export const generateIshaharaPlate = (canvas, number) => {
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;

  // Background circle
  ctx.fillStyle = '#f5f5f5';
  ctx.beginPath();
  ctx.arc(width / 2, height / 2, width / 2 - 10, 0, Math.PI * 2);
  ctx.fill();

  // Generate dots
  const colors = getRandomColorPalette();
  const dotRadius = 8;
  const spacing = 20;

  for (let y = 0; y < height; y += spacing) {
    for (let x = 0; x < width; x += spacing) {
      const color = colors[Math.floor(Math.random() * colors.length)];
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, dotRadius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Draw hidden number using distinct color
  drawNumber(ctx, number, width, height);
};

const getRandomColorPalette = () => {
  const palettes = [
    ['#FF6B6B', '#FF8E72', '#FFAA50'],
    ['#4ECDC4', '#45B7D1', '#96CEB4'],
    ['#FFD93D', '#FEC860', '#FFE66D'],
  ];
  return palettes[Math.floor(Math.random() * palettes.length)];
};

const drawNumber = (ctx, number, width, height) => {
  ctx.fillStyle = '#c8a96e';
  ctx.font = 'bold 120px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(number, width / 2, height / 2);
};
```

### 9. Utility: Voice Manager

**src/utils/voiceManager.js**
```javascript
export const VoiceManager = {
  speak: (text, options = {}) => {
    const utterance = new SpeechSynthesisUtterance(text);
    
    if (options.voice) {
      const voices = speechSynthesis.getVoices();
      utterance.voice = voices[options.voice];
    }
    
    utterance.rate = options.rate || 1.0;
    utterance.pitch = options.pitch || 1.0;
    utterance.volume = options.volume || 1.0;

    window.speechSynthesis.speak(utterance);
    return utterance;
  },

  stop: () => {
    window.speechSynthesis.cancel();
  },

  getVoices: () => {
    return window.speechSynthesis.getVoices();
  },

  startDictation: (onResult, onEnd) => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.continuous = true;
    
    recognition.onresult = (event) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      onResult(transcript);
    };

    recognition.onend = onEnd;
    recognition.start();
    
    return recognition;
  },
};
```

### 10. Main App Component

**src/App.jsx**
```jsx
import { useEffect } from 'react';
import Toolbar from './components/Toolbar';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Types from './components/Types';
import Simulator from './components/Simulator';
import Test from './components/Test';
import VoicePanel from './components/VoicePanel';
import Footer from './components/Footer';
import './styles/index.css';

function App() {
  useEffect(() => {
    // Scroll animation observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    });

    document.querySelectorAll('.reveal').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div id="reading-guide" role="presentation" aria-hidden="true"></div>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      
      <Toolbar />
      <Navigation />
      
      <main id="main-content">
        <Hero />
        <Types />
        <Simulator />
        <Test />
        <VoicePanel />
      </main>
      
      <Footer />
    </>
  );
}

export default App;
```

### 11. Vite Configuration

**vite.config.js**
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
})
```

---

## Part 3: Asset Management

### Images & Media

**Best Practices:**
1. **Public Folder** (`public/`): Use for images that won't be processed (favicons, metadata)
   - Access as: `/plates/plate9.avif`
   
2. **Assets Folder** (`src/assets/`): Use for images imported in components
   - Import: `import eyeImage from '../assets/eye.svg'`
   - Vite will optimize these

**In React Components:**
```jsx
// Using image from public folder
<img src="/plates/plate9.avif" alt="Color blindness plate" />

// Using image from assets
import logo from '../assets/logo.svg';
export const Header = () => <img src={logo} alt="Logo" />;
```

---

## Part 4: Running the Application

### Development
```bash
npm run dev
```
Runs on `http://localhost:3000`

### Production Build
```bash
npm run build
npm run preview
```

---

## Part 5: Key Differences from Static HTML

| Aspect | Static HTML | React + Vite |
|--------|------------|-------------|
| State Management | Vanilla JS | useState Hook |
| Component Reuse | Manual copying | Import/Export |
| Styling | Global CSS | CSS Modules/CSS-in-JS |
| Build Process | None | Vite (optimized bundling) |
| Development Speed | Manual refresh | HMR (Hot Module Reload) |
| Code Splitting | Manual | Automatic |

---

## Part 6: Migration Checklist

- [ ] Create Vite project
- [ ] Move CSS to `src/styles/`
- [ ] Create component files
- [ ] Map repetitive elements to data arrays
- [ ] Implement useState for interactive features
- [ ] Convert inline event handlers to React patterns
- [ ] Move assets to `public/` or `src/assets/`
- [ ] Test all accessibility features
- [ ] Build for production
- [ ] Deploy

---

## Part 7: Common Patterns

### Pattern 1: Handling Form Inputs
```jsx
const [formData, setFormData] = useState({ text: '', voice: 0, rate: 1 });

const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData(prev => ({ ...prev, [name]: value }));
};

return (
  <input 
    name="text" 
    value={formData.text}
    onChange={handleChange}
  />
);
```

### Pattern 2: Conditional Rendering
```jsx
{isTestActive ? <TestFlow /> : <TestIntro />}
```

### Pattern 3: Event Delegation
```jsx
const handleSimulatorType = (type) => {
  setCurrentSimType(type);
  updateDescription(type);
};

{simulationTypes.map(type => (
  <button 
    key={type.id}
    onClick={() => handleSimulatorType(type.id)}
  >
    {type.name}
  </button>
))}
```

---

## Next Steps

1. Start with `src/components/Hero.jsx` - simplest component
2. Build `src/components/Types.jsx` - demonstrates `.map()` patterns
3. Move to interactive components (Simulator, Test, Voice)
4. Test accessibility features thoroughly
5. Optimize images and build size

---

## Resources
- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [React Hooks API](https://react.dev/reference/react)
- [Web Accessibility (WCAG)](https://www.w3.org/WAI/WCAG21/quickref/)
