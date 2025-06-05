import { TaxBracket } from '../types';

/**
 * Interface for federal tax brackets by marital status
 */
export interface FederalTaxBrackets {
  single: TaxBracket[];
  married: TaxBracket[];
}

/**
 * Interface for cantonal tax rates
 */
export interface CantonalTaxRates {
  [canton: string]: number;
}

/**
 * Interface for child deductions by canton
 */
export interface ChildDeductions {
  [canton: string]: number;
}

/**
 * Interface for insurance deduction limits
 */
export interface InsuranceDeductions {
  SINGLE: number;
  MARRIED: number;
  CHILD: number;
}

/**
 * Interface for Pillar 3a contribution limits
 */
export interface Pillar3aLimits {
  EMPLOYED: number;
  SELF_EMPLOYED: number;
}

/**
 * Interface for professional expense limits
 */
export interface ProfessionalExpenseLimits {
  BASE_RATE: number;
  MIN_AMOUNT: number;
  MAX_AMOUNT: number;
  MEAL_ALLOWANCE: number;
  WORKING_DAYS: number;
  MAX_COMMUTE: number;
}

/**
 * Interface for church tax rates by canton
 */
export interface ChurchTaxRates {
  [canton: string]: number;
}

/**
 * Interface for default municipal tax multipliers by canton code
 */
export interface DefaultTaxMultipliers {
  [cantonCode: string]: number;
}

/**
 * Interface for all tax year data
 */
export interface TaxYearData {
  year: number;
  federalTaxBrackets: FederalTaxBrackets;
  cantonalBaseRates: CantonalTaxRates;
  childDeductions: ChildDeductions;
  insuranceDeductions: InsuranceDeductions;
  pillar3aLimits: Pillar3aLimits;
  professionalExpenses: ProfessionalExpenseLimits;
  churchTaxRates: ChurchTaxRates;
  defaultTaxMultipliers: DefaultTaxMultipliers;
}

/**
 * Tax data for 2024
 */
export const TAX_YEAR_2024: TaxYearData = {
  year: 2024,
  federalTaxBrackets: {
    single: [
      { limit: 15000, rate: 0, baseAmount: 0 },
      { limit: 32800, rate: 0.77, baseAmount: 0 },
      { limit: 42900, rate: 0.88, baseAmount: 137.35 },
      { limit: 57700, rate: 2.64, baseAmount: 225.80 },
      { limit: 75400, rate: 2.97, baseAmount: 603.80 },
      { limit: 81200, rate: 5.94, baseAmount: 1135.05 },
      { limit: 107600, rate: 6.60, baseAmount: 1487.60 },
      { limit: 139600, rate: 8.80, baseAmount: 3223.05 },
      { limit: 182600, rate: 11.00, baseAmount: 6031.80 },
      { limit: 783200, rate: 13.20, baseAmount: 10762.20 },
      { limit: Infinity, rate: 11.50, baseAmount: 90018.20 }
    ],
    married: [
      { limit: 29300, rate: 0, baseAmount: 0 },
      { limit: 52600, rate: 1, baseAmount: 0 },
      { limit: 60500, rate: 2, baseAmount: 233.00 },
      { limit: 77900, rate: 3, baseAmount: 388.00 },
      { limit: 93500, rate: 4, baseAmount: 914.00 },
      { limit: 107100, rate: 5, baseAmount: 1538.00 },
      { limit: 118800, rate: 6, baseAmount: 2223.00 },
      { limit: 128600, rate: 7, baseAmount: 2815.00 },
      { limit: 136400, rate: 8, baseAmount: 3360.00 },
      { limit: 142100, rate: 9, baseAmount: 3812.00 },
      { limit: 146100, rate: 10, baseAmount: 4172.00 },
      { limit: 148100, rate: 11, baseAmount: 4372.00 },
      { limit: 150100, rate: 12, baseAmount: 4592.00 },
      { limit: Infinity, rate: 13.20, baseAmount: 4832.00 }
    ]
  },
  cantonalBaseRates: {
    'Zürich': 0.082,
    'Bern': 0.096,
    'Luzern': 0.085,
    'Uri': 0.074,
    'Schwyz': 0.065,
    'Obwalden': 0.068,
    'Nidwalden': 0.065,
    'Glarus': 0.078,
    'Zug': 0.052,
    'Fribourg': 0.097,
    'Solothurn': 0.084,
    'Basel-Stadt': 0.124,
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
  },
  childDeductions: {
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
  },
  insuranceDeductions: {
    SINGLE: 2000,
    MARRIED: 4000,
    CHILD: 700
  },
  pillar3aLimits: {
    EMPLOYED: 7056,
    SELF_EMPLOYED: 35280
  },
  professionalExpenses: {
    BASE_RATE: 0.03,
    MIN_AMOUNT: 2000,
    MAX_AMOUNT: 4000,
    MEAL_ALLOWANCE: 15,
    WORKING_DAYS: 220,
    MAX_COMMUTE: 3000
  },
  churchTaxRates: {
    'Zürich': 0.08,
    'Bern': 0.21,
    'Luzern': 0.18,
    'Uri': 0.10,
    'Schwyz': 0.07,
    'Obwalden': 0.11,
    'Nidwalden': 0.10,
    'Glarus': 0.12,
    'Zug': 0.075,
    'Fribourg': 0.15,
    'Solothurn': 0.20,
    'Basel-Stadt': 0.10,
    'Basel-Landschaft': 0.09,
    'Schaffhausen': 0.12,
    'Appenzell Ausserrhoden': 0.13,
    'Appenzell Innerrhoden': 0.11,
    'St. Gallen': 0.23,
    'Graubünden': 0.14,
    'Aargau': 0.11,
    'Thurgau': 0.16,
    'Ticino': 0.09,
    'Vaud': 0.00,
    'Valais': 0.17,
    'Neuchâtel': 0.00,
    'Geneva': 0.00,
    'Jura': 0.19
  },
  defaultTaxMultipliers: {
    'ZH': 119,
    'BE': 154,
    'LU': 175,
    'UR': 100,
    'SZ': 130,
    'OW': 132,
    'NW': 137,
    'GL': 63,
    'ZG': 60,
    'FR': 100,
    'SO': 115,
    'BS': 120,
    'BL': 165,
    'SH': 118,
    'AR': 105,
    'AI': 96,
    'SG': 144,
    'GR': 100,
    'AG': 113,
    'TG': 117,
    'TI': 90,
    'VD': 154,
    'VS': 140,
    'NE': 123,
    'GE': 44,
    'JU': 190
  }
};

