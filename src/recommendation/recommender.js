// Main recommendation engine for Toyota cars
import { mockUsers } from './mockUsers.js';
import { carsApi } from '../services/api.js';
import { 
  calculateOverallScore, 
  sortCarsByScore, 
  filterLowScoreCars 
} from './scoringUtils.js';

/**
 * Main recommendation function
 * @param {number} userId - ID of the user to get recommendations for
 * @param {number} limit - Maximum number of recommendations to return (default: 5)
 * @param {number} minScore - Minimum score threshold for recommendations (default: 20)
 * @returns {Object} Recommendation results with top cars and scoring details
 */
export const getRecommendations = async (userId, limit = 5, minScore = 20) => {
  // Get user data - support both _id and id
  const user = mockUsers.find(u => u._id === userId || u.id === userId);
  if (!user) {
    throw new Error(`User with ID ${userId} not found`);
  }

  // Fetch real car data from the database
  const carsResponse = await carsApi.getCars({ 
    limit: 1000, // Get all cars
    status: 'In Stock' // Only get available cars
  });
  
  if (!carsResponse.success || !carsResponse.data) {
    throw new Error('Failed to fetch car data from database');
  }
  
  const realCars = carsResponse.data;
  
  // Calculate scores for all cars
  const carsWithScores = realCars.map(car => {
    const score = calculateOverallScore(car, user);
    return {
      car: car,
      score: score
    };
  });
  
  // Filter out low-scoring cars
  const filteredCars = filterLowScoreCars(carsWithScores, minScore);
  
  // Sort by score (highest first)
  const sortedCars = sortCarsByScore(filteredCars);
  
  // Get top recommendations
  const topRecommendations = sortedCars.slice(0, limit);
  
  // Calculate recommendation statistics
  const stats = calculateRecommendationStats(carsWithScores, topRecommendations);
  
  return {
    user: {
      id: user._id || user.id,
      name: user.name,
      location: user.location,
      budget: user.budget
    },
    recommendations: topRecommendations.map(item => ({
      car: {
        id: item.car._id || item.car.id,
        year: item.car.year,
        make: item.car.make,
        model: item.car.model,
        trim: item.car.trim,
        bodyStyle: item.car.bodyStyle,
        fuelType: item.car.fuelType,
        drivetrain: item.car.drivetrain,
        mpgCity: item.car.mpgCity,
        mpgHighway: item.car.mpgHighway,
        msrp: item.car.msrp,
        dealerPrice: item.car.dealerPrice,
        features: item.car.features,
        category: item.car.category,
        location: item.car.location,
        safetyRating: item.car.safetyRating,
        reliabilityScore: item.car.reliabilityScore,
        fuelEconomyScore: item.car.fuelEconomyScore
      },
      score: item.score.overall,
      scoreBreakdown: item.score.breakdown,
      reasons: generateRecommendationReasons(item.car, user, item.score.breakdown)
    })),
    statistics: stats,
    totalCarsAnalyzed: realCars.length,
    carsFiltered: carsWithScores.length - filteredCars.length,
    recommendationsReturned: topRecommendations.length
  };
};

/**
 * Get recommendations for all users
 * @param {number} limit - Maximum number of recommendations per user (default: 5)
 * @returns {Array} Array of recommendation results for all users
 */
export const getAllUserRecommendations = (limit = 5) => {
  return mockUsers.map(user => getRecommendations(user.id, limit));
};

/**
 * Get recommendations for a specific user by name
 * @param {string} userName - Name of the user
 * @param {number} limit - Maximum number of recommendations (default: 5)
 * @returns {Object} Recommendation results for the user
 */
export const getRecommendationsByName = (userName, limit = 5) => {
  const user = mockUsers.find(u => 
    u.name.toLowerCase().includes(userName.toLowerCase())
  );
  
  if (!user) {
    throw new Error(`User with name "${userName}" not found`);
  }
  
  return getRecommendations(user.id, limit);
};

/**
 * Get recommendations based on custom criteria
 * @param {Object} criteria - Custom search criteria
 * @param {number} limit - Maximum number of recommendations (default: 5)
 * @returns {Object} Recommendation results based on custom criteria
 */
export const getCustomRecommendations = (criteria, limit = 5) => {
  const customUser = {
    id: 999,
    name: "Custom Search",
    location: criteria.location || "Unknown",
    budget: criteria.budget || { min: 0, max: 100000, preferred: 50000 },
    preferences: criteria.preferences || {},
    drivingHabits: criteria.drivingHabits || {},
    lifestyle: criteria.lifestyle || {}
  };
  
  return getRecommendations(999, limit);
};

/**
 * Generate human-readable reasons for recommendations
 * @param {Object} car - Car object
 * @param {Object} user - User object
 * @param {Object} scoreBreakdown - Score breakdown object
 * @returns {Array} Array of reason strings
 */
