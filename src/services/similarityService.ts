import cosineSimilarity from 'cosine-similarity';
import { UserEmbedding, CarEmbedding, RAGRecommendation } from './ragConfig';

/**
 * Calculate cosine similarity between two embedding vectors
 */
function calculateCosineSimilarity(embedding1: number[], embedding2: number[]): number {
  // Ensure embeddings are valid
  if (!embedding1 || !embedding2 || embedding1.length === 0 || embedding2.length === 0) {
    // Invalid embeddings provided to cosine similarity calculation
    return 0;
  }

  // Ensure embeddings have the same length
  const minLength = Math.min(embedding1.length, embedding2.length);
  const emb1 = embedding1.slice(0, minLength);
  const emb2 = embedding2.slice(0, minLength);

  const similarity = cosineSimilarity(emb1, emb2);
  
  // For feature vectors, cosine similarity can be negative
  // Normalize to 0-1 range for better interpretation
  const normalizedSimilarity = Math.max(0, similarity);
  
  // Add some minimum similarity to prevent 0% scores
  // This ensures that even dissimilar items get a small score
  const minSimilarity = 0.2; // Increased from 0.1 to 0.2 for better scores
  const finalSimilarity = Math.max(normalizedSimilarity, minSimilarity);
  
  // Cosine similarity calculation completed
  
  return finalSimilarity;
}

/**
 * Calculate budget fit score
 */
function calculateBudgetFit(userBudget: { min: number; max: number }, carMsrp: number): number {
  const { min, max } = userBudget;
  
  // Debug logging
  console.log('Budget fit calculation:', {
    userBudget: { min, max },
    carMsrp,
    budgetValid: !!(min && max && min > 0 && max > 0),
    carInRange: carMsrp >= min && carMsrp <= max
  });
  
  // Ensure we have valid budget values
  if (!min || !max || min <= 0 || max <= 0) {
    // Invalid budget values provided
    console.log('Invalid budget values - returning 0');
    return 0.0; // No score for invalid budget
  }
  
  // Perfect fit within budget
  if (carMsrp >= min && carMsrp <= max) {
    console.log('Car fits budget - returning 1.0');
    return 1.0;
  }
  
  // Outside budget range - return 0 score
  console.log('Car outside budget range - returning 0.0');
  return 0.0;
}

/**
 * Calculate location proximity score
 */
function calculateLocationProximity(userLocation: { city: string; state: string }, carLocation: { city: string; state: string }): number {
  // Ensure we have valid location data
  if (!userLocation || !carLocation || !userLocation.city || !carLocation.city) {
    // Invalid location data provided
    return 0.5; // Default moderate score
  }
  
  // Same city - perfect match
  if (userLocation.city.toLowerCase() === carLocation.city.toLowerCase() && 
      userLocation.state.toLowerCase() === carLocation.state.toLowerCase()) {
    return 1.0;
  }
  
  // Same state - good match
  if (userLocation.state.toLowerCase() === carLocation.state.toLowerCase()) {
    return 0.8; // Increased from 0.7
  }
  
  // Different state - lower score but not zero
  return 0.5; // Increased from 0.3
}

/**
 * Check if car passes initial filters
 */
function passesInitialFilters(
  user: any,
  car: any,
  filters: { MSRP_TOLERANCE: number; BODY_STYLE_MATCH: boolean }
): boolean {
  // Checking filters for car
  
  // MSRP tolerance filter
  if (filters.MSRP_TOLERANCE > 0 && user.budget) {
    const userBudgetCenter = (user.budget.min + user.budget.max) / 2;
    const tolerance = userBudgetCenter * filters.MSRP_TOLERANCE;
    const minAcceptable = userBudgetCenter - tolerance;
    const maxAcceptable = userBudgetCenter + tolerance;
    
    // Budget filter check
    
    if (car.msrp < minAcceptable || car.msrp > maxAcceptable) {
      // Car failed budget filter
      return false;
    }
  }
  
  // Body style preference filter
  if (filters.BODY_STYLE_MATCH && user.preferences?.bodyStyle) {
    const preferredBodyStyles = user.preferences.bodyStyle;
    // Body style filter check
    
    if (!preferredBodyStyles.includes(car.bodyStyle)) {
      // Car failed body style filter
      return false;
    }
  }
  
  // Car passed all initial filters
  return true;
}

/**
 * Calculate comprehensive similarity score
 */
