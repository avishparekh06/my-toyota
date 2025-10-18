// Helper functions for calculating recommendation scores using weighted algorithms

/**
 * Calculate budget compatibility score (0-100)
 * Higher score for cars closer to user's preferred budget
 */
export const calculateBudgetScore = (car, userBudget) => {
  const carPrice = car.dealerPrice;
  const { min, max, preferred } = userBudget;
  
  // If car is outside budget range, return 0
  if (carPrice < min || carPrice > max) {
    return 0;
  }
  
  // Calculate distance from preferred budget
  const distanceFromPreferred = Math.abs(carPrice - preferred);
  const budgetRange = max - min;
  const normalizedDistance = distanceFromPreferred / budgetRange;
  
  // Score decreases as distance from preferred increases
  return Math.max(0, 100 - (normalizedDistance * 100));
};

/**
 * Calculate body style preference score (0-100)
 */
export const calculateBodyStyleScore = (car, userPreferences) => {
  const preferredBodyStyles = userPreferences.bodyStylePreference || userPreferences.bodyStyle || [];
  if (preferredBodyStyles.length === 0) return 50; // Neutral score if no preference
  
  const carBodyStyle = car.bodyStyle.toLowerCase();
  const isPreferred = preferredBodyStyles.some(style => 
    style.toLowerCase() === carBodyStyle
  );
  
  return isPreferred ? 100 : 0;
};

/**
 * Calculate fuel type preference score (0-100)
 */
export const calculateFuelTypeScore = (car, userPreferences) => {
  const preferredFuelTypes = userPreferences.fuelTypePreference || userPreferences.fuelType || [];
  if (preferredFuelTypes.length === 0) return 50; // Neutral score if no preference
  
  const carFuelType = car.fuelType.toLowerCase();
  const isPreferred = preferredFuelTypes.some(fuel => 
    fuel.toLowerCase() === carFuelType
  );
  
  return isPreferred ? 100 : 0;
};

/**
 * Calculate drivetrain preference score (0-100)
 */
export const calculateDrivetrainScore = (car, userPreferences) => {
  const preferredDrivetrains = userPreferences.drivetrainPreference || userPreferences.drivetrain || [];
  if (preferredDrivetrains.length === 0) return 50; // Neutral score if no preference
  
  const carDrivetrain = car.drivetrain.toLowerCase();
  const isPreferred = preferredDrivetrains.some(drive => 
    drive.toLowerCase() === carDrivetrain
  );
  
  return isPreferred ? 100 : 0;
};

/**
 * Calculate driving habits compatibility score (0-100)
 */
