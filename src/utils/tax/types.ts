export interface TaxBracket {
  limit: number;
  rate: number;
  baseAmount: number;
}

export interface TaxableIncomeResult {
  federalTaxableIncome: number;
  cantonalTaxableIncome: number;
  isJointFiling: boolean;
  deductions: {
    social: number;
    pension: number;
    pillar3a: number;
    professional: number;
    insurance: number;
    children: number;
    other: number;
    total: number;
  };
}

export interface TaxBreakdown {
  federal: number;
  cantonal: number;
  municipal: number;
  church?: ChurchTaxBreakdown;
  wealth?: WealthTaxBreakdown;
  withholding?: WithholdingTaxInfo;
  total: number;
  effectiveRate: number;
  details: TaxDetails;
  taxYear: number;
}

export interface ChurchTaxBreakdown {
  person1?: number;
  person2?: number;
  total: number;
}

export interface WealthTaxBreakdown {
  cantonal: number;
  municipal: number;
  total: number;
}

export interface WithholdingTaxInfo {
  rate: number;
  amount: number;
}

export interface TaxDetails {
  baseAmount: number;
  deductions: {
    social: number;
    pension: number;
    pillar3a: number;
    professional: number;
    insurance: number;
    children: number;
    other: number;
    total: number;
  };
  taxableIncome: {
    federal: number;
    cantonal: number;
  };
  taxableWealth?: number;
}

export interface MunicipalityTaxInfo {
  name: string;
  cantonCode: string;
  taxMultiplier: Record<string, number>;
}

export interface ProfessionalExpenseLimits {
  BASE_RATE: number;
  MIN_AMOUNT: number;
  MAX_AMOUNT: number;
  MEAL_ALLOWANCE: number;
  WORKING_DAYS: number;
  MAX_COMMUTE: number;
}

export interface InsuranceDeductionLimits {
  SINGLE: number;
  MARRIED: number;
  CHILD: number;
}

export interface Pillar3aLimits {
  EMPLOYED: number;
  SELF_EMPLOYED: number;
}
