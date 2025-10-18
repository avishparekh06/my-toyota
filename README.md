# MyToyota Smart Match

A pixel-perfect, responsive Toyota-inspired UI prototype built with React, TypeScript, and TailwindCSS.

## Features

- **Two Routes**: Landing page (`/`) and Auth page (`/auth`)
- **Toyota-inspired Design**: Custom brand tokens and dark mode by default
- **Modern Animations**: Framer Motion for smooth transitions and micro-interactions
- **Responsive Design**: Mobile-first approach with glass morphism effects
- **Accessibility**: Keyboard navigation, ARIA labels, and focus management
- **No Backend**: Pure frontend UI with placeholder handlers

## Tech Stack

- **React 18** + **TypeScript** + **Vite**
- **TailwindCSS** with custom theme tokens
- **Framer Motion** for animations
- **shadcn/ui** components (Button, Card, Input, Tabs, Dialog, Tooltip)
- **Lucide React** for icons
- **React Router** for navigation
- **Radix UI** primitives for accessibility

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

## Brand Tokens

The app uses custom CSS variables defined in `src/index.css`:

```css
--toyota-accent: #EB0A1E  /* Toyota red */
--toyota-bg: #0B0B0C     /* Dark background */
--toyota-card: #111214   /* Card background */
--toyota-muted: #9AA0A6  /* Muted text */
--toyota-fg: #EDEFF2     /* Foreground text */
```

## Customization

### Hero Copy
Edit the hero section in `src/routes/Landing.tsx`:
- Line ~45: Main headline
- Line ~55: Subtitle
- Line ~65: CTA buttons

### Brand Colors
Update CSS variables in `src/index.css`:
- Lines 15-20: Light mode tokens
- Lines 22-40: Dark mode tokens

### Features
Modify the features array in `src/routes/Landing.tsx` (lines 25-35) to change:
- Feature icons
- Titles
- Descriptions

## Demo Script

1. **Landing Page**: View hero animation, scroll through features, hover over stepper steps
2. **Navigation**: Click "Create account" or "Log in" to go to auth page
3. **Auth Page**: Switch between Login/Create tabs, try form interactions
4. **Dark Mode**: Toggle dark/light mode using the moon/sun icon in navbar
5. **Responsive**: Resize browser to see mobile-first responsive design
6. **Animations**: Notice smooth transitions, hover effects, and scroll animations

## File Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # shadcn/ui components
│   ├── Navbar.tsx       # Navigation with dark mode toggle
│   ├── Container.tsx    # Responsive container wrapper
│   ├── GlassCard.tsx    # Glass morphism card component
│   ├── PrimaryButton.tsx # Toyota-red primary button
│   └── ...
├── routes/              # Page components
│   ├── Landing.tsx      # Landing page with hero & features
│   └── Auth.tsx         # Auth page with tabs
├── lib/
│   └── utils.ts         # Utility functions (cn helper)
├── App.tsx              # Main app with routing
├── main.tsx            # React entry point
└── index.css           # Global styles & theme tokens
```

## Accessibility Features

- **Keyboard Navigation**: Full tab order support
- **ARIA Labels**: Screen reader friendly
- **Focus Management**: Visible focus rings
- **Color Contrast**: AA-level contrast ratios
- **Reduced Motion**: Respects `prefers-reduced-motion`

## Browser Support

- Chrome/Edge 88+
- Firefox 85+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

---

**Note**: This is a prototype for demonstration only. No data is stored or processed.
