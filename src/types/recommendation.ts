export interface Recommendation {
  car: any;
  carData: any;
  similarityScore: number;
  budgetFit: number;
  locationProximity: number;
  explanation: string;
  reasons: string[];
}

export interface RecommendationResult {
  user: {
    id: string;
    name: string;
  };
  recommendations: Recommendation[];
  totalCarsAnalyzed: number;
  filteredCars: number;
  method: string;
}
