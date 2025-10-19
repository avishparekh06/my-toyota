// RAG-based recommendation engine for Toyota cars
import { EmbeddingService } from '../services/embeddingService';
import { SimilarityService } from '../services/similarityService';
import { LLMExplanationService } from '../services/llmExplanationService';
import { RAG_CONFIG } from '../services/ragConfig';
// @ts-ignore - mockData.js doesn't have TypeScript declarations
import { mockUsers, mockCars } from './mockData';
import { authApi } from '../services/api';

/**
 * RAG-based recommendation engine
 */
export class RAGRecommender {
  private embeddingService: EmbeddingService;
  private similarityService: SimilarityService;
  private llmService: LLMExplanationService;
  private userEmbeddings: Map<string, any>;
  private carEmbeddings: Map<string, any>;
  private initialized: boolean;

  constructor() {
    this.embeddingService = EmbeddingService.getInstance();
    this.similarityService = new SimilarityService();
    this.llmService = LLMExplanationService.getInstance();
    this.userEmbeddings = new Map();
    this.carEmbeddings = new Map();
    this.initialized = false;
  }

  /**
   * Initialize embeddings for all users and cars
   */
  async initialize() {
    if (this.initialized) return;

    console.log('Initializing RAG system...');
    console.log(`Found ${mockUsers.length} mock users and ${mockCars.length} mock cars`);

    try {
      // Generate embeddings for all users
      console.log('Generating user embeddings...');
      for (const user of mockUsers) {
        const userEmbedding = await this.embeddingService.generateUserEmbedding(user);
        this.userEmbeddings.set(user._id || user.id, userEmbedding);
      }
      console.log(`Generated ${this.userEmbeddings.size} user embeddings`);

      // Generate embeddings for all cars
      console.log('Generating car embeddings...');
      for (const car of mockCars) {
        const carEmbedding = await this.embeddingService.generateCarEmbedding(car);
        this.carEmbeddings.set(car._id || car.id, carEmbedding);
      }
      console.log(`Generated ${this.carEmbeddings.size} car embeddings`);

      this.initialized = true;
      console.log('RAG system initialized successfully');
    } catch (error) {
      console.error('Error initializing RAG system:', error);
      throw error;
    }
  }

  /**
   * Get recommendations for a user using RAG
   */
  async getRecommendations(userId: string, limit = 5) {
    if (!this.initialized) {
      await this.initialize();
    }

    console.log('Getting RAG recommendations for user:', userId);

    // First try to find user in mock data (for testing)
    let user = mockUsers.find((u: any) => u._id === userId || u.id === userId);
    
    // If not found in mock data, fetch current authenticated user data from backend
    if (!user) {
      try {
        console.log('User not found in mock data, fetching current user profile from backend...');
        const response = await authApi.getProfile();
        if (response.success) {
          // Convert the profile data to RAG format
          user = this.convertRealUserToRAGFormat(response.data);
          console.log('Successfully fetched and converted user profile data');
          console.log('User data:', {
            id: user._id,
            name: user.name,
            location: user.location,
            preferences: user.preferences,
            budget: user.budget,
            financial: user.financial
          });
        }
      } catch (error) {
        console.error('Error fetching user profile from backend:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        throw new Error(`Failed to fetch user profile: ${errorMessage}`);
      }
    }

    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }

    // Get user embedding - generate if not exists (for real users)
    let userEmbedding = this.userEmbeddings.get(user._id || user.id);
    if (!userEmbedding) {
      console.log('Generating embedding for real user...');
      console.log('User data for embedding:', user);
      userEmbedding = await this.embeddingService.generateUserEmbedding(user);
      this.userEmbeddings.set(user._id || user.id, userEmbedding);
      console.log('User embedding generated and stored');
    } else {
      console.log('Using existing user embedding');
    }

    // Get all car embeddings
    const carEmbeddings = Array.from(this.carEmbeddings.values());
    console.log(`Found ${carEmbeddings.length} car embeddings for similarity matching`);

    // Find similar cars
    console.log('Starting similarity matching...');
    const recommendations = await this.similarityService.findSimilarCars(
      userEmbedding,
      carEmbeddings,
      user,
      mockCars,
      RAG_CONFIG.FILTERS,
      RAG_CONFIG.RECOMMENDATION.SIMILARITY_WEIGHTS,
      limit
    );

    console.log(`Found ${recommendations.length} similar cars before explanations`);

    // Generate explanations using LLM
    console.log('Generating explanations...');
    const recommendationsWithExplanations = await this.llmService.generateMultipleExplanations(
      user,
      recommendations
    );

    console.log('Generated RAG recommendations:', recommendationsWithExplanations.length);
    console.log('Recommendations:', recommendationsWithExplanations);

    return {
      user: {
        id: user._id || user.id,
        name: user.name
      },
      recommendations: recommendationsWithExplanations,
      totalCarsAnalyzed: mockCars.length,
      filteredCars: recommendations.length,
      method: 'RAG'
    };
  }

