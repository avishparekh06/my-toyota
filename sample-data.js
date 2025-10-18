// Sample car data for testing the API endpoints
const sampleCars = [
  {
    make: "Toyota",
    model: "Camry",
    year: 2024,
    trim: "LE",
    bodyType: "Sedan",
    engine: "2.5L 4-Cylinder",
    transmission: "Automatic",
    drivetrain: "FWD",
    fuelType: "Gasoline",
    mpg: {
      city: 28,
      highway: 39,
      combined: 32
    },
    price: {
      msrp: 26220,
      invoice: 24500,
      lease: {
        monthly: 299,
        downPayment: 2500,
        term: 36,
        mileage: 12000
      }
    },
    features: [
      {
        category: "Safety",
        items: ["Toyota Safety Sense 2.5+", "Blind Spot Monitor", "Rear Cross Traffic Alert"]
      },
      {
        category: "Technology",
        items: ["7-inch Touchscreen", "Apple CarPlay", "Android Auto", "WiFi Hotspot"]
      }
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1549317336-206569e8475c",
        alt: "2024 Toyota Camry LE",
        isPrimary: true
      }
    ],
    availability: {
      inStock: true,
      location: "Downtown Toyota",
      dealerId: "DT001"
    },
    specifications: {
      horsepower: 203,
      torque: 184,
      seating: 5,
      cargo: 15.1,
      towing: 0,
      groundClearance: 5.7
    },
    safety: {
      nhtsaRating: 5,
      iihsRating: "Top Safety Pick+",
      features: ["Forward Collision Warning", "Automatic Emergency Braking", "Lane Departure Warning"]
    },
    warranty: {
      basic: "3 years/36,000 miles",
      powertrain: "5 years/60,000 miles",
      hybrid: "8 years/100,000 miles"
    }
  },
  {
    make: "Toyota",
    model: "RAV4",
    year: 2024,
    trim: "XLE",
    bodyType: "SUV",
    engine: "2.5L 4-Cylinder",
    transmission: "Automatic",
    drivetrain: "AWD",
    fuelType: "Gasoline",
    mpg: {
      city: 27,
      highway: 35,
      combined: 30
    },
    price: {
      msrp: 31225,
      invoice: 29100,
      lease: {
        monthly: 349,
        downPayment: 3000,
        term: 36,
        mileage: 12000
      }
    },
    features: [
      {
        category: "Safety",
        items: ["Toyota Safety Sense 2.5+", "Blind Spot Monitor", "Rear Cross Traffic Alert", "360° Camera"]
      },
      {
        category: "Technology",
        items: ["8-inch Touchscreen", "Apple CarPlay", "Android Auto", "Wireless Charging"]
      }
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1549317336-206569e8475c",
        alt: "2024 Toyota RAV4 XLE",
        isPrimary: true
      }
    ],
    availability: {
      inStock: true,
      location: "Metro Toyota",
      dealerId: "MT002"
    },
    specifications: {
      horsepower: 203,
      torque: 184,
      seating: 5,
      cargo: 37.6,
      towing: 1500,
      groundClearance: 8.4
    },
    safety: {
      nhtsaRating: 5,
      iihsRating: "Top Safety Pick+",
      features: ["Forward Collision Warning", "Automatic Emergency Braking", "Lane Departure Warning", "Adaptive Cruise Control"]
    },
    warranty: {
      basic: "3 years/36,000 miles",
      powertrain: "5 years/60,000 miles",
      hybrid: "8 years/100,000 miles"
    }
  }
];

module.exports = sampleCars;
