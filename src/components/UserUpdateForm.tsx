import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { authApi, User } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface UserUpdateFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

const UserUpdateForm: React.FC<UserUpdateFormProps> = ({ onSuccess, onError }) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Personal form state
  const [personalData, setPersonalData] = useState({
    familyInfo: '',
    avgCommuteDistance: '',
    location: '',
    featurePreferences: '',
    buildPreferences: '',
    modelPreferences: '',
    fuelType: '',
    color: '',
    year: '',
    buyingFor: ''
  });

  // Finance form state
  const [financeData, setFinanceData] = useState({
    householdIncome: '',
    creditScore: '',
    financeOrLease: '',
    employmentStatus: '',
    financingPriorities: ''
  });

  // Initialize form with existing user data
  useEffect(() => {
    if (user) {
      // Personal data
      setPersonalData({
        familyInfo: user.personal?.familyInfo?.toString() || '',
        avgCommuteDistance: user.personal?.avgCommuteDistance?.toString() || '',
        location: user.personal?.location || '',
        featurePreferences: user.personal?.featurePreferences || [],
        buildPreferences: user.personal?.buildPreferences || [],
        modelPreferences: user.personal?.modelPreferences?.join(', ') || '',
        fuelType: user.personal?.fuelType || '',
        color: user.personal?.color || '',
        year: user.personal?.year?.toString() || '',
        buyingFor: user.personal?.buyingFor || ''
      });

      // Finance data
      const formatIncome = (income: number | undefined): string => {
        if (!income) return '';
        return income.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      };
      
      setFinanceData({
        householdIncome: formatIncome(user.finance?.householdIncome),
        creditScore: user.finance?.creditScore?.toString() || '',
        financeOrLease: user.finance?.financeOrLease || '',
        employmentStatus: user.finance?.employmentStatus || '',
        financingPriorities: user.finance?.financingPriorities?.[0] || ''
      });
    }
  }, [user]);

  const handlePersonalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPersonalData(prev => ({ ...prev, [name]: value }));
  };

  const handleFinanceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Format household income with commas
    if (name === 'householdIncome') {
      const numericValue = value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
      const formattedValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      setFinanceData(prev => ({ ...prev, [name]: formattedValue }));
    } else {
      setFinanceData(prev => ({ ...prev, [name]: value }));
    }
  };

  const parseArrayField = (value: string): string[] => {
    return value.split(',').map(item => item.trim()).filter(item => item.length > 0);
  };

  const parseNumberField = (value: string): number | undefined => {
    // Remove commas and parse
    const cleanValue = value.replace(/,/g, '');
    const parsed = parseFloat(cleanValue);
    return isNaN(parsed) ? undefined : parsed;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    setMessage(null);

    try {
      // Prepare data for submission
      const personalUpdate = {
        familyInfo: parseNumberField(personalData.familyInfo),
        avgCommuteDistance: parseNumberField(personalData.avgCommuteDistance),
        location: personalData.location || undefined,
        featurePreferences: Array.isArray(personalData.featurePreferences) ? personalData.featurePreferences : undefined,
        buildPreferences: Array.isArray(personalData.buildPreferences) ? personalData.buildPreferences : undefined,
        modelPreferences: parseArrayField(personalData.modelPreferences),
        fuelType: personalData.fuelType as 'EV' | 'Gas' | 'Hybrid' | undefined,
        color: personalData.color || undefined,
        year: parseNumberField(personalData.year),
        buyingFor: personalData.buyingFor || undefined
      };

      const financeUpdate = {
        householdIncome: parseNumberField(financeData.householdIncome),
        creditScore: parseNumberField(financeData.creditScore),
        financeOrLease: financeData.financeOrLease as 'Finance' | 'Lease' | undefined,
        employmentStatus: financeData.employmentStatus as 'Employed' | 'Self-Employed' | 'Unemployed' | 'Retired' | 'Student' | undefined,
        financingPriorities: financeData.financingPriorities ? [financeData.financingPriorities] : undefined
      };

      // Remove undefined values
      const cleanPersonalUpdate = Object.fromEntries(
        Object.entries(personalUpdate).filter(([_, value]) => value !== undefined)
      );
      const cleanFinanceUpdate = Object.fromEntries(
        Object.entries(financeUpdate).filter(([_, value]) => value !== undefined)
      );

      const response = await authApi.updateUserData(user._id, {
        personal: cleanPersonalUpdate,
        finance: cleanFinanceUpdate
      });

      if (response.success) {
        setMessage({ type: 'success', text: 'User data updated successfully!' });
        onSuccess?.();
      } else {
        throw new Error('Failed to update user data');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setMessage({ type: 'error', text: errorMessage });
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return <div className="text-center text-gray-500">Please log in to update your information.</div>;
  }

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <div className="max-w-4xl mx-auto p-6 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="bg-[var(--card)] border-[var(--border)] shadow-[var(--shadow)] rounded-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-[var(--text)]">Update Your Information</CardTitle>
            </CardHeader>
            <CardContent>
              
              {message && (
                <motion.div 
                  className={`mb-4 p-4 rounded-md ${
                    message.type === 'success' 
                      ? 'bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20' 
                      : 'bg-red-100 text-red-700 border border-red-200'
                  }`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {message.text}
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Personal Information Section */}
                <motion.div 
                  className="border-b border-[var(--border)] pb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  <h3 className="text-xl font-semibold text-[var(--text)] mb-4">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="familyInfo" className="block text-sm font-medium text-[var(--text)] mb-1">
                Family Size
              </label>
              <input
                type="number"
                id="familyInfo"
                name="familyInfo"
                value={personalData.familyInfo}
                onChange={handlePersonalChange}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent)] bg-[var(--card)] text-[var(--text)]"
                placeholder="Number of family members"
              />
            </div>

            <div>
              <label htmlFor="avgCommuteDistance" className="block text-sm font-medium text-[var(--text)] mb-1">
                Average Commute Distance (miles)
              </label>
              <input
                type="number"
                id="avgCommuteDistance"
                name="avgCommuteDistance"
                value={personalData.avgCommuteDistance}
                onChange={handlePersonalChange}
                step="0.1"
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent)] bg-[var(--card)] text-[var(--text)]"
                placeholder="Daily commute distance"
              />
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-[var(--text)] mb-1">
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={personalData.location}
                onChange={handlePersonalChange}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent)] bg-[var(--card)] text-[var(--text)]"
                placeholder="e.g., San Francisco, CA or New York, NY"
              />
            </div>

            <div>
              <label htmlFor="fuelType" className="block text-sm font-medium text-[var(--text)] mb-1">
                Preferred Fuel Type
              </label>
              <select
                id="fuelType"
                name="fuelType"
                value={personalData.fuelType}
                onChange={handlePersonalChange}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent)] bg-[var(--card)] text-[var(--text)]"
              >
                <option value="">Select fuel type</option>
                <option value="EV">Electric Vehicle</option>
                <option value="Gas">Gasoline</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            <div>
              <label htmlFor="color" className="block text-sm font-medium text-[var(--text)] mb-1">
                Preferred Color
              </label>
              <input
                type="text"
                id="color"
                name="color"
                value={personalData.color}
                onChange={handlePersonalChange}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent)] bg-[var(--card)] text-[var(--text)]"
                placeholder="e.g., White, Black, Silver"
              />
            </div>

            <div>
              <label htmlFor="year" className="block text-sm font-medium text-[var(--text)] mb-1">
                Preferred Year
              </label>
              <input
                type="number"
                id="year"
                name="year"
                value={personalData.year}
                onChange={handlePersonalChange}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent)] bg-[var(--card)] text-[var(--text)]"
                placeholder="Vehicle year"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="buyingFor" className="block text-sm font-medium text-[var(--text)] mb-1">
                Buying For
              </label>
              <input
                type="text"
                id="buyingFor"
                name="buyingFor"
                value={personalData.buyingFor}
                onChange={handlePersonalChange}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent)] bg-[var(--card)] text-[var(--text)]"
                placeholder="e.g., Family, Work, Recreation"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Feature Preferences
              </label>
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto border border-gray-200 rounded-md p-3">
                {[
                  "Apple CarPlay", "Android Auto", "Bluetooth Connectivity", "Heated Seats", "Cooled Seats",
                  "Sunroof / Moonroof", "Panoramic Roof", "Leather Interior", "Premium Sound System", "Adaptive Cruise Control",
                  "Lane Assist", "Blind Spot Monitoring", "Backup Camera", "Parking Sensors", "Wireless Charging",
                  "Navigation System", "Keyless Entry", "Remote Start", "Heads-Up Display", "Third Row Seating"
                ].map((feature) => (
                  <label key={feature} className="flex items-center space-x-2 text-sm">
                    <input
                      type="checkbox"
                      checked={personalData.featurePreferences.includes(feature)}
                      onChange={(e) => {
                        const isChecked = e.target.checked;
                        setPersonalData(prev => ({
                          ...prev,
                          featurePreferences: isChecked
                            ? [...prev.featurePreferences, feature]
                            : prev.featurePreferences.filter(f => f !== feature)
                        }));
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-700">{feature}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Build Preferences
              </label>
              <div className="grid grid-cols-2 gap-2 border border-gray-200 rounded-md p-3">
                {[
                  "Sedan", "SUV", "Crossover", "Truck", "Coupe", "Convertible",
                  "Hatchback", "Wagon", "Van / Minivan", "Sports Car", "Electric Vehicle (EV)", "Hybrid Vehicle"
                ].map((build) => (
                  <label key={build} className="flex items-center space-x-2 text-sm">
                    <input
                      type="checkbox"
                      checked={personalData.buildPreferences.includes(build)}
                      onChange={(e) => {
                        const isChecked = e.target.checked;
                        setPersonalData(prev => ({
                          ...prev,
                          buildPreferences: isChecked
                            ? [...prev.buildPreferences, build]
                            : prev.buildPreferences.filter(b => b !== build)
                        }));
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-700">{build}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="modelPreferences" className="block text-sm font-medium text-[var(--text)] mb-1">
                Model Preferences
              </label>
              <textarea
                id="modelPreferences"
                name="modelPreferences"
                value={personalData.modelPreferences}
                onChange={handlePersonalChange}
                rows={3}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent)] bg-[var(--card)] text-[var(--text)]"
                placeholder="Enter model preferences separated by commas (e.g., Camry, RAV4, Highlander)"
              />
            </div>
          </div>
                </motion.div>

                {/* Financial Information Section */}
                <motion.div 
                  className="pb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  <h3 className="text-xl font-semibold text-[var(--text)] mb-4">Financial Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="householdIncome" className="block text-sm font-medium text-[var(--text)] mb-1">
                Household Income ($)
              </label>
              <input
                type="text"
                id="householdIncome"
                name="householdIncome"
                value={financeData.householdIncome}
                onChange={handleFinanceChange}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent)] bg-[var(--card)] text-[var(--text)]"
                placeholder="e.g., 75,000"
              />
            </div>

            <div>
              <label htmlFor="creditScore" className="block text-sm font-medium text-[var(--text)] mb-1">
                Credit Score
              </label>
              <input
                type="number"
                id="creditScore"
                name="creditScore"
                value={financeData.creditScore}
                onChange={handleFinanceChange}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent)] bg-[var(--card)] text-[var(--text)]"
                placeholder="Credit score (300-850)"
              />
            </div>

            <div>
              <label htmlFor="financeOrLease" className="block text-sm font-medium text-[var(--text)] mb-1">
                Finance or Lease
              </label>
              <select
                id="financeOrLease"
                name="financeOrLease"
                value={financeData.financeOrLease}
                onChange={handleFinanceChange}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent)] bg-[var(--card)] text-[var(--text)]"
              >
                <option value="">Select option</option>
                <option value="Finance">Finance</option>
                <option value="Lease">Lease</option>
              </select>
            </div>

            <div>
              <label htmlFor="employmentStatus" className="block text-sm font-medium text-[var(--text)] mb-1">
                Employment Status
              </label>
              <select
                id="employmentStatus"
                name="employmentStatus"
                value={financeData.employmentStatus}
                onChange={handleFinanceChange}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent)] bg-[var(--card)] text-[var(--text)]"
              >
                <option value="">Select status</option>
                <option value="Employed">Employed</option>
                <option value="Self-Employed">Self-Employed</option>
                <option value="Unemployed">Unemployed</option>
                <option value="Retired">Retired</option>
                <option value="Student">Student</option>
              </select>
            </div>

            <div>
              <label htmlFor="financingPriorities" className="block text-sm font-medium text-[var(--text)] mb-1">
                Financing Priorities
              </label>
              <select
                id="financingPriorities"
                name="financingPriorities"
                value={financeData.financingPriorities}
                onChange={handleFinanceChange}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent)] bg-[var(--card)] text-[var(--text)]"
              >
                <option value="">Select priority</option>
                <option value="Downpayment">Low Down Payment</option>
                <option value="Low interest rates">Low interest rates</option>
                <option value="Short financing period">Short financing period</option>
              </select>
            </div>
          </div>
                </motion.div>

                {/* Submit Button */}
                <motion.div 
                  className="flex justify-end"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                >
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="bg-[var(--accent)] hover:bg-[var(--accent-600)] text-white px-6 py-2"
                  >
                    {isLoading ? 'Updating...' : 'Update Information'}
                  </Button>
                </motion.div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default UserUpdateForm;
