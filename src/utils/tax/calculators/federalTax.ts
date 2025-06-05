import { TaxBracket } from '../types';
import { getTaxYearData, getLatestTaxYear, isTaxYearSupported } from '../constants/taxYears';

/**
 * Calculates the federal tax based on taxable income, marital status, and tax year
 * 
 * @param taxableIncome The taxable income after all deductions
 * @param maritalStatus The marital status ('single', 'married', 'registered_partnership', etc.)
 * @param year The tax year to calculate for (defaults to latest supported year)
 * @returns The calculated federal tax amount
 */
export function calculateFederalTax(
  taxableIncome: number, 
  maritalStatus: string,
  year?: number
): number {
  // Validate inputs
  if (taxableIncome < 0) {
    throw new Error('Taxable income cannot be negative');
  }
  
  if (!maritalStatus) {
    throw new Error('Marital status is required for federal tax calculation');
  }
  
  // Determine tax year to use
  const taxYear = year || getLatestTaxYear();
  if (year && !isTaxYearSupported(taxYear)) {
    console.warn(`Tax year ${taxYear} not supported. Using latest available year.`);
  }
  
  // Get tax data for the specified year
  const taxData = getTaxYearData(taxYear);
  
  // Determine which brackets to use based on marital status
  const isJointFiling = maritalStatus === 'married' || maritalStatus === 'registered_partnership';
  const brackets = isJointFiling ? 
    taxData.federalTaxBrackets.married : 
    taxData.federalTaxBrackets.single;
  
  // Calculate the progressive tax
  return calculateProgressiveTax(taxableIncome, brackets);
}

/**
 * Calculates progressive tax based on income and tax brackets
 * 
 * @param income Taxable income
 * @param brackets Tax brackets to apply
 * @returns Calculated tax amount
 */
function calculateProgressiveTax(income: number, brackets: TaxBracket[]): number {
  // If income is below first bracket limit, no tax is due
  if (income <= brackets[0].limit) {
    return 0;
  }
  
  // Find the applicable bracket
  const applicableBracket = brackets.find(bracket => income <= bracket.limit);
  
  // If no bracket found (should not happen with Infinity in last bracket), use last bracket
  const bracket = applicableBracket || brackets[brackets.length - 1];
  
  // Find the previous bracket
  const bracketIndex = brackets.indexOf(bracket);
  const prevBracket = bracketIndex > 0 ? brackets[bracketIndex - 1] : null;
  
  // Calculate the excess amount above the previous bracket limit
  const prevLimit = prevBracket ? prevBracket.limit : 0;
  const excessAmount = income - prevLimit;
  
  // Calculate tax using the bracket's base amount and rate
  const tax = bracket.baseAmount + (excessAmount * (bracket.rate / 100));
  
  // Round to nearest cent (2 decimal places)
  return Math.round(tax * 100) / 100;
}
