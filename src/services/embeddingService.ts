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
      console.error('Error generating embedding:', error);
      // Fallback: create a simple hash-based embedding
      return this.createFallbackEmbedding(text);
    }
  }

  /**
   * Create a comprehensive feature-based embedding
   */
  private createFeatureEmbedding(text: string): number[] {
    const words = text.toLowerCase();
    const features: number[] = [];
    
    // Vehicle type preferences (0-1 scale)
    features.push(words.includes('sedan') ? 1 : 0);
    features.push(words.includes('suv') ? 1 : 0);
    features.push(words.includes('coupe') ? 1 : 0);
    features.push(words.includes('hatchback') ? 1 : 0);
    
    // Drivetrain preferences
    features.push(words.includes('awd') ? 1 : 0);
    features.push(words.includes('fwd') ? 1 : 0);
    features.push(words.includes('rwd') ? 1 : 0);
    
    // Fuel type preferences
    features.push(words.includes('hybrid') ? 1 : 0);
    features.push(words.includes('electric') ? 1 : 0);
    features.push(words.includes('gasoline') || words.includes('gas') ? 1 : 0);
    
    // Lifestyle indicators
    features.push(words.includes('family') ? 1 : 0);
    features.push(words.includes('commute') ? 1 : 0);
    features.push(words.includes('performance') ? 1 : 0);
    features.push(words.includes('efficiency') ? 1 : 0);
    features.push(words.includes('luxury') ? 1 : 0);
    features.push(words.includes('budget') ? 1 : 0);
    
    // Location and demographics
    features.push(words.includes('young') || words.includes('professional') ? 1 : 0);
    features.push(words.includes('mature') || words.includes('established') ? 1 : 0);
    features.push(words.includes('single') ? 1 : 0);
    features.push(words.includes('couple') ? 1 : 0);
    
    // Financial indicators
    features.push(words.includes('affluent') || words.includes('high income') ? 1 : 0);
    features.push(words.includes('middle') || words.includes('moderate') ? 1 : 0);
    features.push(words.includes('budget-conscious') || words.includes('economical') ? 1 : 0);
    
    // Technical features
    features.push(words.includes('safety') ? 1 : 0);
    features.push(words.includes('technology') ? 1 : 0);
    features.push(words.includes('comfort') ? 1 : 0);
    features.push(words.includes('reliability') ? 1 : 0);
    
    // Text characteristics
    features.push(Math.min(text.length / 500, 1)); // Normalized text length
    features.push((text.match(/\$/g) || []).length / 10); // Price mentions
    features.push((text.match(/\d+/g) || []).length / 20); // Number mentions
    
    return features;
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

    // Basic info
    parts.push(`User: ${user.name}, Age: ${user.age}, Family Size: ${user.familySize}`);

    // Location
    if (user.location) {
      parts.push(`Location: ${user.location.city}, ${user.location.state}`);
    }

    // Preferences
    if (user.preferences) {
      const prefs = [];
      if (user.preferences.bodyStyle) prefs.push(`Body Style: ${user.preferences.bodyStyle.join(', ')}`);
      if (user.preferences.drivetrain) prefs.push(`Drivetrain: ${user.preferences.drivetrain.join(', ')}`);
      if (user.preferences.fuelType) prefs.push(`Fuel Type: ${user.preferences.fuelType.join(', ')}`);
      if (prefs.length > 0) parts.push(`Preferences: ${prefs.join(', ')}`);
    }

    // Budget
    if (user.budget) {
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

    // Basic car info
    parts.push(`${car.year} ${car.make} ${car.model} ${car.trim}`);

    // Body style and type
    parts.push(`Body Style: ${car.bodyStyle}`);

    // Engine and performance
    if (car.engine) parts.push(`Engine: ${car.engine}`);
    if (car.horsepower) parts.push(`Horsepower: ${car.horsepower}hp`);
    if (car.mpgCity && car.mpgHighway) parts.push(`Fuel Economy: ${car.mpgCity}/${car.mpgHighway} MPG city/highway`);

    // Drivetrain and transmission
    parts.push(`Drivetrain: ${car.drivetrain}`);
    if (car.transmission) parts.push(`Transmission: ${car.transmission}`);

    // Fuel type
    parts.push(`Fuel Type: ${car.fuelType}`);

    // Features
    if (car.features && car.features.length > 0) {
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
