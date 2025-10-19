/**
 * Toyota APR Engine
 * Calculates dynamic APR rates based on credit score, loan amount, term length, and other factors
 */

export interface APRCalculationParams {
  creditScore: number;
  loanAmount: number;
  termMonths: number;
  downPayment: number;
  carValue: number;
  planType: 'Finance' | 'Lease' | 'Special';
  isNewCar: boolean;
  isToyotaCertified: boolean;
  hasTradeIn: boolean;
  tradeInValue?: number;
}

export interface APRResult {
  baseRate: number;
  finalRate: number;
  adjustments: {
    creditScoreAdjustment: number;
    termAdjustment: number;
    amountAdjustment: number;
    downPaymentAdjustment: number;
    specialProgramAdjustment: number;
  };
}

/**
 * Base APR rates by credit score tier
 */
const BASE_RATES = {
  EXCELLENT: { min: 750, rate: 2.9 },
  GOOD: { min: 700, rate: 3.9 },
  FAIR: { min: 650, rate: 5.9 },
  POOR: { min: 600, rate: 8.9 },
  SUBPRIME: { min: 0, rate: 12.9 }
};

/**
 * Term length adjustments (longer terms = higher rates)
 */
const TERM_ADJUSTMENTS = {
  12: 0.0,
  24: 0.2,
  36: 0.4,
  48: 0.6,
  60: 0.8,
  72: 1.0,
  84: 1.5
};

/**
 * Loan amount adjustments (higher amounts = better rates)
 */
const AMOUNT_ADJUSTMENTS = {
  LUXURY: { min: 50000, adjustment: -0.5 },
  PREMIUM: { min: 35000, adjustment: -0.3 },
  STANDARD: { min: 20000, adjustment: 0.0 },
  ECONOMY: { min: 0, adjustment: 0.2 }
};

/**
 * Down payment adjustments (higher down payment = better rates)
 */
const DOWN_PAYMENT_ADJUSTMENTS = {
  HIGH: { min: 0.2, adjustment: -0.5 }, // 20%+ down
  MEDIUM: { min: 0.1, adjustment: -0.2 }, // 10-19% down
  LOW: { min: 0.05, adjustment: 0.0 }, // 5-9% down
  MINIMAL: { min: 0, adjustment: 0.3 } // <5% down
};

/**
 * Special program adjustments
 */
const SPECIAL_PROGRAM_ADJUSTMENTS = {
  MILITARY: -1.0,
  FIRST_TIME_BUYER: -0.5,
  GRADUATE: -0.3,
  LOYALTY: -0.2,
  NONE: 0.0
};

/**
 * Calculate APR based on multiple factors
 */
export function calculateAPR(params: APRCalculationParams): APRResult {
  const {
    creditScore,
    loanAmount,
    termMonths,
    downPayment,
    carValue,
    planType,
    isNewCar,
    isToyotaCertified,
    hasTradeIn,
    tradeInValue = 0
  } = params;

  // Get base rate from credit score
  const baseRate = getBaseRateFromCreditScore(creditScore);
  
  // Calculate adjustments
  const creditScoreAdjustment = 0; // Already factored into base rate
  const termAdjustment = getTermAdjustment(termMonths);
  const amountAdjustment = getAmountAdjustment(loanAmount);
  const downPaymentAdjustment = getDownPaymentAdjustment(downPayment, carValue);
  const specialProgramAdjustment = getSpecialProgramAdjustment(planType);

  // Calculate final rate
  const finalRate = Math.max(0.9, baseRate + termAdjustment + amountAdjustment + downPaymentAdjustment + specialProgramAdjustment);

  return {
    baseRate,
    finalRate: Math.round(finalRate * 100) / 100, // Round to 2 decimal places
    adjustments: {
      creditScoreAdjustment,
      termAdjustment,
      amountAdjustment,
      downPaymentAdjustment,
      specialProgramAdjustment
    }
  };
}

/**
 * Get base rate based on credit score
 */
function getBaseRateFromCreditScore(creditScore: number): number {
  if (creditScore >= BASE_RATES.EXCELLENT.min) return BASE_RATES.EXCELLENT.rate;
  if (creditScore >= BASE_RATES.GOOD.min) return BASE_RATES.GOOD.rate;
  if (creditScore >= BASE_RATES.FAIR.min) return BASE_RATES.FAIR.rate;
  if (creditScore >= BASE_RATES.POOR.min) return BASE_RATES.POOR.rate;
  return BASE_RATES.SUBPRIME.rate;
}

/**
 * Get term length adjustment
 */
function getTermAdjustment(termMonths: number): number {
  return TERM_ADJUSTMENTS[termMonths as keyof typeof TERM_ADJUSTMENTS] || 1.5;
}

/**
 * Get loan amount adjustment
 */
function getAmountAdjustment(loanAmount: number): number {
  if (loanAmount >= AMOUNT_ADJUSTMENTS.LUXURY.min) return AMOUNT_ADJUSTMENTS.LUXURY.adjustment;
  if (loanAmount >= AMOUNT_ADJUSTMENTS.PREMIUM.min) return AMOUNT_ADJUSTMENTS.PREMIUM.adjustment;
  if (loanAmount >= AMOUNT_ADJUSTMENTS.STANDARD.min) return AMOUNT_ADJUSTMENTS.STANDARD.adjustment;
  return AMOUNT_ADJUSTMENTS.ECONOMY.adjustment;
}

/**
 * Get down payment adjustment
 */
function getDownPaymentAdjustment(downPayment: number, carValue: number): number {
  const downPaymentPercentage = downPayment / carValue;
  
  if (downPaymentPercentage >= DOWN_PAYMENT_ADJUSTMENTS.HIGH.min) return DOWN_PAYMENT_ADJUSTMENTS.HIGH.adjustment;
  if (downPaymentPercentage >= DOWN_PAYMENT_ADJUSTMENTS.MEDIUM.min) return DOWN_PAYMENT_ADJUSTMENTS.MEDIUM.adjustment;
  if (downPaymentPercentage >= DOWN_PAYMENT_ADJUSTMENTS.LOW.min) return DOWN_PAYMENT_ADJUSTMENTS.LOW.adjustment;
  return DOWN_PAYMENT_ADJUSTMENTS.MINIMAL.adjustment;
}

/**
 * Get special program adjustment
 */
function getSpecialProgramAdjustment(planType: string): number {
  switch (planType) {
    case 'Special':
      return SPECIAL_PROGRAM_ADJUSTMENTS.MILITARY;
    default:
      return SPECIAL_PROGRAM_ADJUSTMENTS.NONE;
  }
}

/**
 * Calculate lease money factor from APR
 */
export function aprToMoneyFactor(apr: number): number {
  return apr / 2400; // Convert APR to money factor (APR / 2400)
}

/**
 * Calculate APR from money factor
 */
export function moneyFactorToAPR(moneyFactor: number): number {
  return moneyFactor * 2400; // Convert money factor to APR (money factor * 2400)
}

/**
 * Get APR range for a given credit score
 */
export function getAPRRange(creditScore: number): { min: number; max: number } {
  const baseRate = getBaseRateFromCreditScore(creditScore);
  return {
    min: Math.max(0.9, baseRate - 0.5),
    max: baseRate + 2.0
  };
}

/**
 * Check if a rate is competitive for the given parameters
 */
export function isCompetitiveRate(rate: number, params: APRCalculationParams): boolean {
  const range = getAPRRange(params.creditScore);
  return rate >= range.min && rate <= range.max;
}

