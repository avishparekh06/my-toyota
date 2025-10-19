"""
Configuration settings for Toyota inventory scraper
"""
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class Config:
    # MongoDB Configuration
    MONGO_URI = os.getenv('MONGO_URI')
    
    # Selenium Configuration
    HEADLESS_MODE = os.getenv('HEADLESS_MODE', 'true').lower() == 'true'
    PAGE_LOAD_TIMEOUT = int(os.getenv('PAGE_LOAD_TIMEOUT', '30'))
    IMPLICIT_WAIT = int(os.getenv('IMPLICIT_WAIT', '10'))
    
    # Scraping Configuration
    MAX_RETRIES = int(os.getenv('MAX_RETRIES', '3'))
    DELAY_BETWEEN_REQUESTS = int(os.getenv('DELAY_BETWEEN_REQUESTS', '2'))
    MAX_PAGES_TO_SCRAPE = int(os.getenv('MAX_PAGES_TO_SCRAPE', '5'))
    
    # Toyota Website URLs
    TOYOTA_SEARCH_URL = 'https://www.toyota.com/search-inventory/'
    
    # Database Collections
    USERS_COLLECTION = 'users'
    CAR_DATA_COLLECTION = 'car_data'
