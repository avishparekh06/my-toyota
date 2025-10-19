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

2. **Set up environment variables:**
   ```bash
   # Copy the example environment file
   cp .env.example .env
   
   # Edit .env with your actual API keys and database URLs
   # See ENVIRONMENT_SETUP.md for detailed instructions
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
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
# My Toyota - Car Lease & Financial Platform

A modern, responsive web application for finding Toyota leases and financial options. Built with React, Node.js, Express, and MongoDB.

## 🚀 Features

### Frontend
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Toyota Brand Colors**: Uses official Toyota color palette (Red: #EB0A1E, Black, White, Gray)
- **Modern Typography**: Clean sans-serif fonts (Inter, Helvetica Neue)
- **Interactive Elements**: Hover effects and smooth transitions
- **Accessibility**: Semantic HTML and ARIA labels
- **Modular Components**: Easy to expand and maintain

### Backend
- **RESTful API**: Full CRUD operations for car data
- **MongoDB Integration**: Scalable database with Mongoose ODM
- **Advanced Filtering**: Search cars by make, model, price, features, etc.
- **Production Ready**: Environment-based configuration and error handling

## 🏗️ Architecture

### Frontend Components
- **NavBar**: Top navigation with Toyota logo and menu items
- **HeroSection**: Full-screen hero with background image and call-to-action
- **CTAButtons**: Login and Create Account buttons with hover effects
- **InfoSection**: Service information and features

### Backend API
- **GET /api/cars**: Retrieve cars with filtering and pagination
- **POST /api/cars**: Create new car entries
- **GET /api/cars/:id**: Get specific car by ID
- **PUT /api/cars/:id**: Update existing car
- **DELETE /api/cars/:id**: Delete car
- **GET /api/health**: Health check endpoint

## 🛠️ Tech Stack

- **Frontend**: React 18, TailwindCSS, HTML5, CSS3
- **Backend**: Node.js, Express.js, Mongoose
- **Database**: MongoDB Atlas

## 📋 Prerequisites

- Node.js (version 16 or higher)
- npm or yarn
- MongoDB Atlas account

## 🚀 Getting Started

### Quick Setup (Recommended)
```bash
# 1. Clone the repository
git clone https://github.com/yourusername/find-my-toyota.git
cd find-my-toyota

# 2. Run the setup script (Mac/Linux)
./setup.sh

# 3. Start the application
npm run dev
```

### Manual Setup
```bash
# 1. Clone the repository
git clone https://github.com/yourusername/find-my-toyota.git
cd find-my-toyota

# 2. Install dependencies
npm install

# 3. Start the application
npm run dev
```

### What You'll Get
- **Frontend**: http://localhost:3000 (React app)
- **Backend**: http://localhost:5000 (Express API)

### Prerequisites
- Node.js (version 16 or higher) - [Download here](https://nodejs.org/)
- npm (comes with Node.js)

### Troubleshooting
If you get any errors:
1. Make sure Node.js is installed: `node --version`
2. Make sure npm is installed: `npm --version`
3. Try deleting `node_modules` and running `npm install` again
4. Check that ports 3000 and 5000 are not in use by other applications

## 🌐 API Endpoints

### Cars API
```bash
# Get all cars
GET /api/cars

# Get cars with filters
GET /api/cars?make=Toyota&maxPrice=50000&location=Los Angeles

# Get specific car
GET /api/cars/:id

# Create new car
POST /api/cars
Content-Type: application/json
{
  "vin": "JTDBCMFE8P3000001",
  "year": 2024,
  "make": "Toyota",
  "model": "Camry",
  "msrp": 30000
}

# Update car
PUT /api/cars/:id

# Delete car
DELETE /api/cars/:id
```

### Health Check
```bash
GET /api/health
```

## 🎨 Design System

### Color Palette
- **Primary Red**: #EB0A1E
- **Black**: #000000
- **White**: #FFFFFF
- **Gray**: #E5E5E5

### Typography
- **Font Family**: Inter, Helvetica Neue, Arial, sans-serif
- **Responsive Breakpoints**: Mobile-first design

## 📊 Database Schema

### Car Model
```javascript
{
  vin: String (required, unique),
  year: Number (required),
  make: String (required, default: 'Toyota'),
  model: String (required),
  trim: String,
  bodyStyle: String,
  engine: String,
  horsepower: Number,
  drivetrain: String,
  transmission: String,
  fuelType: String,
  mpgCity: Number,
  mpgHighway: Number,
  exteriorColor: String,
  interiorColor: String,
  stockNumber: String,
  msrp: Number (required),
  dealerPrice: Number,
  features: [String],
  dimensions: {
    length: String,
    width: String,
    height: String,
    wheelbase: String
  },
  status: String,
  images: [String],
  location: {
    city: String,
    state: String,
    zip: String
  },
  dealership: {
    name: String,
    address: String,
    city: String,
    state: String,
    zip: String,
    phone: String
  },
  dateAdded: Date
}
```

## 🔧 Available Scripts

```bash
npm start          # Start React development server (port 3000)
npm run server     # Start Express server with nodemon (port 5000)
npm run dev        # Start both frontend and backend
npm run build      # Build React app for production
npm run server:prod # Start production server
npm test           # Run tests
```

## 🚀 Future Enhancements

- [ ] User authentication and authorization
- [ ] Advanced search and filtering UI
- [ ] Car comparison features
- [ ] Financial calculator integration
- [ ] Real-time inventory updates
- [ ] Mobile app development
- [ ] AI-powered recommendations
