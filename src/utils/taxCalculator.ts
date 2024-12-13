import { PersonalInfo, FinancialInfo } from '../types/TaxInfo';

interface TaxBreakdown {
  federal: number;
  cantonal: number;
  municipal: number;
  church?: number;
  total: number;
  effectiveRate: number;
  details: {
    baseAmount: number;
    deductions: {
      pillar3a: number;
      childDeductions: number;
      professionalExpenses: number;
      otherDeductions: number;
    };
    taxableIncome: number;
  };
}

export function calculateTaxBreakdown(
  personalInfo: PersonalInfo,
  financialInfo: FinancialInfo
): TaxBreakdown {
  const income = Number(financialInfo.yearlyIncome) || 0;
  const pillar3a = Number(financialInfo.pillar3aContributions) || 0;
  const childCount = Number(personalInfo.numberOfChildren) || 0;

  // Professional expenses (based on Swiss tax law)
  const professionalExpenses = calculateProfessionalExpenses(income);

  // Child deductions (varies by canton, using Zürich as example)
  const childDeductions = calculateChildDeductions(childCount, personalInfo.canton);

  // Other deductions
  const otherDeductions = calculateOtherDeductions(financialInfo, personalInfo);

  // Calculate taxable income
  const taxableIncome = Math.max(0, income - pillar3a - childDeductions - professionalExpenses - otherDeductions);

  // Federal tax calculation
  const federalTax = calculateFederalTax(taxableIncome, personalInfo.maritalStatus);

  // Cantonal tax
  const cantonalTax = calculateCantonalTax(taxableIncome, personalInfo.canton);

  // Municipal tax
  const municipalMultiplier = getMunicipalMultiplier(personalInfo.canton, personalInfo.municipality);
  const municipalTax = cantonalTax * municipalMultiplier;

  // Church tax if applicable
  let churchTax;
  if (personalInfo.religion === 'roman_catholic' || personalInfo.religion === 'protestant') {
    churchTax = cantonalTax * 0.08; // 8% of cantonal tax
  }

  // Calculate total and effective rate
  const total = federalTax + cantonalTax + municipalTax + (churchTax || 0);
  const effectiveRate = income > 0 ? (total / income) * 100 : 0;

  return {
    federal: federalTax,
    cantonal: cantonalTax,
    municipal: municipalTax,
    church: churchTax,
    total,
    effectiveRate,
    details: {
      baseAmount: income,
      deductions: {
        pillar3a,
        childDeductions,
        professionalExpenses,
        otherDeductions
      },
      taxableIncome
    }
  };
}

function calculateProfessionalExpenses(income: number): number {
  // Professional expenses according to Swiss tax law:
  // 1. Basic deduction for professional expenses: 3% of income, min 2000, max 4000
  const basicDeduction = Math.min(Math.max(income * 0.03, 2000), 4000);

  // 2. Transportation costs (public transport or car)
  // Using average public transport costs as default
  const transportDeduction = Math.min(3000, income * 0.02);

  // 3. Meal expenses (if applicable)
  // 15 CHF per workday (around 220 workdays)
  const mealDeduction = 3300; // 15 CHF * 220 days

  return basicDeduction + transportDeduction + mealDeduction;
}

