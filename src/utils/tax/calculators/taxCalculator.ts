import { PersonalInfo, FinancialInfo } from '../../../types/TaxInfo';
import { calculateTaxableIncome } from './taxableIncome';
import { calculateFederalTax } from './federalTax';
import { calculateCantonalTax } from './cantonalTax';
import { CANTON_CODES } from '../../../data/municipalities/constants';
import { getTaxYearData, getLatestTaxYear, isTaxYearSupported } from '../constants/taxYears';
import { getMunicipalityTaxMultiplier } from '../../../data/municipalities/comprehensive';

/**
 * Interface for tax breakdown results
 */
interface TaxBreakdown {
  federal: number;
  cantonal: number;
  municipal: number;
  church?: {
    person1?: number;
    person2?: number;
    total: number;
  };
  wealth?: {
    cantonal: number;
    municipal: number;
    total: number;
  };
  withholding?: {
    rate: number;
    amount: number;
  };
  total: number;
  effectiveRate: number;
  details: {
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
  };
  taxYear: number;
}

/**
 * Calculate all taxes for a person based on their personal and financial information
 * 
 * @param personalInfo Personal information (canton, municipality, marital status, etc.)
 * @param financialInfo Financial information (income, wealth, deductions, etc.)
 * @param taxYear The tax year to calculate for (defaults to latest supported year)
 * @returns Complete tax breakdown
 */
export function calculateTaxes(
  personalInfo: PersonalInfo, 
  financialInfo: FinancialInfo, 
  taxYear?: number
): TaxBreakdown {
  // Validate inputs
  if (!personalInfo || !financialInfo) {
    throw new Error('Personal and financial information are required');
  }
  
  if (!personalInfo.canton) {
    throw new Error('Canton is required for tax calculation');
  }
  
  // Determine tax year to use
  const year = taxYear || getLatestTaxYear();
  if (taxYear && !isTaxYearSupported(year)) {
    console.warn(`Tax year ${year} not supported. Using latest available year.`);
  }
  
  // Get tax data for the specified year
  const taxData = getTaxYearData(year);
  
  // Calculate taxable income with all deductions
  const {
    federalTaxableIncome,
    cantonalTaxableIncome,
    deductions,
    isJointFiling
  } = calculateTaxableIncome(personalInfo, financialInfo, year);

  // Calculate federal tax
  const federalTax = calculateFederalTax(federalTaxableIncome, personalInfo.maritalStatus, year);

  // Calculate cantonal tax
  const cantonalTax = calculateCantonalTax(cantonalTaxableIncome, personalInfo.canton, year);

  // Calculate municipal tax (using multiplier)
  const municipalMultiplier = getMunicipalMultiplier(personalInfo.canton, personalInfo.municipality, year);
  const municipalTax = cantonalTax * municipalMultiplier;

  // Calculate church tax if applicable
  const churchTax = calculateChurchTax(cantonalTax, personalInfo, year);

  // Calculate wealth tax if applicable
  const wealthTax = calculateWealthTax(personalInfo, financialInfo, year);

  // Calculate withholding tax if applicable
  const withholdingTax = calculateWithholdingTax(personalInfo, financialInfo, year);

  // Calculate total income for effective rate
  const totalIncome = financialInfo.yearlyIncome + (financialInfo.spouseYearlyIncome || 0);

  // Calculate total tax
  let totalTax = federalTax + cantonalTax + municipalTax + (churchTax?.total || 0);
  
  // Add wealth tax if applicable
  if (wealthTax) {
    totalTax += wealthTax.total;
  }
  
  // Use withholding tax if applicable and higher
  if (withholdingTax && personalInfo.isWithholdingTaxEligible) {
    if (withholdingTax.amount < totalTax) {
      // Replace all other taxes with withholding tax
      totalTax = withholdingTax.amount;
    }
  }

  // Calculate effective tax rate
  const effectiveRate = totalIncome > 0 ? (totalTax / totalIncome) * 100 : 0;

  // Create and return the tax breakdown
  const result: TaxBreakdown = {
    federal: federalTax,
    cantonal: cantonalTax,
    municipal: municipalTax,
    church: churchTax,
    total: totalTax,
    effectiveRate,
    taxYear: year,
    details: {
      baseAmount: totalIncome,
      deductions,
      taxableIncome: {
        federal: federalTaxableIncome,
        cantonal: cantonalTaxableIncome
      }
    }
  };
  
  // Add wealth tax if applicable
  if (wealthTax) {
    result.wealth = wealthTax;
    result.details.taxableWealth = calculateTaxableWealth(financialInfo, personalInfo.canton, year);
  }
  
  // Add withholding tax if applicable
  if (withholdingTax && personalInfo.isWithholdingTaxEligible) {
    result.withholding = withholdingTax;
  }
  
  return result;
}

/**
 * Get the municipal tax multiplier for a given municipality and canton
 * 
 * @param canton Canton name
 * @param municipality Municipality name
 * @param year Tax year
 * @returns Municipal tax multiplier as a decimal
 */
