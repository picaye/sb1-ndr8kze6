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

// Bern-specific tax brackets
const BE_BRACKETS: TaxBracket[] = [
  { limit: 5900, rate: 1.8, baseAmount: 0 },
  { limit: 13000, rate: 3.2, baseAmount: 106 },
  { limit: 20100, rate: 4.5, baseAmount: 342 },
  { limit: 35600, rate: 5.8, baseAmount: 800 },
  { limit: 47000, rate: 6.8, baseAmount: 1698 },
  { limit: 68500, rate: 7.5, baseAmount: 3072 },
  { limit: 87300, rate: 8.2, baseAmount: 4940 },
  { limit: 115900, rate: 8.8, baseAmount: 7354 },
  { limit: 150200, rate: 9.4, baseAmount: 10472 },
  { limit: Infinity, rate: 10.0, baseAmount: 15700 }
];

// Geneva-specific tax brackets
const GE_BRACKETS: TaxBracket[] = [
  { limit: 17000, rate: 8, baseAmount: 0 },
  { limit: 28700, rate: 9, baseAmount: 1360 },
  { limit: 41800, rate: 10, baseAmount: 2400 },
  { limit: 56300, rate: 11, baseAmount: 3710 },
  { limit: 74500, rate: 12, baseAmount: 5406 },
  { limit: 97100, rate: 13, baseAmount: 7632 },
  { limit: 124000, rate: 14, baseAmount: 10350 },
  { limit: 160400, rate: 14.5, baseAmount: 13890 },
  { limit: Infinity, rate: 15, baseAmount: 19170 }
];

// Basel-Stadt-specific tax brackets
const BS_BRACKETS: TaxBracket[] = [
  { limit: 8700, rate: 2.5, baseAmount: 0 },
  { limit: 21000, rate: 7.5, baseAmount: 218 },
  { limit: 36800, rate: 11, baseAmount: 1190 },
  { limit: 53600, rate: 12.5, baseAmount: 2923 },
  { limit: 87200, rate: 13, baseAmount: 5023 },
  { limit: 117100, rate: 13.5, baseAmount: 8891 },
  { limit: 189000, rate: 14, baseAmount: 13075 },
  { limit: Infinity, rate: 14.5, baseAmount: 22841 }
];

// Vaud-specific tax brackets
const VD_BRACKETS: TaxBracket[] = [
  { limit: 6700, rate: 3, baseAmount: 0 },
  { limit: 13200, rate: 5, baseAmount: 201 },
  { limit: 20900, rate: 7, baseAmount: 456 },
  { limit: 29300, rate: 9, baseAmount: 855 },
  { limit: 39300, rate: 10.5, baseAmount: 1611 },
  { limit: 51500, rate: 12, baseAmount: 2886 },
  { limit: 68100, rate: 13, baseAmount: 4884 },
  { limit: 89600, rate: 14, baseAmount: 7606 },
  { limit: Infinity, rate: 15, baseAmount: 10556 }
];

// Zug-specific tax brackets
const ZG_BRACKETS: TaxBracket[] = [
  { limit: 12700, rate: 1, baseAmount: 0 },
  { limit: 26100, rate: 2, baseAmount: 127 },
  { limit: 45900, rate: 3, baseAmount: 395 },
  { limit: 64800, rate: 4, baseAmount: 988 },
  { limit: 89300, rate: 5, baseAmount: 1744 },
  { limit: 119500, rate: 6, baseAmount: 3019 },
  { limit: Infinity, rate: 7, baseAmount: 4830 }
];

// Tax bracket map for each canton
const CANTONAL_BRACKETS: Record<string, TaxBracket[]> = {
  'Zürich': ZH_BRACKETS,
  'Bern': BE_BRACKETS,
  'Geneva': GE_BRACKETS,
  'Basel-Stadt': BS_BRACKETS,
  'Vaud': VD_BRACKETS,
  'Zug': ZG_BRACKETS
};

export function calculateCantonalTax(taxableIncome: number, canton: string): number {
  // Use specific brackets if available
  if (canton in CANTONAL_BRACKETS) {
    return calculateProgressiveTax(taxableIncome, CANTONAL_BRACKETS[canton]);
  }

  return calculateStandardCantonalTax(taxableIncome, canton);
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