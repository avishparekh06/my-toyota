"""
Setup script for Toyota Inventory Scraper
"""
import subprocess
import sys
import os

def install_requirements():
    """Install required Python packages"""
    print("📦 Installing required packages...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        print("✅ Requirements installed successfully!")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Error installing requirements: {e}")
        return False

def create_env_file():
    """Create .env file if it doesn't exist"""
    if not os.path.exists('.env'):
        print("📝 Creating .env file...")
        with open('.env', 'w') as f:
            f.write("""# MongoDB Configuration
MONGO_URI=your_mongodb_connection_string_here

# Selenium Configuration
HEADLESS_MODE=true
PAGE_LOAD_TIMEOUT=30
IMPLICIT_WAIT=10

# Scraping Configuration
MAX_RETRIES=3
DELAY_BETWEEN_REQUESTS=2
MAX_PAGES_TO_SCRAPE=5
""")
        print("✅ .env file created!")
    else:
        print("📝 .env file already exists")

def test_chrome():
    """Test if Chrome is available"""
    print("🌐 Testing Chrome availability...")
    try:
        from selenium import webdriver
        from selenium.webdriver.chrome.service import Service
        from selenium.webdriver.chrome.options import Options
        from webdriver_manager.chrome import ChromeDriverManager
        
        chrome_options = Options()
        chrome_options.add_argument('--headless')
        chrome_options.add_argument('--no-sandbox')
        chrome_options.add_argument('--disable-dev-shm-usage')
        
        service = Service(ChromeDriverManager().install())
        driver = webdriver.Chrome(service=service, options=chrome_options)
        driver.get("https://www.google.com")
        driver.quit()
        print("✅ Chrome test successful!")
        return True
    except Exception as e:
        print(f"❌ Chrome test failed: {e}")
        print("💡 Make sure Chrome browser is installed on your system")
        return False

def main():
    """Main setup function"""
    print("🚗 Toyota Inventory Scraper Setup")
    print("=" * 40)
    
    # Install requirements
    if not install_requirements():
        return False
    
    # Create .env file
    create_env_file()
    
    # Test Chrome
    if not test_chrome():
        print("\n⚠️  Chrome test failed, but you can still try running the scraper")
        print("   Make sure Chrome browser is installed and try again")
    
    print("\n🎉 Setup completed!")
    print("\n📋 Next steps:")
    print("1. Edit .env file with your MongoDB URI if needed")
    print("2. Run 'python3 main.py' to scrape all user ZIP codes")
    print("3. Or run 'python3 main.py 90210' to test with a specific ZIP code")
    
    return True

if __name__ == "__main__":
    main()
