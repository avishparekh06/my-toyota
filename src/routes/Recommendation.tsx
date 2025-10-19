import { useState, useEffect } from 'react';
import { motion } from "framer-motion"
import { Footer } from "@/components/Footer"
import { Container } from "@/components/Container"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "@/contexts/AuthContext"
import { getRecommendations } from '../recommendation/ragRecommender';

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
            {/* User Selection */}
            <Card className="mb-8">
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Your Profile</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="bg-gray-50 rounded-lg p-4">
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
                  </div>
                  <div className="flex items-end">
                    <Button 
                      onClick={handleGetRecommendations}
                      disabled={loading}
                      className="w-full bg-[#EB0A1E] hover:bg-[#CF0A19] text-white"
                    >
                      {loading ? 'Getting Recommendations...' : 'Get My Recommendations'}
                    </Button>
                  </div>
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
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {(showAllResults ? recommendations : recommendations.slice(0, 5)).map((rec, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
                        >
                          {/* Car Image Placeholder */}
                          <div className="relative h-48 bg-gradient-to-br from-gray-50 to-gray-100">
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="text-center">
                                <div className="w-16 h-16 bg-[#EB0A1E]/10 rounded-full flex items-center justify-center mx-auto mb-2">
                                  <svg className="w-8 h-8 text-[#EB0A1E]" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M8 16.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM15 16.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/>
                                    <path fillRule="evenodd" d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zm11.5 3a1.5 1.5 0 00-1.5 1.5v6a1.5 1.5 0 003 0v-6a1.5 1.5 0 00-1.5-1.5z" clipRule="evenodd"/>
                                  </svg>
                                </div>
                                <p className="text-sm text-gray-500 font-medium">Image Coming Soon</p>
                              </div>
                            </div>
                            {/* Match Score Badge */}
                            <div className="absolute top-3 right-3">
                              <div className="bg-[#EB0A1E] text-white px-3 py-1 rounded-full text-sm font-semibold">
                                {Math.round(rec.similarityScore * 100)}% Match
                              </div>
                            </div>
                            
                            {/* Ranking Badge */}
                            <div className="absolute top-3 left-3">
                              <div className="bg-black/70 text-white px-2 py-1 rounded-full text-xs font-semibold">
                                #{index + 1}
                              </div>
                            </div>
                          </div>

                          {/* Card Content */}
                          <div className="p-5">
                            {/* Car Name */}
                            <h4 className="text-xl font-bold text-gray-900 mb-2">
                              {rec.car}
                            </h4>

                            {/* Car Details Grid */}
                            <div className="grid grid-cols-2 gap-3 mb-4">
                              <div className="bg-gray-50 rounded-lg p-3">
                                <div className="text-gray-500 text-xs uppercase tracking-wide font-medium mb-1">Engine</div>
                                <div className="font-semibold text-gray-900 text-sm">{rec.carData.engine}</div>
                              </div>
                              <div className="bg-gray-50 rounded-lg p-3">
                                <div className="text-gray-500 text-xs uppercase tracking-wide font-medium mb-1">MPG</div>
                                <div className="font-semibold text-gray-900 text-sm">{rec.carData.mpgCity}/{rec.carData.mpgHighway}</div>
                              </div>
                              <div className="bg-gray-50 rounded-lg p-3">
                                <div className="text-gray-500 text-xs uppercase tracking-wide font-medium mb-1">Drivetrain</div>
                                <div className="font-semibold text-gray-900 text-sm">{rec.carData.drivetrain}</div>
                              </div>
                              <div className="bg-gray-50 rounded-lg p-3">
                                <div className="text-gray-500 text-xs uppercase tracking-wide font-medium mb-1">Fuel Type</div>
                                <div className="font-semibold text-gray-900 text-sm">{rec.carData.fuelType}</div>
                              </div>
                            </div>

                            {/* Pricing */}
                            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 mb-4">
                              <div className="flex items-baseline justify-between mb-1">
                                <span className="text-sm text-gray-600 font-medium">Starting at</span>
                                <span className="text-2xl font-bold text-gray-900">
                                  ${rec.carData.dealerPrice.toLocaleString()}
                                </span>
                              </div>
                              <div className="text-sm text-gray-500">
                                MSRP: ${rec.carData.msrp.toLocaleString()}
                              </div>
                            </div>

                            {/* Detailed Scoring Breakdown */}
                            <div className="bg-blue-50 rounded-lg p-3 mb-4">
                              <h5 className="font-semibold text-blue-900 mb-2 text-sm">Match Breakdown</h5>
                              <div className="space-y-1">
                                <div className="flex justify-between text-xs">
                                  <span className="text-blue-700">Overall Match:</span>
                                  <span className="font-semibold text-blue-900">{Math.round(rec.similarityScore * 100)}%</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                  <span className="text-blue-700">Profile Match:</span>
                                  <span className="font-semibold text-blue-900">{Math.round(rec.semanticSimilarity * 100)}%</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                  <span className="text-blue-700">Budget Fit:</span>
                                  <span className="font-semibold text-blue-900">{Math.round(rec.budgetFit * 100)}%</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                  <span className="text-blue-700">Location:</span>
                                  <span className="font-semibold text-blue-900">{Math.round(rec.locationProximity * 100)}%</span>
                                </div>
                              </div>
                              
                              {/* Progress bars for visual representation */}
                              <div className="mt-3 space-y-1">
                                <div className="flex items-center space-x-2">
                                  <div className="w-16 text-xs text-blue-700">Profile:</div>
                                  <div className="flex-1 bg-blue-200 rounded-full h-1.5">
                                    <div 
                                      className="bg-blue-600 h-1.5 rounded-full transition-all duration-300" 
                                      style={{ width: `${rec.semanticSimilarity * 100}%` }}
                                    ></div>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <div className="w-16 text-xs text-blue-700">Budget:</div>
                                  <div className="flex-1 bg-blue-200 rounded-full h-1.5">
                                    <div 
                                      className="bg-green-600 h-1.5 rounded-full transition-all duration-300" 
                                      style={{ width: `${rec.budgetFit * 100}%` }}
                                    ></div>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <div className="w-16 text-xs text-blue-700">Location:</div>
                                  <div className="flex-1 bg-blue-200 rounded-full h-1.5">
                                    <div 
                                      className="bg-purple-600 h-1.5 rounded-full transition-all duration-300" 
                                      style={{ width: `${rec.locationProximity * 100}%` }}
                                    ></div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Location & Status */}
                            <div className="mb-4">
                              <div className="flex justify-between items-center mb-2 text-sm">
                                <div className="text-gray-600">
                                  <span className="font-medium">{rec.carData.location.city}, {rec.carData.location.state}</span>
                                </div>
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                  rec.carData.status === "In Stock" 
                                    ? "bg-green-100 text-green-800" 
                                    : "bg-yellow-100 text-yellow-800"
                                }`}>
                                  {rec.carData.status}
                                </span>
                              </div>
                              <div className="text-xs text-gray-500">
                                <span className="font-medium">{rec.carData.dealership.name}</span>
                                <span className="ml-2">{rec.carData.dealership.phone}</span>
                              </div>
                            </div>

                            {/* Key Reasons */}
                            <div className="mb-4">
                              <h6 className="font-medium text-gray-700 mb-2">Key Reasons:</h6>
                              <ul className="space-y-1">
                                {rec.reasons.map((reason, reasonIndex) => (
                                  <li key={reasonIndex} className="text-sm text-gray-600 flex items-start">
                                    <span className="text-[#EB0A1E] mr-2">•</span>
                                    <span>{reason}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-2">
                              <button className="w-full py-2.5 px-4 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200">
                                View Details
                              </button>
                              <button className="w-full py-2.5 px-4 text-sm font-semibold text-white bg-[#EB0A1E] rounded-xl hover:bg-[#CF0A19] transition-all duration-200">
                                Contact Dealer
                              </button>
                            </div>
                          </div>
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

      <Footer />
    </div>
  );
};

export { RecommendationPage };