# VisualAid React + Vite: Complete Setup Guide

## Quick Start (5 minutes)

### Step 1: Create Vite Project
```bash
npm create vite@latest visualaid-react -- --template react
cd visualaid-react
npm install
```

### Step 2: Start Development Server
```bash
npm run dev
```
Opens at `http://localhost:5173`

---

## Complete Migration Steps

### Phase 1: Project Structure Setup (10 min)

```bash
# From project root
mkdir -p src/components/Cards
mkdir -p src/components/Shared
mkdir -p src/pages
mkdir -p src/styles
mkdir -p src/utils
mkdir -p public/plates
```

Copy your image files:
```bash
cp plates/plate9.avif public/plates/
```

### Phase 2: Copy CSS to React (5 min)

1. **Create `src/styles/variables.css`**
   - Copy CSS variables section from HTML `<style>` tag
   - See REACT_VITE_MIGRATION.md for complete example

2. **Create `src/styles/index.css`**
   - Copy all CSS except `<style>` wrapper
   - Import variables: `@import './variables.css';`
   - Import Google Fonts in same file

### Phase 3: Create Base Components (30 min)

Start with simplest components first:

**1. Hero.jsx** (from example files)
```bash
# Copy provided example-Hero.jsx → src/components/Hero.jsx
```

**2. Types.jsx** (demonstrates .map() pattern)
```bash
# Copy provided example-Types.jsx → src/components/Types.jsx
```

**3. Simulator.jsx** (state management)
```bash
# Copy provided example-Simulator.jsx → src/components/Simulator.jsx
```

**4. Test.jsx** (complex state)
```bash
# Copy provided example-Test.jsx → src/components/Test.jsx
```

**5. VoicePanel.jsx** (Web APIs)
```bash
# Copy provided example-VoicePanel.jsx → src/components/VoicePanel.jsx
```

### Phase 4: Create Utility Files (15 min)

**src/utils/colorFilters.js**
```javascript
export const colorFilters = {
  deuteranopia: (r, g, b) => ({
    r: 0.367 * r + 0.861 * g - 0.228 * b,
    g: 0.280 * r + 0.673 * g + 0.047 * b,
    b: -0.012 * r + 0.043 * g + 0.969 * b,
  }),
  // ... more filters
};
```

**src/utils/voiceManager.js**
- Speech synthesis wrapper
- Dictation with Web Speech API

**src/utils/plateGenerator.js**
- Ishihara plate rendering

### Phase 5: Setup App.jsx (5 min)

```jsx
// src/App.jsx
import { useEffect } from 'react';
import Toolbar from './components/Toolbar';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
// ... import others
import './styles/index.css';

function App() {
  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    });

    document.querySelectorAll('.reveal').forEach(el => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
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

### Phase 6: Setup vite.config.js (2 min)

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
  },
})
```

### Phase 7: Build & Deploy (5 min)

```bash
# Production build
npm run build

# Preview production build
npm run preview

# Deploy to hosting (Vercel, Netlify, etc.)
# Just upload the 'dist' folder
```

---

## Component-by-Component Checklist

### ✅ Toolbar.jsx
- [x] Font size adjustment
- [x] Theme switching (dark/light/high-contrast)
- [x] Reading guide toggle
- [x] Focus mode button

**Key React Pattern:**
```jsx
const [fontSize, setFontSize] = useState(16);

const handleFontSize = (size) => {
  setFontSize(size);
  document.documentElement.style.fontSize = `${size}px`;
};
```

### ✅ Navigation.jsx
- [x] Active link detection
- [x] Scroll event listener
- [x] Navigation smoothing

**Key React Pattern:**
```jsx
useEffect(() => {
  const handleScroll = () => { /* ... */ };
  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);
```

### ✅ Hero.jsx
- [x] Static content with animation
- [x] Stats array mapping
- [x] CTA buttons

**Key React Pattern:**
```jsx
const stats = [{...}, {...}];
{stats.map((stat, idx) => (
  <div key={idx}>...</div>
))}
```

### ✅ Types.jsx
- [x] Color blindness types array
- [x] Card component reuse
- [x] Data-driven rendering

**Key React Pattern:**
```jsx
const types = [
  { id: 'deuteranopia', title: '...', ... },
  // more...
];
{types.map(type => (
  <TypeCard key={type.id} {...type} />
))}
```

### ✅ Simulator.jsx
- [x] Type selection with state
- [x] Scene switching
- [x] Canvas rendering
- [x] Filter application

**Key React Pattern:**
```jsx
const [currentType, setCurrentType] = useState('normal');
{types.map(type => (
  <button 
    key={type.id}
    onClick={() => setCurrentType(type.id)}
    className={currentType === type.id ? 'active' : ''}
  >
    {type.name}
  </button>
))}
```

### ✅ Test.jsx
- [x] Test flow state management
- [x] Plate generation
- [x] Answer tracking
- [x] Results calculation
- [x] Progress bar

**Key React Pattern:**
```jsx
const [testStarted, setTestStarted] = useState(false);
const [answers, setAnswers] = useState([]);
const [currentPlate, setCurrentPlate] = useState(0);

// Conditional rendering
{!testStarted ? <Intro /> : <TestFlow /> : <Results />}
```