function getMunicipalMultiplier(canton: string, municipality: string, year: number): number {
  // Convert year to string key for the multiplier object
  const yearKey = year.toString() as '2024' | '2025';
  
  try {
    // Try to get the multiplier from the comprehensive municipality database
    return getMunicipalityTaxMultiplier(municipality, canton, yearKey);
  } catch (error) {
    console.warn(`Error getting municipality multiplier: ${error.message}`);
    
    // Fallback to default multiplier for the canton
    const taxData = getTaxYearData(year);
    let cantonCode: string | undefined;
    
    // Get canton code
    if (canton in CANTON_CODES) {
      cantonCode = CANTON_CODES[canton as keyof typeof CANTON_CODES];
    }
    
    // If we have a valid canton code, get the multiplier from default tax multipliers
    if (cantonCode && cantonCode in taxData.defaultTaxMultipliers) {
      return taxData.defaultTaxMultipliers[cantonCode] / 100; // Convert to decimal
    }
    
    return 1.0; // Default fallback
  }
}

/**
 * Calculate church tax based on cantonal tax and personal information
 * 
 * @param cantonalTax The calculated cantonal tax
 * @param personalInfo Personal information including religion
 * @param year Tax year
 * @returns Church tax breakdown or undefined if not applicable
 */
function calculateChurchTax(
  cantonalTax: number, 
  personalInfo: PersonalInfo, 
  year: number
): {
  person1?: number;
  person2?: number;
  total: number;
} {
  const taxData = getTaxYearData(year);
  const churchTaxRates = taxData.churchTaxRates;

  // If canton doesn't have church tax or rate is missing, return zero
  if (!churchTaxRates[personalInfo.canton] || churchTaxRates[personalInfo.canton] === 0) {
    return { total: 0 };
  }

  const baseRate = churchTaxRates[personalInfo.canton];
  let person1Tax = 0;
  let person2Tax = 0;

  // Calculate church tax for person 1
  if (personalInfo.religion === 'roman_catholic' || personalInfo.religion === 'protestant') {
    person1Tax = cantonalTax * baseRate;
  }

  // Calculate church tax for person 2 if married/registered partnership
  if ((personalInfo.maritalStatus === 'married' || personalInfo.maritalStatus === 'registered_partnership') &&
      personalInfo.spouse &&
      (personalInfo.spouse.religion === 'roman_catholic' || personalInfo.spouse.religion === 'protestant')) {
    person2Tax = cantonalTax * baseRate;
  }

  const total = person1Tax + person2Tax;

  return {
    ...(person1Tax > 0 && { person1: person1Tax }),
    ...(person2Tax > 0 && { person2: person2Tax }),
    total
  };
}

/**
 * Calculate wealth tax based on canton and financial information
 * 
 * @param personalInfo Personal information
 * @param financialInfo Financial information including wealth
 * @param year Tax year
 * @returns Wealth tax breakdown or undefined if not applicable
 */
function calculateWealthTax(
  personalInfo: PersonalInfo,
  financialInfo: FinancialInfo,
  year: number
): { cantonal: number; municipal: number; total: number } | undefined {
  // If no wealth data provided, return undefined
  if (!financialInfo.totalWealth && !financialInfo.totalLiabilities) {
    return undefined;
  }
  
  // Calculate taxable wealth
  const taxableWealth = calculateTaxableWealth(financialInfo, personalInfo.canton, year);
  
  // If no taxable wealth, return zero tax
  if (taxableWealth <= 0) {
    return { cantonal: 0, municipal: 0, total: 0 };
  }
  
  // Wealth tax rates by canton (per 1000 CHF)
  const wealthTaxRates: Record<string, number> = {
    'Zürich': 0.3,
    'Bern': 0.34,
    'Luzern': 0.25,
    'Uri': 0.17,
    'Schwyz': 0.18,
    'Obwalden': 0.2,
    'Nidwalden': 0.15,
    'Glarus': 0.2,
    'Zug': 0.14,
    'Fribourg': 0.3,
    'Solothurn': 0.38,
    'Basel-Stadt': 0.5,
    'Basel-Landschaft': 0.33,
    'Schaffhausen': 0.3,
    'Appenzell Ausserrhoden': 0.25,
    'Appenzell Innerrhoden': 0.2,
    'St. Gallen': 0.2,
    'Graubünden': 0.23,
    'Aargau': 0.25,
    'Thurgau': 0.3,
    'Ticino': 0.35,
    'Vaud': 0.33,
    'Valais': 0.31,
    'Neuchâtel': 0.35,
    'Geneva': 0.38,
    'Jura': 0.35
  };
  
  // Get wealth tax rate for the canton
  const wealthTaxRate = wealthTaxRates[personalInfo.canton] || 0.3;
  
  // Calculate cantonal wealth tax (rate is per 1000 CHF)
  const cantonalWealthTax = (taxableWealth / 1000) * wealthTaxRate;
  
  // Calculate municipal wealth tax using the same multiplier as income tax
  const municipalMultiplier = getMunicipalMultiplier(personalInfo.canton, personalInfo.municipality, year);
  const municipalWealthTax = cantonalWealthTax * municipalMultiplier;
  
  // Total wealth tax
  const totalWealthTax = cantonalWealthTax + municipalWealthTax;
  
  return {
    cantonal: cantonalWealthTax,
    municipal: municipalWealthTax,
    total: totalWealthTax
  };
}

