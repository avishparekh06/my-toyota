"""
Database operations for Toyota inventory scraper
"""
from pymongo import MongoClient
from datetime import datetime
from typing import List, Dict, Any
from config import Config

class DatabaseManager:
    def __init__(self):
        self.client = MongoClient(Config.MONGO_URI)
        self.db = self.client.get_default_database()
        self.users_collection = self.db[Config.USERS_COLLECTION]
        self.car_data_collection = self.db[Config.CAR_DATA_COLLECTION]
    
    def get_unique_zip_codes(self) -> List[str]:
        """Get all unique ZIP codes from users collection"""
        try:
            # Get all users and extract ZIP codes
            users = list(self.users_collection.find({}, {"location.zip": 1, "personal.location": 1}))
            zip_codes = set()
            
            for user in users:
                # Try different possible ZIP code fields
                zip_code = None
                if user.get('location', {}).get('zip'):
                    zip_code = user['location']['zip']
                elif user.get('personal', {}).get('location'):
                    # Extract ZIP from personal.location if it's a full address
                    location = user['personal']['location']
                    if isinstance(location, str):
                        # Try to extract ZIP from string like "Atlanta, CA 90001"
                        parts = location.split()
                        for part in parts:
                            if part.isdigit() and len(part) == 5:
                                zip_code = part
                                break
                
                if zip_code and len(str(zip_code)) == 5:
                    zip_codes.add(str(zip_code))
            
            print(f"Found {len(zip_codes)} unique ZIP codes")
            return list(zip_codes)
            
        except Exception as e:
            print(f"Error getting ZIP codes: {e}")
            return []
    
    def insert_car_data(self, car_data: List[Dict[str, Any]], zip_code: str) -> bool:
        """Insert scraped car data into the database"""
        try:
            if not car_data:
                print(f"No car data to insert for ZIP code {zip_code}")
                return True
            
            # Add metadata to each car record
            for car in car_data:
                car['zipCode'] = zip_code
                car['scrapedAt'] = datetime.utcnow()
            
            # Insert with upsert to avoid duplicates
            result = self.car_data_collection.insert_many(car_data, ordered=False)
            print(f"Successfully inserted {len(result.inserted_ids)} cars for ZIP code {zip_code}")
            return True
            
        except Exception as e:
            print(f"Error inserting car data for ZIP {zip_code}: {e}")
            return False
    
    def get_existing_cars_count(self, zip_code: str) -> int:
        """Get count of existing cars for a ZIP code"""
        try:
            return self.car_data_collection.count_documents({"zipCode": zip_code})
        except Exception as e:
            print(f"Error getting existing cars count: {e}")
            return 0
    
    def close_connection(self):
        """Close database connection"""
        if self.client:
            self.client.close()
