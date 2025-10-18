// Simplified recommendation engine
import { mockUsers, mockCars } from './mockData.js';

/**
 * Calculate compatibility score between user and car
 */
const calculateScore = (user, car) => {
  let score = 0;
  let factors = 0;

  // Body style match (40% weight)
  if (user.preferences.bodyStyle.includes(car.bodyStyle)) {
    score += 40;
  }
  factors += 40;

  // Drivetrain match (20% weight)
  if (user.preferences.drivetrain.includes(car.drivetrain)) {
    score += 20;
  }
  factors += 20;

  // Fuel type match (20% weight)
  if (user.preferences.fuelType.includes(car.fuelType)) {
    score += 20;
  }
  factors += 20;

  // Budget match (20% weight)
  if (car.dealerPrice >= user.budget.min && car.dealerPrice <= user.budget.max) {
    score += 20;
  } else if (car.dealerPrice < user.budget.min) {
    score += 10; // Partial credit for under budget
  }
  factors += 20;

  return factors > 0 ? (score / factors) : 0;
};

/**
 * Generate recommendations for a user
 */
export const getRecommendations = async (userId, limit = 5) => {
  console.log('Getting recommendations for user:', userId);
  
  const user = mockUsers.find(u => u._id === userId || u.id === userId);
  if (!user) {
    throw new Error(`User with ID ${userId} not found`);
  }

  console.log('Found user:', user.name);

  // Calculate scores for all cars
  const carScores = mockCars.map(car => ({
    car: `${car.year} ${car.make} ${car.model} ${car.trim}`,
    carData: car, // Include full car data
    score: calculateScore(user, car),
    reasons: generateReasons(user, car)
  }));

  // Sort by score and take top results
  const recommendations = carScores
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .filter(rec => rec.score > 0.1); // Only include cars with >10% match

  console.log('Generated recommendations:', recommendations.length);
  return recommendations;
};

/**
 * Generate reasons why a car matches the user
 */
const generateReasons = (user, car) => {
  const reasons = [];

  if (user.preferences.bodyStyle.includes(car.bodyStyle)) {
    reasons.push(`Perfect body style match: ${car.bodyStyle}`);
  }

  if (user.preferences.drivetrain.includes(car.drivetrain)) {
    reasons.push(`Matches your preferred drivetrain: ${car.drivetrain}`);
  }

  if (user.preferences.fuelType.includes(car.fuelType)) {
    reasons.push(`Eco-friendly ${car.fuelType} powertrain`);
  }

  if (car.dealerPrice >= user.budget.min && car.dealerPrice <= user.budget.max) {
    reasons.push(`Fits perfectly within your budget range`);
  } else if (car.dealerPrice < user.budget.min) {
    reasons.push(`Under budget - great value for money`);
  }

  if (user.location.city === car.location.city) {
    reasons.push(`Available locally in ${car.location.city}`);
  }

  return reasons;
};

/**
 * Get recommendations for all users
 */
export const getAllUserRecommendations = async (limit = 3) => {
  const results = {};
  
  for (const user of mockUsers) {
    try {
      const recommendations = await getRecommendations(user._id, limit);
      results[user._id] = recommendations;
    } catch (error) {
      console.error(`Error getting recommendations for ${user._id}:`, error);
      results[user._id] = [];
    }
  }
  
  return results;
};

/**
 * Get recommendations by user name
 */
export const getRecommendationsByName = async (name, limit = 3) => {
  const user = mockUsers.find(u => 
    u.name.toLowerCase().includes(name.toLowerCase())
  );
  
  if (!user) {
    throw new Error(`User with name "${name}" not found`);
  }
  
  return await getRecommendations(user._id, limit);
};
