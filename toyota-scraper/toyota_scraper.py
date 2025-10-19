"""
Toyota Inventory Scraper using Selenium
"""
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import TimeoutException, NoSuchElementException
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup
import time
import re
from datetime import datetime
from typing import List, Dict, Any, Optional
from config import Config

class ToyotaInventoryScraper:
    def __init__(self):
        self.driver = None
        self.wait = None
        self.setup_driver()
    
    def setup_driver(self):
        """Setup Chrome driver with appropriate options"""
        chrome_options = Options()
        
        if Config.HEADLESS_MODE:
            chrome_options.add_argument('--headless')
        
        # Additional options for better performance and reliability
        chrome_options.add_argument('--no-sandbox')
        chrome_options.add_argument('--disable-dev-shm-usage')
        chrome_options.add_argument('--disable-gpu')
        chrome_options.add_argument('--window-size=1920,1080')
        chrome_options.add_argument('--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36')
        
        # Disable popup blocking and allow all popups
        chrome_options.add_argument('--disable-popup-blocking')
        chrome_options.add_argument('--disable-web-security')
        chrome_options.add_argument('--allow-running-insecure-content')
        
        # Disable images and CSS for faster loading (commented out for debugging)
        # prefs = {
        #     "profile.managed_default_content_settings.images": 2,
        #     "profile.default_content_setting_values.stylesheets": 2
        # }
        # chrome_options.add_experimental_option("prefs", prefs)
        
        try:
            service = Service(ChromeDriverManager().install())
            self.driver = webdriver.Chrome(service=service, options=chrome_options)
            self.driver.set_page_load_timeout(Config.PAGE_LOAD_TIMEOUT)
            self.driver.implicitly_wait(Config.IMPLICIT_WAIT)
            self.wait = WebDriverWait(self.driver, 10)
            print("Chrome driver setup successful")
        except Exception as e:
            print(f"Error setting up Chrome driver: {e}")
            raise
    
    def navigate_to_search_page(self) -> bool:
        """Navigate to Toyota search inventory page"""
        try:
            print(f"Navigating to {Config.TOYOTA_SEARCH_URL}")
            self.driver.get(Config.TOYOTA_SEARCH_URL)
            
            # Wait for page to load
            self.wait.until(EC.presence_of_element_located((By.TAG_NAME, "body")))
            time.sleep(3)  # Additional wait for dynamic content
            
            # Check for and handle ZIP code popup
            if self.handle_zip_popup():
                print("Successfully handled ZIP code popup")
            else:
                print("No ZIP code popup found or failed to handle it")
            
            print("Successfully loaded Toyota search page")
            return True
            
        except TimeoutException:
            print("Timeout while loading Toyota search page")
            return False
        except Exception as e:
            print(f"Error navigating to search page: {e}")
            return False
    
    def handle_zip_popup(self) -> bool:
        """Handle ZIP code popup that appears on page load"""
        try:
            print("Checking for ZIP code popup...")
            
            # Common popup selectors for ZIP code prompts
            popup_selectors = [
                # Modal/popup containers
                ".modal",
                ".popup", 
                ".zip-popup",
                ".location-popup",
                "[data-testid*='modal']",
                "[data-testid*='popup']",
                ".overlay",
                ".dialog",
                
                # Specific Toyota selectors
                ".toyota-modal",
                ".location-modal",
                ".zip-modal",
                "[class*='modal']",
                "[class*='popup']",
                "[class*='overlay']"
            ]
            
            # Wait a bit for popup to appear
            time.sleep(2)
            
            # Look for popup/modal elements
            popup_element = None
            for selector in popup_selectors:
                try:
                    elements = self.driver.find_elements(By.CSS_SELECTOR, selector)
                    for element in elements:
                        if element.is_displayed():
                            popup_element = element
                            print(f"Found popup with selector: {selector}")
                            break
                    if popup_element:
                        break
                except:
                    continue
            
            if not popup_element:
                print("No ZIP code popup found")
                return False
            
            # Look for ZIP code input within the popup
            zip_input_selectors = [
                "input[placeholder*='ZIP']",
                "input[placeholder*='zip']",
                "input[name*='zip']",
                "input[id*='zip']",
                "input[data-testid*='zip']",
                "input[type='text']"
            ]
            
            zip_input = None
            for selector in zip_input_selectors:
                try:
                    # Look within the popup element first
                    zip_input = popup_element.find_element(By.CSS_SELECTOR, selector)
                    if zip_input and zip_input.is_displayed():
                        print(f"Found ZIP input in popup with selector: {selector}")
                        break
                except:
                    continue
            
            # If not found in popup, look globally
            if not zip_input:
                for selector in zip_input_selectors:
                    try:
                        zip_input = self.driver.find_element(By.CSS_SELECTOR, selector)
                        if zip_input and zip_input.is_displayed():
                            print(f"Found ZIP input globally with selector: {selector}")
                            break
                    except:
                        continue
            
            if not zip_input:
                print("No ZIP code input found in popup")
                return False
            
            # Enter a default ZIP code to dismiss the popup
            default_zip = "90210"  # Beverly Hills as default
            zip_input.clear()
            zip_input.send_keys(default_zip)
            print(f"Entered default ZIP code: {default_zip}")
            
            # Look for submit/continue button in popup
            button_selectors = [
                "button[type='submit']",
                "button:contains('Continue')",
                "button:contains('Submit')",
                "button:contains('Search')",
                "button:contains('OK')",
                "button:contains('Go')",
                ".btn",
                ".button",
                "[data-testid*='submit']",
                "[data-testid*='continue']"
            ]
            
            submit_button = None
            for selector in button_selectors:
                try:
                    if ":contains" in selector:
                        # Use XPath for text-based search
                        text_content = selector.split(":contains")[1].strip("'\"")
                        xpath = f"//button[contains(text(), '{text_content}')]"
                        submit_button = self.driver.find_element(By.XPATH, xpath)
                    else:
                        # Look within popup first
                        submit_button = popup_element.find_element(By.CSS_SELECTOR, selector)
                    
                    if submit_button and submit_button.is_displayed():
                        print(f"Found submit button with selector: {selector}")
                        break
                except:
                    continue
            
            if submit_button:
                submit_button.click()
                print("Clicked submit button in popup")
            else:
                # Try pressing Enter
                from selenium.webdriver.common.keys import Keys
                zip_input.send_keys(Keys.RETURN)
                print("Pressed Enter on ZIP input")
            
            # Wait for popup to close
            time.sleep(2)
            
            # Check if popup is still visible
            try:
                if popup_element and not popup_element.is_displayed():
                    print("Popup successfully dismissed")
                    return True
            except:
                print("Popup element no longer exists (likely dismissed)")
                return True
            
            return True
            
        except Exception as e:
            print(f"Error handling ZIP popup: {e}")
            return False
    
    def search_by_zip_code(self, zip_code: str) -> bool:
        """Enter ZIP code and search for inventory"""
        try:
            print(f"Searching for inventory in ZIP code: {zip_code}")
            
            # First, try to find and update the existing ZIP code input (if popup was handled)
            # Look for any visible ZIP input fields
            zip_input_selectors = [
                "input[placeholder*='ZIP']",
                "input[placeholder*='zip']", 
                "input[name*='zip']",
                "input[id*='zip']",
                "input[data-testid*='zip']",
                ".zip-input input",
                ".location-input input",
                "input[type='text']"
            ]
            
            zip_input = None
            for selector in zip_input_selectors:
                try:
                    zip_input = self.wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, selector)))
                    print(f"Found ZIP input with selector: {selector}")
                    break
                except TimeoutException:
                    continue
            
            if not zip_input:
                print("Could not find ZIP code input field")
                return False
            
            # Clear and enter ZIP code
            zip_input.clear()
            zip_input.send_keys(zip_code)
            
            # Find and click search button
            search_button_selectors = [
                "button[type='submit']",
                "button[data-testid*='search']",
                "button:contains('Search')",
                ".search-button",
                ".btn-search",
                "input[type='submit']"
            ]
            
            search_button = None
            for selector in search_button_selectors:
                try:
                    if ":contains" in selector:
                        # Use XPath for text-based search
                        xpath = f"//button[contains(text(), 'Search')]"
                        search_button = self.driver.find_element(By.XPATH, xpath)
                    else:
                        search_button = self.driver.find_element(By.CSS_SELECTOR, selector)
                    print(f"Found search button with selector: {selector}")
                    break
                except NoSuchElementException:
                    continue
            
            if not search_button:
                # Try pressing Enter on the input field
                from selenium.webdriver.common.keys import Keys
                zip_input.send_keys(Keys.RETURN)
                print("Pressed Enter on ZIP input field")
            else:
                search_button.click()
                print("Clicked search button")
            
            # Wait for results to load
            time.sleep(5)
            
            # Check if results loaded
            if self.has_inventory_results():
                print(f"Successfully loaded inventory for ZIP {zip_code}")
                return True
            else:
                print(f"No inventory results found for ZIP {zip_code}")
                return False
                
        except Exception as e:
            print(f"Error searching by ZIP code {zip_code}: {e}")
            return False
    
    def has_inventory_results(self) -> bool:
        """Check if inventory results are displayed"""
        try:
            # Look for common result indicators
            result_indicators = [
                ".vehicle-listing",
                ".inventory-item",
                ".car-card",
                ".vehicle-card",
                "[data-testid*='vehicle']",
                ".result-item"
            ]
            
            for indicator in result_indicators:
                try:
                    elements = self.driver.find_elements(By.CSS_SELECTOR, indicator)
                    if elements:
                        print(f"Found {len(elements)} inventory items")
                        return True
                except:
                    continue
            
            # Also check for "no results" messages
            no_results_indicators = [
                "text()='No vehicles found'",
                "text()='No inventory found'",
                "text()='No results'"
            ]
            
            for indicator in no_results_indicators:
                try:
                    element = self.driver.find_element(By.XPATH, f"//*[contains({indicator})]")
                    if element:
                        print("Found 'no results' message")
                        return False
                except:
                    continue
            
            return False
            
        except Exception as e:
            print(f"Error checking for inventory results: {e}")
            return False
    
    def scrape_inventory_data(self) -> List[Dict[str, Any]]:
        """Scrape vehicle data from the current page"""
        try:
            print("Scraping inventory data...")
            
            # Get page source and parse with BeautifulSoup
            soup = BeautifulSoup(self.driver.page_source, 'html.parser')
            
            # Try multiple selectors for vehicle listings
            vehicle_selectors = [
                ".vehicle-listing",
                ".inventory-item", 
                ".car-card",
                ".vehicle-card",
                "[data-testid*='vehicle']",
                ".result-item",
                ".vehicle-result"
            ]
            
            vehicles = []
            for selector in vehicle_selectors:
                vehicle_elements = soup.select(selector)
                if vehicle_elements:
                    print(f"Found {len(vehicle_elements)} vehicles with selector: {selector}")
                    vehicles = vehicle_elements
                    break
            
            if not vehicles:
                print("No vehicle elements found with any selector")
                return []
            
            scraped_data = []
            for vehicle in vehicles:
                try:
                    car_data = self.extract_vehicle_data(vehicle)
                    if car_data:
                        scraped_data.append(car_data)
                except Exception as e:
                    print(f"Error extracting vehicle data: {e}")
                    continue
            
            print(f"Successfully scraped {len(scraped_data)} vehicles")
            return scraped_data
            
        except Exception as e:
            print(f"Error scraping inventory data: {e}")
            return []
    
    def extract_vehicle_data(self, vehicle_element) -> Optional[Dict[str, Any]]:
        """Extract data from a single vehicle element"""
        try:
            car_data = {}
            
            # Extract model and trim
            model_selectors = ['.model', '.vehicle-model', '.car-model', 'h3', 'h2', '.title']
            for selector in model_selectors:
                model_elem = vehicle_element.select_one(selector)
                if model_elem:
                    model_text = model_elem.get_text(strip=True)
                    car_data['model'] = model_text
                    break
            
            # Extract year
            year_match = re.search(r'\b(20\d{2})\b', str(vehicle_element))
            if year_match:
                car_data['year'] = int(year_match.group(1))
            
            # Extract price
            price_selectors = ['.price', '.vehicle-price', '.car-price', '[class*="price"]']
            for selector in price_selectors:
                price_elem = vehicle_element.select_one(selector)
                if price_elem:
                    price_text = price_elem.get_text(strip=True)
                    price_match = re.search(r'\$?([\d,]+)', price_text)
                    if price_match:
                        car_data['price'] = int(price_match.group(1).replace(',', ''))
                        break
            
            # Extract dealer name
            dealer_selectors = ['.dealer', '.dealer-name', '.dealership', '[class*="dealer"]']
            for selector in dealer_selectors:
                dealer_elem = vehicle_element.select_one(selector)
                if dealer_elem:
                    car_data['dealerName'] = dealer_elem.get_text(strip=True)
                    break
            
            # Extract fuel type
            fuel_selectors = ['.fuel-type', '.fuel', '[class*="fuel"]']
            for selector in fuel_selectors:
                fuel_elem = vehicle_element.select_one(selector)
                if fuel_elem:
                    fuel_text = fuel_elem.get_text(strip=True)
                    if any(keyword in fuel_text.lower() for keyword in ['hybrid', 'electric', 'gas', 'gasoline']):
                        car_data['fuelType'] = fuel_text
                        break
            
            # Extract drivetrain
            drivetrain_selectors = ['.drivetrain', '.drive', '[class*="drive"]']
            for selector in drivetrain_selectors:
                drive_elem = vehicle_element.select_one(selector)
                if drive_elem:
                    drive_text = drive_elem.get_text(strip=True)
                    if any(keyword in drive_text.lower() for keyword in ['awd', 'fwd', 'rwd', '4wd']):
                        car_data['drivetrain'] = drive_text.upper()
                        break
            
            # Extract mileage
            mileage_selectors = ['.mileage', '.miles', '[class*="mile"]']
            for selector in mileage_selectors:
                mile_elem = vehicle_element.select_one(selector)
                if mile_elem:
                    mile_text = mile_elem.get_text(strip=True)
                    mile_match = re.search(r'([\d,]+)', mile_text)
                    if mile_match:
                        car_data['mileage'] = int(mile_match.group(1).replace(',', ''))
                        break
            
            # Extract availability URL
            link_elem = vehicle_element.select_one('a[href]')
            if link_elem:
                href = link_elem.get('href')
                if href:
                    if href.startswith('/'):
                        href = 'https://www.toyota.com' + href
                    car_data['availabilityUrl'] = href
            
            # Only return if we have at least model and price
            if car_data.get('model') and car_data.get('price'):
                return car_data
            
            return None
            
        except Exception as e:
            print(f"Error extracting vehicle data: {e}")
            return None
    
    def scrape_zip_code(self, zip_code: str) -> List[Dict[str, Any]]:
        """Complete scraping process for a single ZIP code"""
        try:
            print(f"\n=== Scraping ZIP code: {zip_code} ===")
            
            # Navigate to search page
            if not self.navigate_to_search_page():
                return []
            
            # Search by ZIP code
            if not self.search_by_zip_code(zip_code):
                return []
            
            # Scrape the results
            car_data = self.scrape_inventory_data()
            
            print(f"Scraped {len(car_data)} vehicles for ZIP {zip_code}")
            return car_data
            
        except Exception as e:
            print(f"Error scraping ZIP code {zip_code}: {e}")
            return []
    
    def close_driver(self):
        """Close the browser driver"""
        if self.driver:
            self.driver.quit()
            print("Browser driver closed")