  /**
   * Get recommendations by user name
   */
  async getRecommendationsByName(name: string, limit = 5) {
    const user = mockUsers.find((u: any) => 
      u.name.toLowerCase().includes(name.toLowerCase())
    );

    if (!user) {
      throw new Error(`User with name "${name}" not found`);
    }

    return await this.getRecommendations(user._id || user.id, limit);
  }

  /**
   * Get recommendations for all users
   */
  async getAllUserRecommendations(limit = 3) {
    if (!this.initialized) {
      await this.initialize();
    }

    const results = {};

    for (const user of mockUsers) {
      try {
        const recommendations = await this.getRecommendations(user._id || user.id, limit);
        (results as any)[user._id || user.id] = recommendations.recommendations;
      } catch (error) {
        console.error(`Error getting RAG recommendations for ${user._id || user.id}:`, error);
        (results as any)[user._id || user.id] = [];
      }
    }

    return results;
  }

  /**
   * Get custom recommendations based on criteria
   */
  async getCustomRecommendations(criteria: any, limit = 5) {
    // Create a temporary user object from criteria
    const customUser = {
      _id: 'custom_user',
      name: "Custom Search",
      age: criteria.age || 35,
      familySize: criteria.familySize || 2,
      location: criteria.location || { city: "Unknown", state: "Unknown" },
      budget: criteria.budget || { min: 25000, max: 50000 },
      preferences: criteria.preferences || {
        bodyStyle: ['Sedan', 'SUV'],
        drivetrain: ['FWD', 'AWD'],
        fuelType: ['Gasoline', 'Hybrid']
      },
      financial: criteria.financial || {
        annualIncome: 75000,
        creditScore: 700
      }
    };

    // Generate embedding for custom user
    const userEmbedding = await this.embeddingService.generateUserEmbedding(customUser);

    // Get all car embeddings
    const carEmbeddings = Array.from(this.carEmbeddings.values());

    // Find similar cars
    const recommendations = await this.similarityService.findSimilarCars(
      userEmbedding,
      carEmbeddings,
      customUser,
      mockCars,
      RAG_CONFIG.FILTERS,
      RAG_CONFIG.RECOMMENDATION.SIMILARITY_WEIGHTS,
      limit
    );

    // Generate explanations
    const recommendationsWithExplanations = await this.llmService.generateMultipleExplanations(
      customUser,
      recommendations
    );

    return {
      user: {
        id: 'custom_user',
        name: 'Custom Search'
      },
      recommendations: recommendationsWithExplanations,
      totalCarsAnalyzed: mockCars.length,
      filteredCars: recommendations.length,
      method: 'RAG'
    };
  }

  /**
   * Get similarity breakdown for debugging
   */
  async getSimilarityBreakdown(userId: string, carId: string) {
    if (!this.initialized) {
      await this.initialize();
    }

    const user = mockUsers.find((u: any) => u._id === userId || u.id === userId);
    const car = mockCars.find((c: any) => c._id === carId || c.id === carId);

    if (!user || !car) {
      throw new Error('User or car not found');
    }

    const userEmbedding = this.userEmbeddings.get(user._id || user.id);
    const carEmbedding = this.carEmbeddings.get(car._id || car.id);

    if (!userEmbedding || !carEmbedding) {
      throw new Error('Embeddings not found');
    }

    return this.similarityService.getSimilarityBreakdown(
      userEmbedding,
      carEmbedding,
      RAG_CONFIG.RECOMMENDATION.SIMILARITY_WEIGHTS
    );
  }

