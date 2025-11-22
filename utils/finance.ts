import { CalculationResult, CalculationType, PeriodType, RateType, YearlyData } from '../types';

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

const round = (num: number): number => {
  return Math.round((num + Number.EPSILON) * 100) / 100;
};

export const calculateMillion = (
  type: CalculationType,
  initialValue: number,
  rate: number,
  rateType: RateType,
  periodOrContribution: number,
  periodType: PeriodType
): CalculationResult => {
  
  const targetValue = 1000000;
  
  // Normalize Rate to Monthly
  let monthlyRate = 0;
  if (rateType === RateType.ANNUAL) {
    monthlyRate = Math.pow(1 + rate / 100, 1 / 12) - 1;
  } else {
    monthlyRate = rate / 100;
  }

  let months = 0;
  let monthlyContribution = 0;

  if (type === CalculationType.CONTRIBUTION) {
    // User inputs period (years or months), we calculate contribution
    months = periodType === PeriodType.YEARS ? periodOrContribution * 12 : periodOrContribution;
    
    // FV = PV * (1+r)^n + PMT * [ ((1+r)^n - 1) / r ]
    // Solve for PMT
    const compoundFactor = Math.pow(1 + monthlyRate, months);
    const fvOfInitial = initialValue * compoundFactor;
    const remainingTarget = targetValue - fvOfInitial;

    if (monthlyRate === 0) {
        monthlyContribution = remainingTarget / months;
    } else {
        monthlyContribution = remainingTarget / ((compoundFactor - 1) / monthlyRate);
    }

    // Prevent negative contribution (if initial value already exceeds target)
    if (monthlyContribution < 0) monthlyContribution = 0;

  } else {
    // User inputs monthly contribution, we calculate time
    monthlyContribution = periodOrContribution;

    if (monthlyRate === 0) {
        if (monthlyContribution === 0) {
            months = 0; // Impossible if initial < target
        } else {
            months = (targetValue - initialValue) / monthlyContribution;
        }
    } else {
        // n = ln( (FV * r + PMT) / (PV * r + PMT) ) / ln(1 + r)
        const numerator = targetValue * monthlyRate + monthlyContribution;
        const denominator = initialValue * monthlyRate + monthlyContribution;
        
        if (denominator === 0 || numerator / denominator <= 0) {
             months = 0; // Error case
        } else {
            months = Math.log(numerator / denominator) / Math.log(1 + monthlyRate);
        }
    }
  }

  // Generate Breakdown with Financial Rounding to match reference tools
  const yearlyBreakdown: YearlyData[] = [];
  let currentTotal = initialValue;
  let totalInterest = 0;

  // For time calculation, we want to simulate until the ceiling of months
  // This ensures we show the state when the target is actually crossed
  const simulationMonths = Math.ceil(months);
  
  let currentInvestedAccumulated = initialValue;

  for (let i = 1; i <= simulationMonths; i++) {
    const startMonthTotal = currentTotal;
    
    // Round interest to 2 decimals (Standard banking practice for simulation)
    const interestEarned = round(startMonthTotal * monthlyRate);
    
    currentTotal = round(startMonthTotal + interestEarned + monthlyContribution);
    
    currentInvestedAccumulated = round(currentInvestedAccumulated + monthlyContribution);
    totalInterest = round(totalInterest + interestEarned);

    // If it's a full year or the very last month
    if (i % 12 === 0 || i === simulationMonths) {
      yearlyBreakdown.push({
        year: Math.ceil(i / 12),
        investedAmount: round(currentInvestedAccumulated - initialValue), // Pure contributions
        interestAmount: totalInterest, // Cumulative interest
        totalInvested: currentInvestedAccumulated,
        totalInterest: totalInterest,
        totalAccumulated: currentTotal,
        meta: targetValue
      });
    }
  }

  return {
    success: true,
    requiredMonthlyContribution: type === CalculationType.CONTRIBUTION ? monthlyContribution : undefined,
    requiredMonths: months, // Return exact float months for calculation, display logic handles rounding
    totalInvested: currentInvestedAccumulated,
    totalInterest: totalInterest,
    totalAmount: currentTotal,
    yearlyBreakdown
  };
};