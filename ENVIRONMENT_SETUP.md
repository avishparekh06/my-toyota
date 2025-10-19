# Environment Variables Setup

This project uses environment variables to store sensitive information like API keys and database connections. Follow these steps to set up your environment:

## 1. Create Environment File

Copy the example environment file and fill in your actual values:

```bash
cp .env.example .env
```

## 2. Required Environment Variables

### MongoDB Configuration
- `MONGODB_URI`: Your MongoDB connection string
  - Example: `mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority&appName=app`

### Gemini AI Configuration
- `VITE_GEMINI_API_KEY`: Your Google Gemini API key
  - Get it from: https://makersuite.google.com/app/apikey

### Vapi Configuration
- `VAPI_API_KEY`: Your Vapi API key
- `VAPI_ASSISTANT_ID`: Your Vapi assistant ID
- `VAPI_PHONE_NUMBER_ID`: Your Vapi phone number ID
  - Get these from: https://vapi.ai/

### Server Configuration
- `PORT`: Server port (default: 5001)
- `NODE_ENV`: Environment (development/production)

### Scraping Configuration (for toyota-scraper)
- `HEADLESS_MODE`: Run browser in headless mode (true/false)
- `PAGE_LOAD_TIMEOUT`: Page load timeout in seconds
- `IMPLICIT_WAIT`: Implicit wait time in seconds
- `MAX_RETRIES`: Maximum retry attempts
- `DELAY_BETWEEN_REQUESTS`: Delay between requests in seconds
- `MAX_PAGES_TO_SCRAPE`: Maximum pages to scrape

## 3. Security Notes

- Never commit your `.env` file to version control
- The `.env` file is already included in `.gitignore`
- Use `.env.example` as a template for other developers
- In production, set environment variables through your hosting platform

## 4. Development vs Production

### Development
- Use the `.env` file for local development
- All sensitive values should be in your local `.env` file

### Production
- Set environment variables through your hosting platform (Vercel, Netlify, Heroku, etc.)
- Never use the `.env` file in production deployments
