import { CANTONAL_BASE_RATES } from '../constants/cantonalRates';
import { getTaxYearData, getLatestTaxYear, isTaxYearSupported } from '../constants/taxYears';

/**
 * Calculates the cantonal tax based on taxable income, canton, and tax year
 * 
 * @param taxableIncome The taxable income after all deductions
 * @param canton The canton name (e.g., 'Zürich', 'Bern', etc.)
 * @param year The tax year to calculate for (defaults to latest supported year)
 * @returns The calculated cantonal tax amount
 */
export function calculateCantonalTax(
  taxableIncome: number, 
  canton: string,
  year?: number
): number {
  // Validate inputs
  if (taxableIncome < 0) {
    throw new Error('Taxable income cannot be negative');
  }
  
  if (!canton) {
    throw new Error('Canton is required for cantonal tax calculation');
  }
  
  // Determine tax year to use
  const taxYear = year || getLatestTaxYear();
  if (year && !isTaxYearSupported(taxYear)) {
    console.warn(`Tax year ${taxYear} not supported. Using latest available year.`);
  }
  
  // Get tax data for the specified year
  const taxData = getTaxYearData(taxYear);
  
  // Get the cantonal base rate for the specified canton and year
  const baseRate = taxData.cantonalBaseRates[canton];
  
  if (!baseRate) {
    console.warn(`No tax rate found for canton ${canton}. Using default rate.`);
    return calculateDefaultCantonalTax(taxableIncome);
  }
  
  // Apply progressive scaling based on income brackets
  let effectiveRate = baseRate;
  
  // Apply progressive scaling for higher incomes
  // Different cantons have different progression systems, this is a simplified approach
  if (taxableIncome > 200000) {
    effectiveRate *= 1.2; // 20% increase for high incomes
  } else if (taxableIncome > 150000) {
    effectiveRate *= 1.15; // 15% increase
  } else if (taxableIncome > 100000) {
    effectiveRate *= 1.1; // 10% increase
  }
  
  // Special case for cantons with their own specific progression rules
  if (canton === 'Zürich') {
    return calculateZurichCantonalTax(taxableIncome, baseRate);
  } else if (canton === 'Geneva') {
    return calculateGenevaCantonalTax(taxableIncome, baseRate);
  } else if (canton === 'Basel-Stadt') {
    return calculateBaselCantonalTax(taxableIncome, baseRate);
  }
  
  // Calculate tax using the effective rate
  const tax = taxableIncome * effectiveRate;
  
  // Round to nearest cent (2 decimal places)
  return Math.round(tax * 100) / 100;
}

/**
 * Calculates a default cantonal tax when canton-specific data is not available
 * 
 * @param taxableIncome The taxable income
 * @returns The calculated default cantonal tax
 */
function calculateDefaultCantonalTax(taxableIncome: number): number {
  // Use an average rate of 8.5% as fallback
  const defaultRate = 0.085;
  const tax = taxableIncome * defaultRate;
  return Math.round(tax * 100) / 100;
}

/**
 * Calculates Zurich-specific cantonal tax with its progressive brackets
 * 
 * @param taxableIncome The taxable income
 * @param baseRate The base rate for Zurich
 * @returns The calculated cantonal tax for Zurich
 */
function calculateZurichCantonalTax(taxableIncome: number, baseRate: number): number {
  let tax = 0;
  
  if (taxableIncome <= 50000) {
    tax = taxableIncome * baseRate * 0.9; // Lower rate for lower incomes
  } else if (taxableIncome <= 100000) {
    tax = 50000 * baseRate * 0.9 + (taxableIncome - 50000) * baseRate;
  } else if (taxableIncome <= 200000) {
    tax = 50000 * baseRate * 0.9 + 50000 * baseRate + (taxableIncome - 100000) * baseRate * 1.1;
  } else {
    tax = 50000 * baseRate * 0.9 + 50000 * baseRate + 100000 * baseRate * 1.1 + (taxableIncome - 200000) * baseRate * 1.2;
  }
  
  return Math.round(tax * 100) / 100;
}

/**
 * Calculates Geneva-specific cantonal tax with its progressive brackets
 * 
 * @param taxableIncome The taxable income
 * @param baseRate The base rate for Geneva
 * @returns The calculated cantonal tax for Geneva
 */
function calculateGenevaCantonalTax(taxableIncome: number, baseRate: number): number {
  let tax = 0;
  
  if (taxableIncome <= 40000) {
    tax = taxableIncome * baseRate * 0.95;
  } else if (taxableIncome <= 90000) {
    tax = 40000 * baseRate * 0.95 + (taxableIncome - 40000) * baseRate;
  } else if (taxableIncome <= 180000) {
    tax = 40000 * baseRate * 0.95 + 50000 * baseRate + (taxableIncome - 90000) * baseRate * 1.1;
  } else {
    tax = 40000 * baseRate * 0.95 + 50000 * baseRate + 90000 * baseRate * 1.1 + (taxableIncome - 180000) * baseRate * 1.25;
  }
  
  return Math.round(tax * 100) / 100;
}

/**
 * Calculates Basel-specific cantonal tax with its progressive brackets
 * 
 * @param taxableIncome The taxable income
 * @param baseRate The base rate for Basel-Stadt
 * @returns The calculated cantonal tax for Basel-Stadt
 */
function calculateBaselCantonalTax(taxableIncome: number, baseRate: number): number {
  let tax = 0;
  
  if (taxableIncome <= 40000) {
    tax = taxableIncome * baseRate * 0.9;
  } else if (taxableIncome <= 100000) {
    tax = 40000 * baseRate * 0.9 + (taxableIncome - 40000) * baseRate;
  } else if (taxableIncome <= 200000) {
    tax = 40000 * baseRate * 0.9 + 60000 * baseRate + (taxableIncome - 100000) * baseRate * 1.15;
  } else {
    tax = 40000 * baseRate * 0.9 + 60000 * baseRate + 100000 * baseRate * 1.15 + (taxableIncome - 200000) * baseRate * 1.3;
  }
  
  return Math.round(tax * 100) / 100;
}
