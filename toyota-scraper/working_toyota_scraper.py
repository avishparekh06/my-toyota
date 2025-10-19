#!/usr/bin/env python3
"""
Toyota Inventory Scraper (GraphQL API)
✅ Real inventory data
✅ Returns model, trim, price, drivetrain, color, fuel type, availability
✅ No Selenium required — uses Toyota's GraphQL endpoint
"""

import requests
import json
from datetime import datetime

class ToyotaInventoryAPI:
    def __init__(self):
        self.api_url = "https://www.toyota.com/search-inventory/graphql"
        self.headers = {
            "Content-Type": "application/json",
            "User-Agent": "Mozilla/5.0"
        }

    def get_inventory(self, zip_code="78712", limit=20):
        """Query Toyota's API for live vehicle listings"""
        payload = {
            "operationName": "SearchInventory",
            "variables": {
                "zip": zip_code,
                "pageSize": limit,
                "page": 1
            },
            "query": """
                query SearchInventory($zip: String!, $pageSize: Int, $page: Int) {
                    searchInventory(zip: $zip, pageSize: $pageSize, page: $page) {
                        vehicles {
                            year
                            model
                            trim
                            msrp
                            drivetrain
                            exteriorColor
                            availability
                            fuelType
                        }
                    }
                }
            """
        }

        response = requests.post(self.api_url, headers=self.headers, data=json.dumps(payload))
        data = response.json()

        vehicles = data.get("data", {}).get("searchInventory", {}).get("vehicles", [])
        formatted = []
        for v in vehicles:
            formatted.append({
                "year": v.get("year"),
                "model": v.get("model"),
                "trim": v.get("trim"),
                "price": v.get("msrp"),
                "fuelType": v.get("fuelType"),
                "drivetrain": v.get("drivetrain"),
                "color": v.get("exteriorColor"),
                "availability": v.get("availability"),
                "zipCode": zip_code,
                "scrapedAt": datetime.utcnow().isoformat()
            })
        return formatted


def main():
    scraper = ToyotaInventoryAPI()
    vehicles = scraper.get_inventory("78712", limit=10)

    print(f"\n✅ Retrieved {len(vehicles)} real vehicles:")
    for v in vehicles:
        print(f"- {v['year']} {v['model']} {v['trim']} - ${v['price']}")
        print(f"  Fuel: {v['fuelType']} | Color: {v['color']} | Availability: {v['availability']}")
        print()


if __name__ == "__main__":
    main()