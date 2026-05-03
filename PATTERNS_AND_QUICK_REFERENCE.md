# React + Vite: Common Patterns & Quick Reference

## Core React Patterns Used in VisualAid

### 1. State Management with useState

#### Basic State
```jsx
import { useState } from 'react';

const Counter = () => {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
};
```

#### Multiple State Values
```jsx
const [fontSize, setFontSize] = useState(16);
const [theme, setTheme] = useState('dark');
const [isOpen, setIsOpen] = useState(false);

// Update individually
setFontSize(20);
setTheme('light');
```

#### Complex State (Objects & Arrays)
```jsx
const [answers, setAnswers] = useState([]);
const [settings, setSettings] = useState({ 
  speed: 1.0, 
  pitch: 1.0 
});

// Add to array
setAnswers([...answers, newAnswer]);

// Update object
setSettings({ ...settings, speed: 1.5 });

// Update nested
setAnswers(answers.map((a, i) => 
  i === 0 ? { ...a, correct: true } : a
));
```

---

### 2. Rendering Lists with .map()

#### Basic List
```jsx
const colors = ['red', 'green', 'blue'];

{colors.map((color, idx) => (
  <div key={idx}>{color}</div>
))}
```

#### List from Objects
```jsx
const types = [
  { id: 'type1', name: 'Type 1', description: '...' },
  { id: 'type2', name: 'Type 2', description: '...' },
];

{types.map(type => (
  <TypeCard key={type.id} type={type} />
))}
```

#### Nested Lists
```jsx
const sections = [
  {
    title: 'Color Blindness',
    items: ['Deuteranopia', 'Protanopia', 'Tritanopia']
  }
];

{sections.map(section => (
  <div key={section.title}>
    <h2>{section.title}</h2>
    {section.items.map(item => (
      <p key={item}>{item}</p>
    ))}
  </div>
))}
```

**Key Rule:** Always use a stable `key` prop (ID, not index if list can be reordered)

---

### 3. Event Handling

#### Click Events
```jsx
<button onClick={() => setCount(count + 1)}>
  Click me
</button>

// With parameters
<button onClick={(e) => handleClick(id, e)}>
  Delete
</button>
```

#### Form Events
```jsx
const [text, setText] = useState('');

<input 
  value={text}
  onChange={(e) => setText(e.target.value)}
/>

<textarea 
  value={text}
  onChange={(e) => setText(e.target.value)}
/>

<select 
  value={selected}
  onChange={(e) => setSelected(e.target.value)}
>
  <option value="1">One</option>
  <option value="2">Two</option>
</select>

<input 
  type="checkbox"
  checked={isChecked}
  onChange={(e) => setIsChecked(e.target.checked)}
/>
```

#### Hover Events
```jsx
const [isHovered, setIsHovered] = useState(false);

<div
  onMouseEnter={() => setIsHovered(true)}
  onMouseLeave={() => setIsHovered(false)}
>
  {isHovered && <p>Hover content</p>}
</div>
```

---

### 4. Conditional Rendering

#### if/else
```jsx
{testStarted ? <TestFlow /> : <TestIntro />}
```

#### Multiple conditions
```jsx
{testStarted && !testCompleted && <TestFlow />}
{testCompleted && <Results />}
{!testStarted && <Intro />}
```

#### Ternary chains
```jsx
{status === 'loading' ? (
  <Spinner />
) : status === 'error' ? (
  <Error />
) : (
  <Success />
)}
```

#### Logical AND (&&)
```jsx
{isAdmin && <AdminPanel />}

{items.length > 0 && (
  <div>
    <h2>Items: {items.length}</h2>
    {items.map(item => <Item key={item.id} {...item} />)}
  </div>
)}
```

---

### 5. Effects with useEffect

#### Run once on mount
```jsx
useEffect(() => {
  // Load data, setup listeners, etc.
  const handleResize = () => { /* ... */ };
  window.addEventListener('resize', handleResize);
  
  // Cleanup
  return () => {
    window.removeEventListener('resize', handleResize);
  };
}, []); // Empty dependency array = run once
```

