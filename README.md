# Bale AI Video Agency Landing Page

A premium, conversion-optimized landing page for Bale AI video agency built with React, TailwindCSS, and Framer Motion.

## 🚀 Features

- ✨ **Premium Design**: Dark/Light theme with cinematic aesthetics
- 🎭 **Smooth Animations**: Framer Motion powered interactions
- 📱 **Fully Responsive**: Perfect on all devices
- 🎨 **Theme Toggle**: Light/Dark mode with localStorage persistence
- ⚡ **Performance Optimized**: Lazy loading and efficient animations
- 🎯 **Conversion Focused**: Strategically placed CTAs and social proof

## 🛠️ Tech Stack

- **React 19** - Frontend framework
- **TailwindCSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Lucide React** - Beautiful icons
- **PostCSS** - CSS processing

## 📦 Installation

1. Clone or copy the project files
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
3. Start the development server:
   ```bash
   npm start
   # or
   yarn start
   ```

## 📁 Project Structure

```
src/
├── App.js                          # Main app component
├── App.css                         # Custom styles and animations
├── components/
│   ├── LandingPage.jsx            # Original dark-theme landing page
│   └── LandingPageWithTheme.jsx   # Enhanced version with theme toggle
└── index.css                      # Global styles with TailwindCSS
```

## 🎨 Customization

### Colors
Update the gradient colors in the components:
```jsx
// Change primary gradient
className="bg-gradient-to-r from-blue-400 to-purple-600"

// Update theme colors in themeClasses object
const themeClasses = {
  bg: isDarkMode ? 'bg-black' : 'bg-white',
  // ... other theme properties
}
```

### Content
Update the data arrays in the component:
```jsx
const features = [
  {
    icon: <Video className="w-8 h-8" />,
    title: "Your Feature Title",
    description: "Your feature description",
    image: "your-image-url"
  }
  // ... more features
];
```

### Images
Replace the image URLs with your own:
- Hero background image
- Feature section images
- Technology showcase images
- Testimonial avatars

## 🎯 Key Sections

1. **Hero Section** - Immersive full-screen experience with parallax
2. **Features** - 4 key AI video services with visual cards
3. **Technology** - Showcase of AI models (Google Veo, Kling, etc.)
4. **Testimonials** - Auto-rotating customer testimonials
5. **Pricing** - 3-tier pricing structure ($750, $1500, $2500)
6. **FAQ** - Collapsible frequently asked questions
7. **CTA Sections** - Strategic call-to-action placement
8. **Footer** - Company information and links

## 🌙 Theme Toggle

The enhanced version includes a sophisticated light/dark mode toggle:
- Automatically saves user preference to localStorage
- Smooth transitions between themes
- Adapts all colors, backgrounds, and visual elements
- Sun/Moon icon toggle button

## 📱 Responsive Design

- **Mobile-first approach**
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Mobile menu** with smooth animations
- **Touch-friendly** interactions
- **Optimized typography** scaling

## ⚡ Performance Features

- **Lazy loading** for images
- **Intersection Observer** for scroll animations
- **Optimized animations** with proper will-change properties
- **Efficient re-renders** with React hooks
- **Compressed images** and optimized assets

## 🎭 Animation Details

- **Parallax scrolling** on hero section
- **Staggered animations** for lists and grids
- **Hover effects** on cards and buttons
- **Smooth transitions** between theme modes
- **Auto-rotating testimonials** (5-second intervals)
- **Accordion FAQ** with smooth open/close

## 🔧 Development Tips

1. **Testing Animations**: Reduce `duration` values during development
2. **Theme Testing**: Toggle between light/dark modes frequently
3. **Mobile Testing**: Use browser dev tools responsive mode
4. **Performance**: Monitor animation performance with React DevTools

## 📊 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🚀 Deployment

Build for production:
```bash
npm run build
# or
yarn build
```

The `build` folder contains optimized production files ready for deployment.

## 📄 License

This project is created for demonstration purposes. Customize as needed for your projects.

---

## 🎨 Design Philosophy

This landing page follows modern design principles:
- **Visual hierarchy** - Clear content organization
- **Whitespace usage** - Proper spacing for readability
- **Color psychology** - Blue for trust, purple for innovation
- **Typography** - Clear, readable fonts with proper scaling
- **Accessibility** - Proper contrast ratios and focus states
- **Performance** - Optimized for fast loading and smooth interactions

Built with ❤️ for premium video AI agencies.