#!/bin/bash

# Toyota Inventory Scraper Run Script

echo "🚗 Toyota Inventory Scraper"
echo "=========================="

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "❌ Virtual environment not found. Please run setup first:"
    echo "   python3 -m venv venv"
    echo "   source venv/bin/activate"
    echo "   pip install -r requirements.txt"
    exit 1
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Check if we have a specific ZIP code argument
if [ $# -eq 1 ]; then
    echo "🧪 Running test mode with ZIP code: $1"
    python main.py "$1"
else
    echo "🚀 Running full scraper for all users..."
    python main.py
fi

echo "✅ Scraper finished!"
