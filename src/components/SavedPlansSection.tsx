import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, Trash2, Heart, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface SavedPlan {
  planId: string;
  planType: string;
  planName: string;
  term: string;
  downPayment: number;
  monthlyPayment: number;
  apr: number;
  totalAmount: number;
  isRecommended: boolean;
  favoritedAt: string;
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
}

const SavedPlansSection: React.FC = () => {
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
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent)] mx-auto mb-4"></div>
          <p className="text-[var(--muted)]">Loading saved plans...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="lg:col-span-2"
    >
      <Card className="bg-[var(--card)] border-[var(--border)] shadow-[var(--shadow)] rounded-xl hover:shadow-lg transition-all duration-300">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[var(--accent)]/10 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-[var(--accent)]" />
              </div>
              <span className="text-[var(--text)]">Saved Plans</span>
            </CardTitle>
            
            {favoritedPlans.length > 0 && (
              <div className="flex items-center gap-2">
                <Button
                  onClick={exportCSV}
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2 text-[var(--muted)] hover:text-[var(--text)] border-[var(--border)] hover:border-[var(--accent)]"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Export CSV</span>
                  <span className="sm:hidden">CSV</span>
                </Button>

                <Button
                  onClick={exportPDF}
                  size="sm"
                  className="bg-[var(--accent)] hover:bg-[var(--accent-600)] text-white flex items-center space-x-2"
                >
                  <FileText className="w-4 h-4" />
                  <span className="hidden sm:inline">Export PDF</span>
                  <span className="sm:hidden">PDF</span>
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {message && (
            <div className={`mb-4 px-4 py-2 rounded-lg text-sm ${
              message.includes('successfully') || message.includes('deleted')
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}>
              {message}
            </div>
          )}

          {favoritedPlans.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-[var(--accent)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-[var(--accent)]" />
              </div>
              <h3 className="text-lg font-semibold text-[var(--text)] mb-2">No Saved Plans</h3>
              <p className="text-[var(--muted)] mb-6">You haven't saved any financing plans yet.</p>
              <Button
                onClick={() => navigate('/recommendations')}
                className="bg-[var(--accent)] hover:bg-[var(--accent-600)] text-white"
              >
                Browse Cars & Plans
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {favoritedPlans.map((savedPlan) => (
                <motion.div
                  key={savedPlan.planId}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="bg-[var(--bg)] rounded-lg border border-[var(--border)] p-4 hover:shadow-md transition-all duration-200"
                >
                  {/* Card Header */}
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
                        <span className="inline-flex px-2 py-0.5 text-xs font-medium rounded-full bg-[var(--accent)] text-white">
                          Recommended
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => deletePlan(savedPlan.planId)}
                      className="text-[var(--muted)] hover:text-red-500 transition-colors duration-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-[var(--text)] mb-1">
                    {savedPlan.car.year} {savedPlan.car.make} {savedPlan.car.model}
                  </h3>
                  <p className="text-sm text-[var(--muted)] mb-2">{savedPlan.planName}</p>
                  <p className="text-xs text-[var(--muted)] mb-4">
                    Favorited on {new Date(savedPlan.favoritedAt).toLocaleDateString()}
                  </p>

                  {/* Card Content */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-[var(--muted)]">Monthly Payment</span>
                      <span className="text-lg font-semibold text-[var(--text)]">${savedPlan.monthlyPayment.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-[var(--muted)]">APR</span>
                      <span className="text-base font-semibold text-[var(--text)]">{savedPlan.apr.toFixed(2)}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-[var(--muted)]">Term</span>
                      <span className="text-base font-semibold text-[var(--text)]">{savedPlan.term}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-[var(--muted)]">Total Amount</span>
                      <span className="text-base font-semibold text-[var(--text)]">${savedPlan.totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-[var(--border)]">
                    <div className="text-xs text-[var(--muted)] space-y-1">
                      <p><span className="font-medium">Credit Score:</span> {savedPlan.financialInputs.creditScore}</p>
                      <p><span className="font-medium">Annual Income:</span> ${savedPlan.financialInputs.annualIncome}</p>
                      <p><span className="font-medium">Monthly Budget:</span> ${savedPlan.financialInputs.monthlyBudget}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SavedPlansSection;