/**
 * Tax data for 2025 (updated with inflation adjustments)
 */
export const TAX_YEAR_2025: TaxYearData = {
  year: 2025,
  federalTaxBrackets: {
    single: [
      { limit: 15300, rate: 0, baseAmount: 0 },
      { limit: 33500, rate: 0.77, baseAmount: 0 },
      { limit: 43800, rate: 0.88, baseAmount: 140.25 },
      { limit: 58900, rate: 2.64, baseAmount: 230.45 },
      { limit: 76900, rate: 2.97, baseAmount: 616.10 },
      { limit: 82800, rate: 5.94, baseAmount: 1158.10 },
      { limit: 109800, rate: 6.60, baseAmount: 1517.75 },
      { limit: 142400, rate: 8.80, baseAmount: 3288.15 },
      { limit: 186300, rate: 11.00, baseAmount: 6153.75 },
      { limit: 798900, rate: 13.20, baseAmount: 10978.05 },
      { limit: Infinity, rate: 11.50, baseAmount: 91819.65 }
    ],
    married: [
      { limit: 29900, rate: 0, baseAmount: 0 },
      { limit: 53700, rate: 1, baseAmount: 0 },
      { limit: 61700, rate: 2, baseAmount: 238.00 },
      { limit: 79500, rate: 3, baseAmount: 396.00 },
      { limit: 95400, rate: 4, baseAmount: 933.00 },
      { limit: 109200, rate: 5, baseAmount: 1569.00 },
      { limit: 121200, rate: 6, baseAmount: 2269.00 },
      { limit: 131200, rate: 7, baseAmount: 2869.00 },
      { limit: 139100, rate: 8, baseAmount: 3423.00 },
      { limit: 144900, rate: 9, baseAmount: 3883.00 },
      { limit: 149000, rate: 10, baseAmount: 4253.00 },
      { limit: 151100, rate: 11, baseAmount: 4463.00 },
      { limit: 153100, rate: 12, baseAmount: 4683.00 },
      { limit: Infinity, rate: 13.20, baseAmount: 4923.00 }
    ]
  },
  cantonalBaseRates: {
    'Zürich': 0.082,
    'Bern': 0.096,
    'Luzern': 0.085,
    'Uri': 0.074,
    'Schwyz': 0.065,
    'Obwalden': 0.068,
    'Nidwalden': 0.065,
    'Glarus': 0.078,
    'Zug': 0.052,
    'Fribourg': 0.097,
    'Solothurn': 0.084,
    'Basel-Stadt': 0.124,
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
  },
  childDeductions: {
    'Zürich': 9300,
    'Bern': 8200,
    'Luzern': 6800,
    'Uri': 8200,
    'Schwyz': 9200,
    'Obwalden': 8200,
    'Nidwalden': 8200,
    'Glarus': 7100,
    'Zug': 12200,
    'Fribourg': 8700,
    'Solothurn': 6100,
    'Basel-Stadt': 8000,
    'Basel-Landschaft': 7700,
    'Schaffhausen': 8600,
    'Appenzell Ausserrhoden': 6100,
    'Appenzell Innerrhoden': 6100,
    'St. Gallen': 7300,
    'Graubünden': 6300,
    'Aargau': 7100,
    'Thurgau': 7100,
    'Ticino': 11300,
    'Vaud': 7100,
    'Valais': 7700,
    'Neuchâtel': 6100,
    'Geneva': 9200,
    'Jura': 5400
  },
  insuranceDeductions: {
    SINGLE: 2100,
    MARRIED: 4200,
    CHILD: 730
  },
  pillar3aLimits: {
    EMPLOYED: 7200,
    SELF_EMPLOYED: 36000
  },
  professionalExpenses: {
    BASE_RATE: 0.03,
    MIN_AMOUNT: 2100,
    MAX_AMOUNT: 4200,
    MEAL_ALLOWANCE: 16,
    WORKING_DAYS: 220,
    MAX_COMMUTE: 3100
  },
  churchTaxRates: {
    'Zürich': 0.08,
    'Bern': 0.21,
    'Luzern': 0.18,
    'Uri': 0.10,
    'Schwyz': 0.07,
    'Obwalden': 0.11,
    'Nidwalden': 0.10,
    'Glarus': 0.12,
    'Zug': 0.075,
    'Fribourg': 0.15,
    'Solothurn': 0.20,
    'Basel-Stadt': 0.10,
    'Basel-Landschaft': 0.09,
    'Schaffhausen': 0.12,
    'Appenzell Ausserrhoden': 0.13,
    'Appenzell Innerrhoden': 0.11,
    'St. Gallen': 0.23,
    'Graubünden': 0.14,
    'Aargau': 0.11,
    'Thurgau': 0.16,
    'Ticino': 0.09,
    'Vaud': 0.00,
    'Valais': 0.17,
    'Neuchâtel': 0.00,
    'Geneva': 0.00,
    'Jura': 0.19
  },
  defaultTaxMultipliers: {
    'ZH': 119,
    'BE': 154,
    'LU': 175,
    'UR': 100,
    'SZ': 130,
    'OW': 132,
    'NW': 137,
    'GL': 63,
    'ZG': 60,
    'FR': 100,
    'SO': 115,
    'BS': 120,
    'BL': 165,
    'SH': 118,
    'AR': 105,
    'AI': 96,
    'SG': 144,
    'GR': 100,
    'AG': 113,
    'TG': 117,
    'TI': 90,
    'VD': 154,
    'VS': 140,
    'NE': 123,
    'GE': 44,
    'JU': 190
  }
};

