export enum CalculationType {
  CONTRIBUTION = 'contribution', // Calcular aporte mensal
  TIME = 'time' // Calcular prazo
}

export enum PeriodType {
  YEARS = 'anos',
  MONTHS = 'meses'
}

export enum RateType {
  ANNUAL = 'anual',
  MONTHLY = 'mensal'
}

export interface CalculatorState {
  calculationType: CalculationType;
  initialValue: number;
  targetValue: number; // Usually 1,000,000
  interestRate: number;
  rateType: RateType;
  period: number; // Can be time (years/months) OR amount (monthly contribution) depending on type
  periodType: PeriodType; // Used if calculationType is CONTRIBUTION
  monthlyContribution: number; // Used if calculationType is TIME
}

export interface YearlyData {
  year: number;
  investedAmount: number;
  interestAmount: number;
  totalInvested: number;
  totalInterest: number;
  totalAccumulated: number;
  meta: number;
}

export interface CalculationResult {
  requiredMonthlyContribution?: number; // If calculating contribution
  requiredMonths?: number; // If calculating time
  totalInvested: number;
  totalInterest: number;
  totalAmount: number;
  yearlyBreakdown: YearlyData[];
  success: boolean;
}