import { useState, useEffect } from 'react';
import { motion } from "framer-motion"
import { Footer } from "@/components/Footer"
import { Container } from "@/components/Container"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "@/contexts/AuthContext"
import { getRecommendations } from '../recommendation/ragRecommender';
import { RecommendationCard } from "@/components/RecommendationCard";
import { CarDetailModal } from "@/components/CarDetailModal";

interface Recommendation {
  car: string;
  carData: any;
  similarityScore: number;
  budgetFit: number;
  locationProximity: number;
  semanticSimilarity: number;
  breakdown: {
    semantic: number;
    budget: number;
    location: number;
  };
  explanation: string;
  reasons: string[];
}

interface RecommendationResult {
  user: {
    id: string;
    name: string;
  };
  recommendations: Recommendation[];
  totalCarsAnalyzed: number;
  filteredCars: number;
  method: string;
}

const RecommendationPage = () => {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [recommendations, setRecommendations] = useState<Recommendation[] | null>(null);
  const [recommendationResult, setRecommendationResult] = useState<RecommendationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAllResults, setShowAllResults] = useState(true); // Show all results by default
  const [selectedCar, setSelectedCar] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Auto-load recommendations when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user && !authLoading) {
      handleGetRecommendations();
    }
  }, [isAuthenticated, user, authLoading]);

  const handleGetRecommendations = async () => {
    if (!user) {
      setError('You must be logged in to get recommendations');
      return;
    }

    setLoading(true);
    setError(null);
    setRecommendations(null);

    try {
      // Use RAG system with user's ID - get more results to show all
      const result = await getRecommendations(user._id, 20); // Get more results
      
      setRecommendations(result.recommendations);
      setRecommendationResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (recommendation: Recommendation) => {
    setSelectedCar(recommendation.carData);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCar(null);
  };

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#EB0A1E] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[var(--bg)] pt-[68px]">
        <Container>
          <div className="py-20 text-center">
            <div className="max-w-md mx-auto">
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="w-16 h-16 bg-[#EB0A1E]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-[#EB0A1E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Sign In Required
                </h2>
                <p className="text-gray-600 mb-6">
                  Please sign in to get personalized Toyota recommendations based on your profile and preferences.
                </p>
                <Button 
                  onClick={() => window.location.href = '/auth'}
                  className="w-full bg-[#EB0A1E] hover:bg-[#CF0A19] text-white"
                >
                  Sign In
                </Button>
              </div>
            </div>
          </div>
        </Container>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <Container>
          <div className="py-12 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Smart Vehicle Recommendations
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get personalized Toyota recommendations using AI-powered semantic matching based on your profile, preferences, and financial situation.
            </p>
          </div>
        </Container>
      </div>

      {/* Main Content */}
      <Container>
        <div className="py-12">
          <div className="max-w-4xl mx-auto">
            {/* User Profile */}
            <Card className="mb-8">
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Your Profile</h2>
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Welcome, {user?.firstName}!</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    We'll use your profile data to find the perfect Toyota for you.
                  </p>
                  {user?.finance?.budgetRange && (
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Your Budget Range</h4>
                      <div className="flex items-center space-x-4 text-sm">
                        <div>
                          <span className="text-gray-500">Min:</span>
                          <span className="font-semibold text-green-600 ml-1">
                            ${user.finance.budgetRange.min.toLocaleString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Max:</span>
                          <span className="font-semibold text-green-600 ml-1">
                            ${user.finance.budgetRange.max.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Get Recommendations Button */}
                <div className="text-center">
                  <Button 
                    onClick={handleGetRecommendations}
                    disabled={loading}
                    className="bg-[#EB0A1E] hover:bg-[#CF0A19] text-white px-8 py-3 text-lg"
                  >
                    {loading ? 'Getting Recommendations...' : 'Get My Recommendations'}
                  </Button>
                </div>
              </CardContent>
            </Card>


            {/* Error Display */}
            {error && (
              <Card className="mb-8 border-red-200 bg-red-50">
                <CardContent className="p-6">
                  <div className="text-red-800">
                    <h3 className="font-semibold mb-2">Error</h3>
                    <p>{error}</p>
                  </div>
                </CardContent>
              </Card>
            )}


            {/* No Recommendations Message */}
            {recommendations && recommendations.length === 0 && (
              <Card className="mb-8">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.709M15 6.291A7.962 7.962 0 0012 5c-2.34 0-4.29 1.009-5.824 2.709" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Recommendations Found</h3>
                  <p className="text-gray-600 mb-4">
                    We couldn't find any cars that match your current profile and preferences.
                  </p>
                  <p className="text-sm text-gray-500">
                    Try updating your profile or adjusting your preferences to get better matches.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Recommendations Display */}
            {recommendations && recommendations.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-2xl font-semibold text-gray-900">
                        Your Personalized Recommendations
                      </h3>
                      <div className="flex items-center space-x-4">
                        {recommendationResult && (
                          <div className="text-sm text-gray-600">
                            <span className="font-medium">{recommendationResult.filteredCars}</span> of{' '}
                            <span className="font-medium">{recommendationResult.totalCarsAnalyzed}</span> cars match
                          </div>
                        )}
                        <Button
                          onClick={() => setShowAllResults(!showAllResults)}
                          variant="outline"
                          size="sm"
                        >
                          {showAllResults ? 'Show Top 5' : 'Show All Results'}
                        </Button>
                      </div>
                    </div>

                    {/* Results Summary */}
                    {recommendationResult && (
                      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                          <div>
                            <div className="text-2xl font-bold text-green-700">{recommendations.length}</div>
                            <div className="text-sm text-green-600">Recommendations Found</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-blue-700">{recommendationResult.totalCarsAnalyzed}</div>
                            <div className="text-sm text-blue-600">Cars Analyzed</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-purple-700">
                              {recommendations.length > 0 ? Math.round(recommendations[0].similarityScore * 100) : 0}%
                            </div>
                            <div className="text-sm text-purple-600">Best Match Score</div>
                          </div>
                        </div>
                        
                        {/* Scoring Weights Info */}
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="text-center">
                            <h4 className="text-sm font-semibold text-gray-700 mb-2">Scoring Weights</h4>
                            <div className="flex justify-center space-x-6 text-xs text-gray-600">
                              <span>Profile Match: <span className="font-semibold">60%</span></span>
                              <span>Budget Fit: <span className="font-semibold">30%</span></span>
                              <span>Location: <span className="font-semibold">10%</span></span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {(showAllResults ? recommendations : recommendations.slice(0, 5)).map((rec, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          <RecommendationCard 
                            recommendation={rec}
                            rank={index + 1}
                            onViewDetails={handleViewDetails}
                          />
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </Container>

      {/* Car Detail Modal */}
      <CarDetailModal 
        car={selectedCar}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />

      <Footer />
    </div>
  );
};

export { RecommendationPage };