export const calculateDrivingHabitsScore = (car, userHabits) => {
  let score = 0;
  const factors = [];
  
  // Fuel efficiency for daily miles
  const dailyMiles = userHabits.averageDrivingDistance || userHabits.dailyMiles || 0;
  const mpg = (car.mpgCity + car.mpgHighway) / 2;
  
  if (dailyMiles > 50) {
    // High daily miles - prioritize fuel efficiency
    if (mpg > 40) score += 30;
    else if (mpg > 30) score += 20;
    else if (mpg > 20) score += 10;
    factors.push(`Fuel efficiency for ${dailyMiles} daily miles`);
  } else if (dailyMiles > 25) {
    // Medium daily miles - moderate fuel efficiency
    if (mpg > 35) score += 25;
    else if (mpg > 25) score += 15;
    else if (mpg > 15) score += 5;
    factors.push(`Moderate fuel efficiency for ${dailyMiles} daily miles`);
  } else {
    // Low daily miles - less critical
    score += 15;
    factors.push(`Low daily miles (${dailyMiles}) - fuel efficiency less critical`);
  }
  
  // Highway vs city driving
  const commuteType = userHabits.commuteType || 'mixed';
  const highwayPercentage = userHabits.highwayPercentage || (commuteType === 'highway' ? 70 : commuteType === 'city' ? 20 : 50);
  
  if (commuteType === 'highway' || highwayPercentage > 60) {
    // Highway driving - prioritize highway MPG
    if (car.mpgHighway > 35) score += 20;
    else if (car.mpgHighway > 25) score += 10;
    factors.push(`Highway driving (${commuteType}) - good highway MPG`);
  } else if (commuteType === 'city' || highwayPercentage < 40) {
    // City driving - prioritize city MPG
    if (car.mpgCity > 30) score += 20;
    else if (car.mpgCity > 20) score += 10;
    factors.push(`City driving (${commuteType}) - good city MPG`);
  } else {
    // Mixed driving
    score += 15;
    factors.push(`Mixed driving (${commuteType})`);
  }
  
  // Cargo needs
  const cargoNeeds = userHabits.cargoNeeds || 'Low';
  const carCargoCapacity = car.cargoCapacity || 'Low';
  
  const cargoScore = {
    'Low': { 'Low': 20, 'Medium': 15, 'High': 10, 'Very High': 5 },
    'Medium': { 'Low': 10, 'Medium': 20, 'High': 15, 'Very High': 10 },
    'High': { 'Low': 5, 'Medium': 10, 'High': 20, 'Very High': 15 },
    'Very High': { 'Low': 0, 'Medium': 5, 'High': 15, 'Very High': 20 }
  };
  
  score += cargoScore[cargoNeeds]?.[carCargoCapacity] || 10;
  factors.push(`Cargo needs: ${cargoNeeds} vs car capacity: ${carCargoCapacity}`);
  
  return Math.min(100, score);
};

/**
 * Calculate lifestyle compatibility score (0-100)
 */
export const calculateLifestyleScore = (car, userLifestyle) => {
  let score = 0;
  const factors = [];
  
  // Family considerations
  if (userLifestyle.family) {
    if (car.familyFriendly === 'Very High') score += 25;
    else if (car.familyFriendly === 'High') score += 20;
    else if (car.familyFriendly === 'Medium') score += 10;
    else score += 0;
    factors.push(`Family-friendly: ${car.familyFriendly}`);
  } else {
    // Non-family users might prefer sportier options
    if (car.familyFriendly === 'None' || car.familyFriendly === 'Low') score += 15;
    factors.push(`Non-family user - sportier options preferred`);
  }
  
  // Outdoor activities
  if (userLifestyle.outdoorActivities) {
    if (car.offRoadCapability === 'Very High') score += 20;
    else if (car.offRoadCapability === 'High') score += 15;
    else if (car.offRoadCapability === 'Medium') score += 10;
    else score += 5;
    factors.push(`Outdoor activities - off-road capability: ${car.offRoadCapability}`);
  }
  
  // Pet considerations
  if (userLifestyle.pets) {
    if (car.cargoCapacity === 'High' || car.cargoCapacity === 'Very High') score += 15;
    else if (car.cargoCapacity === 'Medium') score += 10;
    else score += 5;
    factors.push(`Pet owner - cargo space: ${car.cargoCapacity}`);
  }
  
  // Weekend trips
  if (userLifestyle.weekendTrips === 'Frequent') {
    if (car.cargoCapacity === 'High' || car.cargoCapacity === 'Very High') score += 15;
    else if (car.cargoCapacity === 'Medium') score += 10;
    factors.push(`Frequent weekend trips - cargo space: ${car.cargoCapacity}`);
  }
  
  return Math.min(100, score);
};

/**
 * Calculate feature preference score (0-100)
 */
