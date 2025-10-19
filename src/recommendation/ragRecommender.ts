// RAG-based recommendation engine for Toyota cars
import { EmbeddingService } from '../services/embeddingService';
import { SimilarityService } from '../services/similarityService';
import { LLMExplanationService } from '../services/llmExplanationService';
import { RAG_CONFIG } from '../services/ragConfig';
// @ts-ignore - mockData.js doesn't have TypeScript declarations
import { mockUsers } from './mockData';
import { authApi, carsApi } from '../services/api';

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
  private realCars: any[] = [];

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

    // Initializing RAG system

    try {
      // Fetch real car data from the database
      const carsResponse = await carsApi.getCars({ 
        limit: 1000, // Get all cars
        status: 'In Stock' // Only get available cars
      });
      
      if (carsResponse.success && carsResponse.data) {
        this.realCars = carsResponse.data;
        // Found real cars from database
      } else {
        throw new Error('Failed to fetch car data from database');
      }

      // Generate embeddings for all users (still using mock users for now)
      // Generating user embeddings
      for (const user of mockUsers) {
        const userEmbedding = await this.embeddingService.generateUserEmbedding(user);
        this.userEmbeddings.set(user._id || user.id, userEmbedding);
      }
      // Generated user embeddings

      // Generate embeddings for all real cars
      // Generating car embeddings
      for (const car of this.realCars) {
        const carEmbedding = await this.embeddingService.generateCarEmbedding(car);
        this.carEmbeddings.set(car._id || car.id, carEmbedding);
      }
      // Generated car embeddings

      this.initialized = true;
      // RAG system initialized successfully
    } catch (error) {
      // Error initializing RAG system
      throw error;
    }
  }

  /**
   * Get recommendations for a user using RAG
   */
  async getRecommendations(userId: string, limit = 5) {
    // RAG getRecommendations called
    // System initialization status checked
    
    if (!this.initialized) {
      // System not initialized, initializing now
      await this.initialize();
    }

    // Getting RAG recommendations for user

    // First try to find user in mock data (for testing)
    let user = mockUsers.find((u: any) => u._id === userId || u.id === userId);
    
    // If not found in mock data, fetch current authenticated user data from backend
    if (!user) {
      try {
        // User not found in mock data, fetching current user profile from backend
        const response = await authApi.getProfile();
        if (response.success && response.data) {
          // Convert the profile data to RAG format
          user = this.convertRealUserToRAGFormat(response.data);
          // Successfully fetched and converted user profile data
          // User data processed
        } else {
          throw new Error('Failed to get user profile from backend');
        }
      } catch (error) {
        // Error fetching user profile from backend
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
      try {
        // Generating embedding for real user
        // User data for embedding
        userEmbedding = await this.embeddingService.generateUserEmbedding(user);
        this.userEmbeddings.set(user._id || user.id, userEmbedding);
        // User embedding generated and stored
      } catch (error) {
        // Error generating user embedding
        throw new Error(`Failed to generate user embedding: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    } else {
      // Using existing user embedding
    }

    // Get all car embeddings
    const carEmbeddings = Array.from(this.carEmbeddings.values());
    // Found car embeddings for similarity matching

    // Find similar cars
    // Starting similarity matching
    let recommendations;
    try {
      recommendations = await this.similarityService.findSimilarCars(
        userEmbedding,
        carEmbeddings,
        user,
        this.realCars,
        RAG_CONFIG.FILTERS,
        RAG_CONFIG.RECOMMENDATION.SIMILARITY_WEIGHTS,
        limit
      );
      // Found similar cars before explanations
    } catch (error) {
      // Error in similarity matching
      throw new Error(`Failed to find similar cars: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    // Generate explanations using LLM
    // Generating explanations
    let recommendationsWithExplanations;
    try {
      recommendationsWithExplanations = await this.llmService.generateMultipleExplanations(
        user,
        recommendations
      );
    } catch (error) {
      // Error generating explanations
      // Use recommendations without explanations as fallback
      recommendationsWithExplanations = recommendations.map(rec => ({
        ...rec,
        explanation: "This vehicle offers excellent value and features that match your preferences.",
        reasons: [
          "Matches your budget requirements",
          "Offers the features you need",
          "Provides reliable performance",
          "Great value for your investment"
        ]
      }));
    }

    // Generated RAG recommendations
    // Recommendations processed

    return {
      user: {
        id: user._id || user.id,
        name: user.name
      },
      recommendations: recommendationsWithExplanations,
      totalCarsAnalyzed: this.realCars.length,
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
        // Error getting RAG recommendations
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
      this.realCars,
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
      totalCarsAnalyzed: this.realCars.length,
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
    // Converting real user data to RAG format
    // Raw user data processed

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

    // Helper function to safely extract array values
    const extractArray = (value: any): string[] => {
      if (Array.isArray(value)) return value;
      if (typeof value === 'string') return [value];
      return [];
    };

    // Extract numeric values safely
    const familyInfo = extractNumber(realUser.personal?.familyInfo);
    const avgCommuteDistance = extractNumber(realUser.personal?.avgCommuteDistance);
    const householdIncome = extractNumber(realUser.finance?.householdIncome);
    const creditScore = extractNumber(realUser.finance?.creditScore);

    // Extract location information with better fallbacks
    const personalLocation = realUser.personal?.location || '';
    const locationParts = personalLocation.split(',').map((s: string) => s.trim());
    const city = locationParts[0] || realUser.location?.city || "Unknown";
    const state = locationParts[1] || realUser.location?.state || "Unknown";

    // Calculate budget - use budgetRange from finance profile if available
    const annualIncome = householdIncome || realUser.annualIncome || 75000;
    let budgetMin, budgetMax, budgetPreferred;
    
    console.log('Budget calculation debug:', {
      hasBudgetRange: !!(realUser.finance?.budgetRange && realUser.finance.budgetRange.min && realUser.finance.budgetRange.max),
      budgetRange: realUser.finance?.budgetRange,
      annualIncome,
      householdIncome
    });
    
    if (realUser.finance?.budgetRange && realUser.finance.budgetRange.min && realUser.finance.budgetRange.max) {
      // Use budgetRange from finance profile
      budgetMin = realUser.finance.budgetRange.min;
      budgetMax = realUser.finance.budgetRange.max;
      budgetPreferred = Math.round((budgetMin + budgetMax) / 2); // Use midpoint as preferred
      console.log('Using user budget range:', { budgetMin, budgetMax, budgetPreferred });
    } else {
      // Fallback to calculating based on household income - use more reasonable ranges
      budgetMin = Math.round(annualIncome * 0.3); // 30% of annual income
      budgetMax = Math.round(annualIncome * 0.8); // 80% of annual income
      budgetPreferred = Math.round(annualIncome * 0.5); // 50% of annual income
      console.log('Using calculated budget range:', { budgetMin, budgetMax, budgetPreferred, annualIncome });
    }

    // Extract preferences with better defaults
    const buildPreferences = extractArray(realUser.personal?.buildPreferences);
    const vehicleType = realUser.preferences?.vehicleType;
    const bodyStyle = buildPreferences.length > 0 ? buildPreferences : (vehicleType ? [vehicleType] : ["Sedan"]);

    const fuelType = realUser.personal?.fuelType || realUser.preferences?.fuelType || "Gasoline";
    const featurePreferences = extractArray(realUser.personal?.featurePreferences).concat(
      extractArray(realUser.preferences?.features)
    );

    const convertedUser = {
      _id: extractString(realUser._id),
      name: `${realUser.firstName || ''} ${realUser.lastName || ''}`.trim() || "User",
      age: realUser.age || 35,
      familySize: familyInfo || 2,
      location: {
        city: city,
        state: state,
        zip: realUser.location?.zip || "00000"
      },
      preferences: {
        bodyStyle: bodyStyle,
        drivetrain: ["FWD"], // Default since not specified in user model
        fuelType: [fuelType],
        colorPreference: realUser.personal?.color || "White",
        featurePreferences: featurePreferences
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

    // Converted user data for RAG
    console.log('Final converted user budget:', convertedUser.budget);
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
      totalCars: this.realCars.length,
      dataSource: 'Real Database'
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
