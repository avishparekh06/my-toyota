import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface SavedPlan {
  _id: string;
  plan: {
    id: string;
    type: string;
    name: string;
    term: string;
    downPayment: number;
    monthlyPayment: number;
    apr: number;
    totalAmount: number;
    isRecommended: boolean;
  };
  car: {
    make: string;
    model: string;
    year: number;
    trim: string;
    msrp: number;
    dealerPrice: number;
    location: {
      city: string;
      state: string;
    };
  };
  financialInputs: {
    creditScore: string;
    annualIncome: string;
    downPayment: string;
    preferredTerm: string;
    monthlyBudget: string;
  };
  savedAt: string;
}

const SavedPlans: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [favoritedPlans, setFavoritedPlans] = useState<SavedPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      fetchSavedPlans();
    }
  }, [user]);

  const fetchSavedPlans = async () => {
    try {
      const response = await fetch(`http://localhost:5001/api/users/${user?._id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      if (response.ok) {
        const userData = await response.json();
        setFavoritedPlans(userData.data.favoritedPlans || []);
      } else {
        setMessage('Failed to load saved plans');
      }
    } catch (error) {
      console.error('Error fetching saved plans:', error);
      setMessage('Error loading saved plans');
    } finally {
      setLoading(false);
    }
  };

  const deletePlan = async (planId: string) => {
    try {
      const response = await fetch(`http://localhost:5001/api/users/${user?._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          favoritedPlans: {
            $pull: { planId: planId }
          }
        })
      });
      
      if (response.ok) {
        setFavoritedPlans(prev => prev.filter(plan => plan.planId !== planId));
        setMessage('Plan deleted successfully');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Failed to delete plan');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error deleting plan:', error);
      setMessage('Error deleting plan');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const exportCSV = async () => {
    try {
      const response = await fetch(`http://localhost:5001/api/user-plans/export/${user?._id}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'favorited-plans.csv';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        setMessage('Failed to export plans');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error exporting plans:', error);
      setMessage('Error exporting plans');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const exportPDF = async () => {
    try {
      const response = await fetch(`http://localhost:5001/api/user-plans/export-pdf/${user?._id}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'user_plans.pdf';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        setMessage('Failed to export PDF');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error exporting PDF:', error);
      setMessage('Error exporting PDF');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#EB0A1E] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading saved plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] pt-20 pb-8 px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Saved Plans</h1>
              <p className="text-gray-600">Your saved financing plans and recommended cars</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => navigate('/recommendations')}
                className="flex items-center space-x-2 px-3 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span className="hidden sm:inline">Back to Recommendations</span>
                <span className="sm:hidden">Back</span>
              </button>
              
              <button
                onClick={exportCSV}
                disabled={favoritedPlans.length === 0}
                className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                  favoritedPlans.length === 0 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                    : 'bg-gray-600 text-white hover:bg-gray-700'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="hidden sm:inline">Export CSV</span>
                <span className="sm:hidden">CSV</span>
              </button>

              <button
                onClick={exportPDF}
                disabled={favoritedPlans.length === 0}
                className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                  favoritedPlans.length === 0 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                    : 'bg-[#EB0A1E] text-white hover:bg-[#EB0A1E]/90'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <span className="hidden sm:inline">Export PDF</span>
                <span className="sm:hidden">PDF</span>
              </button>
            </div>
          </div>
          
          {message && (
            <div className={`mt-4 px-4 py-2 rounded-lg text-sm ${
              message.includes('successfully') || message.includes('deleted')
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}>
              {message}
            </div>
          )}
        </div>

        {/* Saved Plans Grid */}
        {favoritedPlans.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Saved Plans</h3>
            <p className="text-gray-600 mb-6">You haven't saved any financing plans yet.</p>
            <button
              onClick={() => navigate('/recommendations')}
              className="px-6 py-3 bg-[#EB0A1E] text-white font-medium rounded-lg hover:bg-[#EB0A1E]/90 transition-colors duration-200"
            >
              Browse Cars & Plans
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoritedPlans.map((savedPlan) => (
              <div key={savedPlan._id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                {/* Card Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
                        savedPlan.planType === 'Finance' ? 'bg-green-100 text-green-700 border border-green-200' : 
                        savedPlan.planType === 'Lease' ? 'bg-blue-100 text-blue-700 border border-blue-200' : 
                        'bg-gray-100 text-gray-700 border border-gray-200'
                      }`}>
                        {savedPlan.planType}
                      </span>
                      {savedPlan.isRecommended && (
                        <span className="inline-flex px-2 py-0.5 text-xs font-medium rounded-full bg-[#EB0A1E] text-white">
                          Recommended
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => deletePlan(savedPlan.planId)}
                      className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {savedPlan.car.year} {savedPlan.car.make} {savedPlan.car.model}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">{savedPlan.planName}</p>
                  <p className="text-xs text-gray-500">
                    Favorited on {new Date(savedPlan.favoritedAt).toLocaleDateString()}
                  </p>
                </div>

                {/* Card Content */}
                <div className="p-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Monthly Payment</span>
                      <span className="text-lg font-semibold text-gray-900">${savedPlan.monthlyPayment.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">APR</span>
                      <span className="text-base font-semibold text-gray-900">{savedPlan.apr.toFixed(2)}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Term</span>
                      <span className="text-base font-semibold text-gray-900">{savedPlan.term}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Total Amount</span>
                      <span className="text-base font-semibold text-gray-900">${savedPlan.totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="text-xs text-gray-500 space-y-1">
                      <p><span className="font-medium">Credit Score:</span> {savedPlan.financialInputs.creditScore}</p>
                      <p><span className="font-medium">Annual Income:</span> ${savedPlan.financialInputs.annualIncome}</p>
                      <p><span className="font-medium">Monthly Budget:</span> ${savedPlan.financialInputs.monthlyBudget}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedPlans;
