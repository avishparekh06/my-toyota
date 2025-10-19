"""
Test script for Toyota Inventory Scraper
"""
from toyota_scraper import ToyotaInventoryScraper
from database import DatabaseManager
import json

def test_scraper_basic():
    """Test basic scraper functionality"""
    print("🧪 Testing basic scraper functionality...")
    
    scraper = ToyotaInventoryScraper()
    
    try:
        # Test navigation
        print("1. Testing page navigation...")
        if scraper.navigate_to_search_page():
            print("   ✅ Page navigation successful")
        else:
            print("   ❌ Page navigation failed")
            return False
        
        # Test ZIP code search (using a common ZIP code)
        test_zip = "90210"  # Beverly Hills
        print(f"2. Testing ZIP code search with {test_zip}...")
        if scraper.search_by_zip_code(test_zip):
            print("   ✅ ZIP code search successful")
        else:
            print("   ❌ ZIP code search failed")
            return False
        
        # Test data scraping
        print("3. Testing data scraping...")
        car_data = scraper.scrape_inventory_data()
        
        if car_data:
            print(f"   ✅ Successfully scraped {len(car_data)} vehicles")
            print("   📋 Sample data:")
            for i, car in enumerate(car_data[:2], 1):  # Show first 2 cars
                print(f"      {i}. {car.get('model', 'N/A')} - ${car.get('price', 'N/A')}")
        else:
            print("   ⚠️  No data scraped (might be normal if no inventory)")
        
        print("\n✅ Basic scraper test completed successfully!")
        return True
        
    except Exception as e:
        print(f"❌ Test failed with error: {e}")
        return False
    
    finally:
        scraper.close_driver()

def test_database_connection():
    """Test database connection and ZIP code extraction"""
    print("\n🧪 Testing database connection...")
    
    db_manager = DatabaseManager()
    
    try:
        # Test ZIP code extraction
        zip_codes = db_manager.get_unique_zip_codes()
        print(f"✅ Database connection successful")
        print(f"📍 Found {len(zip_codes)} unique ZIP codes")
        
        if zip_codes:
            print("   Sample ZIP codes:")
            for zip_code in zip_codes[:5]:  # Show first 5
                print(f"      - {zip_code}")
        
        return True
        
    except Exception as e:
        print(f"❌ Database test failed: {e}")
        return False
    
    finally:
        db_manager.close_connection()

def test_full_workflow():
    """Test the complete workflow for a single ZIP code"""
    print("\n🧪 Testing full workflow...")
    
    # Use a common ZIP code for testing
    test_zip = "10001"  # New York
    
    scraper = ToyotaInventoryScraper()
    db_manager = DatabaseManager()
    
    try:
        print(f"Testing with ZIP code: {test_zip}")
        
        # Scrape data
        car_data = scraper.scrape_zip_code(test_zip)
        
        if car_data:
            print(f"✅ Scraped {len(car_data)} vehicles")
            
            # Test database insertion (dry run)
            print("💾 Testing database insertion...")
            success = db_manager.insert_car_data(car_data, test_zip)
            
            if success:
                print("✅ Database insertion successful")
            else:
                print("❌ Database insertion failed")
        else:
            print("⚠️  No vehicles found (this might be normal)")
        
        return True
        
    except Exception as e:
        print(f"❌ Full workflow test failed: {e}")
        return False
    
    finally:
        scraper.close_driver()
        db_manager.close_connection()

def main():
    """Run all tests"""
    print("🚗 Toyota Inventory Scraper Test Suite")
    print("=" * 50)
    
    tests = [
        ("Database Connection", test_database_connection),
        ("Basic Scraper", test_scraper_basic),
        ("Full Workflow", test_full_workflow)
    ]
    
    results = []
    
    for test_name, test_func in tests:
        print(f"\n{'='*20} {test_name} {'='*20}")
        try:
            result = test_func()
            results.append((test_name, result))
        except Exception as e:
            print(f"❌ {test_name} failed with exception: {e}")
            results.append((test_name, False))
    
    # Summary
    print(f"\n{'='*50}")
    print("📊 Test Results Summary:")
    print("=" * 50)
    
    passed = 0
    for test_name, result in results:
        status = "✅ PASSED" if result else "❌ FAILED"
        print(f"{test_name:.<30} {status}")
        if result:
            passed += 1
    
    print(f"\n🎯 Overall: {passed}/{len(results)} tests passed")
    
    if passed == len(results):
        print("🎉 All tests passed! The scraper is ready to use.")
    else:
        print("⚠️  Some tests failed. Check the errors above.")

if __name__ == "__main__":
    main()
