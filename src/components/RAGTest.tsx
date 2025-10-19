import React, { useState } from 'react';
import { ragRecommender } from '../recommendation/ragRecommender';

const RAGTest: React.FC = () => {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkSystemStatus = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const systemStatus = ragRecommender.getStatus();
      setStatus(systemStatus);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const initializeSystem = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await ragRecommender.initialize();
      const systemStatus = ragRecommender.getStatus();
      setStatus(systemStatus);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">RAG System Status</h3>
      
      <div className="space-y-4">
        <div className="flex gap-4">
          <button
            onClick={checkSystemStatus}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Checking...' : 'Check Status'}
          </button>
          
          <button
            onClick={initializeSystem}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Initializing...' : 'Initialize System'}
          </button>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {status && (
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
            <h4 className="font-medium text-gray-900 mb-2">System Status:</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Initialized:</span>
                <span className={`ml-2 px-2 py-1 rounded text-xs ${
                  status.initialized ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {status.initialized ? 'Yes' : 'No'}
                </span>
              </div>
              <div>
                <span className="font-medium">User Embeddings:</span>
                <span className="ml-2">{status.userEmbeddings}</span>
              </div>
              <div>
                <span className="font-medium">Car Embeddings:</span>
                <span className="ml-2">{status.carEmbeddings}</span>
              </div>
              <div>
                <span className="font-medium">Total Users:</span>
                <span className="ml-2">{status.totalUsers}</span>
              </div>
              <div>
                <span className="font-medium">Total Cars:</span>
                <span className="ml-2">{status.totalCars}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RAGTest;
