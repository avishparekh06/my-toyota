import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useCar } from '../contexts/CarContext';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { calculateAPR } from '../utils/aprEngine';

interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  trim?: string;
  msrp: number;
  dealerPrice: number;
  image?: string;
  location?: {
    city: string;
    state: string;
  };
}

interface FinancialInfo {
  creditScore: string;
  annualIncome: string;
  downPayment: string;
  preferredTerm: string;
  monthlyBudget: string;
}

interface FinancingPlan {
  id: string;
  type: 'Lease' | 'Finance' | 'Special';
  name: string;
  term: string;
  downPayment: number;
  monthlyPayment: number;
  milesPerYear: string;
  residualValue: number;
  apr: number;
  description: string;
  features: string[];
  requirements: string[];
  totalAmount: number;
  isRecommended?: boolean;
}

const PlanSimulator: React.FC = () => {
  const { user } = useAuth();
  const { selectedCar: contextCar } = useCar();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [financialInfo, setFinancialInfo] = useState<FinancialInfo>({
    creditScore: '',
    annualIncome: '',
    downPayment: '',
    preferredTerm: '',
    monthlyBudget: ''
  });
  const [filteredPlans, setFilteredPlans] = useState<FinancingPlan[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const plansPerPage = 4;
  const [selectedPlanType, setSelectedPlanType] = useState<'Finance' | 'Lease'>('Finance');

  // Load car data from context or URL parameters
  useEffect(() => {
    // Prioritize context car over URL parameters
    if (contextCar) {
      setSelectedCar(contextCar);
    } else {
      const carData = searchParams.get('car');
      if (carData) {
        try {
          const parsedCar = JSON.parse(decodeURIComponent(carData));
          setSelectedCar(parsedCar);
        } catch (error) {
          console.error('Error parsing car data:', error);
        }
      }
    }
  }, [contextCar, searchParams]);

  // Pre-fill form with user data
  useEffect(() => {
    if (user && user.finance && !isInitialized) {
      // Calculate a reasonable monthly budget from the user's budget range
      const monthlyBudgetFromRange = user.finance.budgetRange 
        ? Math.round(user.finance.budgetRange.max / 60) // Assuming 60-month term as default
        : 0;
      
      setFinancialInfo({
        creditScore: user.finance.creditScore?.toString() || '',
        annualIncome: user.finance.householdIncome?.toString() || '',
        downPayment: '0',
        preferredTerm: '',
        monthlyBudget: monthlyBudgetFromRange.toString()
      });
      setIsInitialized(true);
    }
  }, [user, isInitialized]);

  // Auto-update plans when financial info changes
  useEffect(() => {
    if (isInitialized && selectedCar) {
      const timer = setTimeout(() => {
        filterPlans();
        setShowResults(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [financialInfo, selectedCar, isInitialized]);

  // Auto-update plans when plan type changes
  useEffect(() => {
    if (showResults) {
      filterPlansWithData();
    }
  }, [selectedPlanType, showResults]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFinancialInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateFinancePayment = (principal: number, apr: number, termMonths: number): number => {
    const monthlyRate = apr / 100 / 12;
    const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / 
      (Math.pow(1 + monthlyRate, termMonths) - 1);
    return monthlyPayment;
  };

  const calculateLeasePayment = (carValue: number, residualValue: number, termMonths: number, apr: number): number => {
    const monthlyRate = apr / 100 / 12;
    const depreciation = carValue - residualValue;
    const financeCharge = (carValue + residualValue) * monthlyRate;
    return (depreciation / termMonths) + financeCharge;
  };


  const generateDynamicPlans = (car: Car, data: FinancialInfo): FinancingPlan[] => {
    const creditScore = parseInt(data.creditScore) || 700;
    const downPayment = parseFloat(data.downPayment) || 0;
    const principal = car.dealerPrice - downPayment;

    const plans: FinancingPlan[] = [];

    // Generate finance plans with dynamic APR for each term
    const financeTerms = [36, 48, 60, 72];
    financeTerms.forEach(term => {
      // Calculate APR specific to this term
      const termAPR = calculateAPR({
        creditScore,
        loanAmount: principal,
        termMonths: term,
        downPayment,
        carValue: car.dealerPrice,
        planType: 'Finance',
        isNewCar: true,
        isToyotaCertified: true,
        hasTradeIn: false
      });

      const monthlyPayment = calculateFinancePayment(principal, termAPR.finalRate, term);
      const totalAmount = downPayment + (Math.round(monthlyPayment) * term);
      
      plans.push({
        id: `finance-${term}-${car.id}`,
        type: 'Finance',
        name: `${term}-Month Finance`,
        term: `${term} months`,
        downPayment: downPayment,
        monthlyPayment: Math.round(monthlyPayment),
        milesPerYear: 'Unlimited',
        residualValue: 0,
        apr: termAPR.finalRate,
        description: `Own your ${car.year} ${car.make} ${car.model} with competitive rates`,
        features: ['No mileage restrictions', 'Build equity', 'Flexible payment options'],
        requirements: ['Good credit (680+)', 'Proof of income', 'Valid driver\'s license'],
        totalAmount: totalAmount
      });
    });

    // Generate lease plans with dynamic APR for each term
    const leaseTerms = [24, 36, 48];
    leaseTerms.forEach(term => {
      const residualPercentage = term === 24 ? 0.65 : term === 36 ? 0.55 : 0.45;
      const residualValue = car.dealerPrice * residualPercentage;
      
      const leaseAPR = calculateAPR({
        creditScore,
        loanAmount: car.dealerPrice,
        termMonths: term,
        downPayment,
        carValue: car.dealerPrice,
        planType: 'Lease',
        isNewCar: true,
        isToyotaCertified: true,
        hasTradeIn: false
      });

      const monthlyPayment = calculateLeasePayment(car.dealerPrice, residualValue, term, leaseAPR.finalRate);
      const totalAmount = downPayment + (Math.round(monthlyPayment) * term);
      
      plans.push({
        id: `lease-${term}-${car.id}`,
        type: 'Lease',
        name: `${term}-Month Lease`,
        term: `${term} months`,
        downPayment: downPayment,
        monthlyPayment: Math.round(monthlyPayment),
        milesPerYear: '12,000',
        residualValue: Math.round(residualValue),
        apr: leaseAPR.finalRate,
        description: `Drive a new ${car.year} ${car.make} ${car.model} with lower monthly payments`,
        features: ['Lower monthly payments', 'Warranty coverage', 'Easy upgrade options'],
        requirements: ['Good credit (650+)', 'Proof of income', 'Valid driver\'s license'],
        totalAmount: totalAmount
      });
    });

    // Add special programs
    plans.push({
      id: `special-military-${car.id}`,
      type: 'Special',
      name: 'Military Program',
      term: '36 months',
      downPayment: downPayment,
      monthlyPayment: Math.round(calculateFinancePayment(principal, 1.9, 36)),
      milesPerYear: 'Unlimited',
      residualValue: 0,
      apr: 1.9,
      description: 'Special financing for military personnel',
      features: ['Low APR', 'Flexible terms', 'No prepayment penalty'],
      requirements: ['Military ID', 'Active duty or veteran status', 'Proof of income'],
      totalAmount: downPayment + (Math.round(calculateFinancePayment(principal, 1.9, 36)) * 36)
    });

    return plans;
  };

  const calculatePriorityScore = (plan: FinancingPlan, priorities: string[]): number => {
    let score = 0;
    
    if (priorities.includes('low down payment')) {
      score += plan.downPayment < 2000 ? 10 : plan.downPayment < 5000 ? 5 : 0;
    }
    
    if (priorities.includes('low interest rates')) {
      score += plan.apr < 3 ? 10 : plan.apr < 5 ? 5 : 0;
    }
    
    if (priorities.includes('short financing period')) {
      const termMonths = parseInt(plan.term);
      score += termMonths <= 36 ? 10 : termMonths <= 48 ? 5 : 0;
    }
    
    return score;
  };

  const sortPlansByPriorities = (plans: FinancingPlan[]): FinancingPlan[] => {
    if (!user?.finance?.financingPriorities || user.finance.financingPriorities.length === 0) {
      return plans;
    }

    return plans.sort((a, b) => {
      const scoreA = calculatePriorityScore(a, user?.finance?.financingPriorities || []);
      const scoreB = calculatePriorityScore(b, user?.finance?.financingPriorities || []);
      return scoreB - scoreA;
    });
  };

  const getRecommendedPlans = (plans: FinancingPlan[]): FinancingPlan[] => {
    const sortedPlans = sortPlansByPriorities(plans);
    return sortedPlans.map((plan, index) => ({
      ...plan,
      isRecommended: index === 0
    }));
  };

  const filterPlansWithData = () => {
    if (!selectedCar) return;

    const data = financialInfo;
    const dynamicPlans = generateDynamicPlans(selectedCar, data);
    const recommendedPlans = getRecommendedPlans(dynamicPlans);
    
    // Filter by plan type
    const filteredByType = recommendedPlans.filter(plan => plan.type === selectedPlanType);
    
    setFilteredPlans(filteredByType);
    setShowResults(true);
  };

  const filterPlans = () => {
    filterPlansWithData();
    setCurrentPage(0); // Reset to first page when new plans are loaded
  };



  const calculateAffordability = (plan: FinancingPlan): string => {
    const monthlyBudget = parseFloat(financialInfo.monthlyBudget) || 0;
    if (monthlyBudget === 0) return 'Unknown';
    
    if (plan.monthlyPayment <= monthlyBudget) {
      return 'Affordable';
    } else if (plan.monthlyPayment <= monthlyBudget * 1.1) {
      return 'Close';
    } else {
      return 'Over Budget';
    }
  };



  // If no car is selected, redirect to recommendations
  useEffect(() => {
    if (!selectedCar && !contextCar) {
      navigate('/recommendations');
    }
  }, [selectedCar, contextCar, navigate]);

  // Show loading state while car is being loaded
  if (!selectedCar) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#EB0A1E] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading financing options...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-8">
      <div className="max-w-[1200px] mx-auto w-full">
        {/* Breadcrumb Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
            <button 
              onClick={() => navigate('/recommendations')}
              className="hover:text-[#EB0A1E] transition-colors duration-200 flex items-center space-x-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back to Recommendations</span>
            </button>
            <span>/</span>
            <span className="text-gray-900 font-medium">Financing Options</span>
          </div>
          
          {selectedCar && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Financing Options for {selectedCar.year} {selectedCar.make} {selectedCar.model} {selectedCar.trim}
              </h1>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>MSRP: <span className="font-semibold text-gray-900">${selectedCar.msrp.toLocaleString()}</span></span>
                <span>•</span>
                <span>Dealer Price: <span className="font-semibold text-gray-900">${selectedCar.dealerPrice.toLocaleString()}</span></span>
                <span>•</span>
                <span>Location: <span className="font-semibold text-gray-900">{selectedCar.location?.city || 'N/A'}, {selectedCar.location?.state || 'N/A'}</span></span>
              </div>
            </div>
          )}
        </div>

        {/* Split Layout */}
        <div className="flex gap-10 items-stretch">
          {/* Left Side - Financing Controls */}
          <div className="w-1/2 bg-white rounded-2xl shadow-lg" >
              {/* Header */}
              <div className="p-6 border-b border-gray-200 bg-white rounded-t-2xl">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-[#EB0A1E] rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 mb-2" >
                      Toyota Financial Solutions
                    </h2>
                    <p className="text-gray-900/70 text-xs">Find the perfect financing plan tailored to your budget and preferences</p>
                  </div>
                </div>
              </div>

              {/* Financial Information Form */}
              <div className="p-6 bg-white rounded-b-2xl">
                <div className="space-y-4">
                  {/* Financial Profile Section */}
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 mb-2" >
                      Financial profile
                    </h3>
                    {user && isInitialized && (
                      <div className="text-xs text-gray-500 mb-4">
                        Profile data loaded
                      </div>
                    )}
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label htmlFor="creditScore" className="block text-xs font-semibold text-gray-900" >
                          Credit score
                        </label>
                        <input
                          type="number"
                          id="creditScore"
                          name="creditScore"
                          value={financialInfo.creditScore}
                          onChange={handleInputChange}
                          placeholder="e.g., 750"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EB0A1E]/20 focus:border-[#EB0A1E] transition-all duration-200 bg-gray-50 hover:bg-white"
                        />
                        <p className="text-xs text-gray-900/60">FICO score</p>
                      </div>

                      <div className="space-y-1">
                        <label htmlFor="annualIncome" className="block text-xs font-semibold text-gray-900" >
                          Annual income
                        </label>
                        <input
                          type="number"
                          id="annualIncome"
                          name="annualIncome"
                          value={financialInfo.annualIncome}
                          onChange={handleInputChange}
                          placeholder="e.g., 75000"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EB0A1E]/20 focus:border-[#EB0A1E] transition-all duration-200 bg-gray-50 hover:bg-white"
                        />
                        <p className="text-xs text-gray-900/60">Gross income</p>
                      </div>

                      <div className="space-y-1">
                        <label htmlFor="downPayment" className="block text-xs font-semibold text-gray-900" >
                          Down payment
                        </label>
                        <input
                          type="number"
                          id="downPayment"
                          name="downPayment"
                          value={financialInfo.downPayment}
                          onChange={handleInputChange}
                          placeholder="e.g., 5000"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EB0A1E]/20 focus:border-[#EB0A1E] transition-all duration-200 bg-gray-50 hover:bg-white"
                        />
                        <p className="text-xs text-gray-900/60">Available cash</p>
                      </div>

                      <div className="space-y-1">
                        <label htmlFor="preferredTerm" className="block text-xs font-semibold text-gray-900" >
                          Term
                        </label>
                        <select
                          id="preferredTerm"
                          name="preferredTerm"
                          value={financialInfo.preferredTerm}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EB0A1E]/20 focus:border-[#EB0A1E] transition-all duration-200 bg-gray-50 hover:bg-white"
                        >
                          <option value="">Any Term</option>
                          <option value="24">24 months</option>
                          <option value="36">36 months</option>
                          <option value="48">48 months</option>
                          <option value="60">60 months</option>
                          <option value="72">72 months</option>
                        </select>
                        <p className="text-xs text-gray-900/60">Loan term</p>
                      </div>

                      <div className="space-y-1">
                        <label htmlFor="monthlyBudget" className="block text-xs font-semibold text-gray-900" >
                          Budget
                        </label>
                        <input
                          type="number"
                          id="monthlyBudget"
                          name="monthlyBudget"
                          value={financialInfo.monthlyBudget}
                          onChange={handleInputChange}
                          placeholder="e.g., 400"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EB0A1E]/20 focus:border-[#EB0A1E] transition-all duration-200 bg-gray-50 hover:bg-white"
                        />
                        <p className="text-xs text-gray-900/60">Max payment</p>
                      </div>
                    </div>
                  </div>


                </div>
              </div>
          </div>

          {/* Right Side - Recommendations */}
          <div className="w-1/2 bg-white rounded-2xl shadow-lg" >
              {/* Header */}
              <div className="p-6 border-b border-gray-200 bg-white rounded-t-2xl">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-[#EB0A1E] rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 mb-2" >
                      Personalized Recommendations
                    </h2>
                    <p className="text-gray-900/70 text-xs">Tailored to your financial profile</p>
                  </div>
                </div>
              </div>

              {/* Results Section */}
              <div className="p-6 bg-white rounded-b-2xl">
                {showResults ? (
                  <div className="flex flex-col">
                    {/* Plan Type Toggle - Moved up with tighter padding */}
                    <div className="mb-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-gray-900 tracking-wide">
                          Plan Type
                        </h4>
                        <div className="flex items-center space-x-2">
                          {/* Finance Icon */}
                          <div className={`flex items-center space-x-1 ${selectedPlanType === 'Finance' ? 'text-[#EB0A1E]' : 'text-gray-400'}`}>
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
                            </svg>
                            <span className="text-xs font-medium">Finance</span>
                          </div>
                          
                          <div 
                            className="relative w-12 h-6 bg-gray-300 rounded-full cursor-pointer transition-colors duration-200"
                            onClick={() => setSelectedPlanType(selectedPlanType === 'Finance' ? 'Lease' : 'Finance')}
                          >
                            {/* Background */}
                            <div 
                              className={`absolute inset-0 rounded-full transition-colors duration-200 ${
                                selectedPlanType === 'Lease' ? 'bg-[#EB0A1E]' : 'bg-gray-300'
                              }`}
                            />
                            
                            {/* Sliding circle */}
                            <div 
                              className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                                selectedPlanType === 'Lease' ? 'translate-x-6' : 'translate-x-0.5'
                              }`}
                            />
                          </div>
                          
                          {/* Lease Icon */}
                          <div className={`flex items-center space-x-1 ${selectedPlanType === 'Lease' ? 'text-[#EB0A1E]' : 'text-gray-400'}`}>
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                            </svg>
                            <span className="text-xs font-medium">Lease</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <h3 className="text-sm font-semibold text-gray-900 mb-2" >
                      Plans ({filteredPlans.length})
                    </h3>
                    
                    {/* Plans Display */}
                    <div className="space-y-4 pb-4">
                        {filteredPlans
                          .slice(currentPage * plansPerPage, (currentPage + 1) * plansPerPage)
                          .map((plan) => {
                          const affordability = calculateAffordability(plan);
                          return (
                            <div key={plan.id} className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-200 mb-4">
                              {/* Card Header */}
                              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                                <div className="flex items-center space-x-3">
                                  <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
                                    plan.type === 'Finance' ? 'bg-green-100 text-green-700 border border-green-200' : 
                                    plan.type === 'Lease' ? 'bg-blue-100 text-blue-700 border border-blue-200' : 
                                    'bg-gray-100 text-gray-700 border border-gray-200'
                                  }`}>
                                    {plan.type}
                                  </span>
                                  {plan.isRecommended && (
                                    <span className="inline-flex px-2 py-0.5 text-xs font-medium rounded-full bg-[#EB0A1E] text-white">
                                      Recommended
                                    </span>
                                  )}
                                </div>
                                <div className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
                                  affordability === 'Affordable' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 
                                  affordability === 'Over Budget' ? 'bg-red-100 text-red-700 border border-red-200' : 
                                  'bg-amber-100 text-amber-700 border border-amber-200'
                                }`}>
                                  {affordability === 'Affordable' ? 'Available' : affordability === 'Over Budget' ? 'Over Budget' : 'Pending'}
                                </div>
                              </div>
                              
                              {/* Card Content */}
                              <div className="p-4">
                                <div className="grid grid-cols-2 gap-4">
                                  {/* Left Column */}
                                  <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                      <span className="text-sm text-gray-500">Monthly Payment</span>
                                      <span className="text-base font-semibold text-gray-900">${plan.monthlyPayment.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                      <span className="text-sm text-gray-500">APR</span>
                                      <span className="text-base font-semibold text-gray-900">{plan.apr.toFixed(2)}%</span>
                                    </div>
                                  </div>
                                  
                                  {/* Right Column */}
                                  <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                      <span className="text-sm text-gray-500">Term</span>
                                      <span className="text-base font-semibold text-gray-900">{plan.term}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                      <span className="text-sm text-gray-500">Total Amount</span>
                                      <span className="text-base font-semibold text-gray-900">${plan.totalAmount.toLocaleString()}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                    
                    {/* Bottom Pagination - Small Red Numbered Circles */}
                    {filteredPlans.length > plansPerPage && (
                      <div className="flex justify-center items-center space-x-2 mt-4">
                        {Array.from({ length: Math.ceil(filteredPlans.length / plansPerPage) }, (_, i) => (
                          <button
                            key={i}
                            onClick={() => setCurrentPage(i)}
                            className={`w-8 h-8 rounded-full text-sm font-medium transition-all duration-200 ${
                              i === currentPage
                                ? 'bg-[#EB0A1E] text-white shadow-md'
                                : 'bg-gray-200 text-gray-900 hover:bg-[#EB0A1E]/20 hover:border-[#EB0A1E]/30'
                            }`}
                          >
                            {i + 1}
                          </button>
                        ))}
                      </div>
                    )}

                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-gradient-to-br from-[#EB0A1E]/10 to-[#EB0A1E]/20 rounded-2xl mb-6 mx-auto flex items-center justify-center">
                        <svg className="w-10 h-10 text-[#EB0A1E]" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">Ready to Find Your Perfect Plan?</h3>
                      <p className="text-gray-900/60 text-base max-w-md">Complete your financial profile on the left and click "Find My Plans" to see personalized Toyota financing recommendations.</p>
                    </div>
                  </div>
                )}
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanSimulator;