// Mock car dataset imported from JSON for MongoDB compatibility
import carsData from './cars.json' with { type: 'json' };

// Export the cars data
export const mockCars = carsData;

// Helper function to get car by ID
export const getCarById = (carId) => {
  return mockCars.find(car => car._id === carId || car.id === carId);
};

// Helper function to get all cars
export const getAllCars = () => {
  return mockCars;
};

// Helper function to get cars by category
export const getCarsByCategory = (category) => {
  return mockCars.filter(car => car.category === category);
};

// Helper function to get cars within budget range
export const getCarsInBudget = (minPrice, maxPrice) => {
  return mockCars.filter(car => car.dealerPrice >= minPrice && car.dealerPrice <= maxPrice);
};

// Helper function to get cars by location
export const getCarsByLocation = (city, state) => {
  return mockCars.filter(car => 
    car.location.city.toLowerCase() === city.toLowerCase() && 
    car.location.state.toLowerCase() === state.toLowerCase()
  );
};

// Helper function to get cars by fuel type
export const getCarsByFuelType = (fuelType) => {
  return mockCars.filter(car => car.fuelType.toLowerCase() === fuelType.toLowerCase());
};

// Helper function to get cars by body style
export const getCarsByBodyStyle = (bodyStyle) => {
  return mockCars.filter(car => car.bodyStyle.toLowerCase() === bodyStyle.toLowerCase());
};
