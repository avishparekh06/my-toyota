import { GoogleGenerativeAI } from '@google/generative-ai';
import { RAG_CONFIG, RAGRecommendation } from './ragConfig';

/**
 * LLM service for generating natural language explanations
 */
export class LLMExplanationService {
  private static instance: LLMExplanationService;
  private model: any;

  private constructor() {
    const genAI = new GoogleGenerativeAI(RAG_CONFIG.GEMINI_API_KEY);
    this.model = genAI.getGenerativeModel({ model: RAG_CONFIG.GEMINI_MODEL });
  }

  public static getInstance(): LLMExplanationService {
    if (!LLMExplanationService.instance) {
      LLMExplanationService.instance = new LLMExplanationService();
    }
    return LLMExplanationService.instance;
  }

  /**
   * Generate explanation for why a car fits a user
   */
  async generateExplanation(
    user: any,
    recommendation: RAGRecommendation,
    similarityBreakdown?: any
  ): Promise<{ explanation: string; reasons: string[] }> {
    // Use enhanced fallback explanation instead of AI generation
    return this.generateEnhancedFallbackExplanation(user, recommendation);
  }


  /**
   * Generate enhanced fallback explanation with more personalization
   */
  private generateEnhancedFallbackExplanation(user: any, recommendation: RAGRecommendation): { explanation: string; reasons: string[] } {
    const car = recommendation.carData;
    const reasons: string[] = [];

    // Personalized budget reason
    if (recommendation.budgetFit >= 0.8) {
      reasons.push(`Perfect fit within your $${user.budget.min.toLocaleString()}-$${user.budget.max.toLocaleString()} budget range`);
    } else {
      reasons.push(`Excellent value at $${car.dealerPrice.toLocaleString()}, well within your budget`);
    }

    // Personalized feature reasons based on user preferences
    if (user.preferences && user.preferences.bodyStylePreference) {
      const preferredBodyStyle = user.preferences.bodyStylePreference[0];
      if (car.bodyStyle === preferredBodyStyle) {
        reasons.push(`Matches your preferred ${preferredBodyStyle} body style perfectly`);
      }
    }

    // Fuel type preference
    if (user.preferences && user.preferences.fuelTypePreference) {
      const preferredFuelType = user.preferences.fuelTypePreference[0];
      if (car.fuelType === preferredFuelType) {
        reasons.push(`Features your preferred ${preferredFuelType} powertrain for optimal efficiency`);
      }
    }

    // Family size consideration
    if (user.familySize && user.familySize > 2) {
      if (car.bodyStyle === 'SUV' || car.bodyStyle === 'Crossover') {
        reasons.push(`Spacious ${car.bodyStyle} design perfect for your family of ${user.familySize}`);
      }
    }

    // Location-based reason
    if (user.location && car.location) {
      if (user.location.state === car.location.state) {
        reasons.push(`Conveniently located in ${car.location.city}, ${car.location.state} for easy pickup`);
      }
    }

    // Performance reason
    if (car.mpgCity && car.mpgHighway) {
      reasons.push(`Outstanding fuel economy with ${car.mpgCity}/${car.mpgHighway} MPG city/highway`);
    }

    // Ensure we have at least 3 reasons
    if (reasons.length < 3) {
      if (car.features && car.features.length > 0) {
        reasons.push(`Includes premium features like ${car.features.slice(0, 2).join(' and ')}`);
      }
      if (car.drivetrain === 'AWD') {
        reasons.push(`All-wheel drive for enhanced safety and performance`);
      }
    }

    const explanation = `The ${recommendation.car} is an excellent choice for you, ${user.name}. This vehicle perfectly balances your budget requirements with the features and performance you need for your lifestyle in ${user.location.city}.`;

    return { explanation, reasons };
  }

  /**
   * Generate fallback explanation when LLM fails
   */
  private generateFallbackExplanation(user: any, recommendation: RAGRecommendation | null): { explanation: string; reasons: string[] } {
    if (!recommendation) {
      return {
        explanation: "This vehicle offers excellent value and features that match your preferences.",
        reasons: [
          "Matches your budget requirements",
          "Offers the features you need",
          "Provides reliable performance",
          "Great value for your investment"
        ]
      };
    }

    const car = recommendation.carData;
    const reasons: string[] = [];

    // Budget-based reason
    if (recommendation.budgetFit >= 0.8) {
      reasons.push("Perfect fit within your budget range");
    } else if (recommendation.budgetFit >= 0.6) {
      reasons.push("Good value within your budget");
    } else {
      reasons.push("Premium option that offers exceptional value");
    }

    // Feature-based reasons
    if (car.features && car.features.length > 0) {
      const keyFeatures = car.features.slice(0, 2).join(' and ');
      reasons.push(`Includes ${keyFeatures} for enhanced driving experience`);
    }

    // Performance-based reason
    if (car.mpgCity && car.mpgHighway) {
      reasons.push(`Excellent fuel economy with ${car.mpgCity}/${car.mpgHighway} MPG city/highway`);
    }

    // Drivetrain-based reason
    if (car.drivetrain === 'AWD') {
      reasons.push("All-wheel drive for enhanced safety and performance in all weather conditions");
    } else if (car.fuelType === 'Hybrid') {
      reasons.push("Hybrid powertrain for superior fuel efficiency and eco-friendly driving");
    } else {
      reasons.push("Reliable performance and driving dynamics");
    }

    const explanation = `The ${recommendation.car} is an excellent choice that combines ${car.fuelType.toLowerCase()} efficiency with the features and performance you need. This vehicle offers great value and matches your lifestyle requirements perfectly.`;

    return { explanation, reasons };
  }

  /**
   * Generate explanations for multiple recommendations
   */
  async generateMultipleExplanations(
    user: any,
    recommendations: RAGRecommendation[]
  ): Promise<RAGRecommendation[]> {
    const updatedRecommendations: RAGRecommendation[] = [];

    for (const recommendation of recommendations) {
      const { explanation, reasons } = this.generateEnhancedFallbackExplanation(user, recommendation);
      
      updatedRecommendations.push({
        ...recommendation,
        explanation,
        reasons
      });
    }

    return updatedRecommendations;
  }

}
