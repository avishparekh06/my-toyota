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
    try {
      const prompt = this.createExplanationPrompt(user, recommendation, similarityBreakdown);
      
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const explanationText = response.text();
      
      // Parse the response to extract explanation and reasons
      return this.parseExplanationResponse(explanationText);
    } catch (error) {
      console.error('Error generating explanation:', error);
      // Fallback to basic explanation
      return this.generateFallbackExplanation(user, recommendation);
    }
  }

  /**
   * Create prompt for explanation generation
   */
  private createExplanationPrompt(user: any, recommendation: RAGRecommendation, similarityBreakdown?: any): string {
    const car = recommendation.carData;
    
    return `You are an expert Toyota sales consultant helping a customer understand why a specific vehicle is perfect for their needs.

CUSTOMER PROFILE:
- Name: ${user.name}
- Age: ${user.age}
- Family Size: ${user.familySize}
- Location: ${user.location.city}, ${user.location.state}
- Budget: $${user.budget.min.toLocaleString()} - $${user.budget.max.toLocaleString()}
- Preferences: ${JSON.stringify(user.preferences, null, 2)}
- Financial: ${user.financial ? `Income: $${user.financial.annualIncome?.toLocaleString()}, Credit: ${user.financial.creditScore}` : 'Not specified'}

RECOMMENDED VEHICLE:
- ${recommendation.car}
- MSRP: $${car.msrp.toLocaleString()}
- Engine: ${car.engine}
- MPG: ${car.mpgCity}/${car.mpgHighway} city/highway
- Drivetrain: ${car.drivetrain}
- Fuel Type: ${car.fuelType}
- Key Features: ${car.features.join(', ')}

SIMILARITY ANALYSIS:
- Overall Match Score: ${Math.round(recommendation.similarityScore * 100)}%
- Budget Fit: ${Math.round(recommendation.budgetFit * 100)}%
- Location Proximity: ${Math.round(recommendation.locationProximity * 100)}%

Please provide:
1. A compelling 2-3 sentence explanation of why this vehicle is perfect for this customer
2. 3-4 specific reasons why this car matches their needs

Format your response as:
EXPLANATION: [your explanation here]
REASONS:
- [reason 1]
- [reason 2]
- [reason 3]
- [reason 4]

Make it personal, specific, and highlight the most relevant benefits for this customer's situation.`;
  }

  /**
   * Parse the LLM response to extract explanation and reasons
   */
  private parseExplanationResponse(responseText: string): { explanation: string; reasons: string[] } {
    try {
      const lines = responseText.split('\n');
      let explanation = '';
      const reasons: string[] = [];
      
      let currentSection = '';
      
      for (const line of lines) {
        const trimmedLine = line.trim();
        
        if (trimmedLine.startsWith('EXPLANATION:')) {
          explanation = trimmedLine.replace('EXPLANATION:', '').trim();
          currentSection = 'explanation';
        } else if (trimmedLine.startsWith('REASONS:')) {
          currentSection = 'reasons';
        } else if (currentSection === 'reasons' && trimmedLine.startsWith('-')) {
          reasons.push(trimmedLine.replace('-', '').trim());
        } else if (currentSection === 'explanation' && trimmedLine && !trimmedLine.startsWith('REASONS:')) {
          explanation += ' ' + trimmedLine;
        }
      }
      
      // Clean up explanation
      explanation = explanation.trim();
      
      // Ensure we have at least some content
      if (!explanation) {
        explanation = "This vehicle offers an excellent combination of features, performance, and value that aligns well with your needs and preferences.";
      }
      
      if (reasons.length === 0) {
        reasons.push("Matches your preferred vehicle type and budget range");
        reasons.push("Offers the features and performance you're looking for");
        reasons.push("Provides excellent value for your investment");
      }
      
      return { explanation, reasons };
    } catch (error) {
      console.error('Error parsing explanation response:', error);
      return this.generateFallbackExplanation(null, null);
    }
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
      try {
        const { explanation, reasons } = await this.generateExplanation(user, recommendation);
        
        updatedRecommendations.push({
          ...recommendation,
          explanation,
          reasons
        });
      } catch (error) {
        console.error('Error generating explanation for recommendation:', error);
        
        // Use fallback explanation
        const { explanation, reasons } = this.generateFallbackExplanation(user, recommendation);
        
        updatedRecommendations.push({
          ...recommendation,
          explanation,
          reasons
        });
      }
    }

    return updatedRecommendations;
  }
}
