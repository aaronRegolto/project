# VisualAid React + Vite

A modern React + Vite migration of the VisualAid visual impairment awareness application.

## ✅ Project Setup Complete

The basic project structure is ready. Follow these steps to continue:

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Start Development Server

```bash
npm run dev
```

Opens at `http://localhost:3000`

### Step 3: Build Components

The following component files are ready as examples:
- `example-Simulator.jsx` - Advanced state management
- `example-Test.jsx` - Complex state with flow control  
- `example-VoicePanel.jsx` - Web APIs (Speech Synthesis/Recognition)

Copy and adapt these to:
```
src/components/
├── Toolbar.jsx
├── Navigation.jsx
├── Hero.jsx
├── Types.jsx
├── Simulator.jsx
├── Test.jsx
├── VoicePanel.jsx
└── Footer.jsx
```

## 📖 Documentation

Comprehensive guides available in the project root:

- **REACT_VITE_MIGRATION.md** - Complete migration guide with code examples
- **SETUP_GUIDE.md** - Step-by-step implementation instructions
- **PATTERNS_AND_QUICK_REFERENCE.md** - React patterns and best practices

## 🚀 Running Commands

```bash
# Development server with hot reload
npm run dev

# Production build
npm run build

# Preview production build locally
npm run preview
```

## 📁 Project Structure

```
visualaid-react/
├── public/
│   └── plates/
│       └── plate9.avif
├── src/
│   ├── components/          (Create your components here)
│   ├── styles/
│   │   └── index.css
│   ├── utils/               (Helper functions)
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── vite.config.js
├── package.json
└── README.md
```

## 🎯 Next Steps

1. ✅ Dependencies installed
2. Create component files in `src/components/`
3. Import and use in `App.jsx`
4. Test with `npm run dev`
5. Build for production with `npm run build`

## 💡 Quick Start Template

**src/components/Hero.jsx:**
```jsx
const Hero = () => {
  return (
    <section id="hero" className="section" aria-labelledby="hero-title">
      <div className="container">
        <h1 className="section-title" id="hero-title">
          See the World Through Different Eyes
        </h1>
        <p className="section-desc">
          Discover how color blindness affects millions of people.
        </p>
      </div>
    </section>
  );
};

export default Hero;
```

## 📚 Resources

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [React Hooks API](https://react.dev/reference/react)
- [Web Accessibility](https://www.w3.org/WAI/WCAG21/quickref/)

## 🆘 Issues?

If `npm install` fails:
1. Clear npm cache: `npm cache clean --force`
2. Delete `node_modules` folder and `package-lock.json`
3. Run `npm install` again

Common issues are documented in **SETUP_GUIDE.md** under "Troubleshooting"

---

**Built with ❤️ for accessibility and visual impairment awareness**