#### Run on state change
```jsx
useEffect(() => {
  // Run whenever 'currentPlate' changes
  generateIshaharaPlate(canvas, plates[currentPlate].number);
}, [currentPlate]); // Dependency array
```

#### Watch multiple dependencies
```jsx
useEffect(() => {
  updateDescription(currentType, language);
}, [currentType, language]); // Run if either changes
```

#### Cleanup function
```jsx
useEffect(() => {
  const recognition = startSpeechRecognition();
  
  return () => {
    recognition.stop(); // Cleanup
  };
}, []);
```

---

### 6. Props & Component Communication

#### Simple Props
```jsx
// Parent
<TypeCard title="Deuteranopia" description="No green cones" />

// Child
const TypeCard = ({ title, description }) => (
  <div>
    <h3>{title}</h3>
    <p>{description}</p>
  </div>
);
```

#### Spreading Props
```jsx
const data = { id: 1, name: 'Deuteranopia', color: '#a0a020' };

// Instead of:
<TypeCard id={data.id} name={data.name} color={data.color} />

// Do:
<TypeCard {...data} />
```

#### Callback Props (Child to Parent)
```jsx
// Parent
const [selected, setSelected] = useState('normal');

<SimulationTypeButton 
  type="deuteranopia"
  onSelect={(type) => setSelected(type)}
/>

// Child
const SimulationTypeButton = ({ type, onSelect }) => (
  <button onClick={() => onSelect(type)}>
    {type}
  </button>
);
```

#### Children Props
```jsx
// Parent passes content as children
<Card>
  <h3>Title</h3>
  <p>Description</p>
</Card>

// Child receives as special prop
const Card = ({ children }) => (
  <div className="card">
    {children}
  </div>
);
```

---

### 7. DOM Manipulation (Direct Access)

#### Getting elements
```jsx
const canvas = document.getElementById('plate-canvas');
const guide = document.getElementById('reading-guide');

// Or using useRef
import { useRef } from 'react';
const canvasRef = useRef(null);

<canvas ref={canvasRef} />

// Access in useEffect
useEffect(() => {
  const ctx = canvasRef.current.getContext('2d');
  ctx.fillRect(0, 0, 100, 100);
}, []);
```

#### Adding classes
```jsx
document.getElementById('reading-guide').classList.add('active');

// In React components
<div className={isActive ? 'active' : ''}>
```

#### Setting styles dynamically
```jsx
document.documentElement.style.fontSize = '20px';

// Or in JSX
<div style={{ fontSize: '20px', color: 'red' }}>
  Styled text
</div>
```

---

### 8. LocalStorage for Persistence

#### Saving data
```jsx
const [customPhrases, setCustomPhrases] = useState([]);

const handleAddPhrase = (phrase) => {
  const updated = [...customPhrases, phrase];
  setCustomPhrases(updated);
  
  // Save to localStorage
  localStorage.setItem('customPhrases', JSON.stringify(updated));
};
```

#### Loading data
```jsx
useEffect(() => {
  const saved = localStorage.getItem('customPhrases');
  if (saved) {
    setCustomPhrases(JSON.parse(saved));
  }
}, []);
```

#### Clearing data
```jsx
localStorage.removeItem('customPhrases');
// or
localStorage.clear(); // clears everything
```

---

### 9. Web APIs Integration

#### Speech Synthesis
```jsx
const handleSpeak = () => {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1.0;
  utterance.pitch = 1.0;
  
  utterance.onend = () => setIsSpeaking(false);
  
  window.speechSynthesis.speak(utterance);
  setIsSpeaking(true);
};
```

#### Speech Recognition
```jsx
const startDictation = () => {
  const recognition = new (window.SpeechRecognition || 
                            window.webkitSpeechRecognition)();
  
  recognition.onresult = (event) => {
    let transcript = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
      transcript += event.results[i][0].transcript;
    }
    setText(transcript);
  };
  
  recognition.start();
};
```

#### Canvas API
```jsx
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

ctx.fillStyle = '#FF0000';
ctx.fillRect(0, 0, 100, 100);

ctx.drawImage(image, x, y, width, height);
```

#### Intersection Observer (Scroll animations)
```jsx
useEffect(() => {
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
```

---

### 10. Custom Hooks Pattern