/**
 * Calculate taxable wealth after deductions
 * 
 * @param financialInfo Financial information
 * @param canton Canton name
 * @param year Tax year
 * @returns Taxable wealth amount
 */
function calculateTaxableWealth(
  financialInfo: FinancialInfo,
  canton: string,
  year: number
): number {
  // Get gross wealth
  const grossWealth = financialInfo.totalWealth || 0;
  
  // Get liabilities
  const liabilities = financialInfo.totalLiabilities || 0;
  
  // Calculate net wealth
  const netWealth = Math.max(0, grossWealth - liabilities);
  
  // Wealth tax exemption thresholds by canton
  const exemptionThresholds: Record<string, number> = {
    'Zürich': 77000,
    'Bern': 97000,
    'Luzern': 60000,
    'Uri': 25000,
    'Schwyz': 50000,
    'Obwalden': 50000,
    'Nidwalden': 50000,
    'Glarus': 80000,
    'Zug': 50000,
    'Fribourg': 100000,
    'Solothurn': 50000,
    'Basel-Stadt': 80000,
    'Basel-Landschaft': 90000,
    'Schaffhausen': 25000,
    'Appenzell Ausserrhoden': 100000,
    'Appenzell Innerrhoden': 50000,
    'St. Gallen': 80000,
    'Graubünden': 90000,
    'Aargau': 50000,
    'Thurgau': 50000,
    'Ticino': 200000,
    'Vaud': 50000,
    'Valais': 57000,
    'Neuchâtel': 50000,
    'Geneva': 82000,
    'Jura': 54000
  };
  
  // Get exemption threshold for the canton
  const exemptionThreshold = exemptionThresholds[canton] || 50000;
  
  // Calculate taxable wealth (after exemption)
  return Math.max(0, netWealth - exemptionThreshold);
}

/**
 * Calculate withholding tax (Quellensteuer) for eligible individuals
 * 
 * @param personalInfo Personal information
 * @param financialInfo Financial information
 * @param year Tax year
 * @returns Withholding tax information or undefined if not applicable
 */
function calculateWithholdingTax(
  personalInfo: PersonalInfo,
  financialInfo: FinancialInfo,
  year: number
): { rate: number; amount: number } | undefined {
  // Check if person is eligible for withholding tax
  if (!personalInfo.isWithholdingTaxEligible) {
    return undefined;
  }
  
  // Base withholding tax rates by canton
  const baseRates: Record<string, number> = {
    'Zürich': 0.17,
    'Bern': 0.19,
    'Luzern': 0.16,
    'Uri': 0.14,
    'Schwyz': 0.13,
    'Obwalden': 0.12,
    'Nidwalden': 0.12,
    'Glarus': 0.15,
    'Zug': 0.10,
    'Fribourg': 0.18,
    'Solothurn': 0.18,
    'Basel-Stadt': 0.22,
    'Basel-Landschaft': 0.18,
    'Schaffhausen': 0.17,
    'Appenzell Ausserrhoden': 0.15,
    'Appenzell Innerrhoden': 0.14,
    'St. Gallen': 0.17,
    'Graubünden': 0.16,
    'Aargau': 0.17,
    'Thurgau': 0.16,
    'Ticino': 0.19,
    'Vaud': 0.20,
    'Valais': 0.18,
    'Neuchâtel': 0.18,
    'Geneva': 0.22,
    'Jura': 0.19
  };
  
  // Get base rate for the canton
  const baseRate = baseRates[personalInfo.canton] || 0.17;
  
  // Adjust rate based on marital status and children
  let adjustedRate = baseRate;
  
  // Married people generally pay less
  if (personalInfo.maritalStatus === 'married' || personalInfo.maritalStatus === 'registered_partnership') {
    adjustedRate *= 0.9; // 10% reduction
  }
  
  // Children reduce the rate
  if (personalInfo.hasChildren && personalInfo.numberOfChildren > 0) {
    // Each child reduces the rate by 1 percentage point, up to 5 children
    const childReduction = Math.min(personalInfo.numberOfChildren, 5) * 0.01;
    adjustedRate = Math.max(adjustedRate - childReduction, baseRate * 0.7); // At least 70% of base rate
  }
  
  // Calculate withholding tax amount
  const totalIncome = financialInfo.yearlyIncome + (financialInfo.spouseYearlyIncome || 0);
  const withholdingTaxAmount = totalIncome * adjustedRate;
  
  return {
    rate: adjustedRate,
    amount: withholdingTaxAmount
  };
}