function calculateComprehensiveScore(
  userEmbedding: UserEmbedding,
  carEmbedding: CarEmbedding,
  weights: { userPreferences: number; carFeatures: number; budgetFit: number; locationProximity: number }
): number {
  // Semantic similarity between user profile and car features
  const semanticSimilarity = calculateCosineSimilarity(userEmbedding.embedding, carEmbedding.embedding);
  
  // Ensure semantic similarity is non-negative (cosine similarity can be negative)
  const normalizedSemanticSimilarity = Math.max(0, semanticSimilarity);
  
  // Budget fit score
  const budgetFitScore = calculateBudgetFit(userEmbedding.budget, carEmbedding.msrp);
  
  // Location proximity score
  const locationScore = calculateLocationProximity(userEmbedding.location, carEmbedding.location);
  
  // Calculate weighted score with corrected weights
  // Use semantic similarity only once, combining user preferences and car features
  const combinedSemanticWeight = weights.userPreferences + weights.carFeatures;
  const weightedScore = 
    (normalizedSemanticSimilarity * combinedSemanticWeight) +
    (budgetFitScore * weights.budgetFit) +
    (locationScore * weights.locationProximity);
  
  // Normalize to ensure score is between 0 and 1
  const finalScore = Math.min(1.0, Math.max(0.0, weightedScore));
  
  // Comprehensive score calculation completed
  
  return finalScore;
}

/**
 * Main similarity matching service
 */
export class SimilarityService {
  /**
   * Find similar cars for a user
   */
  async findSimilarCars(
    userEmbedding: UserEmbedding,
    carEmbeddings: CarEmbedding[],
    user: any,
    cars: any[],
    filters: any,
    weights: any,
    maxResults: number = 5
  ): Promise<RAGRecommendation[]> {
    const recommendations: RAGRecommendation[] = [];
    
    // Starting findSimilarCars
    console.log('Budget filtering debug:', {
      budgetFilterEnabled: filters.BUDGET_FILTER,
      userBudget: userEmbedding.budget,
      totalCars: cars.length,
      sampleCarPrices: cars.slice(0, 3).map(c => ({ name: `${c.year} ${c.make} ${c.model}`, price: c.dealerPrice }))
    });
    
    // Show ALL cars - no filtering
    const filteredCars = cars; // Use all cars instead of filtering
    const filteredCarEmbeddings = carEmbeddings; // Use all embeddings
    
    // Showing all cars (no filtering applied)
    // Using all car embeddings
    
    // Calculate similarity scores for each car
    // Processing car embeddings for similarity calculation
    
    for (const carEmbedding of filteredCarEmbeddings) {
      const car = filteredCars.find(c => 
        (c._id === carEmbedding.carId) || (c.id === carEmbedding.carId)
      );
      
      if (!car) {
        // Car not found for embedding ID
        continue;
      }
      
      // Processing car
      
      const similarityScore = calculateComprehensiveScore(
        userEmbedding,
        carEmbedding,
        weights
      );
      
      const budgetFit = calculateBudgetFit(userEmbedding.budget, car.dealerPrice || car.msrp);
      const locationProximity = calculateLocationProximity(userEmbedding.location, carEmbedding.location);
      
      // Car similarity calculated
      
      // Check if car fits budget (if budget filtering is enabled)
      if (filters.BUDGET_FILTER && budgetFit === 0) {
        // Skip cars that don't fit budget
        console.log(`Skipping car ${car.year} ${car.make} ${car.model} - Budget fit: ${budgetFit}, Car price: $${car.dealerPrice || car.msrp}, User budget: $${userEmbedding.budget.min}-$${userEmbedding.budget.max}`);
        continue;
      }
      
      // Calculate detailed breakdown
      const semanticSimilarity = calculateCosineSimilarity(userEmbedding.embedding, carEmbedding.embedding);
      const breakdown = {
        semantic: semanticSimilarity * (weights.userPreferences + weights.carFeatures),
        budget: budgetFit * weights.budgetFit,
        location: locationProximity * weights.locationProximity
      };

      recommendations.push({
        car: `${car.year} ${car.make} ${car.model} ${car.trim}`,
        carData: car,
        similarityScore,
        budgetFit,
        locationProximity,
        semanticSimilarity,
        breakdown,
        explanation: '', // Will be filled by LLM service
        reasons: [] // Will be filled by LLM service
      });
    }
    
    // Sort by similarity score (highest first)
    recommendations.sort((a, b) => b.similarityScore - a.similarityScore);
    
    // Final recommendations calculated
    console.log(`Found ${recommendations.length} recommendations before filtering`);
    
    // Return top recommendations
    const finalResults = recommendations.slice(0, maxResults);
    console.log(`Returning ${finalResults.length} final recommendations`);
    
    return finalResults;
  }
  
  /**
   * Get similarity breakdown for debugging
   */
  getSimilarityBreakdown(
    userEmbedding: UserEmbedding,
    carEmbedding: CarEmbedding,
    weights: any
  ) {
    const semanticSimilarity = calculateCosineSimilarity(userEmbedding.embedding, carEmbedding.embedding);
    const budgetFit = calculateBudgetFit(userEmbedding.budget, carEmbedding.msrp);
    const locationProximity = calculateLocationProximity(userEmbedding.location, carEmbedding.location);
    
    return {
      semanticSimilarity,
      budgetFit,
      locationProximity,
      weightedScore: calculateComprehensiveScore(userEmbedding, carEmbedding, weights),
      breakdown: {
        semantic: semanticSimilarity * (weights.userPreferences + weights.carFeatures),
        budget: budgetFit * weights.budgetFit,
        location: locationProximity * weights.locationProximity
      }
    };
  }
}
