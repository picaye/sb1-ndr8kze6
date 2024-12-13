import { PersonalInfo, FinancialInfo } from '../../types/TaxInfo';

// 2024 Child deductions by canton (verified values)
const CHILD_DEDUCTIONS: Record<string, number> = {
  'Zürich': 9100,
  'Bern': 8000,
  'Luzern': 6700,
  'Uri': 8000,
  'Schwyz': 9000,
  'Obwalden': 8000,
  'Nidwalden': 8000,
  'Glarus': 7000,
  'Zug': 12000,
  'Fribourg': 8500,
  'Solothurn': 6000,
  'Basel-Stadt': 7800,
  'Basel-Landschaft': 7500,
  'Schaffhausen': 8400,
  'Appenzell Ausserrhoden': 6000,
  'Appenzell Innerrhoden': 6000,
  'St. Gallen': 7200,
  'Graubünden': 6200,
  'Aargau': 7000,
  'Thurgau': 7000,
  'Ticino': 11100,
  'Vaud': 7000,
  'Valais': 7510,
  'Neuchâtel': 6000,
  'Geneva': 9000,
  'Jura': 5300
};

// Professional expense rates by canton
const PROFESSIONAL_EXPENSE_RATES: Record<string, { baseRate: number; min: number; max: number }> = {
  'Zürich': { baseRate: 0.03, min: 2000, max: 4000 },
  'Bern': { baseRate: 0.03, min: 2400, max: 4000 },
  'Basel-Stadt': { baseRate: 0.03, min: 2000, max: 4000 },
  'Zug': { baseRate: 0.03, min: 2000, max: 4000 }
};

export function calculateDeductions(personalInfo: PersonalInfo, financialInfo: FinancialInfo) {
  let totalDeductions = 0;

  // 1. Professional expenses (more accurate calculation)
  totalDeductions += calculateProfessionalExpenses(financialInfo.yearlyIncome, personalInfo.canton);

  // 2. Child deductions
  if (personalInfo.hasChildren && personalInfo.numberOfChildren > 0) {
    const deductionPerChild = CHILD_DEDUCTIONS[personalInfo.canton] || 6500;
    totalDeductions += deductionPerChild * personalInfo.numberOfChildren;
  }

  // 3. Insurance premiums (more accurate calculation)
  totalDeductions += calculateInsuranceDeductions(personalInfo);

  // 4. Pillar 3a contributions (with validation)
  if (financialInfo.pillar3aContributions > 0) {
    const maxPillar3a = financialInfo.selfEmployed ? 35280 : 7056; // 2024 values
    totalDeductions += Math.min(financialInfo.pillar3aContributions, maxPillar3a);
  }

  // 5. Pension fund contributions
  if (financialInfo.pensionContributions > 0) {
    // Limit pension fund contributions to 25% of income
    const maxPension = financialInfo.yearlyIncome * 0.25;
    totalDeductions += Math.min(financialInfo.pensionContributions, maxPension);
  }

  // 6. Mortgage interest (with realistic rate)
  if (financialInfo.mortgageDebt > 0) {
    totalDeductions += calculateMortgageInterestDeduction(financialInfo.mortgageDebt);
  }

  // 7. Charitable donations (max 20% of income)
  if (financialInfo.charitableDonations > 0) {
    const maxDonation = financialInfo.yearlyIncome * 0.2;
    totalDeductions += Math.min(financialInfo.charitableDonations, maxDonation);
  }

  return totalDeductions;
}

function calculateProfessionalExpenses(income: number, canton: string): number {
  const rates = PROFESSIONAL_EXPENSE_RATES[canton] || { baseRate: 0.03, min: 2000, max: 4000 };
  
  // Basic professional expenses
  const basicExpenses = Math.min(Math.max(income * rates.baseRate, rates.min), rates.max);
  
  // Transportation costs (max 3000 for public transport)
  const transportCosts = Math.min(3000, income * 0.02);
  
  // Meal expenses (15 CHF per workday, 220 workdays)
  const mealExpenses = 15 * 220;

  return basicExpenses + transportCosts + mealExpenses;
}

function calculateInsuranceDeductions(personalInfo: PersonalInfo): number {
  // Base insurance deduction (adjusted for 2024)
  let deduction = personalInfo.maritalStatus === 'married' ? 3500 : 1700;

  // Additional for children (700 per child)
  if (personalInfo.hasChildren) {
    deduction += personalInfo.numberOfChildren * 700;
  }

  // Additional health insurance premium deduction
  const baseHealthInsurance = personalInfo.maritalStatus === 'married' ? 5200 : 2600;
  deduction += baseHealthInsurance;

  return deduction;
}

function calculateMortgageInterestDeduction(mortgageDebt: number): number {
  // Current average mortgage rate in Switzerland (as of 2024)
  const currentInterestRate = 0.035; // 3.5%
  return mortgageDebt * currentInterestRate;
}