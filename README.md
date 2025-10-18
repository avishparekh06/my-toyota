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
