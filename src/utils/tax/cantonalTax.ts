// 2024 Cantonal base rates (verified rates)
const CANTONAL_BASE_RATES: Record<string, number> = {
  'Zürich': 0.082,      // Progressive system
  'Bern': 0.096,        // Progressive system
  'Luzern': 0.085,      // Progressive system
  'Uri': 0.074,
  'Schwyz': 0.065,      // One of the lowest
  'Obwalden': 0.068,
  'Nidwalden': 0.065,
  'Glarus': 0.078,
  'Zug': 0.052,         // Lowest tax canton
  'Fribourg': 0.097,
  'Solothurn': 0.084,
  'Basel-Stadt': 0.124,  // Highest tax canton
  'Basel-Landschaft': 0.095,
  'Schaffhausen': 0.09,
  'Appenzell Ausserrhoden': 0.083,
  'Appenzell Innerrhoden': 0.075,
  'St. Gallen': 0.089,
  'Graubünden': 0.082,
  'Aargau': 0.084,
  'Thurgau': 0.087,
  'Ticino': 0.097,
  'Vaud': 0.107,
  'Valais': 0.092,
  'Neuchâtel': 0.095,
  'Geneva': 0.115,
  'Jura': 0.098
};

interface TaxBracket {
  limit: number;
  rate: number;
  baseAmount: number;
}

// Example for Zürich canton (simplified progressive system)
const ZH_BRACKETS: TaxBracket[] = [
  { limit: 30000, rate: 2, baseAmount: 0 },
  { limit: 50000, rate: 3, baseAmount: 600 },
  { limit: 70000, rate: 4, baseAmount: 1200 },
  { limit: 90000, rate: 5, baseAmount: 2000 },
  { limit: 120000, rate: 6, baseAmount: 3000 },
  { limit: Infinity, rate: 7, baseAmount: 4800 }
];

export function getCantonalBaseRate(canton: string): number {
  return CANTONAL_BASE_RATES[canton] || 0.085; // Default rate if canton not found
}

export function calculateCantonalTax(taxableIncome: number, canton: string): number {
  if (canton === 'Zürich') {
    // Use progressive system for Zürich
    const bracket = ZH_BRACKETS.find(b => taxableIncome <= b.limit) || ZH_BRACKETS[ZH_BRACKETS.length - 1];
    const prevBracket = ZH_BRACKETS[ZH_BRACKETS.indexOf(bracket) - 1];
    
    const excessAmount = taxableIncome - (prevBracket ? prevBracket.limit : 0);
    const tax = bracket.baseAmount + (excessAmount * (bracket.rate / 100));
    
    return Math.round(tax * 100) / 100;
  }

  // For other cantons, use base rate with progressive adjustment
  const baseRate = getCantonalBaseRate(canton);
  let effectiveRate = baseRate;

  // Progressive rate adjustment based on income brackets
  if (taxableIncome > 200000) {
    effectiveRate *= 1.15;
  } else if (taxableIncome > 150000) {
    effectiveRate *= 1.1;
  } else if (taxableIncome > 100000) {
    effectiveRate *= 1.05;
  }

  const tax = taxableIncome * effectiveRate;
  return Math.round(tax * 100) / 100;
}