function calculateChildDeductions(childCount: number, canton: string): number {
  // Child deductions vary by canton
  const deductionsByCanton: Record<string, number> = {
    'Zürich': 9000,
    'Bern': 8000,
    'Luzern': 6500,
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

  const deductionPerChild = deductionsByCanton[canton] || 6500;
  return childCount * deductionPerChild;
}

function calculateOtherDeductions(financialInfo: FinancialInfo, personalInfo: PersonalInfo): number {
  let deductions = 0;

  // 1. Personal deduction (varies by canton and marital status)
  deductions += calculatePersonalDeduction(personalInfo);

  // 2. Insurance premiums and interest on savings
  // Basic health insurance premiums (average)
  deductions += 2500;

  // Additional insurance deductions
  deductions += calculateInsuranceDeductions(personalInfo);

  // 3. Mortgage interest deduction if applicable
  if (financialInfo.mortgageDebt > 0) {
    const mortgageInterestRate = 0.035; // 3.5% interest rate
    deductions += financialInfo.mortgageDebt * mortgageInterestRate;
  }

  // 4. Pension fund contributions
  if (financialInfo.pensionContributions > 0) {
    deductions += financialInfo.pensionContributions;
  }

  // 5. Charitable donations (up to 20% of income)
  if (financialInfo.charitableDonations > 0) {
    const maxDonationDeduction = financialInfo.yearlyIncome * 0.2;
    deductions += Math.min(financialInfo.charitableDonations, maxDonationDeduction);
  }

  return deductions;
}

function calculatePersonalDeduction(personalInfo: PersonalInfo): number {
  // Personal deduction varies by canton and marital status
  const baseDeduction = personalInfo.maritalStatus === 'married' ? 4400 : 2200;
  
  // Additional deductions for specific cantons
  const cantonMultipliers: Record<string, number> = {
    'Zürich': 1.2,
    'Zug': 1.5,
    'Basel-Stadt': 1.3,
    'Geneva': 1.4
  };

  return baseDeduction * (cantonMultipliers[personalInfo.canton] || 1);
}

function calculateInsuranceDeductions(personalInfo: PersonalInfo): number {
  // Insurance deductions based on marital status and canton
  let baseDeduction = personalInfo.maritalStatus === 'married' ? 3500 : 1700;

  // Additional for children
  if (personalInfo.hasChildren) {
    baseDeduction += personalInfo.numberOfChildren * 700;
  }

  return baseDeduction;
}

// Rest of the existing functions (calculateFederalTax, calculateCantonalTax, etc.) remain the same
function calculateFederalTax(taxableIncome: number, maritalStatus: string): number {
  // 2024 federal tax rates (simplified)
  const rates = maritalStatus === 'married' ? [
    { limit: 28300, rate: 0 },
    { limit: 50900, rate: 0.01 },
    { limit: 58400, rate: 0.02 },
    { limit: 75300, rate: 0.03 },
    { limit: 90300, rate: 0.04 },
    { limit: 103400, rate: 0.05 },
    { limit: 114700, rate: 0.06 },
    { limit: 124200, rate: 0.07 },
    { limit: 131700, rate: 0.08 },
    { limit: 137300, rate: 0.09 },
    { limit: 141200, rate: 0.10 },
    { limit: 143100, rate: 0.11 },
    { limit: 145000, rate: 0.12 },
    { limit: Infinity, rate: 0.13 }
  ] : [
    { limit: 14500, rate: 0 },
    { limit: 31600, rate: 0.0077 },
    { limit: 41400, rate: 0.0088 },
    { limit: 55200, rate: 0.0264 },
    { limit: 72500, rate: 0.0264 },
    { limit: 78100, rate: 0.0600 },
    { limit: 103600, rate: 0.0660 },
    { limit: 134600, rate: 0.0800 },
    { limit: 176000, rate: 0.0900 },
    { limit: 755200, rate: 0.1100 },
    { limit: Infinity, rate: 0.1300 }
  ];

  let tax = 0;
  let previousLimit = 0;

  for (const { limit, rate } of rates) {
    if (taxableIncome > previousLimit) {
      const taxableAmount = Math.min(taxableIncome - previousLimit, limit - previousLimit);
      tax += taxableAmount * rate;
    }
    if (taxableIncome <= limit) break;
    previousLimit = limit;
  }

  return tax;
}

function calculateCantonalTax(taxableIncome: number, canton: string): number {
  const baseRate = getCantonalBaseRate(canton);
  return taxableIncome * baseRate;
}

export function getCantonalBaseRate(canton: string): number {
  // 2024 approximate base rates by canton
  const rates: Record<string, number> = {
    'Zürich': 0.06,
    'Bern': 0.065,
    'Luzern': 0.055,
    'Uri': 0.045,
    'Schwyz': 0.04,
    'Obwalden': 0.035,
    'Nidwalden': 0.035,
    'Glarus': 0.055,
    'Zug': 0.03,
    'Fribourg': 0.065,
    'Solothurn': 0.06,
    'Basel-Stadt': 0.075,
    'Basel-Landschaft': 0.065,
    'Schaffhausen': 0.06,
    'Appenzell Ausserrhoden': 0.055,
    'Appenzell Innerrhoden': 0.045,
    'St. Gallen': 0.059,
    'Graubünden': 0.055,
    'Aargau': 0.06,
    'Thurgau': 0.055,
    'Ticino': 0.07,
    'Vaud': 0.075,
    'Valais': 0.065,
    'Neuchâtel': 0.07,
    'Geneva': 0.08,
    'Jura': 0.065
  };
  
  return rates[canton] || 0.06;
}

export function getMunicipalMultiplier(canton: string, municipality: string): number {
  // 2024 municipal multipliers (examples)
  const multipliers: Record<string, number> = {
    'Zürich': 0.119,
    'Winterthur': 0.122,
    'Uster': 0.110,
    'Bern': 0.152,
    'Basel': 0.120,
    'Lausanne': 0.154,
    'Geneva': 0.44,
    'Zug': 0.060,
  };

  return multipliers[municipality] || 0.8;
}