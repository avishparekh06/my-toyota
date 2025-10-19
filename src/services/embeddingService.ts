import { GoogleGenerativeAI } from '@google/generative-ai';
import { RAG_CONFIG, UserEmbedding, CarEmbedding } from './ragConfig';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(RAG_CONFIG.GEMINI_API_KEY);

/**
 * Generate embeddings for user profiles and car features
 */
export class EmbeddingService {
  private static instance: EmbeddingService;
  private model: any;

  private constructor() {
    this.model = genAI.getGenerativeModel({ model: RAG_CONFIG.GEMINI_MODEL });
  }

  public static getInstance(): EmbeddingService {
    if (!EmbeddingService.instance) {
      EmbeddingService.instance = new EmbeddingService();
    }
    return EmbeddingService.instance;
  }

  /**
   * Generate embedding for a text string using feature extraction
   */
  async generateEmbedding(text: string): Promise<number[]> {
    try {
      // Create a comprehensive feature-based embedding
      return this.createFeatureEmbedding(text);
    } catch (error) {
      // Error generating embedding
      // Fallback: create a simple hash-based embedding
      return this.createFallbackEmbedding(text);
    }
  }

  /**
   * Create a comprehensive feature-based embedding with weighted scores
   */
  private createFeatureEmbedding(text: string): number[] {
    const words = text.toLowerCase();
    const features: number[] = [];
    
    // Vehicle type preferences (weighted by frequency and context)
    features.push(this.getWeightedScore(words, ['sedan', 'sedans'], 1.0));
    features.push(this.getWeightedScore(words, ['suv', 'suvs'], 1.0));
    features.push(this.getWeightedScore(words, ['coupe', 'coupes'], 1.0));
    features.push(this.getWeightedScore(words, ['hatchback', 'hatchbacks'], 1.0));
    features.push(this.getWeightedScore(words, ['truck', 'trucks', 'pickup'], 1.0));
    
    // Drivetrain preferences
    features.push(this.getWeightedScore(words, ['awd', 'all-wheel drive'], 1.0));
    features.push(this.getWeightedScore(words, ['fwd', 'front-wheel drive'], 1.0));
    features.push(this.getWeightedScore(words, ['rwd', 'rear-wheel drive'], 1.0));
    features.push(this.getWeightedScore(words, ['4wd', 'four-wheel drive'], 1.0));
    
    // Fuel type preferences
    features.push(this.getWeightedScore(words, ['hybrid', 'hybrids'], 1.0));
    features.push(this.getWeightedScore(words, ['electric', 'ev', 'battery'], 1.0));
    features.push(this.getWeightedScore(words, ['gasoline', 'gas', 'petrol'], 1.0));
    
    // Lifestyle indicators (weighted by context)
    features.push(this.getWeightedScore(words, ['family', 'families', 'children', 'kids'], 0.8));
    features.push(this.getWeightedScore(words, ['commute', 'commuting', 'daily', 'work'], 0.8));
    features.push(this.getWeightedScore(words, ['performance', 'sport', 'sporty', 'fast'], 0.8));
    features.push(this.getWeightedScore(words, ['efficiency', 'efficient', 'mpg', 'fuel economy'], 0.8));
    features.push(this.getWeightedScore(words, ['luxury', 'premium', 'high-end'], 0.8));
    features.push(this.getWeightedScore(words, ['budget', 'affordable', 'economical', 'cheap'], 0.8));
    
    // Location and demographics
    features.push(this.getWeightedScore(words, ['young', 'professional', 'millennial'], 0.6));
    features.push(this.getWeightedScore(words, ['mature', 'established', 'adult'], 0.6));
    features.push(this.getWeightedScore(words, ['single', 'individual'], 0.6));
    features.push(this.getWeightedScore(words, ['couple', 'married', 'partner'], 0.6));
    
    // Financial indicators
    features.push(this.getWeightedScore(words, ['affluent', 'high income', 'wealthy', 'rich'], 0.7));
    features.push(this.getWeightedScore(words, ['middle', 'moderate', 'average'], 0.7));
    features.push(this.getWeightedScore(words, ['budget-conscious', 'economical', 'frugal'], 0.7));
    
    // Technical features
    features.push(this.getWeightedScore(words, ['safety', 'safe', 'crash', 'protection'], 0.9));
    features.push(this.getWeightedScore(words, ['technology', 'tech', 'digital', 'smart'], 0.9));
    features.push(this.getWeightedScore(words, ['comfort', 'comfortable', 'luxury', 'premium'], 0.9));
    features.push(this.getWeightedScore(words, ['reliability', 'reliable', 'dependable', 'quality'], 0.9));
    
    // Text characteristics (normalized)
    features.push(Math.min(text.length / 500, 1)); // Normalized text length
    features.push(Math.min((text.match(/\$/g) || []).length / 10, 1)); // Price mentions
    features.push(Math.min((text.match(/\d+/g) || []).length / 20, 1)); // Number mentions
    
    // Add some random variation to prevent identical embeddings
    features.push(Math.random() * 0.1); // Small random component
    
    return features;
  }

