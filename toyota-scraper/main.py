"""
Main script to run Toyota inventory scraper
"""
import time
from typing import List
from database import DatabaseManager
from toyota_scraper import ToyotaInventoryScraper
from config import Config

def main():
    """Main function to orchestrate the scraping process"""
    print("🚗 Toyota Inventory Scraper Starting...")
    
    # Initialize components
    db_manager = DatabaseManager()
    scraper = ToyotaInventoryScraper()
    
    try:
        # Get unique ZIP codes from users
        print("📋 Fetching ZIP codes from users collection...")
        zip_codes = db_manager.get_unique_zip_codes()
        
        if not zip_codes:
            print("❌ No ZIP codes found in users collection")
            return
        
        print(f"📍 Found {len(zip_codes)} unique ZIP codes to scrape")
        
        # Process each ZIP code
        total_cars_scraped = 0
        successful_scrapes = 0
        
        for i, zip_code in enumerate(zip_codes, 1):
            print(f"\n🔄 Processing ZIP code {i}/{len(zip_codes)}: {zip_code}")
            
            try:
                # Check if we already have data for this ZIP code
                existing_count = db_manager.get_existing_cars_count(zip_code)
                if existing_count > 0:
                    print(f"⏭️  Skipping ZIP {zip_code} - already has {existing_count} cars")
                    continue
                
                # Scrape inventory for this ZIP code
                car_data = scraper.scrape_zip_code(zip_code)
                
                if car_data:
                    # Insert data into database
                    success = db_manager.insert_car_data(car_data, zip_code)
                    
                    if success:
                        total_cars_scraped += len(car_data)
                        successful_scrapes += 1
                        print(f"✅ Successfully scraped and stored {len(car_data)} cars for ZIP {zip_code}")
                    else:
                        print(f"❌ Failed to store data for ZIP {zip_code}")
                else:
                    print(f"⚠️  No cars found for ZIP {zip_code}")
                
                # Delay between requests to be respectful
                if i < len(zip_codes):
                    print(f"⏳ Waiting {Config.DELAY_BETWEEN_REQUESTS} seconds before next request...")
                    time.sleep(Config.DELAY_BETWEEN_REQUESTS)
                    
            except Exception as e:
                print(f"❌ Error processing ZIP {zip_code}: {e}")
                continue
        
        # Summary
        print(f"\n🎉 Scraping completed!")
        print(f"📊 Summary:")
        print(f"   - ZIP codes processed: {len(zip_codes)}")
        print(f"   - Successful scrapes: {successful_scrapes}")
        print(f"   - Total cars scraped: {total_cars_scraped}")
        
    except Exception as e:
        print(f"❌ Fatal error in main process: {e}")
    
    finally:
        # Cleanup
        scraper.close_driver()
        db_manager.close_connection()
        print("🧹 Cleanup completed")

def scrape_single_zip(zip_code: str):
    """Function to scrape a single ZIP code for testing"""
    print(f"🧪 Testing scraper with ZIP code: {zip_code}")
    
    scraper = ToyotaInventoryScraper()
    db_manager = DatabaseManager()
    
    try:
        car_data = scraper.scrape_zip_code(zip_code)
        
        if car_data:
            print(f"📋 Scraped data preview:")
            for i, car in enumerate(car_data[:3], 1):  # Show first 3 cars
                print(f"   {i}. {car.get('model', 'N/A')} - ${car.get('price', 'N/A')}")
            
            # Ask if user wants to save to database
            save = input(f"\n💾 Save {len(car_data)} cars to database? (y/n): ")
            if save.lower() == 'y':
                success = db_manager.insert_car_data(car_data, zip_code)
                if success:
                    print("✅ Data saved successfully!")
                else:
                    print("❌ Failed to save data")
        else:
            print("⚠️  No cars found")
            
    except Exception as e:
        print(f"❌ Error: {e}")
    
    finally:
        scraper.close_driver()
        db_manager.close_connection()

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1:
        # Test mode with specific ZIP code
        test_zip = sys.argv[1]
        scrape_single_zip(test_zip)
    else:
        # Full scraping mode
        main()
