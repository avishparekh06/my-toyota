import React, { useState } from 'react';
import { authApi } from '@/services/api';

export const AuthTest: React.FC = () => {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testRegister = async () => {
    setLoading(true);
    try {
      const response = await authApi.register({
        firstName: 'Test',
        lastName: 'User',
        email: `test${Date.now()}@example.com`,
        password: 'password123'
      });
      setResult(`✅ Registration successful: ${response.data.user.email}`);
    } catch (error) {
      setResult(`❌ Registration failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    setLoading(false);
  };

  const testLogin = async () => {
    setLoading(true);
    try {
      const response = await authApi.login('test@example.com', 'password123');
      setResult(`✅ Login successful: ${response.data.user.email}`);
    } catch (error) {
      setResult(`❌ Login failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    setLoading(false);
  };

  const testProfile = async () => {
    setLoading(true);
    try {
      const response = await authApi.getProfile();
      setResult(`✅ Profile retrieved: ${response.data.firstName} ${response.data.lastName}`);
    } catch (error) {
      setResult(`❌ Profile failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    setLoading(false);
  };

  return (
    <div className="p-4 border rounded-lg bg-white">
      <h3 className="text-lg font-semibold mb-4">Auth API Test</h3>
      <div className="space-x-2 mb-4">
        <button 
          onClick={testRegister} 
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Test Register
        </button>
        <button 
          onClick={testLogin} 
          disabled={loading}
          className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
        >
          Test Login
        </button>
        <button 
          onClick={testProfile} 
          disabled={loading}
          className="px-4 py-2 bg-purple-500 text-white rounded disabled:opacity-50"
        >
          Test Profile
        </button>
      </div>
      {result && (
        <div className="p-2 bg-gray-100 rounded text-sm">
          {result}
        </div>
      )}
    </div>
  );
};