export const calculateFeatureScore = (car, userPreferences) => {
  const preferredFeatures = userPreferences.featurePreferences || userPreferences.features || [];
  if (preferredFeatures.length === 0) return 50; // Neutral score if no preference
  
  let score = 0;
  const factors = [];
  
  // Map user preferences to car attributes
  const featureMapping = {
    'Safety': 'safety',
    'Safety Sense': 'safety',
    'Technology': 'technology',
    'Comfort': 'comfort',
    'Performance': 'performance',
    'Efficiency': 'fuelEfficiency',
    'Luxury': 'comfort', // Map luxury to comfort
    'Reliability': 'reliability',
    'Towing': 'towingCapacity',
    'Off-road': 'offRoadCapability',
    'Family': 'familyFriendly',
    'Wireless CarPlay': 'technology',
    'Heated Seats': 'comfort',
    'Blind Spot Monitor': 'safety',
    'Power Liftgate': 'convenience',
    'Captain\'s Chairs': 'comfort',
    'Leather Seats': 'comfort',
    'Panoramic Roof': 'luxury',
    'JBL Audio': 'technology',
    'Advanced Park Assist': 'technology',
    '14-Inch Touchscreen': 'technology',
    'Sport Seats': 'performance',
    'Apple CarPlay': 'technology',
    'Android Auto': 'technology'
  };
  
  preferredFeatures.forEach(feature => {
    const carAttribute = featureMapping[feature];
    if (carAttribute && car[carAttribute]) {
      const attributeValue = car[carAttribute];
      let attributeScore = 0;
      
      // Score based on attribute level
      if (attributeValue === 'Very High') attributeScore = 25;
      else if (attributeValue === 'High') attributeScore = 20;
      else if (attributeValue === 'Medium') attributeScore = 15;
      else if (attributeValue === 'Low') attributeScore = 10;
      else if (attributeValue === 'None') attributeScore = 0;
      else if (typeof attributeValue === 'number' && attributeValue > 0) {
        // For numeric values like towing capacity
        attributeScore = Math.min(25, attributeValue / 1000);
      }
      
      score += attributeScore;
      factors.push(`${feature}: ${attributeValue} (${attributeScore} points)`);
    }
  });
  
  return Math.min(100, score);
};

/**
 * Calculate location compatibility score (0-100)
 * Prefer cars available in user's location
 */
export const calculateLocationScore = (car, userLocation) => {
  if (!userLocation) return 50; // Neutral if no location specified
  
  const carLocation = car.location?.city?.toLowerCase();
  const userCity = userLocation.city?.toLowerCase() || userLocation.toLowerCase();
  
  if (carLocation === userCity) {
    return 100; // Perfect match
  } else {
    return 50; // Neutral for different locations
  }
};

/**
 * Calculate overall recommendation score using weighted algorithm
 */
export const calculateOverallScore = (car, user) => {
  const weights = {
    budget: 0.25,        // 25% - Most important
    bodyStyle: 0.15,     // 15%
    fuelType: 0.10,      // 10%
    drivetrain: 0.10,    // 10%
    drivingHabits: 0.15, // 15%
    lifestyle: 0.10,     // 10%
    features: 0.10,      // 10%
    location: 0.05       // 5%
  };
  
  const scores = {
    budget: calculateBudgetScore(car, user.budget),
    bodyStyle: calculateBodyStyleScore(car, user.preferences),
    fuelType: calculateFuelTypeScore(car, user.preferences),
    drivetrain: calculateDrivetrainScore(car, user.preferences),
    drivingHabits: calculateDrivingHabitsScore(car, user.drivingHabits),
    lifestyle: calculateLifestyleScore(car, user.lifestyle),
    features: calculateFeatureScore(car, user.preferences),
    location: calculateLocationScore(car, user.location)
  };
  
  // Calculate weighted average
  let totalScore = 0;
  let totalWeight = 0;
  
  Object.keys(weights).forEach(key => {
    const weight = weights[key];
    const score = scores[key];
    totalScore += score * weight;
    totalWeight += weight;
  });
  
  const finalScore = totalWeight > 0 ? totalScore / totalWeight : 0;
  
  return {
    overall: Math.round(finalScore),
    breakdown: scores,
    weights: weights
  };
};

/**
 * Sort cars by recommendation score (highest first)
 */
export const sortCarsByScore = (carsWithScores) => {
  return carsWithScores.sort((a, b) => b.score.overall - a.score.overall);
};

/**
 * Filter out cars with very low scores (below threshold)
 */
export const filterLowScoreCars = (carsWithScores, threshold = 20) => {
  return carsWithScores.filter(car => car.score.overall >= threshold);
};