/**
 * All available tax years data
 */
export const TAX_YEARS: Record<number, TaxYearData> = {
  2024: TAX_YEAR_2024,
  2025: TAX_YEAR_2025
};

/**
 * Get the latest available tax year
 */
export const getLatestTaxYear = (): number => {
  return Math.max(...Object.keys(TAX_YEARS).map(year => parseInt(year)));
};

/**
 * Check if a tax year is supported
 */
export const isTaxYearSupported = (year: number): boolean => {
  return year in TAX_YEARS;
};

/**
 * Get tax data for a specific year, falling back to the latest year if not available
 */
export const getTaxYearData = (year: number): TaxYearData => {
  if (isTaxYearSupported(year)) {
    return TAX_YEARS[year];
  }
  
  // Fallback to latest year
  const latestYear = getLatestTaxYear();
  console.warn(`Tax year ${year} not supported. Using latest available year (${latestYear}).`);
  return TAX_YEARS[latestYear];
};

/**
 * Add a new tax year data
 * @param taxYearData The tax year data to add
 */
export const addTaxYearData = (taxYearData: TaxYearData): void => {
  if (taxYearData.year in TAX_YEARS) {
    console.warn(`Tax year ${taxYearData.year} already exists. Overwriting.`);
  }
  
  TAX_YEARS[taxYearData.year] = taxYearData;
};
