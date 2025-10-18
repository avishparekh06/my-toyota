import { User } from '@/services/api';

/**
 * Determines if a user's profile is considered "complete" for the setup wizard
 * A profile is complete if it has meaningful data in both personal and finance sections
 */
export const isProfileComplete = (user: User | null): boolean => {
  if (!user) return false;

  const personal = user.personal;
  const finance = user.finance;

  // Check if we have meaningful personal data
  const hasPersonalData = personal && (
    personal.familyInfo ||
    personal.avgCommuteDistance ||
    personal.location ||
    personal.fuelType ||
    personal.color ||
    personal.year ||
    personal.buyingFor ||
    (personal.featurePreferences && personal.featurePreferences.length > 0) ||
    (personal.buildPreferences && personal.buildPreferences.length > 0) ||
    (personal.modelPreferences && personal.modelPreferences.length > 0)
  );

  // Check if we have meaningful financial data
  const hasFinancialData = finance && (
    finance.householdIncome ||
    finance.creditScore ||
    finance.financeOrLease ||
    finance.employmentStatus ||
    (finance.financingPriorities && finance.financingPriorities.length > 0)
  );

  // Profile is complete if we have data in both sections
  return !!(hasPersonalData && hasFinancialData);
};

/**
 * Gets the completion percentage of a user's profile
 */
export const getProfileCompletionPercentage = (user: User | null): number => {
  if (!user) return 0;

  const personal = user.personal;
  const finance = user.finance;

  let completedFields = 0;
  const totalFields = 15; // Total number of fields we track

  // Personal fields (10)
  if (personal?.familyInfo) completedFields++;
  if (personal?.avgCommuteDistance) completedFields++;
  if (personal?.location) completedFields++;
  if (personal?.fuelType) completedFields++;
  if (personal?.color) completedFields++;
  if (personal?.year) completedFields++;
  if (personal?.buyingFor) completedFields++;
  if (personal?.featurePreferences && personal.featurePreferences.length > 0) completedFields++;
  if (personal?.buildPreferences && personal.buildPreferences.length > 0) completedFields++;
  if (personal?.modelPreferences && personal.modelPreferences.length > 0) completedFields++;

  // Finance fields (5)
  if (finance?.householdIncome) completedFields++;
  if (finance?.creditScore) completedFields++;
  if (finance?.financeOrLease) completedFields++;
  if (finance?.employmentStatus) completedFields++;
  if (finance?.financingPriorities && finance.financingPriorities.length > 0) completedFields++;

  return Math.round((completedFields / totalFields) * 100);
};

/**
 * Gets a list of missing fields for the profile
 */
export const getMissingFields = (user: User | null): string[] => {
  if (!user) return [];

  const missing: string[] = [];
  const personal = user.personal;
  const finance = user.finance;

  // Personal fields
  if (!personal?.familyInfo) missing.push('Family Size');
  if (!personal?.avgCommuteDistance) missing.push('Commute Distance');
  if (!personal?.location) missing.push('Location');
  if (!personal?.fuelType) missing.push('Fuel Type');
  if (!personal?.color) missing.push('Preferred Color');
  if (!personal?.year) missing.push('Preferred Year');
  if (!personal?.buyingFor) missing.push('Buying For');
  if (!personal?.featurePreferences || personal.featurePreferences.length === 0) missing.push('Feature Preferences');
  if (!personal?.buildPreferences || personal.buildPreferences.length === 0) missing.push('Build Preferences');
  if (!personal?.modelPreferences || personal.modelPreferences.length === 0) missing.push('Model Preferences');

  // Finance fields
  if (!finance?.householdIncome) missing.push('Household Income');
  if (!finance?.creditScore) missing.push('Credit Score');
  if (!finance?.financeOrLease) missing.push('Finance or Lease');
  if (!finance?.employmentStatus) missing.push('Employment Status');
  if (!finance?.financingPriorities || finance.financingPriorities.length === 0) missing.push('Financing Priorities');

  return missing;
};
