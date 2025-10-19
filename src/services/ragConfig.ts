// RAG Configuration for Toyota Recommendation System
export const RAG_CONFIG = {
  // Gemini API Configuration
  GEMINI_API_KEY: 'AIzaSyDsc03j2O0mMMyGHT8ZSWFeSzwY5lL4oCc',
  GEMINI_MODEL: 'gemini-1.5-flash',
  
  // Filtering Configuration
  FILTERS: {
    MSRP_TOLERANCE: 0.1, // ±10% MSRP tolerance
    BODY_STYLE_MATCH: true, // Must match body style preference
    MIN_SIMILARITY_SCORE: 0.3, // Minimum similarity score for recommendations
  },
  
  // Embedding Configuration
  EMBEDDING: {
    USER_PROFILE_FIELDS: [
      'preferences',
      'drivingHabits', 
      'lifestyle',
      'financial',
      'location'
    ],
    CAR_FEATURE_FIELDS: [
      'features',
      'engine',
      'bodyStyle',
      'fuelType',
      'drivetrain',
      'transmission'
    ]
  },
  
  // Recommendation Configuration
  RECOMMENDATION: {
    MAX_RECOMMENDATIONS: 5,
    EXPLANATION_MAX_LENGTH: 200,
    SIMILARITY_WEIGHTS: {
      userPreferences: 0.3,      // 30% - User profile matching
      carFeatures: 0.3,          // 30% - Car feature alignment
      budgetFit: 0.3,            // 30% - Budget compatibility
      locationProximity: 0.1     // 10% - Geographic proximity
    }
  }
};

// Types for RAG System
export interface UserEmbedding {
  userId: string;
  profileText: string;
  embedding: number[];
  preferences: {
    bodyStyle: string[];
    drivetrain: string[];
    fuelType: string[];
  };
  budget: {
    min: number;
    max: number;
  };
  location: {
    city: string;
    state: string;
  };
}

export interface CarEmbedding {
  carId: string;
  featureText: string;
  embedding: number[];
  msrp: number;
  bodyStyle: string;
  location: {
    city: string;
    state: string;
  };
}

export interface RAGRecommendation {
  car: any;
  carData: any;
  similarityScore: number;
  budgetFit: number;
  locationProximity: number;
  explanation: string;
  reasons: string[];
}