### ✅ VoicePanel.jsx
- [x] Text input with state
- [x] Speech synthesis
- [x] Voice selection dropdown
- [x] Speech speed/pitch controls
- [x] Speech recognition (dictation)
- [x] Custom phrases management
- [x] LocalStorage persistence
- [x] Modal handling

**Key React Pattern:**
```jsx
const [voiceText, setVoiceText] = useState('');
const [isSpeaking, setIsSpeaking] = useState(false);
const [customPhrases, setCustomPhrases] = useState([]);

// Persist to localStorage
localStorage.setItem('customPhrases', JSON.stringify(phrases));
```

---

## Asset Management

### Vite Asset Handling

**Public Folder** (static files)
```
public/
  ├── plates/
  │   └── plate9.avif
  └── favicon.svg
```
Access: `<img src="/plates/plate9.avif" />`

**Source Assets** (processed by Vite)
```
src/
  ├── assets/
  │   └── eye.svg
```
Import: `import eye from '../assets/eye.svg'`

### Optimizations
```javascript
// Vite automatically:
// - Optimizes PNG/JPEG to WebP
// - Inlines small images as base64
// - Tree-shakes unused CSS
// - Code-splits components
```

---

## Performance Optimization Tips

### 1. Code Splitting
```jsx
// Lazy load heavy components
import { lazy, Suspense } from 'react';
const Test = lazy(() => import('./components/Test'));

<Suspense fallback={<div>Loading...</div>}>
  <Test />
</Suspense>
```

### 2. Memoization
```jsx
import { memo } from 'react';

const TypeCard = memo(({ type }) => (
  // Only re-renders if 'type' prop changes
));
```

### 3. useCallback for event handlers
```jsx
const handleClick = useCallback(() => {
  // event handler
}, [dependencies]);
```

### 4. Image Optimization
```jsx
// Use responsive images
<img 
  src="/plates/plate.avif"
  srcSet="/plates/plate-sm.avif 480w, /plates/plate.avif 1024w"
  alt="Color test plate"
/>
```

---

## Accessibility Checklist

- [x] Semantic HTML (`<section>`, `<nav>`, `<main>`)
- [x] ARIA labels (`aria-label`, `aria-labelledby`)
- [x] Keyboard navigation (Tab, Enter)
- [x] Color contrast ratios (WCAG AA minimum)
- [x] Alt text for images
- [x] Form labels properly associated
- [x] Focus indicators visible
- [x] Screen reader announcements (`aria-live`)

---

## Testing Components

### Simple Component Test
```javascript
// src/__tests__/Hero.test.jsx
import { render, screen } from '@testing-library/react';
import Hero from '../components/Hero';

describe('Hero Component', () => {
  it('renders main title', () => {
    render(<Hero />);
    expect(screen.getByText(/See the World/)).toBeInTheDocument();
  });
});
```

---

## Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# Drag 'dist' folder to Netlify
```

### GitHub Pages
```bash
npm install --save-dev gh-pages
# Update vite.config.js: base: '/visualaid-react/'
npm run build
# Push dist/ to gh-pages branch
```

---

## Troubleshooting

### Issue: Components not updating
**Solution:** Check if you're mutating state directly
```jsx
// ❌ Wrong
state[0].value = 'new';
setState(state);

// ✅ Correct
setState([...state.slice(0, 0), { ...state[0], value: 'new' }, ...state.slice(1)]);
```

### Issue: "Cannot find module" errors
**Solution:** Check import paths (case-sensitive on Linux/Mac)
```jsx
// ❌ Wrong (if file is Hero.jsx)
import hero from './hero';

// ✅ Correct
import Hero from './Hero';
```

### Issue: Styles not applying
**Solution:** Ensure CSS is imported in App.jsx
```jsx
// At top of App.jsx
import './styles/index.css';
```

### Issue: Images not loading
**Solution:** Use correct path based on location
```jsx
// From public folder
<img src="/plates/plate9.avif" />

// From src/assets
import plate from '../assets/plate9.avif';
<img src={plate} />
```

---

## File Size Optimization

### Before Migration
Static HTML: ~2.5 MB (with inline CSS/JS)

### After Vite Optimization
- React + Vite: ~45 KB (gzipped)
- JavaScript: ~25 KB
- CSS: ~8 KB
- Assets: Compressed automatically

### Build Output
```
dist/
├── index.html (2 KB)
├── assets/
│   ├── index-abc123.js (25 KB)
│   └── index-def456.css (8 KB)
└── plates/
    └── plate9.avif (optimized)
```

---

## Next Steps After Migration

1. ✅ Migrate all components
2. ✅ Test on mobile/tablet
3. ✅ Verify accessibility (WCAG)
4. ✅ Optimize images
5. ✅ Setup CI/CD
6. ✅ Deploy to production
7. ✅ Monitor performance (Lighthouse)
8. ✅ Gather user feedback

---

## Resources

- **Vite Docs:** https://vitejs.dev/guide/
- **React Docs:** https://react.dev/learn
- **React Hooks:** https://react.dev/reference/react
- **Web APIs:** https://developer.mozilla.org/en-US/docs/Web/API
- **Accessibility:** https://www.w3.org/WAI/WCAG21/quickref/
- **Performance:** https://web.dev/performance/

---

## Support

If you encounter issues during migration:

1. Check the example files provided
2. Review React documentation
3. Test components individually
4. Use React DevTools for debugging
5. Check browser console for errors

Good luck with your migration! 🚀
