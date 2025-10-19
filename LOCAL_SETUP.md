# Local Development Setup Guide

This guide will help you set up the Find My Toyota application locally on your machine.

## Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js** (version 18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Git** - [Download here](https://git-scm.com/)
- **MongoDB** (for database) - [Download here](https://www.mongodb.com/try/download/community) or use MongoDB Atlas (cloud)

## Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd find-my-toyota
```

### 2. Install Dependencies

Install frontend dependencies:
```bash
npm install
```

Install backend dependencies:
```bash
cd backend
npm install
cd ..
```

### 3. Set Up Environment Variables

Copy the example environment file:
```bash
cp .env.example .env
```

Edit the `.env` file with your actual values:
```bash
# MongoDB Configuration
MONGODB_URI=your_mongodb_connection_string_here

# Gemini AI Configuration
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Vapi Configuration
VAPI_API_KEY=your_vapi_api_key_here
VAPI_ASSISTANT_ID=your_vapi_assistant_id_here
VAPI_PHONE_NUMBER_ID=your_vapi_phone_number_id_here

# Server Configuration
PORT=5001
NODE_ENV=development
```

### 4. Start the Application

You need to run both the frontend and backend servers:

**Terminal 1 - Backend Server:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend Server:**
```bash
npm run dev
```

### 5. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5001
- **API Health Check**: http://localhost:5001/api/health

## Detailed Setup Instructions

### Database Setup

#### Option 1: MongoDB Atlas (Recommended for beginners)

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account
3. Create a new cluster
4. Get your connection string
5. Add it to your `.env` file as `MONGODB_URI`

#### Option 2: Local MongoDB

1. Install MongoDB locally
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017/find-my-toyota`

### API Keys Setup

#### Gemini AI API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to your `.env` file as `VITE_GEMINI_API_KEY`

#### Vapi API Keys (Optional)
1. Go to [Vapi.ai](https://vapi.ai/)
2. Create an account and get your API credentials
3. Add them to your `.env` file

### Development Scripts

The project includes several npm scripts:

```bash
# Frontend development
npm run dev          # Start Vite dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint

# Backend development
npm run server       # Start backend with nodemon
npm run backend      # Start backend from root directory

# Combined development
npm run dev          # Start frontend (in one terminal)
npm run backend      # Start backend (in another terminal)
```

## Project Structure

```
find-my-toyota/
├── src/                    # Frontend React application
│   ├── components/         # Reusable UI components
│   ├── routes/            # Page components
│   ├── services/          # API services
│   ├── contexts/          # React contexts
│   └── assets/            # Static assets
├── backend/               # Backend Express server
│   ├── routes/            # API routes
│   ├── models/            # Database models
│   └── server.js          # Main server file
├── public/                # Static public files
├── .env.example           # Environment variables template
└── README.md              # Project documentation
```

## Troubleshooting

### Common Issues

#### 1. Port Already in Use
```bash
# Kill process on port 5173 (frontend)
npx kill-port 5173

# Kill process on port 5001 (backend)
npx kill-port 5001
```

#### 2. MongoDB Connection Issues
- Check your MongoDB URI in `.env`
- Ensure MongoDB is running (if using local)
- Check network connectivity (if using Atlas)

#### 3. API Key Issues
- Verify API keys are correct in `.env`
- Check if API keys have proper permissions
- Ensure environment variables are loaded

#### 4. Dependencies Issues
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# For backend
cd backend
rm -rf node_modules package-lock.json
npm install
```

### Development Tips

1. **Hot Reload**: Both frontend and backend support hot reload
2. **API Testing**: Use the health check endpoint to verify backend is running
3. **Database**: Check MongoDB connection in backend logs
4. **Environment**: Always restart servers after changing `.env` file

## Production Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy the 'dist' folder
```

### Backend (Railway/Heroku)
```bash
cd backend
npm start
```

### Environment Variables for Production
Set these in your hosting platform:
- `MONGODB_URI`
- `VITE_GEMINI_API_KEY`
- `VAPI_API_KEY`
- `VAPI_ASSISTANT_ID`
- `VAPI_PHONE_NUMBER_ID`
- `NODE_ENV=production`

## Getting Help

If you encounter issues:

1. Check the console for error messages
2. Verify all environment variables are set
3. Ensure all dependencies are installed
4. Check that both servers are running
5. Review the troubleshooting section above

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally
5. Submit a pull request

---

**Happy coding! 🚗**
