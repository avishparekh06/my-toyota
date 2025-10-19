# Required Files for Local Development

This document lists all the files that other developers need to have to run this project locally.

## Essential Files (Must Have)

### 1. Environment Configuration
- **`.env`** - Your local environment variables (create from .env.example)
- **`.env.example`** - Template with placeholder values (already in repo)

### 2. Package Files
- **`package.json`** - Frontend dependencies and scripts
- **`backend/package.json`** - Backend dependencies and scripts
- **`package-lock.json`** - Frontend dependency lock file
- **`backend/package-lock.json`** - Backend dependency lock file

### 3. Configuration Files
- **`vite.config.ts`** - Vite build configuration
- **`tsconfig.json`** - TypeScript configuration
- **`tailwind.config.js`** - Tailwind CSS configuration
- **`postcss.config.js`** - PostCSS configuration

## Files You Need to Create

### 1. Environment File (.env)
**Create this file by copying the example:**
```bash
cp .env.example .env
```

**Required content in .env:**
```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority

# Gemini AI Configuration  
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Vapi Configuration (Optional)
VAPI_API_KEY=your_vapi_api_key_here
VAPI_ASSISTANT_ID=your_vapi_assistant_id_here
VAPI_PHONE_NUMBER_ID=your_vapi_phone_number_id_here

# Server Configuration
PORT=5001
NODE_ENV=development
```

### 2. Database Setup
You need either:
- **Local MongoDB** installed and running
- **MongoDB Atlas** account with connection string

## Files Already in Repository

These files are already included and don't need to be created:

### Source Code
- `src/` - All React components and pages
- `backend/` - All Express server files
- `public/` - Static assets and images

### Documentation
- `README.md` - Main project documentation
- `LOCAL_SETUP.md` - Detailed setup instructions
- `ENVIRONMENT_SETUP.md` - Environment variables guide

### Configuration
- `.gitignore` - Git ignore rules
- `tsconfig.node.json` - Node TypeScript config

## Quick Setup Checklist

For someone to run this project, they need to:

### ✅ 1. Clone Repository
```bash
git clone <repository-url>
cd find-my-toyota
```

### ✅ 2. Install Dependencies
```bash
# Frontend
npm install

# Backend  
cd backend
npm install
cd ..
```

### ✅ 3. Create Environment File
```bash
cp .env.example .env
# Edit .env with your actual values
```

### ✅ 4. Get Required API Keys
- **MongoDB**: Set up MongoDB Atlas or local MongoDB
- **Gemini AI**: Get API key from Google AI Studio
- **Vapi** (optional): Get credentials from Vapi.ai

### ✅ 5. Start Development
```bash
# Terminal 1 - Backend
npm run backend

# Terminal 2 - Frontend
npm run dev
```

## What's NOT Required

These files are automatically generated and don't need to be created:
- `node_modules/` - Installed via `npm install`
- `dist/` - Built via `npm run build`
- `.env.local` - Optional local overrides
- `*.log` - Log files

## Troubleshooting Missing Files

If you get errors about missing files:

### Missing .env
```bash
cp .env.example .env
# Edit with your actual values
```

### Missing node_modules
```bash
npm install
cd backend && npm install
```

### Missing API Keys
- Check `ENVIRONMENT_SETUP.md` for detailed instructions
- Ensure all required environment variables are set in `.env`

## File Permissions

Make sure these files are executable (if on Unix/Mac):
```bash
chmod +x setup.sh
```

## Summary

**Minimum files needed:**
1. All source code (already in repo)
2. `.env` file (create from .env.example)
3. Dependencies installed (`npm install`)
4. API keys and database access

That's it! The project should run with just these essentials.
