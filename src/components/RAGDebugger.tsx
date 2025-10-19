import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ragRecommender } from '../recommendation/ragRecommender';
import { authApi } from '../services/api';

const RAGDebugger: React.FC = () => {
  const { user } = useAuth();
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runDebugTest = async () => {
    setLoading(true);
    setError(null);
    setDebugInfo(null);

    try {
      const results: any = {};

      // Test 1: Check system status
      results.systemStatus = ragRecommender.getStatus();
      console.log('System Status:', results.systemStatus);

      // Test 2: Get user profile from backend
      if (user) {
        try {
          const profileResponse = await authApi.getProfile();
          results.userProfile = {
            success: profileResponse.success,
            data: profileResponse.data,
            hasPersonal: !!profileResponse.data?.personal,
            hasFinance: !!profileResponse.data?.finance,
            hasPreferences: !!profileResponse.data?.preferences
          };
          console.log('User Profile:', results.userProfile);
        } catch (err) {
          results.userProfile = { error: err instanceof Error ? err.message : 'Unknown error' };
        }
      }

      // Test 3: Test user data conversion
      if (user && results.userProfile?.success) {
        try {
          // Access the private method through type assertion
          const convertMethod = (ragRecommender as any).convertRealUserToRAGFormat;
          const convertedUser = convertMethod(results.userProfile.data);
          results.convertedUser = convertedUser;
          console.log('Converted User:', results.convertedUser);
        } catch (err) {
          results.convertedUser = { error: err instanceof Error ? err.message : 'Unknown error' };
        }
      }

      // Test 4: Test embedding generation
      if (results.convertedUser && !results.convertedUser.error) {
        try {
          const { EmbeddingService } = await import('../services/embeddingService');
          const embeddingService = EmbeddingService.getInstance();
          const userText = embeddingService.createUserProfileText(results.convertedUser);
          results.userProfileText = userText;
          console.log('User Profile Text:', results.userProfileText);
        } catch (err) {
          results.userProfileText = { error: err instanceof Error ? err.message : 'Unknown error' };
        }
      }

      // Test 5: Test car embedding generation
      try {
        const { mockCars } = await import('../recommendation/mockData');
        const { EmbeddingService } = await import('../services/embeddingService');
        const embeddingService = EmbeddingService.getInstance();
        
        if (mockCars && mockCars.length > 0) {
          const testCar = mockCars[0];
          const carText = embeddingService.createCarFeatureText(testCar);
          results.testCarEmbedding = {
            carName: `${testCar.year} ${testCar.make} ${testCar.model}`,
            carText: carText,
            carData: testCar
          };
          console.log('Test Car Embedding:', results.testCarEmbedding);
        }
      } catch (err) {
        results.testCarEmbedding = { error: err instanceof Error ? err.message : 'Unknown error' };
      }

      setDebugInfo(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">RAG System Debugger</h2>
      
      <div className="mb-4">
        <button
          onClick={runDebugTest}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
        >
          {loading ? 'Running Tests...' : 'Run Debug Tests'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <h3 className="text-red-800 font-semibold">Error</h3>
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {debugInfo && (
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">System Status</h3>
            <pre className="text-sm text-gray-700 overflow-auto">
              {JSON.stringify(debugInfo.systemStatus, null, 2)}
            </pre>
          </div>

          {debugInfo.userProfile && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">User Profile</h3>
              <pre className="text-sm text-gray-700 overflow-auto max-h-64">
                {JSON.stringify(debugInfo.userProfile, null, 2)}
              </pre>
            </div>
          )}

          {debugInfo.convertedUser && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Converted User Data</h3>
              <pre className="text-sm text-gray-700 overflow-auto max-h-64">
                {JSON.stringify(debugInfo.convertedUser, null, 2)}
              </pre>
            </div>
          )}

          {debugInfo.userProfileText && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">User Profile Text for Embedding</h3>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">
                {typeof debugInfo.userProfileText === 'string' 
                  ? debugInfo.userProfileText 
                  : JSON.stringify(debugInfo.userProfileText, null, 2)}
              </p>
            </div>
          )}

          {debugInfo.testCarEmbedding && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Test Car Embedding</h3>
              <div className="space-y-2">
                <div>
                  <span className="font-medium text-gray-700">Car:</span> {debugInfo.testCarEmbedding.carName}
                </div>
                <div>
                  <span className="font-medium text-gray-700">Feature Text:</span>
                  <p className="text-sm text-gray-600 mt-1 whitespace-pre-wrap">
                    {debugInfo.testCarEmbedding.carText}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Car Data:</span>
                  <pre className="text-xs text-gray-600 mt-1 overflow-auto max-h-32">
                    {JSON.stringify(debugInfo.testCarEmbedding.carData, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RAGDebugger;
