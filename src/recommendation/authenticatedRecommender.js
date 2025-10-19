// Authenticated recommendation engine that uses real user data
import { mockCars } from './mockCars.js';
import { 
  calculateOverallScore, 
  sortCarsByScore, 
  filterLowScoreCars 
} from './scoringUtils.js';

/**
 * Transform authenticated user data to recommendation engine format
 * @param {Object} user - Authenticated user from AuthContext
 * @returns {Object} User data in recommendation engine format
 */
const transformUserData = (user) => {
  // Extract data from the user object - use the correct structure
  const personal = user.personal || {};
  const finance = user.finance || {};
  const preferences = user.preferences || {};
  
  // Build budget from available financial data
  const budget = {
    min: preferences.monthlyBudget ? preferences.monthlyBudget * 12 * 2 : 25000, // 2 years of monthly budget
    max: preferences.monthlyBudget ? preferences.monthlyBudget * 12 * 5 : 75000, // 5 years of monthly budget
    preferred: preferences.monthlyBudget ? preferences.monthlyBudget * 12 * 3 : 45000 // 3 years of monthly budget
  };

  // If we have annual income, use it to calculate budget
  if (finance.householdIncome || user.annualIncome) {
    const income = finance.householdIncome || user.annualIncome;
    budget.min = Math.max(budget.min, income * 0.3); // At least 30% of income
    budget.max = Math.min(budget.max, income * 0.8); // At most 80% of income
    budget.preferred = income * 0.5; // 50% of income as preferred
  }

  // Build preferences object from personal data
  const userPreferences = {
    bodyStyle: personal.buildPreferences && personal.buildPreferences.length > 0 
      ? personal.buildPreferences 
      : ['SUV', 'Sedan'], // Default to common options
    drivetrain: ['FWD', 'AWD'], // Default to common options
    fuelType: personal.fuelType ? [personal.fuelType] : ['Gas', 'Hybrid'],
    colorPreference: personal.color || 'Any',
    featurePreferences: personal.featurePreferences || []
  };

  // Handle fuel type mapping for Toyota vehicles (since they don't have EVs yet)
  if (personal.fuelType === 'EV') {
    // Map EV preference to Hybrid for Toyota vehicles
    userPreferences.fuelType = ['Hybrid'];
  }

  // Build driving habits from available data
  const drivingHabits = {
    dailyMiles: personal.avgCommuteDistance || 50,
    highwayPercentage: personal.avgCommuteDistance > 20 ? 60 : 30, // More highway if longer commute
    cityPercentage: personal.avgCommuteDistance > 20 ? 40 : 70, // More city if shorter commute
    cargoNeeds: personal.familyInfo > 2 ? 'High' : 'Low',
    passengerCount: personal.familyInfo || 1,
    parkingType: 'Street' // Default assumption
  };

  // Build lifestyle data
  const lifestyle = {
    family: personal.familyInfo > 1,
    pets: false, // Not tracked in current model
    outdoorActivities: false, // Not tracked in current model
    commute: personal.avgCommuteDistance > 0 ? 'Daily' : 'Occasional',
    weekendTrips: 'Occasional', // Default assumption
    purpose: personal.buyingFor || 'personal'
  };

  return {
    _id: user._id,
    id: user._id,
    name: `${user.firstName} ${user.lastName}`,
    age: user.age || 35,
    familySize: personal.familyInfo || 1,
    numberOfCarsOwned: 0, // Not tracked
    forWhom: personal.buyingFor || 'self',
    averageDrivingDistance: personal.avgCommuteDistance || 50,
    commuteType: personal.avgCommuteDistance > 30 ? 'highway' : 'city',
    location: {
      city: user.location?.city || 'Unknown',
      state: user.location?.state || 'Unknown',
      zip: user.location?.zip || '00000'
    },
    preferences: userPreferences,
    budget: budget,
    financial: {
      annualIncome: finance.householdIncome || user.annualIncome || 50000,
      downPayment: preferences.downPayment || 0,
      tradeInValue: 0, // Not tracked
      financingPreference: finance.financeOrLease || preferences.purchaseType || 'Finance',
      termPreference: preferences.preferredTermMonths || 60,
      creditScore: finance.creditScore || user.creditScore || 700
    },
    drivingHabits: drivingHabits,
    lifestyle: lifestyle,
    preferredMakes: ['Toyota']
  };
};

/**
 * Get recommendations for authenticated user
 * @param {Object} user - Authenticated user from AuthContext
 * @param {number} limit - Maximum number of recommendations to return (default: 5)
 * @param {number} minScore - Minimum score threshold for recommendations (default: 20)
 * @returns {Object} Recommendation results with top cars and scoring details
 */
export const getAuthenticatedRecommendations = (user, limit = 5, minScore = 20) => {
  if (!user) {
    throw new Error('User must be authenticated to get recommendations');
  }

  // Transform user data to recommendation engine format
  const transformedUser = transformUserData(user);
  
  // Debug logging to help understand the transformation
  console.log('🔍 User data transformation:', {
    originalUser: {
      personal: user.personal,
      finance: user.finance,
      preferences: user.preferences
    },
    transformedUser: {
      name: transformedUser.name,
      budget: transformedUser.budget,
      preferences: transformedUser.preferences,
      drivingHabits: transformedUser.drivingHabits,
      lifestyle: transformedUser.lifestyle
    }
  });
  
  // Calculate scores for all cars
  const carsWithScores = mockCars.map(car => {
    const score = calculateOverallScore(car, transformedUser);
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
      id: transformedUser._id,
      name: transformedUser.name,
      location: transformedUser.location,
      budget: transformedUser.budget,
      preferences: transformedUser.preferences
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
      reasons: generateRecommendationReasons(item.car, transformedUser, item.score.breakdown)
    })),
    statistics: stats,
    totalCarsAnalyzed: mockCars.length,
    carsFiltered: carsWithScores.length - filteredCars.length,
    recommendationsReturned: topRecommendations.length
  };
};

/**
 * Generate human-readable reasons for recommendations
 * @param {Object} car - Car object
 * @param {Object} user - Transformed user object
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
    const topFeatures = user.preferences.featurePreferences?.slice(0, 2) || [];
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
 * Get recommendation summary for authenticated user
 * @param {Object} user - Authenticated user from AuthContext
 * @returns {Object} Summary of recommendations
 */
export const getAuthenticatedRecommendationSummary = (user) => {
  const recommendations = getAuthenticatedRecommendations(user, 5);
  
  return {
    user: recommendations.user,
    topCar: recommendations.recommendations[0],
    averageScore: recommendations.statistics.averageScore,
    totalOptions: recommendations.totalCarsAnalyzed,
    qualityDistribution: recommendations.statistics.scoreDistribution
  };
};