#### Creating a custom hook
```jsx
// useLocalStorage.js
import { useState, useEffect } from 'react';

export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : initialValue;
  });

  const setValue = (value) => {
    setStoredValue(value);
    window.localStorage.setItem(key, JSON.stringify(value));
  };

  return [storedValue, setValue];
};

// Usage
const [phrases, setPhrases] = useLocalStorage('phrases', []);
```

#### Custom hook for voice manager
```jsx
// useVoice.js
import { useState, useCallback } from 'react';

export const useVoice = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speak = useCallback((text, options = {}) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = options.rate || 1.0;
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  }, []);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  return { isSpeaking, speak, stop };
};

// Usage
const { isSpeaking, speak, stop } = useVoice();
```

---

## Quick Reference Table

| Pattern | Use Case | Example |
|---------|----------|---------|
| `useState` | Manage component state | Font size, theme, text input |
| `.map()` | Render lists | Color blindness types, test plates |
| Conditional render | Show/hide based on state | Test intro vs test flow vs results |
| `useEffect` | Side effects | Load data, setup listeners, cleanup |
| Props | Pass data to children | Component configuration |
| Callback props | Child → Parent communication | Button click handlers |
| `useRef` | Direct DOM access | Canvas, form focus |
| `localStorage` | Persist user data | Custom phrases, theme preference |
| Web APIs | Browser features | Speech synthesis, canvas drawing |

---

## Performance Optimization Patterns

### 1. Memoization
```jsx
import { memo } from 'react';

// Component only re-renders if props change
const TypeCard = memo(({ type, onSelect }) => (
  <button onClick={() => onSelect(type.id)}>
    {type.name}
  </button>
));
```

### 2. useCallback
```jsx
import { useCallback } from 'react';

const handleSpeak = useCallback(() => {
  // This function is cached
  // Only re-created if dependencies change
}, [textToSpeak]);
```

### 3. Lazy Loading
```jsx
import { lazy, Suspense } from 'react';

const Test = lazy(() => import('./Test'));

<Suspense fallback={<Spinner />}>
  <Test />
</Suspense>
```

---

## Error Handling Patterns

### Try/Catch with async
```jsx
const loadData = async () => {
  try {
    const data = await fetch('/api/data');
    setData(data);
  } catch (error) {
    setError(error.message);
  }
};
```

### Error Boundary (Class component)
```jsx
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong</div>;
    }
    return this.props.children;
  }
}

// Usage
<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
```

---

## Common Mistakes & Fixes

### ❌ Mutating State Directly
```jsx
// Wrong
state.count += 1;
setState(state);

// Correct
setState({ ...state, count: state.count + 1 });
```

### ❌ Missing Key in Lists
```jsx
// Wrong
{items.map((item, idx) => <Item key={idx} />)}

// Correct
{items.map((item) => <Item key={item.id} />)}
```

### ❌ Infinite Loops in useEffect
```jsx
// Wrong (no dependencies)
useEffect(() => {
  setCount(count + 1); // Infinite!
});

// Correct
useEffect(() => {
  // Setup listeners, load data, etc.
}, []); // Only run once
```

### ❌ Inline Function in onClick
```jsx
// Wrong (recreated on every render)
<button onClick={function() { handleClick(); }}>

// Correct (use arrow function or reference)
<button onClick={() => handleClick()}>
<button onClick={handleClick}>
```

---

## Browser DevTools Tips

### React DevTools
1. Install React DevTools browser extension
2. Inspect components in "Components" tab
3. View props and state in real-time
4. Trace renders with Profiler tab

### Console Tricks
```javascript
// Log render count
console.log('Component rendered at', new Date().toLocaleTimeString());

// Log state changes
console.log('New state:', newValue);

// Measure performance
console.time('operation');
// ... code ...
console.timeEnd('operation');
```

---

## Resources

- [React Hooks Cheatsheet](https://react.dev/reference/react)
- [JavaScript Array Methods](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
- [Web APIs](https://developer.mozilla.org/en-US/docs/Web/API)
- [Vite Guide](https://vitejs.dev/guide/)

---

**Pro Tip:** Keep this guide handy while building! Reference it frequently until patterns become natural.
