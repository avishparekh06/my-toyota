import React, { useState } from 'react';
import { motion } from "framer-motion"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { Container } from "@/components/Container"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { 
  getRecommendations, 
  getAllUserRecommendations,
  getRecommendationsByName 
} from '../recommendation/simpleRecommender.js';

interface User {
  id: string;
  name: string;
  location: string;
  budget: string;
}

interface Recommendation {
  car: string;
  score: number;
  reasons: string[];
}

const RecommendationPage = () => {
  const [selectedUser, setSelectedUser] = useState('user_001');
  const [recommendations, setRecommendations] = useState<Recommendation[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock users for the dropdown
  const users: User[] = [
    { id: 'user_001', name: 'Ava Martinez', location: 'Austin, TX', budget: '$30,000 - $40,000' },
    { id: 'user_002', name: 'Daniel Kim', location: 'Houston, TX', budget: '$40,000 - $55,000' },
    { id: 'user_003', name: 'Sophia Patel', location: 'Dallas, TX', budget: '$30,000 - $50,000' },
    { id: 'user_004', name: 'Ethan Johnson', location: 'Los Angeles, CA', budget: '$70,000 - $85,000' },
    { id: 'user_005', name: 'Lily Chen', location: 'Atlanta, GA', budget: '$25,000 - $35,000' }
  ];

  const handleGetRecommendations = async () => {
    setLoading(true);
    setError(null);
    setRecommendations(null);

    try {
      const result = await getRecommendations(selectedUser, 5);
      setRecommendations(result);
    } catch (err) {
      console.error('Error getting recommendations:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleGetAllRecommendations = async () => {
    setLoading(true);
    setError(null);
    setRecommendations(null);

    try {
      const results = await getAllUserRecommendations(3);
      setRecommendations({ allUsers: results } as any);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleGetRecommendationsByName = async () => {
    setLoading(true);
    setError(null);
    setRecommendations(null);

    try {
      const results = await getRecommendationsByName('Ava Martinez', 3);
      setRecommendations(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <Navbar />
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <Container>
          <div className="py-12 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Smart Vehicle Recommendations
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get personalized Toyota recommendations based on your profile, preferences, and financial situation.
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
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Select Your Profile</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Choose a user profile:
                    </label>
                    <select
                      value={selectedUser}
                      onChange={(e) => setSelectedUser(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EB0A1E] focus:border-transparent"
                    >
                      {users.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.name} - {user.location} ({user.budget})
                        </option>
                      ))}
                    </select>
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

            {/* Test Buttons */}
            <Card className="mb-8">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Test Different Scenarios</h3>
                <div className="flex flex-wrap gap-4">
                  <Button 
                    onClick={handleGetAllRecommendations}
                    disabled={loading}
                    variant="outline"
                  >
                    Get All User Recommendations
                  </Button>
                  <Button 
                    onClick={handleGetRecommendationsByName}
                    disabled={loading}
                    variant="outline"
                  >
                    Get Recommendations by Name
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
                    
                    {Array.isArray(recommendations) ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {recommendations.map((rec, index) => (
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
                                <span className="bg-[#EB0A1E] text-white px-3 py-1 rounded-full text-sm font-semibold">
                                  {Math.round(rec.score * 100)}% Match
                                </span>
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
                    ) : (
                      <div className="space-y-6">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">
                          All User Recommendations
                        </h4>
                        {Object.entries(recommendations.allUsers || {}).map(([userId, userRecs]: [string, any]) => (
                          <div key={userId} className="border border-gray-200 rounded-lg p-4">
                            <h5 className="font-semibold text-gray-900 mb-3">User: {userId}</h5>
                            <div className="space-y-3">
                              {userRecs.map((rec: any, index: number) => (
                                <div key={index} className="bg-gray-50 rounded p-3">
                                  <div className="flex justify-between items-center mb-2">
                                    <span className="font-medium">{rec.car}</span>
                                    <span className="text-sm text-gray-600">
                                      {Math.round(rec.score * 100)}% Match
                                    </span>
                                  </div>
                                  <ul className="text-sm text-gray-600 space-y-1">
                                    {rec.reasons.map((reason: string, reasonIndex: number) => (
                                      <li key={reasonIndex} className="flex items-start">
                                        <span className="mr-2">•</span>
                                        <span>{reason}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
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
