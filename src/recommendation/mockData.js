// Simplified mock data for recommendations
export const mockUsers = [
  {
    "_id": "user_001",
    "name": "Ava Martinez",
    "age": 28,
    "familySize": 2,
    "location": {
      "city": "Austin",
      "state": "TX"
    },
    "preferences": {
      "bodyStyle": ["Sedan"],
      "drivetrain": ["FWD"],
      "fuelType": ["Hybrid"]
    },
    "budget": {
      "min": 30000,
      "max": 40000
    },
    "financial": {
      "annualIncome": 85000,
      "creditScore": 720
    }
  },
  {
    "_id": "user_002", 
    "name": "Daniel Kim",
    "age": 35,
    "familySize": 3,
    "location": {
      "city": "Houston",
      "state": "TX"
    },
    "preferences": {
      "bodyStyle": ["SUV"],
      "drivetrain": ["AWD"],
      "fuelType": ["Gasoline"]
    },
    "budget": {
      "min": 40000,
      "max": 55000
    },
    "financial": {
      "annualIncome": 95000,
      "creditScore": 750
    }
  },
  {
    "_id": "user_003",
    "name": "Sophia Patel", 
    "age": 32,
    "familySize": 4,
    "location": {
      "city": "Dallas",
      "state": "TX"
    },
    "preferences": {
      "bodyStyle": ["SUV"],
      "drivetrain": ["AWD"],
      "fuelType": ["Hybrid"]
    },
    "budget": {
      "min": 30000,
      "max": 50000
    },
    "financial": {
      "annualIncome": 78000,
      "creditScore": 680
    }
  },
  {
    "_id": "user_004",
    "name": "Ethan Johnson",
    "age": 45,
    "familySize": 2,
    "location": {
      "city": "Los Angeles",
      "state": "CA"
    },
    "preferences": {
      "bodyStyle": ["Coupe"],
      "drivetrain": ["RWD"],
      "fuelType": ["Gasoline"]
    },
    "budget": {
      "min": 70000,
      "max": 85000
    },
    "financial": {
      "annualIncome": 120000,
      "creditScore": 800
    }
  },
  {
    "_id": "user_005",
    "name": "Lily Chen",
    "age": 26,
    "familySize": 1,
    "location": {
      "city": "Atlanta",
      "state": "GA"
    },
    "preferences": {
      "bodyStyle": ["Sedan"],
      "drivetrain": ["FWD"],
      "fuelType": ["Hybrid"]
    },
    "budget": {
      "min": 25000,
      "max": 35000
    },
    "financial": {
      "annualIncome": 65000,
      "creditScore": 700
    }
  }
];

export const mockCars = [
  {
    "_id": "car_001",
    "make": "Toyota",
    "model": "Camry",
    "year": 2024,
    "trim": "LE",
    "bodyStyle": "Sedan",
    "drivetrain": "FWD",
    "fuelType": "Hybrid",
    "dealerPrice": 32000,
    "msrp": 35000,
    "engine": "2.5L 4-Cylinder Hybrid",
    "horsepower": 208,
    "mpgCity": 51,
    "mpgHighway": 53,
    "transmission": "CVT",
    "exteriorColor": "Wind Chill Pearl",
    "interiorColor": "Black Fabric",
    "features": ["Toyota Safety Sense 3.0", "Apple CarPlay", "Android Auto", "LED Headlights", "Backup Camera"],
    "location": {
      "city": "Austin",
      "state": "TX"
    },
    "dealership": {
      "name": "Toyota of Austin",
      "phone": "(512) 555-0123"
    },
    "status": "In Stock"
  },
  {
    "_id": "car_002", 
    "make": "Toyota",
    "model": "RAV4",
    "year": 2024,
    "trim": "XLE",
    "bodyStyle": "SUV",
    "drivetrain": "AWD",
    "fuelType": "Gasoline",
    "dealerPrice": 42000,
    "msrp": 45000,
    "engine": "2.5L 4-Cylinder",
    "horsepower": 203,
    "mpgCity": 27,
    "mpgHighway": 35,
    "transmission": "8-Speed Automatic",
    "exteriorColor": "Supersonic Red",
    "interiorColor": "Black SofTex",
    "features": ["Toyota Safety Sense 2.5+", "Wireless Charging", "Power Liftgate", "Heated Seats", "Moonroof"],
    "location": {
      "city": "Houston",
      "state": "TX"
    },
    "dealership": {
      "name": "Toyota of Houston",
      "phone": "(713) 555-0456"
    },
    "status": "In Stock"
  },
  {
    "_id": "car_003",
    "make": "Toyota", 
    "model": "Highlander",
    "year": 2024,
    "trim": "Limited",
    "bodyStyle": "SUV",
    "drivetrain": "AWD",
    "fuelType": "Hybrid",
    "dealerPrice": 48000,
    "msrp": 52000,
    "engine": "2.5L 4-Cylinder Hybrid",
    "horsepower": 243,
    "mpgCity": 36,
    "mpgHighway": 35,
    "transmission": "CVT",
    "exteriorColor": "Blueprint",
    "interiorColor": "Black Leather",
    "features": ["Toyota Safety Sense 2.5+", "Panoramic Moonroof", "Heated/Ventilated Seats", "Premium Audio", "Third Row Seating"],
    "location": {
      "city": "Dallas",
      "state": "TX"
    },
    "dealership": {
      "name": "Toyota of Dallas",
      "phone": "(214) 555-0789"
    },
    "status": "In Stock"
  },
  {
    "_id": "car_004",
    "make": "Toyota",
    "model": "GR Supra",
    "year": 2024,
    "trim": "3.0 Premium",
    "bodyStyle": "Coupe", 
    "drivetrain": "RWD",
    "fuelType": "Gasoline",
    "dealerPrice": 75000,
    "msrp": 80000,
    "engine": "3.0L Turbo I6",
    "horsepower": 382,
    "mpgCity": 23,
    "mpgHighway": 31,
    "transmission": "8-Speed Automatic",
    "exteriorColor": "Nitro Yellow",
    "interiorColor": "Black Alcantara",
    "features": ["Adaptive Variable Suspension", "Brembo Brakes", "Heads-Up Display", "Wireless CarPlay", "Sport Seats"],
    "location": {
      "city": "Los Angeles",
      "state": "CA"
    },
    "dealership": {
      "name": "Toyota of Hollywood",
      "phone": "(323) 555-0321"
    },
    "status": "In Stock"
  },
  {
    "_id": "car_005",
    "make": "Toyota",
    "model": "Corolla",
    "year": 2024,
    "trim": "LE",
    "bodyStyle": "Sedan",
    "drivetrain": "FWD", 
    "fuelType": "Hybrid",
    "dealerPrice": 28000,
    "msrp": 30000,
    "engine": "1.8L 4-Cylinder Hybrid",
    "horsepower": 121,
    "mpgCity": 53,
    "mpgHighway": 52,
    "transmission": "CVT",
    "exteriorColor": "Celestite Gray Metallic",
    "interiorColor": "Black Fabric",
    "features": ["Toyota Safety Sense 3.0", "Apple CarPlay", "Android Auto", "LED Headlights", "Automatic Climate Control"],
    "location": {
      "city": "Atlanta",
      "state": "GA"
    },
    "dealership": {
      "name": "Toyota of Atlanta",
      "phone": "(404) 555-0654"
    },
    "status": "In Stock"
  }
];
