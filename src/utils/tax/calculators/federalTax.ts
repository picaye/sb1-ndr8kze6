import { SINGLE_BRACKETS, MARRIED_BRACKETS } from '../constants/federalTaxBrackets';
import { TaxBracket } from '../types';

export function calculateFederalTax(taxableIncome: number, maritalStatus: string): number {
  const brackets = (maritalStatus === 'married' || maritalStatus === 'registered_partnership') ? 
    MARRIED_BRACKETS : SINGLE_BRACKETS;
  return calculateProgressiveTax(taxableIncome, brackets);
}

function calculateProgressiveTax(income: number, brackets: TaxBracket[]): number {
  if (income <= brackets[0].limit) {
    return 0;
  }

  const bracket = brackets.find(b => income <= b.limit) || brackets[brackets.length - 1];
  const prevBracket = brackets[brackets.indexOf(bracket) - 1];
  
  const excessAmount = income - (prevBracket ? prevBracket.limit : 0);
  const tax = bracket.baseAmount + (excessAmount * (bracket.rate / 100));
  
  return Math.round(tax * 100) / 100;
}