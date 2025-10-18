import React, { useState } from 'react';
import { 
  getRecommendations, 
  getAllUserRecommendations,
  getRecommendationsByName 
} from '../recommendation/recommender.js';

const RecommendationTest = () => {
  const [selectedUser, setSelectedUser] = useState('user_001');
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Mock users for the dropdown
  const users = [
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
      setError(err.message);
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
      setRecommendations({ allUsers: results });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-blue-600 bg-blue-100';
    if (score >= 40) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🧪 Recommendation Engine Test
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Test the Toyota car recommendation system with different user profiles
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Test Controls</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="userSelect" className="block text-sm font-medium text-gray-700 mb-2">
                Select User Profile
              </label>
              <select
                id="userSelect"
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name} - {user.location} ({user.budget})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end space-x-4">
              <button
                onClick={handleGetRecommendations}
                disabled={loading}
                className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-semibold py-2 px-6 rounded-md transition duration-200"
              >
                {loading ? 'Loading...' : 'Get Recommendations'}
              </button>
              
              <button
                onClick={handleGetAllRecommendations}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-6 rounded-md transition duration-200"
              >
                {loading ? 'Loading...' : 'All Users'}
              </button>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Results */}
        {recommendations && (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {recommendations.allUsers ? (
              // All users view
              <div>
                <div className="px-6 py-4 bg-gray-50 border-b">
                  <h2 className="text-2xl font-semibold text-gray-900">
                    All Users Recommendations
                  </h2>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recommendations.allUsers.map((userRec, index) => (
                      <div key={index} className="border rounded-lg p-4 bg-gray-50">
                        <h3 className="font-semibold text-lg mb-2">{userRec.user.name}</h3>
                        <p className="text-sm text-gray-600 mb-3">
                          {userRec.user.location.city}, {userRec.user.location.state}
                        </p>
                        <div className="space-y-2">
                          {userRec.recommendations.slice(0, 2).map((rec, idx) => (
                            <div key={idx} className="text-sm">
                              <div className="font-medium">
                                {rec.car.year} {rec.car.make} {rec.car.model}
                              </div>
                              <div className="text-gray-600">
                                {formatCurrency(rec.car.dealerPrice)} - Score: {rec.score}/100
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              // Single user view
              <div>
                <div className="px-6 py-4 bg-gray-50 border-b">
                  <h2 className="text-2xl font-semibold text-gray-900">
                    Recommendations for {recommendations.user.name}
                  </h2>
                  <p className="text-gray-600 mt-1">
                    {recommendations.user.location.city}, {recommendations.user.location.state} • 
                    Budget: {formatCurrency(recommendations.user.budget.min)} - {formatCurrency(recommendations.user.budget.max)}
                  </p>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {recommendations.recommendations.map((rec, index) => (
                      <div key={index} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900">
                              {rec.car.year} {rec.car.make} {rec.car.model} {rec.car.trim}
                            </h3>
                            <p className="text-gray-600">{rec.car.category}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getScoreColor(rec.score)}`}>
                            {rec.score}/100
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <span className="text-sm font-medium text-gray-500">Price:</span>
                            <div className="text-lg font-semibold">
                              {formatCurrency(rec.car.dealerPrice)}
                            </div>
                            <div className="text-sm text-gray-500">
                              MSRP: {formatCurrency(rec.car.msrp)}
                            </div>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-500">Specs:</span>
                            <div className="text-sm">
                              <div>{rec.car.bodyStyle} • {rec.car.fuelType}</div>
                              <div>{rec.car.drivetrain} • {rec.car.mpgCity}/{rec.car.mpgHighway} MPG</div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <span className="text-sm font-medium text-gray-500">Location:</span>
                          <div className="text-sm">
                            {rec.car.location.city}, {rec.car.location.state}
                          </div>
                        </div>
                        
                        <div>
                          <span className="text-sm font-medium text-gray-500">Why this car:</span>
                          <ul className="text-sm text-gray-600 mt-1 space-y-1">
                            {rec.reasons.map((reason, idx) => (
                              <li key={idx} className="flex items-start">
                                <span className="text-green-500 mr-2">•</span>
                                {reason}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Statistics */}
                  <div className="mt-8 bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommendation Statistics</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">
                          {recommendations.totalCarsAnalyzed}
                        </div>
                        <div className="text-sm text-gray-600">Cars Analyzed</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">
                          {recommendations.recommendationsReturned}
                        </div>
                        <div className="text-sm text-gray-600">Recommendations</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">
                          {recommendations.statistics.averageScore}
                        </div>
                        <div className="text-sm text-gray-600">Avg Score</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">
                          {recommendations.statistics.scoreDistribution.excellent}
                        </div>
                        <div className="text-sm text-gray-600">Excellent (80+)</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecommendationTest;
