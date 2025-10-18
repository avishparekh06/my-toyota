import React, { useState, useEffect } from 'react';
import financingPlans from '../data/financingPlans.json';

const PlanSimulator = () => {
  const [financialInfo, setFinancialInfo] = useState({
    creditScore: '',
    annualIncome: '',
    downPayment: '',
    preferredTerm: '',
    monthlyBudget: ''
  });

  const [filteredPlans, setFilteredPlans] = useState(financingPlans);
  const [showResults, setShowResults] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFinancialInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateAffordability = (plan) => {
    const monthlyBudget = parseFloat(financialInfo.monthlyBudget) || 0;
    const monthlyPayment = plan.monthlyPayment;
    const downPayment = parseFloat(financialInfo.downPayment) || 0;
    const planDownPayment = plan.downPayment;
    
    return {
      affordable: monthlyPayment <= monthlyBudget && downPayment >= planDownPayment,
      withinBudget: monthlyPayment <= monthlyBudget,
      downPaymentMet: downPayment >= planDownPayment
    };
  };

  const filterPlans = () => {
    let filtered = [...financingPlans];

    // Filter by credit score
    const creditScore = parseInt(financialInfo.creditScore) || 0;
    if (creditScore > 0) {
      filtered = filtered.filter(plan => {
        if (plan.type === 'Lease') return creditScore >= 700;
        if (plan.type === 'Finance') return creditScore >= 680;
        if (plan.type === 'Special') return creditScore >= 600;
        return true;
      });
    }

    // Filter by preferred term
    if (financialInfo.preferredTerm) {
      filtered = filtered.filter(plan => 
        plan.term.includes(financialInfo.preferredTerm)
      );
    }

    // Filter by monthly budget
    const monthlyBudget = parseFloat(financialInfo.monthlyBudget) || 0;
    if (monthlyBudget > 0) {
      filtered = filtered.filter(plan => plan.monthlyPayment <= monthlyBudget);
    }

    setFilteredPlans(filtered);
    setShowResults(true);
  };

  const resetFilters = () => {
    setFinancialInfo({
      creditScore: '',
      annualIncome: '',
      downPayment: '',
      preferredTerm: '',
      monthlyBudget: ''
    });
    setFilteredPlans(financingPlans);
    setShowResults(false);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Lease': return 'bg-blue-100 text-blue-800';
      case 'Finance': return 'bg-green-100 text-green-800';
      case 'Special': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Toyota Financing Plan Simulator
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Input your financial information to see personalized Toyota lease and finance options
          </p>
        </div>

        {/* Financial Information Form */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Your Financial Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label htmlFor="creditScore" className="block text-sm font-medium text-gray-700 mb-2">
                Credit Score
              </label>
              <input
                type="number"
                id="creditScore"
                name="creditScore"
                value={financialInfo.creditScore}
                onChange={handleInputChange}
                placeholder="e.g., 750"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="annualIncome" className="block text-sm font-medium text-gray-700 mb-2">
                Annual Income
              </label>
              <input
                type="number"
                id="annualIncome"
                name="annualIncome"
                value={financialInfo.annualIncome}
                onChange={handleInputChange}
                placeholder="e.g., 75000"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="downPayment" className="block text-sm font-medium text-gray-700 mb-2">
                Available Down Payment
              </label>
              <input
                type="number"
                id="downPayment"
                name="downPayment"
                value={financialInfo.downPayment}
                onChange={handleInputChange}
                placeholder="e.g., 5000"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="preferredTerm" className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Term
              </label>
              <select
                id="preferredTerm"
                name="preferredTerm"
                value={financialInfo.preferredTerm}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">Any Term</option>
                <option value="24">24 months</option>
                <option value="36">36 months</option>
                <option value="48">48 months</option>
                <option value="60">60 months</option>
                <option value="72">72 months</option>
              </select>
            </div>

            <div>
              <label htmlFor="monthlyBudget" className="block text-sm font-medium text-gray-700 mb-2">
                Monthly Budget
              </label>
              <input
                type="number"
                id="monthlyBudget"
                name="monthlyBudget"
                value={financialInfo.monthlyBudget}
                onChange={handleInputChange}
                placeholder="e.g., 400"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex justify-center space-x-4 mt-6">
            <button
              onClick={filterPlans}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-md transition duration-200"
            >
              Find My Plans
            </button>
            <button
              onClick={resetFilters}
              className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-md transition duration-200"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Results Table */}
        {showResults && (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b">
              <h2 className="text-2xl font-semibold text-gray-900">
                Available Financing Plans ({filteredPlans.length})
              </h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Plan Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Plan Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Term
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Down Payment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Monthly Payment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      APR
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Affordability
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPlans.map((plan) => {
                    const affordability = calculateAffordability(plan);
                    return (
                      <tr key={plan.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(plan.type)}`}>
                            {plan.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{plan.name}</div>
                          <div className="text-sm text-gray-500">{plan.description}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {plan.term}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(plan.downPayment)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(plan.monthlyPayment)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {plan.apr > 0 ? `${plan.apr}%` : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {affordability.affordable ? (
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                              ✓ Affordable
                            </span>
                          ) : !affordability.withinBudget ? (
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                              Over Budget
                            </span>
                          ) : !affordability.downPaymentMet ? (
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                              Need More Down
                            </span>
                          ) : (
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                              Check Details
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-red-600 hover:text-red-900 mr-4">
                            View Details
                          </button>
                          <button className="text-blue-600 hover:text-blue-900">
                            Apply Now
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {filteredPlans.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500 text-lg">No plans match your criteria. Try adjusting your filters.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlanSimulator;
