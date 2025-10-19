"""
Debug script to test Toyota popup handling
"""
from toyota_scraper import ToyotaInventoryScraper
import time

def debug_popup():
    """Debug the ZIP code popup handling"""
    print("🔍 Debugging Toyota ZIP code popup...")
    
    scraper = ToyotaInventoryScraper()
    
    try:
        # Navigate to the page
        print("1. Navigating to Toyota search page...")
        if scraper.navigate_to_search_page():
            print("   ✅ Page loaded successfully")
            
            # Take a screenshot for debugging
            try:
                scraper.driver.save_screenshot("debug_screenshot.png")
                print("   📸 Screenshot saved as debug_screenshot.png")
            except Exception as e:
                print(f"   ⚠️  Could not save screenshot: {e}")
            
            # Wait a bit to see the page
            print("2. Waiting 5 seconds to observe page...")
            time.sleep(5)
            
            # Try to find any ZIP input fields
            print("3. Looking for ZIP input fields...")
            zip_inputs = scraper.driver.find_elements("css selector", "input")
            print(f"   Found {len(zip_inputs)} input fields")
            
            for i, input_elem in enumerate(zip_inputs[:5]):  # Check first 5 inputs
                try:
                    placeholder = input_elem.get_attribute("placeholder") or "N/A"
                    name = input_elem.get_attribute("name") or "N/A"
                    input_type = input_elem.get_attribute("type") or "N/A"
                    is_displayed = input_elem.is_displayed()
                    print(f"   Input {i+1}: type={input_type}, placeholder='{placeholder}', name='{name}', displayed={is_displayed}")
                except Exception as e:
                    print(f"   Input {i+1}: Error getting attributes - {e}")
            
            # Look for modals/popups
            print("4. Looking for modal/popup elements...")
            modal_selectors = [
                ".modal", ".popup", ".overlay", ".dialog",
                "[class*='modal']", "[class*='popup']", "[class*='overlay']"
            ]
            
            for selector in modal_selectors:
                try:
                    elements = scraper.driver.find_elements("css selector", selector)
                    visible_elements = [e for e in elements if e.is_displayed()]
                    if visible_elements:
                        print(f"   Found {len(visible_elements)} visible elements with selector: {selector}")
                except:
                    continue
            
            print("5. Page source preview (first 1000 chars):")
            page_source = scraper.driver.page_source[:1000]
            print(f"   {page_source}...")
            
        else:
            print("   ❌ Failed to load page")
            
    except Exception as e:
        print(f"❌ Debug failed: {e}")
    
    finally:
        scraper.close_driver()
        print("🔚 Debug session ended")

if __name__ == "__main__":
    debug_popup()
