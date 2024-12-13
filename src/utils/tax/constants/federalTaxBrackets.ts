import { TaxBracket } from '../types';

export const SINGLE_BRACKETS: TaxBracket[] = [
  { limit: 14500, rate: 0, baseAmount: 0 },
  { limit: 31600, rate: 0.77, baseAmount: 0 },
  { limit: 41400, rate: 0.88, baseAmount: 131.65 },
  { limit: 55200, rate: 2.64, baseAmount: 217.90 },
  { limit: 72500, rate: 2.97, baseAmount: 582.20 },
  { limit: 78100, rate: 5.94, baseAmount: 1096.00 },
  { limit: 103600, rate: 6.60, baseAmount: 1428.60 },
  { limit: 134600, rate: 8.80, baseAmount: 3111.60 },
  { limit: 176000, rate: 11.00, baseAmount: 5839.60 },
  { limit: 755200, rate: 13.20, baseAmount: 10393.60 },
  { limit: Infinity, rate: 11.50, baseAmount: 86848.00 }
];

export const MARRIED_BRACKETS: TaxBracket[] = [
  { limit: 28300, rate: 0, baseAmount: 0 },
  { limit: 50900, rate: 1, baseAmount: 0 },
  { limit: 58400, rate: 2, baseAmount: 226 },
  { limit: 75300, rate: 3, baseAmount: 376 },
  { limit: 90300, rate: 4, baseAmount: 883 },
  { limit: 103400, rate: 5, baseAmount: 1483 },
  { limit: 114700, rate: 6, baseAmount: 2138 },
  { limit: 124200, rate: 7, baseAmount: 2816 },
  { limit: 131700, rate: 8, baseAmount: 3481 },
  { limit: 137300, rate: 9, baseAmount: 4081 },
  { limit: 141200, rate: 10, baseAmount: 4585 },
  { limit: 143100, rate: 11, baseAmount: 4985 },
  { limit: 145000, rate: 12, baseAmount: 5385 },
  { limit: Infinity, rate: 13.20, baseAmount: 5785 }
];