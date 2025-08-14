# Bale Landing Page - Complete Setup Guide

## 🚀 Quick Start

### Option 1: Use the Theme Toggle Version (Recommended)
```jsx
// In your App.js, import the enhanced version:
import LandingPageWithTheme from './components/LandingPageWithTheme';

function App() {
  return (
    <div className="App">
      <LandingPageWithTheme />
    </div>
  );
}
```

### Option 2: Use the Original Dark Version
```jsx
// In your App.js, import the original version:
import LandingPage from './components/LandingPage';

function App() {
  return (
    <div className="App">
      <LandingPage />
    </div>
  );
}
```

## 📦 Required Dependencies

Add these to your `package.json`:

```json
{
  "dependencies": {
    "framer-motion": "^12.18.1",
    "lucide-react": "^0.522.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "tailwindcss": "^3.4.17",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.49"
  }
}
```

Install with:
```bash
npm install framer-motion lucide-react
# or
yarn add framer-motion lucide-react
```

## ⚙️ TailwindCSS Configuration

Make sure your `tailwind.config.js` includes:

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      // Add custom animations if needed
      animation: {
        'gradient-shift': 'gradient-shift 8s ease infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        'gradient-shift': {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        }
      }
    },
  },
  plugins: [],
};
```

## 🎨 Custom CSS (App.css)

The App.css file includes:
- Custom scrollbar styling
- Glass morphism effects
- Animation keyframes
- Responsive design helpers
- Performance optimizations

## 📱 Complete File Structure

```
src/
├── App.js                          # Main application
├── App.css                         # Custom styles & animations
├── index.css                       # TailwindCSS imports
├── components/
│   ├── LandingPage.jsx            # Original dark theme version
│   └── LandingPageWithTheme.jsx   # Enhanced with light/dark toggle
├── README.md                       # Project documentation
└── SETUP_GUIDE.md                 # This setup guide
```

## 🔧 Environment Setup

1. **Create React App** (if starting fresh):
   ```bash
   npx create-react-app bale-landing
   cd bale-landing
   ```

2. **Install dependencies**:
   ```bash
   npm install framer-motion lucide-react
   npm install -D tailwindcss postcss autoprefixer
   ```

3. **Initialize TailwindCSS**:
   ```bash
   npx tailwindcss init -p
   ```

4. **Copy the provided files** into your src directory

5. **Update index.css** with TailwindCSS imports:
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```

## 🎯 Key Features Explanation

### Theme Toggle System
- Uses `useState` and `useEffect` for theme management
- Persists theme preference in `localStorage`
- Dynamically applies theme classes throughout the component
- Smooth transitions between light/dark modes

### Animation System
- **Framer Motion** for component animations
- **useScroll** hook for parallax effects
- **AnimatePresence** for enter/exit animations
- **Intersection Observer** for scroll-triggered animations

### Responsive Design
- Mobile-first approach with TailwindCSS
- Responsive grid layouts
- Collapsible mobile navigation
- Touch-friendly interactions

## 🚀 Development Workflow

1. **Start development server**:
   ```bash
   npm start
   ```

2. **Build for production**:
   ```bash
   npm run build
   ```

3. **Test responsiveness**:
   - Use browser dev tools
   - Test on actual devices
   - Check both light and dark themes

## 🎨 Customization Guide

### Changing Colors
```jsx
// Update gradient colors
className="bg-gradient-to-r from-your-color to-your-color"

// Update theme colors in themeClasses object
const themeClasses = {
  bg: isDarkMode ? 'bg-your-dark-color' : 'bg-your-light-color',
  // ... other properties
};
```

### Adding New Sections
```jsx
// Add new section after existing ones
<section className="py-20">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    {/* Your content */}
  </div>
</section>
```

### Updating Content
- **Features**: Update the `features` array
- **Testimonials**: Update the `testimonials` array  
- **Pricing**: Update the `pricingPlans` array
- **FAQ**: Update the `faqs` array

### Image Replacement
Replace image URLs in:
- Hero background image
- Feature cards
- Technology section
- Testimonial avatars

## ⚡ Performance Tips

1. **Image Optimization**:
   - Use WebP format when possible
   - Implement lazy loading for below-fold images
   - Optimize image sizes for different screen sizes

2. **Animation Performance**:
   - Use `transform` and `opacity` for animations
   - Add `will-change` property for animated elements
   - Avoid animating layout-triggering properties

3. **Bundle Size**:
   - Import only needed Lucide icons
   - Consider code splitting for larger components

## 🐛 Troubleshooting

### Common Issues:

1. **TailwindCSS not working**:
   - Check `tailwind.config.js` content paths
   - Ensure `@tailwind` directives in CSS

2. **Animations not smooth**:
   - Check browser developer tools for performance
   - Reduce animation complexity on mobile

3. **Theme not persisting**:
   - Check localStorage in browser dev tools
   - Ensure `useEffect` dependencies are correct

4. **Mobile menu not working**:
   - Check z-index values
   - Verify click handlers are attached

## 📞 Support

For questions or issues:
1. Check the browser console for errors
2. Verify all dependencies are installed
3. Test in different browsers
4. Check responsive design on various screen sizes

Happy coding! 🚀