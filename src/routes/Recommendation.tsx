import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { Footer } from "@/components/Footer"
import { Container } from "@/components/Container"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "@/contexts/AuthContext"
import { 
  getAuthenticatedRecommendations,
  getAuthenticatedRecommendationSummary 
} from '../recommendation/authenticatedRecommender.js';

interface Recommendation {
  car: {
    id: string;
    year: number;
    make: string;
    model: string;
    trim: string;
    bodyStyle: string;
    fuelType: string;
    drivetrain: string;
    mpgCity: number;
    mpgHighway: number;
    msrp: number;
    dealerPrice: number;
    features: string[];
    category: string;
    location: {
      city: string;
      state: string;
    };
    safetyRating: number;
    reliabilityScore: number;
    fuelEconomyScore: number;
  };
  score: number;
  scoreBreakdown: any;
  reasons: string[];
}

const RecommendationPage = () => {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [recommendations, setRecommendations] = useState<Recommendation[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      const result = getAuthenticatedRecommendations(user, 5);
      setRecommendations(result.recommendations);
    } catch (err) {
      console.error('Error getting recommendations:', err);
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
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Login Required</h2>
                <p className="text-gray-600 mb-6">
                  You need to be logged in to get personalized vehicle recommendations based on your profile.
                </p>
                <Button 
                  onClick={() => window.location.href = '/auth'}
                  className="w-full bg-[#EB0A1E] hover:bg-[#CF0A19] text-white"
                >
                  Go to Login
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
    <div className="min-h-screen bg-[var(--bg)] pt-[68px]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <Container>
          <div className="py-12 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Your Personalized Recommendations
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get personalized Toyota recommendations based on your profile, preferences, and financial situation.
            </p>
            {user && (
              <div className="mt-6 inline-flex items-center px-4 py-2 bg-[#EB0A1E]/10 rounded-full">
                <span className="text-sm font-medium text-[#EB0A1E]">
                  Welcome back, {user.firstName}!
                </span>
              </div>
            )}
          </div>
        </Container>
      </div>

      {/* Main Content */}
      <Container>
        <div className="py-12">
          <div className="max-w-4xl mx-auto">
            {/* Refresh Button */}
            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your Recommendations</h2>
                    <p className="text-gray-600">
                      Based on your profile data and preferences
                    </p>
                  </div>
                  <Button 
                    onClick={handleGetRecommendations}
                    disabled={loading}
                    className="bg-[#EB0A1E] hover:bg-[#CF0A19] text-white"
                  >
                    {loading ? 'Refreshing...' : 'Refresh Recommendations'}
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

            {/* Recommendations Display */}
            {recommendations && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                      Your Personalized Recommendations
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {recommendations.map((rec, index) => (
                        <motion.div
                          key={rec.car.id}
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
                              <span className="bg-[#EB0A1E] text-white px-3 py-1 rounded-full text-sm font-semibold">
                                {rec.score}% Match
                              </span>
                            </div>
                          </div>

                          {/* Card Content */}
                          <div className="p-5">
                            {/* Car Name */}
                            <h4 className="text-xl font-bold text-gray-900 mb-2">
                              {rec.car.year} {rec.car.make} {rec.car.model} {rec.car.trim}
                            </h4>

                            {/* Car Details Grid */}
                            <div className="grid grid-cols-2 gap-3 mb-4">
                              <div className="bg-gray-50 rounded-lg p-3">
                                <div className="text-gray-500 text-xs uppercase tracking-wide font-medium mb-1">Body Style</div>
                                <div className="font-semibold text-gray-900 text-sm">{rec.car.bodyStyle}</div>
                              </div>
                              <div className="bg-gray-50 rounded-lg p-3">
                                <div className="text-gray-500 text-xs uppercase tracking-wide font-medium mb-1">MPG</div>
                                <div className="font-semibold text-gray-900 text-sm">{rec.car.mpgCity}/{rec.car.mpgHighway}</div>
                              </div>
                              <div className="bg-gray-50 rounded-lg p-3">
                                <div className="text-gray-500 text-xs uppercase tracking-wide font-medium mb-1">Drivetrain</div>
                                <div className="font-semibold text-gray-900 text-sm">{rec.car.drivetrain}</div>
                              </div>
                              <div className="bg-gray-50 rounded-lg p-3">
                                <div className="text-gray-500 text-xs uppercase tracking-wide font-medium mb-1">Fuel Type</div>
                                <div className="font-semibold text-gray-900 text-sm">{rec.car.fuelType}</div>
                              </div>
                            </div>

                            {/* Pricing */}
                            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 mb-4">
                              <div className="flex items-baseline justify-between mb-1">
                                <span className="text-sm text-gray-600 font-medium">Starting at</span>
                                <span className="text-2xl font-bold text-gray-900">
                                  ${rec.car.dealerPrice.toLocaleString()}
                                </span>
                              </div>
                              <div className="text-sm text-gray-500">
                                MSRP: ${rec.car.msrp.toLocaleString()}
                              </div>
                            </div>

                            {/* Location */}
                            <div className="mb-4">
                              <div className="flex justify-between items-center mb-2 text-sm">
                                <div className="text-gray-600">
                                  <span className="font-medium">{rec.car.location.city}, {rec.car.location.state}</span>
                                </div>
                                <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                                  Available
                                </span>
                              </div>
                            </div>

                            {/* Why This Car Fits */}
                            <div className="mb-4">
                              <h5 className="font-semibold text-gray-700 mb-2">Why this car fits you:</h5>
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
                              <Link 
                                to={`/plans?car=${encodeURIComponent(JSON.stringify(rec.car))}`}
                                className="w-full py-2.5 px-4 text-sm font-semibold text-white bg-[#EB0A1E] rounded-xl hover:bg-[#CF0A19] transition-all duration-200 block text-center"
                              >
                                Explore Financial Plans
                              </Link>
                              <button className="w-full py-2.5 px-4 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200">
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
