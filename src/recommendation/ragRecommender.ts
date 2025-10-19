// RAG-based recommendation engine for Toyota cars
import { EmbeddingService } from '../services/embeddingService';
import { SimilarityService } from '../services/similarityService';
import { LLMExplanationService } from '../services/llmExplanationService';
import { RAG_CONFIG } from '../services/ragConfig';
import { mockUsers, mockCars } from './mockData.js';

/**
 * RAG-based recommendation engine
 */
export class RAGRecommender {
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

    try {
      // Generate embeddings for all users
      console.log('Generating user embeddings...');
      for (const user of mockUsers) {
        const userEmbedding = await this.embeddingService.generateUserEmbedding(user);
        this.userEmbeddings.set(user._id || user.id, userEmbedding);
      }

      // Generate embeddings for all cars
      console.log('Generating car embeddings...');
      for (const car of mockCars) {
        const carEmbedding = await this.embeddingService.generateCarEmbedding(car);
        this.carEmbeddings.set(car._id || car.id, carEmbedding);
      }

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
  async getRecommendations(userId, limit = 5) {
    if (!this.initialized) {
      await this.initialize();
    }

    console.log('Getting RAG recommendations for user:', userId);

    // Find user
    const user = mockUsers.find(u => u._id === userId || u.id === userId);
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }

    // Get user embedding
    const userEmbedding = this.userEmbeddings.get(user._id || user.id);
    if (!userEmbedding) {
      throw new Error(`User embedding not found for user ${userId}`);
    }

    // Get all car embeddings
    const carEmbeddings = Array.from(this.carEmbeddings.values());

    // Find similar cars
    const recommendations = await this.similarityService.findSimilarCars(
      userEmbedding,
      carEmbeddings,
      user,
      mockCars,
      RAG_CONFIG.FILTERS,
      RAG_CONFIG.RECOMMENDATION.SIMILARITY_WEIGHTS,
      limit
    );

    // Generate explanations using LLM
    const recommendationsWithExplanations = await this.llmService.generateMultipleExplanations(
      user,
      recommendations
    );

    console.log('Generated RAG recommendations:', recommendationsWithExplanations.length);

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
  async getRecommendationsByName(name, limit = 5) {
    const user = mockUsers.find(u => 
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
        results[user._id || user.id] = recommendations.recommendations;
      } catch (error) {
        console.error(`Error getting RAG recommendations for ${user._id || user.id}:`, error);
        results[user._id || user.id] = [];
      }
    }

    return results;
  }

  /**
   * Get custom recommendations based on criteria
   */
  async getCustomRecommendations(criteria, limit = 5) {
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
  async getSimilarityBreakdown(userId, carId) {
    if (!this.initialized) {
      await this.initialize();
    }

    const user = mockUsers.find(u => u._id === userId || u.id === userId);
    const car = mockCars.find(c => c._id === carId || c.id === carId);

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
export const getRecommendations = async (userId, limit = 5) => {
  return await ragRecommender.getRecommendations(userId, limit);
};

export const getRecommendationsByName = async (name, limit = 5) => {
  return await ragRecommender.getRecommendationsByName(name, limit);
};

export const getAllUserRecommendations = async (limit = 3) => {
  return await ragRecommender.getAllUserRecommendations(limit);
};

export const getCustomRecommendations = async (criteria, limit = 5) => {
  return await ragRecommender.getCustomRecommendations(criteria, limit);
};

// Export the class instance for advanced usage
export { ragRecommender };
