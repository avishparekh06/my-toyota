import cosineSimilarity from 'cosine-similarity';
import { UserEmbedding, CarEmbedding, RAGRecommendation } from './ragConfig';

/**
 * Calculate cosine similarity between two embedding vectors
 */
function calculateCosineSimilarity(embedding1: number[], embedding2: number[]): number {
  const similarity = cosineSimilarity(embedding1, embedding2);
  
  // For binary feature vectors, cosine similarity can be negative
  // Normalize to 0-1 range for better interpretation
  return Math.max(0, similarity);
}

/**
 * Calculate budget fit score
 */
function calculateBudgetFit(userBudget: { min: number; max: number }, carMsrp: number): number {
  const { min, max } = userBudget;
  
  // Perfect fit within budget
  if (carMsrp >= min && carMsrp <= max) {
    return 1.0;
  }
  
  // Under budget (still good, but not optimal)
  if (carMsrp < min) {
    const ratio = carMsrp / min;
    return Math.max(0.7, ratio); // Minimum 70% score for under budget
  }
  
  // Over budget (penalize but don't eliminate)
  if (carMsrp > max) {
    const ratio = max / carMsrp;
    return Math.max(0.3, ratio); // Minimum 30% score for over budget
  }
  
  return 0;
}

/**
 * Calculate location proximity score
 */
function calculateLocationProximity(userLocation: { city: string; state: string }, carLocation: { city: string; state: string }): number {
  // Same city - perfect match
  if (userLocation.city === carLocation.city && userLocation.state === carLocation.state) {
    return 1.0;
  }
  
  // Same state - good match
  if (userLocation.state === carLocation.state) {
    return 0.7;
  }
  
  // Different state - lower score
  return 0.3;
}

/**
 * Check if car passes initial filters
 */
function passesInitialFilters(
  user: any,
  car: any,
  filters: { MSRP_TOLERANCE: number; BODY_STYLE_MATCH: boolean }
): boolean {
  // MSRP tolerance filter (±10%)
  if (filters.MSRP_TOLERANCE > 0) {
    const userBudgetCenter = (user.budget.min + user.budget.max) / 2;
    const tolerance = userBudgetCenter * filters.MSRP_TOLERANCE;
    const minAcceptable = userBudgetCenter - tolerance;
    const maxAcceptable = userBudgetCenter + tolerance;
    
    if (car.msrp < minAcceptable || car.msrp > maxAcceptable) {
      return false;
    }
  }
  
  // Body style preference filter
  if (filters.BODY_STYLE_MATCH && user.preferences?.bodyStyle) {
    const preferredBodyStyles = user.preferences.bodyStyle;
    if (!preferredBodyStyles.includes(car.bodyStyle)) {
      return false;
    }
  }
  
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
  return Math.min(1.0, Math.max(0.0, weightedScore));
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
    
    // Filter cars based on initial criteria
    const filteredCars = cars.filter(car => 
      passesInitialFilters(user, car, filters)
    );
    
    // Get embeddings for filtered cars
    const filteredCarEmbeddings = carEmbeddings.filter(embedding =>
      filteredCars.some(car => car._id === embedding.carId || car.id === embedding.carId)
    );
    
    // Calculate similarity scores for each car
    for (const carEmbedding of filteredCarEmbeddings) {
      const car = filteredCars.find(c => 
        (c._id === carEmbedding.carId) || (c.id === carEmbedding.carId)
      );
      
      if (!car) continue;
      
      const similarityScore = calculateComprehensiveScore(
        userEmbedding,
        carEmbedding,
        weights
      );
      
      const budgetFit = calculateBudgetFit(userEmbedding.budget, carEmbedding.msrp);
      const locationProximity = calculateLocationProximity(userEmbedding.location, carEmbedding.location);
      
      // Only include cars above minimum similarity threshold
      if (similarityScore >= filters.MIN_SIMILARITY_SCORE) {
        recommendations.push({
          car: `${car.year} ${car.make} ${car.model} ${car.trim}`,
          carData: car,
          similarityScore,
          budgetFit,
          locationProximity,
          explanation: '', // Will be filled by LLM service
          reasons: [] // Will be filled by LLM service
        });
      }
    }
    
    // Sort by similarity score (highest first)
    recommendations.sort((a, b) => b.similarityScore - a.similarityScore);
    
    // Return top recommendations
    return recommendations.slice(0, maxResults);
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
