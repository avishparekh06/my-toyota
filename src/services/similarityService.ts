import cosineSimilarity from 'cosine-similarity';
import { UserEmbedding, CarEmbedding, RAGRecommendation } from './ragConfig';

/**
 * Calculate cosine similarity between two embedding vectors
 */
function calculateCosineSimilarity(embedding1: number[], embedding2: number[]): number {
  // Ensure embeddings are valid
  if (!embedding1 || !embedding2 || embedding1.length === 0 || embedding2.length === 0) {
    console.warn('Invalid embeddings provided to cosine similarity calculation');
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
  
  console.log('Cosine similarity calculation:', {
    original: similarity,
    normalized: normalizedSimilarity,
    final: finalSimilarity,
    embedding1Length: embedding1.length,
    embedding2Length: embedding2.length
  });
  
  return finalSimilarity;
}

/**
 * Calculate budget fit score
 */
function calculateBudgetFit(userBudget: { min: number; max: number }, carMsrp: number): number {
  const { min, max } = userBudget;
  
  // Ensure we have valid budget values
  if (!min || !max || min <= 0 || max <= 0) {
    console.warn('Invalid budget values:', { min, max });
    return 0.5; // Default moderate score
  }
  
  // Perfect fit within budget
  if (carMsrp >= min && carMsrp <= max) {
    return 1.0;
  }
  
  // Under budget (still good, but not optimal)
  if (carMsrp < min) {
    const ratio = carMsrp / min;
    return Math.max(0.6, ratio); // Minimum 60% score for under budget
  }
  
  // Over budget (penalize but don't eliminate)
  if (carMsrp > max) {
    const ratio = max / carMsrp;
    return Math.max(0.4, ratio); // Minimum 40% score for over budget
  }
  
  return 0.5; // Default moderate score
}

/**
 * Calculate location proximity score
 */
function calculateLocationProximity(userLocation: { city: string; state: string }, carLocation: { city: string; state: string }): number {
  // Ensure we have valid location data
  if (!userLocation || !carLocation || !userLocation.city || !carLocation.city) {
    console.warn('Invalid location data:', { userLocation, carLocation });
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
  console.log(`Checking filters for car: ${car.year} ${car.make} ${car.model}`);
  
  // MSRP tolerance filter
  if (filters.MSRP_TOLERANCE > 0 && user.budget) {
    const userBudgetCenter = (user.budget.min + user.budget.max) / 2;
    const tolerance = userBudgetCenter * filters.MSRP_TOLERANCE;
    const minAcceptable = userBudgetCenter - tolerance;
    const maxAcceptable = userBudgetCenter + tolerance;
    
    console.log(`Budget filter: Car MSRP ${car.msrp}, User budget center ${userBudgetCenter}, Acceptable range ${minAcceptable}-${maxAcceptable}`);
    
    if (car.msrp < minAcceptable || car.msrp > maxAcceptable) {
      console.log(`Car ${car.year} ${car.make} ${car.model} failed budget filter`);
      return false;
    }
  }
  
  // Body style preference filter
  if (filters.BODY_STYLE_MATCH && user.preferences?.bodyStyle) {
    const preferredBodyStyles = user.preferences.bodyStyle;
    console.log(`Body style filter: Car body style ${car.bodyStyle}, User preferences ${preferredBodyStyles}`);
    
    if (!preferredBodyStyles.includes(car.bodyStyle)) {
      console.log(`Car ${car.year} ${car.make} ${car.model} failed body style filter`);
      return false;
    }
  }
  
  console.log(`Car ${car.year} ${car.make} ${car.model} passed all initial filters`);
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
  
  console.log('Comprehensive score calculation:', {
    carId: carEmbedding.carId,
    semanticSimilarity,
    normalizedSemanticSimilarity,
    budgetFitScore,
    locationScore,
    weights,
    combinedSemanticWeight,
    weightedScore,
    finalScore
  });
  
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
    
    console.log('Starting findSimilarCars with:', {
      userEmbeddingId: userEmbedding.userId,
      carEmbeddingsCount: carEmbeddings.length,
      carsCount: cars.length,
      userData: {
        id: user._id || user.id,
        name: user.name,
        budget: user.budget,
        preferences: user.preferences
      }
    });
    
    // Show ALL cars - no filtering
    const filteredCars = cars; // Use all cars instead of filtering
    const filteredCarEmbeddings = carEmbeddings; // Use all embeddings
    
    console.log(`Showing ALL cars: ${filteredCars.length} cars (no filtering applied)`);
    console.log(`Using ALL car embeddings: ${filteredCarEmbeddings.length} embeddings`);
    
    // Calculate similarity scores for each car
    console.log(`Processing ${filteredCarEmbeddings.length} car embeddings for similarity calculation...`);
    
    for (const carEmbedding of filteredCarEmbeddings) {
      const car = filteredCars.find(c => 
        (c._id === carEmbedding.carId) || (c.id === carEmbedding.carId)
      );
      
      if (!car) {
        console.warn(`Car not found for embedding ID: ${carEmbedding.carId}`);
        continue;
      }
      
      console.log(`Processing car: ${car.year} ${car.make} ${car.model} (ID: ${car._id || car.id})`);
      
      const similarityScore = calculateComprehensiveScore(
        userEmbedding,
        carEmbedding,
        weights
      );
      
      const budgetFit = calculateBudgetFit(userEmbedding.budget, carEmbedding.msrp);
      const locationProximity = calculateLocationProximity(userEmbedding.location, carEmbedding.location);
      
      console.log(`Car ${car.year} ${car.make} ${car.model} - Similarity: ${Math.round(similarityScore * 100)}%, Budget: ${Math.round(budgetFit * 100)}%, Location: ${Math.round(locationProximity * 100)}%`);
      
      // Include ALL cars regardless of similarity score
      console.log(`Including car ${car.year} ${car.make} ${car.model} (showing all cars)`);
      
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
    
    console.log(`Final recommendations: ${recommendations.length} cars found`);
    recommendations.forEach((rec, index) => {
      console.log(`${index + 1}. ${rec.car} - ${Math.round(rec.similarityScore * 100)}% match`);
    });
    
    // Return top recommendations
    const finalResults = recommendations.slice(0, maxResults);
    console.log(`Returning top ${finalResults.length} recommendations`);
    
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