  /**
   * Get weighted score for keyword matching
   */
  private getWeightedScore(text: string, keywords: string[], weight: number): number {
    let score = 0;
    for (const keyword of keywords) {
      if (text.includes(keyword)) {
        score += weight;
        // Bonus for multiple occurrences
        const occurrences = (text.match(new RegExp(keyword, 'g')) || []).length;
        score += (occurrences - 1) * 0.1;
      }
    }
    return Math.min(score, 1.0); // Cap at 1.0
  }

  /**
   * Create a fallback embedding using simple text hashing
   */
  private createFallbackEmbedding(text: string): number[] {
    // Simple hash-based embedding as ultimate fallback
    const hash = this.simpleHash(text);
    const embedding = [];
    
    for (let i = 0; i < 32; i++) {
      embedding.push((hash >> i) & 1 ? 1 : 0);
    }
    
    return embedding;
  }

  /**
   * Simple hash function for fallback embeddings
   */
  private simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  /**
   * Create user profile text for embedding
   */
  createUserProfileText(user: any): string {
    const parts = [];

    // Basic info with safe defaults
    const name = user.name || "User";
    const age = user.age || 35;
    const familySize = user.familySize || 2;
    parts.push(`User: ${name}, Age: ${age}, Family Size: ${familySize}`);

    // Location
    if (user.location && user.location.city && user.location.state) {
      parts.push(`Location: ${user.location.city}, ${user.location.state}`);
    }

    // Preferences
    if (user.preferences) {
      const prefs = [];
      if (user.preferences.bodyStyle && Array.isArray(user.preferences.bodyStyle)) {
        prefs.push(`Body Style: ${user.preferences.bodyStyle.join(', ')}`);
      }
      if (user.preferences.drivetrain && Array.isArray(user.preferences.drivetrain)) {
        prefs.push(`Drivetrain: ${user.preferences.drivetrain.join(', ')}`);
      }
      if (user.preferences.fuelType && Array.isArray(user.preferences.fuelType)) {
        prefs.push(`Fuel Type: ${user.preferences.fuelType.join(', ')}`);
      }
      if (prefs.length > 0) parts.push(`Preferences: ${prefs.join(', ')}`);
    }

    // Budget
    if (user.budget && user.budget.min && user.budget.max) {
      parts.push(`Budget: $${user.budget.min.toLocaleString()} - $${user.budget.max.toLocaleString()}`);
    }

    // Financial info
    if (user.financial) {
      const financial = [];
      if (user.financial.annualIncome) financial.push(`Income: $${user.financial.annualIncome.toLocaleString()}`);
      if (user.financial.creditScore) financial.push(`Credit Score: ${user.financial.creditScore}`);
      if (financial.length > 0) parts.push(`Financial: ${financial.join(', ')}`);
    }

    // Lifestyle context
    const lifestyleContext = this.generateLifestyleContext(user);
    if (lifestyleContext) {
      parts.push(`Lifestyle: ${lifestyleContext}`);
    }

    return parts.join('. ');
  }

