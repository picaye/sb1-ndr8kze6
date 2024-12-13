export interface TaxBracket {
  limit: number;
  rate: number;
  baseAmount: number;
}

export interface TaxableIncomeResult {
  federalTaxableIncome: number;
  cantonalTaxableIncome: number;
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