  /**
   * Convert real user data from backend to RAG format
   */
  private convertRealUserToRAGFormat(realUser: any): any {
    console.log('Converting real user data to RAG format...');
    console.log('Raw user data:', JSON.stringify(realUser, null, 2));

    // Helper function to safely extract numeric values from MongoDB format
    const extractNumber = (value: any): number => {
      if (typeof value === 'number') return value;
      if (value && typeof value === 'object' && value.$numberInt) {
        return parseInt(value.$numberInt);
      }
      if (value && typeof value === 'object' && value.$numberLong) {
        return parseInt(value.$numberLong);
      }
      return 0;
    };

    // Helper function to safely extract string values
    const extractString = (value: any): string => {
      if (typeof value === 'string') return value;
      if (value && typeof value === 'object' && value.$oid) {
        return value.$oid;
      }
      return value?.toString() || '';
    };

    // Extract numeric values safely
    const familyInfo = extractNumber(realUser.personal?.familyInfo);
    const avgCommuteDistance = extractNumber(realUser.personal?.avgCommuteDistance);
    const householdIncome = extractNumber(realUser.finance?.householdIncome);
    const creditScore = extractNumber(realUser.finance?.creditScore);

    // Extract location information
    const personalLocation = realUser.personal?.location || '';
    const locationParts = personalLocation.split(',').map((s: string) => s.trim());
    const city = locationParts[0] || realUser.location?.city || "Unknown";
    const state = locationParts[1] || realUser.location?.state || "Unknown";

    // Calculate budget based on household income (rough estimate)
    const annualIncome = householdIncome || realUser.annualIncome || 75000;
    const budgetMin = Math.round(annualIncome * 0.2); // 20% of annual income
    const budgetMax = Math.round(annualIncome * 0.4); // 40% of annual income
    const budgetPreferred = Math.round(annualIncome * 0.3); // 30% of annual income

    const convertedUser = {
      _id: extractString(realUser._id),
      name: `${realUser.firstName || ''} ${realUser.lastName || ''}`.trim(),
      age: realUser.age || 35,
      familySize: familyInfo || 2,
      location: {
        city: city,
        state: state,
        zip: realUser.location?.zip || "00000"
      },
      preferences: {
        bodyStyle: realUser.personal?.buildPreferences || [realUser.preferences?.vehicleType || "Sedan"],
        drivetrain: ["FWD"], // Default since not specified in user model
        fuelType: [realUser.personal?.fuelType || "Gasoline"],
        colorPreference: realUser.personal?.color || "White",
        featurePreferences: realUser.personal?.featurePreferences || realUser.preferences?.features || []
      },
      budget: {
        min: budgetMin,
        max: budgetMax,
        preferred: budgetPreferred
      },
      financial: {
        annualIncome: annualIncome,
        downPayment: realUser.preferences?.downPayment || 5000,
        tradeInValue: 0,
        financingPreference: realUser.finance?.financeOrLease || realUser.preferences?.purchaseType || "Finance",
        termPreference: realUser.preferences?.preferredTermMonths || 60,
        creditScore: creditScore || realUser.creditScore || 700
      },
      drivingHabits: {
        dailyMiles: avgCommuteDistance || 50,
        highwayPercentage: 30,
        cityPercentage: 70,
        cargoNeeds: familyInfo > 3 ? "High" : familyInfo > 1 ? "Medium" : "Low",
        passengerCount: familyInfo || 2,
        parkingType: "Street"
      },
      lifestyle: {
        family: familyInfo > 1,
        pets: false,
        outdoorActivities: false,
        commute: "Daily",
        weekendTrips: "Occasional",
        purpose: realUser.personal?.buyingFor || "personal"
      },
      preferredMakes: ["Toyota"]
    };

    console.log('Converted user data for RAG:', JSON.stringify(convertedUser, null, 2));
    return convertedUser;
  }

  /**
   * Check if system is initialized
   */
  isInitialized() {
    return this.initialized;
  }

  /**
   * Get system status
   */
  getStatus() {
    return {
      initialized: this.initialized,
      userEmbeddings: this.userEmbeddings.size,
      carEmbeddings: this.carEmbeddings.size,
      totalUsers: mockUsers.length,
      totalCars: mockCars.length
    };
  }
}

// Create singleton instance
const ragRecommender = new RAGRecommender();

// Export functions for backward compatibility
export const getRecommendations = async (userId: string, limit = 5) => {
  return await ragRecommender.getRecommendations(userId, limit);
};

export const getRecommendationsByName = async (name: string, limit = 5) => {
  return await ragRecommender.getRecommendationsByName(name, limit);
};

export const getAllUserRecommendations = async (limit = 3) => {
  return await ragRecommender.getAllUserRecommendations(limit);
};

export const getCustomRecommendations = async (criteria: any, limit = 5) => {
  return await ragRecommender.getCustomRecommendations(criteria, limit);
};

// Export the class instance for advanced usage
export { ragRecommender };
