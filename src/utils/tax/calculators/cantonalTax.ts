import { CANTONAL_BASE_RATES } from '../constants/cantonalRates';
import { TaxBracket } from '../types';

// Zürich-specific tax brackets
const ZH_BRACKETS: TaxBracket[] = [
  { limit: 6700, rate: 2, baseAmount: 0 },
  { limit: 11400, rate: 3, baseAmount: 134 },
  { limit: 16100, rate: 4, baseAmount: 275 },
  { limit: 23700, rate: 5, baseAmount: 463 },
  { limit: 33000, rate: 6, baseAmount: 843 },
  { limit: 43700, rate: 7, baseAmount: 1401 },
  { limit: 56100, rate: 8, baseAmount: 2150 },
  { limit: 71200, rate: 9, baseAmount: 3142 },
  { limit: 91400, rate: 10, baseAmount: 4492 },
  { limit: 118200, rate: 11, baseAmount: 6512 },
  { limit: 157400, rate: 12, baseAmount: 9470 },
  { limit: Infinity, rate: 13, baseAmount: 14198 }
];

export function calculateCantonalTax(taxableIncome: number, canton: string): number {
  if (canton === 'Zürich') {
    return calculateZurichTax(taxableIncome);
  }

  return calculateStandardCantonalTax(taxableIncome, canton);
}

function calculateZurichTax(income: number): number {
  if (income <= ZH_BRACKETS[0].limit) {
    return 0;
  }

  const bracket = ZH_BRACKETS.find(b => income <= b.limit) || ZH_BRACKETS[ZH_BRACKETS.length - 1];
  const prevBracket = ZH_BRACKETS[ZH_BRACKETS.indexOf(bracket) - 1];
  
  const excessAmount = income - (prevBracket ? prevBracket.limit : 0);
  const tax = bracket.baseAmount + (excessAmount * (bracket.rate / 100));
  
  return Math.round(tax * 100) / 100;
}

function calculateStandardCantonalTax(income: number, canton: string): number {
  const baseRate = CANTONAL_BASE_RATES[canton] || 0.085;
  let effectiveRate = baseRate;

  // Progressive adjustment
  if (income > 200000) {
    effectiveRate *= 1.15;
  } else if (income > 150000) {
    effectiveRate *= 1.1;
  } else if (income > 100000) {
    effectiveRate *= 1.05;
  }

  const tax = income * effectiveRate;
  return Math.round(tax * 100) / 100;
}