  /**
   * Create car feature text for embedding
   */
  createCarFeatureText(car: any): string {
    const parts = [];

    // Basic car info with safe defaults
    const year = car.year || 2024;
    const make = car.make || "Toyota";
    const model = car.model || "Vehicle";
    const trim = car.trim || "";
    parts.push(`${year} ${make} ${model} ${trim}`.trim());

    // Body style and type
    if (car.bodyStyle) {
      parts.push(`Body Style: ${car.bodyStyle}`);
    }

    // Engine and performance
    if (car.engine) parts.push(`Engine: ${car.engine}`);
    if (car.horsepower) parts.push(`Horsepower: ${car.horsepower}hp`);
    if (car.mpgCity && car.mpgHighway) parts.push(`Fuel Economy: ${car.mpgCity}/${car.mpgHighway} MPG city/highway`);

    // Drivetrain and transmission
    if (car.drivetrain) parts.push(`Drivetrain: ${car.drivetrain}`);
    if (car.transmission) parts.push(`Transmission: ${car.transmission}`);

    // Fuel type
    if (car.fuelType) parts.push(`Fuel Type: ${car.fuelType}`);

    // Features
    if (car.features && Array.isArray(car.features) && car.features.length > 0) {
      parts.push(`Key Features: ${car.features.join(', ')}`);
    }

    // Pricing context
    if (car.msrp) {
      parts.push(`MSRP: $${car.msrp.toLocaleString()}`);
    }

    // Use case context
    const useCaseContext = this.generateUseCaseContext(car);
    if (useCaseContext) {
      parts.push(`Best For: ${useCaseContext}`);
    }

    return parts.join('. ');
  }

  /**
   * Generate lifestyle context based on user profile
   */
  private generateLifestyleContext(user: any): string {
    const contexts = [];

    // Family context
    if (user.familySize) {
      if (user.familySize === 1) contexts.push('single person');
      else if (user.familySize === 2) contexts.push('couple');
      else if (user.familySize >= 3) contexts.push('family with children');
    }

    // Age context
    if (user.age) {
      if (user.age < 30) contexts.push('young professional');
      else if (user.age >= 30 && user.age < 50) contexts.push('established professional');
      else if (user.age >= 50) contexts.push('mature adult');
    }

    // Financial context
    if (user.financial?.annualIncome) {
      if (user.financial.annualIncome < 50000) contexts.push('budget-conscious');
      else if (user.financial.annualIncome >= 50000 && user.financial.annualIncome < 100000) contexts.push('middle-income');
      else if (user.financial.annualIncome >= 100000) contexts.push('affluent');
    }

    return contexts.join(', ');
  }

  /**
   * Generate use case context for cars
   */
  private generateUseCaseContext(car: any): string {
    const contexts = [];

    // Body style use cases
    switch (car.bodyStyle?.toLowerCase()) {
      case 'sedan':
        contexts.push('daily commuting', 'comfortable driving');
        break;
      case 'suv':
        contexts.push('family transportation', 'outdoor activities', 'cargo space');
        break;
      case 'coupe':
        contexts.push('sporty driving', 'performance', 'style');
        break;
      case 'hatchback':
        contexts.push('city driving', 'fuel efficiency', 'practicality');
        break;
    }

    // Fuel type use cases
    switch (car.fuelType?.toLowerCase()) {
      case 'hybrid':
        contexts.push('fuel efficiency', 'eco-friendly');
        break;
      case 'electric':
        contexts.push('zero emissions', 'low operating costs');
        break;
      case 'gasoline':
        contexts.push('performance', 'long-range driving');
        break;
    }

    // Drivetrain use cases
    switch (car.drivetrain?.toLowerCase()) {
      case 'awd':
        contexts.push('all-weather driving', 'off-road capability');
        break;
      case 'fwd':
        contexts.push('fuel efficiency', 'cost-effective');
        break;
      case 'rwd':
        contexts.push('performance', 'sporty handling');
        break;
    }

    return contexts.join(', ');
  }

  /**
   * Generate user embedding
   */
  async generateUserEmbedding(user: any): Promise<UserEmbedding> {
    const profileText = this.createUserProfileText(user);
    const embedding = await this.generateEmbedding(profileText);

    // Generated user embedding

    return {
      userId: user._id || user.id,
      profileText,
      embedding,
      preferences: user.preferences || {},
      budget: user.budget || { min: 0, max: 100000 },
      location: user.location || { city: 'Unknown', state: 'Unknown' }
    };
  }

  /**
   * Generate car embedding
   */
  async generateCarEmbedding(car: any): Promise<CarEmbedding> {
    const featureText = this.createCarFeatureText(car);
    const embedding = await this.generateEmbedding(featureText);

    // Generated car embedding

    return {
      carId: car._id || car.id,
      featureText,
      embedding,
      msrp: car.msrp || car.dealerPrice,
      bodyStyle: car.bodyStyle,
      location: car.location || { city: 'Unknown', state: 'Unknown' }
    };
  }
}