const generateRecommendationReasons = (car, user, scoreBreakdown) => {
  const reasons = [];
  
  // Budget reasons
  if (scoreBreakdown.budget >= 80) {
    reasons.push(`Great value at $${car.dealerPrice.toLocaleString()} - within your budget`);
  } else if (scoreBreakdown.budget >= 60) {
    reasons.push(`Good price at $${car.dealerPrice.toLocaleString()} - close to your preferred budget`);
  }
  
  // Body style reasons
  if (scoreBreakdown.bodyStyle === 100) {
    reasons.push(`Perfect body style match: ${car.bodyStyle}`);
  }
  
  // Fuel type reasons
  if (scoreBreakdown.fuelType === 100) {
    reasons.push(`Matches your preferred fuel type: ${car.fuelType}`);
  }
  
  // Driving habits reasons
  if (scoreBreakdown.drivingHabits >= 80) {
    const avgMpg = Math.round((car.mpgCity + car.mpgHighway) / 2);
    reasons.push(`Excellent fuel efficiency (${avgMpg} MPG) for your driving habits`);
  }
  
  // Lifestyle reasons
  if (scoreBreakdown.lifestyle >= 80) {
    if (user.lifestyle.family && car.familyFriendly === 'Very High') {
      reasons.push(`Perfect for families with excellent family-friendly features`);
    } else if (user.lifestyle.outdoorActivities && car.offRoadCapability === 'Very High') {
      reasons.push(`Great for outdoor activities with excellent off-road capability`);
    }
  }
  
  // Feature reasons
  if (scoreBreakdown.features >= 80) {
    const topFeatures = user.preferences.features?.slice(0, 2) || [];
    if (topFeatures.length > 0) {
      reasons.push(`Strong match for your preferred features: ${topFeatures.join(', ')}`);
    }
  }
  
  // Location reasons
  if (scoreBreakdown.location === 100) {
    reasons.push(`Available at a local dealership in ${car.location.city}`);
  }
  
  // Fallback reasons if no specific reasons generated
  if (reasons.length === 0) {
    reasons.push(`Good overall match based on your preferences and needs`);
  }
  
  return reasons;
};

/**
 * Calculate recommendation statistics
 * @param {Array} allCarsWithScores - All cars with their scores
 * @param {Array} topRecommendations - Top recommended cars
 * @returns {Object} Statistics object
 */
const calculateRecommendationStats = (allCarsWithScores, topRecommendations) => {
  const allScores = allCarsWithScores.map(item => item.score.overall);
  const topScores = topRecommendations.map(item => item.score.overall);
  
  return {
    averageScore: Math.round(allScores.reduce((sum, score) => sum + score, 0) / allScores.length),
    highestScore: Math.max(...allScores),
    lowestScore: Math.min(...allScores),
    topRecommendationAverage: Math.round(topScores.reduce((sum, score) => sum + score, 0) / topScores.length),
    scoreDistribution: {
      excellent: allScores.filter(score => score >= 80).length,
      good: allScores.filter(score => score >= 60 && score < 80).length,
      fair: allScores.filter(score => score >= 40 && score < 60).length,
      poor: allScores.filter(score => score < 40).length
    }
  };
};

/**
 * Get recommendation summary for a user
 * @param {number} userId - User ID
 * @returns {Object} Summary of recommendations
 */
export const getRecommendationSummary = (userId) => {
  const recommendations = getRecommendations(userId, 5);
  
  return {
    user: recommendations.user,
    topCar: recommendations.recommendations[0],
    averageScore: recommendations.statistics.averageScore,
    totalOptions: recommendations.totalCarsAnalyzed,
    qualityDistribution: recommendations.statistics.scoreDistribution
  };
};

/**
 * Compare two users' recommendations
 * @param {number} userId1 - First user ID
 * @param {number} userId2 - Second user ID
 * @returns {Object} Comparison results
 */
export const compareUserRecommendations = (userId1, userId2) => {
  const rec1 = getRecommendations(userId1, 5);
  const rec2 = getRecommendations(userId2, 5);
  
  const commonCars = rec1.recommendations.filter(rec1Item => 
    rec2.recommendations.some(rec2Item => rec2Item.car.id === rec1Item.car.id)
  );
  
  return {
    user1: rec1.user,
    user2: rec2.user,
    commonRecommendations: commonCars.length,
    commonCars: commonCars.map(item => ({
      car: item.car,
      user1Score: item.score,
      user2Score: rec2.recommendations.find(r => r.car.id === item.car.id)?.score || 0
    })),
    uniqueToUser1: rec1.recommendations.filter(rec1Item => 
      !rec2.recommendations.some(rec2Item => rec2Item.car.id === rec1Item.car.id)
    ).length,
    uniqueToUser2: rec2.recommendations.filter(rec2Item => 
      !rec1.recommendations.some(rec1Item => rec1Item.car.id === rec2Item.car.id)
    ).length
  };
};
