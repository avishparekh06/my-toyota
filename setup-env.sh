#!/bin/bash

# Environment Setup Script for Find My Toyota
echo "🚗 Setting up environment for Find My Toyota..."

# Check if .env already exists
if [ -f ".env" ]; then
    echo "⚠️  .env file already exists. Backing up to .env.backup"
    cp .env .env.backup
fi

# Create .env from .env.example if it exists
if [ -f ".env.example" ]; then
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env
    echo "✅ .env file created!"
    echo ""
    echo "🔧 Please edit .env file with your actual values:"
    echo "   - MongoDB URI"
    echo "   - Gemini API Key"
    echo "   - Vapi API credentials"
    echo ""
    echo "📖 See ENVIRONMENT_SETUP.md for detailed instructions"
else
    echo "❌ .env.example file not found. Please create it manually."
    exit 1
fi

echo "🎉 Environment setup complete!"
