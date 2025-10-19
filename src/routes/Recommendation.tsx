import { useState, useRef, useEffect } from 'react';
import { motion } from "framer-motion"
import { Footer } from "@/components/Footer"
import { Container } from "@/components/Container"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "@/contexts/AuthContext"
import { getRecommendations } from '../recommendation/ragRecommender';
import { RecommendationCard } from "@/components/RecommendationCard";
import { CarDetailModal } from "@/components/CarDetailModal";
import { Recommendation, RecommendationResult } from "@/types/recommendation";
const emblemLogo = "/images/logos/emblem_001.jpg";

const RecommendationPage = () => {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [recommendations, setRecommendations] = useState<Recommendation[] | null>(null);
  const [recommendationResult, setRecommendationResult] = useState<RecommendationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAllResults, setShowAllResults] = useState(false); // Show top 3 by default
  const [hasRequestedRecommendations, setHasRequestedRecommendations] = useState(false); // Track if user has requested recommendations
  const [selectedCar, setSelectedCar] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const recommendationsRef = useRef<HTMLDivElement>(null);

  // Check for existing recommendations on page load
  useEffect(() => {
    if (isAuthenticated && user) {
      // Check if user has previously requested recommendations
      const hasRequestedBefore = localStorage.getItem(`hasRequestedRecommendations_${user._id}`);
      const savedRecommendations = localStorage.getItem(`recommendations_${user._id}`);
      const savedRecommendationResult = localStorage.getItem(`recommendationResult_${user._id}`);
      
      if (hasRequestedBefore === 'true' && savedRecommendations && savedRecommendationResult) {
        try {
          const parsedRecommendations = JSON.parse(savedRecommendations);
          const parsedResult = JSON.parse(savedRecommendationResult);
          setRecommendations(parsedRecommendations);
          setRecommendationResult(parsedResult);
          setHasRequestedRecommendations(true);
        } catch (error) {
          console.error('Error parsing saved recommendations:', error);
        }
      }
    }
  }, [isAuthenticated, user]);

  // Simplified version without debouncing to prevent click issues
  const handleGetRecommendationsClick = () => {
    handleGetRecommendations();
  };

  const scrollToRecommendations = () => {
    if (recommendationsRef.current) {
      const elementTop = recommendationsRef.current.offsetTop;
      const offsetPosition = elementTop - 100; // Scroll down 100px less than the element position
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleGetRecommendations = async () => {
    // Prevent multiple simultaneous requests
    if (loading) {
      return;
    }

    if (!user) {
      setError('You must be logged in to get recommendations');
      return;
    }

    // Set states immediately
    setLoading(true);
    setError(null);
    setRecommendations(null);
    setHasRequestedRecommendations(true);
    
    // Clear any existing saved recommendations to get fresh ones
    localStorage.removeItem(`recommendations_${user._id}`);
    localStorage.removeItem(`recommendationResult_${user._id}`);

    try {
      // Use RAG system with user's ID - get more results to show all
      const result = await getRecommendations(user._id, 20); // Get more results
      
      setRecommendations(result.recommendations);
      setRecommendationResult(result);
      
      // Save recommendations to localStorage for persistence
      localStorage.setItem(`recommendations_${user._id}`, JSON.stringify(result.recommendations));
      localStorage.setItem(`recommendationResult_${user._id}`, JSON.stringify(result));
      localStorage.setItem(`hasRequestedRecommendations_${user._id}`, 'true');
      
      // Auto-scroll to recommendations after they're loaded
      setTimeout(() => {
        scrollToRecommendations();
      }, 100); // Small delay to ensure DOM is updated
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
      <div className="bg-gradient-to-br from-white via-gray-50 to-gray-100 pt-[68px] relative overflow-hidden">
        {/* Toyota Red Accent */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#EB0A1E] to-[#CF0A19]"></div>
        
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-3">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23EB0A1E' fill-opacity='0.05'%3E%3Ccircle cx='20' cy='20' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        
        <Container>
          <motion.div 
            className="py-20 text-center relative z-10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Toyota Logo */}
            <motion.div 
              className="mb-12"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <img
                src={emblemLogo}
                alt="Toyota Logo"
                className="h-16 w-auto mx-auto"
              />
            </motion.div>
            
            {/* Main Title */}
            <motion.h1 
              className="text-5xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Your Personalized
              <br />
              <motion.span 
                className="text-[#EB0A1E]"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                Toyota
              </motion.span> Match
            </motion.h1>
            
            {/* Subtitle */}
            <motion.p 
              className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              Discover your perfect Toyota with AI-powered recommendations tailored to your lifestyle, budget, and preferences.
            </motion.p>
            
            {/* User Info Card */}
            <motion.div 
              className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 max-w-4xl mx-auto border border-gray-200 shadow-xl"
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7, delay: 1.0 }}
            >
              <motion.div 
                className="flex items-center justify-center mb-6"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 1.2 }}
              >
                <motion.div 
                  className="w-16 h-16 bg-[#EB0A1E] rounded-full flex items-center justify-center mr-4 shadow-lg"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.4, delay: 1.4, type: "spring", stiffness: 200 }}
                >
                  <span className="text-white text-2xl font-bold">
                    {user?.firstName?.charAt(0)?.toUpperCase()}
                  </span>
                </motion.div>
                <div className="text-left">
                  <h2 className="text-2xl font-bold text-gray-900">Welcome back, {user?.firstName}!</h2>
                  <p className="text-gray-600">Ready to find your perfect Toyota?</p>
                </div>
              </motion.div>
              
              {user?.finance?.budgetRange && (
                <motion.div 
                  className="bg-gradient-to-r from-[#EB0A1E]/10 to-[#CF0A19]/10 rounded-2xl p-6 border border-[#EB0A1E]/20 mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.6 }}
                >
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2 text-[#EB0A1E]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                    </svg>
                    Your Budget Range
                  </h3>
                  <motion.div 
                    className="flex items-center justify-center space-x-12 text-lg"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 1.8 }}
                  >
                    <div className="text-center">
                      <span className="text-gray-500 block text-sm font-medium">Minimum</span>
                      <span className="font-bold text-[#EB0A1E] text-2xl">
                        ${user.finance.budgetRange.min.toLocaleString()}
                      </span>
                    </div>
                    <div className="text-[#EB0A1E] text-2xl">—</div>
                    <div className="text-center">
                      <span className="text-gray-500 block text-sm font-medium">Maximum</span>
                      <span className="font-bold text-[#EB0A1E] text-2xl">
                        ${user.finance.budgetRange.max.toLocaleString()}
                      </span>
                    </div>
                  </motion.div>
                </motion.div>
              )}
              
              {/* Get Recommendations Button */}
              <motion.div 
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 2.0 }}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Button 
                    onClick={handleGetRecommendationsClick}
                    disabled={loading}
                    className="bg-[#EB0A1E] hover:bg-[#CF0A19] text-white px-12 py-4 text-xl font-bold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300"
                  >
                    {loading ? (
                      <motion.div 
                        className="flex items-center space-x-3"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <motion.div 
                          className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        <span>Finding Your Perfect Toyota...</span>
                      </motion.div>
                    ) : (
                      <motion.div 
                        className="flex items-center space-x-3"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <motion.svg 
                          className="w-6 h-6" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                          animate={{ rotate: [0, 10, -10, 0] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </motion.svg>
                        <span>Get My Recommendations</span>
                      </motion.div>
                    )}
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </Container>
      </div>

      {/* Main Content */}
      <Container>
        <div className="py-12">
          <div className="max-w-full mx-auto px-4">


            {/* Error Display */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
              >
                <Card className="mb-8 border-red-200 bg-red-50">
                  <CardContent className="p-6">
                    <motion.div 
                      className="text-red-800"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <h3 className="font-semibold mb-2">Error</h3>
                      <p>{error}</p>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            )}


            {/* No Recommendations Message */}
            {hasRequestedRecommendations && !loading && recommendations && recommendations.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, type: "spring", stiffness: 150 }}
              >
                <Card className="mb-8">
                  <CardContent className="p-6 text-center">
                    <motion.div 
                      className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.4, delay: 0.3, type: "spring", stiffness: 200 }}
                    >
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.709M15 6.291A7.962 7.962 0 0012 5c-2.34 0-4.29 1.009-5.824 2.709" />
                      </svg>
                    </motion.div>
                    <motion.h3 
                      className="text-xl font-semibold text-gray-900 mb-2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      No Recommendations Found
                    </motion.h3>
                    <motion.p 
                      className="text-gray-600 mb-4"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                    >
                      We couldn't find any cars that match your current profile and preferences.
                    </motion.p>
                    <motion.p 
                      className="text-sm text-gray-500"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9 }}
                    >
                      Try updating your profile or adjusting your preferences to get better matches.
                    </motion.p>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Loading State */}
            {hasRequestedRecommendations && loading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="mb-8"
              >
                <Card>
                  <CardContent className="p-8 text-center">
                    <motion.div
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                    >
                      <div className="w-16 h-16 bg-gradient-to-br from-[#EB0A1E]/10 to-[#CF0A19]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <motion.div 
                          className="w-8 h-8 border-3 border-[#EB0A1E] border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                      </div>
                    </motion.div>
                    <motion.h3
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4, delay: 0.2 }}
                      className="text-xl font-semibold text-gray-900 mb-2"
                    >
                      Finding Your Perfect Toyota...
                    </motion.h3>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4, delay: 0.3 }}
                      className="text-gray-600"
                    >
                      Analyzing your preferences and matching them with our inventory
                    </motion.p>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Recommendations Display */}
            {hasRequestedRecommendations && !loading && recommendations && recommendations.length > 0 && (
              <motion.div
                ref={recommendationsRef}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Card>
                    <CardContent className="p-6">
                      <motion.div 
                        className="flex justify-between items-center mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.4 }}
                      >
                        <h3 className="text-2xl font-semibold text-gray-900">
                          Your Personalized Recommendations
                        </h3>
                        <div className="flex items-center space-x-4">
                          {recommendationResult && (
                            <motion.div 
                              className="text-sm text-gray-600"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.6 }}
                            >
                              <span className="font-medium">{recommendationResult.filteredCars}</span> of{' '}
                              <span className="font-medium">{recommendationResult.totalCarsAnalyzed}</span> cars match
                            </motion.div>
                          )}
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Button
                              onClick={() => setShowAllResults(!showAllResults)}
                              variant="outline"
                              size="sm"
                            >
                              {showAllResults ? 'Show Top 3' : 'Show All Results'}
                            </Button>
                          </motion.div>
                        </div>
                      </motion.div>

                    {/* Results Summary */}
                    {recommendationResult && (
                      <motion.div 
                        className="bg-gradient-to-r from-[#EB0A1E]/10 to-gray-100 rounded-lg p-4 mb-6 border border-[#EB0A1E]/20"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.8 }}
                      >
                        <motion.div 
                          className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.6, delay: 1.0 }}
                        >
                          <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.4, delay: 1.2 }}
                          >
                            <div className="text-2xl font-bold text-[#EB0A1E]">{recommendations.length}</div>
                            <div className="text-sm text-gray-600">Recommendations Found</div>
                          </motion.div>
                          <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.4, delay: 1.4 }}
                          >
                            <div className="text-2xl font-bold text-gray-700">{recommendationResult.totalCarsAnalyzed}</div>
                            <div className="text-sm text-gray-600">Cars Analyzed</div>
                          </motion.div>
                          <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.4, delay: 1.6 }}
                          >
                            <div className="text-2xl font-bold text-[#EB0A1E]">
                              {recommendations.length > 0 ? Math.round(recommendations[0].similarityScore * 100) : 0}%
                            </div>
                            <div className="text-sm text-gray-600">Best Match Score</div>
                          </motion.div>
                        </motion.div>
                        
                        {/* Scoring Weights Info */}
                        <motion.div 
                          className="mt-4 pt-4 border-t border-gray-200"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.4, delay: 1.8 }}
                        >
                          <div className="text-center">
                            <h4 className="text-sm font-semibold text-gray-700 mb-2">Scoring Weights</h4>
                            <div className="flex justify-center space-x-6 text-xs text-gray-600">
                              <span>Profile Match: <span className="font-semibold">60%</span></span>
                              <span>Budget Fit: <span className="font-semibold">30%</span></span>
                              <span>Location: <span className="font-semibold">10%</span></span>
                            </div>
                          </div>
                        </motion.div>
                      </motion.div>
                    )}
                    
                    <motion.div 
                      className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 2.0 }}
                    >
                      {(showAllResults ? recommendations : recommendations.slice(0, 3)).map((rec, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 30, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ 
                            duration: 0.5, 
                            delay: 2.2 + (index * 0.1),
                            type: "spring",
                            stiffness: 100,
                            damping: 15
                          }}
                          whileHover={{ 
                            scale: 1.02,
                            transition: { duration: 0.2 }
                          }}
                          className="mb-6"
                        >
                          <RecommendationCard 
                            recommendation={rec}
                            rank={index + 1}
                            onViewDetails={handleViewDetails}
                          />
                        </motion.div>
                      ))}
                    </motion.div>
                  </CardContent>
                </Card>
                </motion.div>
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