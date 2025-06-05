import { PersonalInfo, FinancialInfo } from '../../../types/TaxInfo';
import { calculateTaxableIncome } from './taxableIncome';
import { calculateFederalTax } from './federalTax';
import { calculateCantonalTax } from './cantonalTax';
import { DEFAULT_TAX_MULTIPLIERS, CANTON_CODES } from '../../../data/municipalities/constants';

interface TaxBreakdown {
  federal: number;
  cantonal: number;
  municipal: number;
  church?: {
    person1?: number;
    person2?: number;
    total: number;
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
  };
}

export function calculateTaxes(personalInfo: PersonalInfo, financialInfo: FinancialInfo): TaxBreakdown {
  // Calculate taxable income with all deductions
  const {
    federalTaxableIncome,
    cantonalTaxableIncome,
    deductions
  } = calculateTaxableIncome(personalInfo, financialInfo);

  // Calculate federal tax
  const federalTax = calculateFederalTax(federalTaxableIncome, personalInfo.maritalStatus);

  // Calculate cantonal tax
  const cantonalTax = calculateCantonalTax(cantonalTaxableIncome, personalInfo.canton);

  // Calculate municipal tax (using multiplier)
  const municipalMultiplier = getMunicipalMultiplier(personalInfo.canton, personalInfo.municipality);
  const municipalTax = cantonalTax * municipalMultiplier;

  // Calculate church tax if applicable
  const churchTax = calculateChurchTax(cantonalTax, personalInfo);

  // Calculate total income for effective rate
  const totalIncome = financialInfo.yearlyIncome + (financialInfo.spouseYearlyIncome || 0);

  // Calculate total tax
  const totalTax = federalTax + cantonalTax + municipalTax + (churchTax?.total || 0);

  // Calculate effective tax rate
  const effectiveRate = totalIncome > 0 ? (totalTax / totalIncome) * 100 : 0;

  return {
    federal: federalTax,
    cantonal: cantonalTax,
    municipal: municipalTax,
    church: churchTax,
    total: totalTax,
    effectiveRate,
    details: {
      baseAmount: totalIncome,
      deductions,
      taxableIncome: {
        federal: federalTaxableIncome,
        cantonal: cantonalTaxableIncome
      }
    }
  };
}

function getMunicipalMultiplier(canton: string, municipality: string): number {
  // Municipal tax multipliers for 2024
  const multipliers: Record<string, number> = {
    // Zürich canton
    'Zürich': 1.19,
    'Winterthur': 1.22,
    'Uster': 1.10,
    'Dübendorf': 0.97,
    'Dietikon': 1.23,
    'Wetzikon': 1.13,
    'Opfikon': 0.96,
    'Kloten': 0.98,
    'Adliswil': 1.09,
    'Horgen': 0.99,
    'Wädenswil': 1.09,
    'Thalwil': 1.04,
    'Bülach': 1.05,
    
    // Bern canton
    'Bern': 1.54,
    'Biel/Bienne': 1.63,
    'Thun': 1.65,
    'Köniz': 1.49,
    'Muri bei Bern': 1.20,
    'Burgdorf': 1.63,
    'Langenthal': 1.59,
    'Steffisburg': 1.68,
    'Spiez': 1.65,
    'Worb': 1.60,
    
    // Basel cantons
    'Basel': 1.20,
    'Riehen': 0.80,
    'Liestal': 1.65,
    'Allschwil': 1.60,
    'Reinach (BL)': 1.58,
    'Muttenz': 1.57,
    'Binningen': 1.47,
    'Pratteln': 1.63,
    
    // Geneva canton
    'Geneva': 0.44,
    'Vernier': 0.47,
    'Lancy': 0.47,
    'Meyrin': 0.44,
    'Carouge': 0.44,
    'Versoix': 0.45,
    
    // Vaud canton
    'Lausanne': 1.54,
    'Yverdon-les-Bains': 1.77,
    'Montreux': 1.65,
    'Nyon': 1.35,
    'Vevey': 1.79,
    'Renens': 1.84,
    'Morges': 1.68,
    
    // Zug canton
    'Zug': 0.60,
    'Baar': 0.56,
    'Cham': 0.65,
    'Hünenberg': 0.72,
    'Steinhausen': 0.60,
    'Risch': 0.57,
    
    // Luzern canton
    'Luzern': 1.75,
    'Emmen': 1.95,
    'Kriens': 1.80,
    'Horw': 1.45,
    'Sursee': 1.70,
    
    // St. Gallen canton
    'St. Gallen': 1.44,
    'Rapperswil-Jona': 1.34,
    'Wil': 1.48,
    'Gossau': 1.43,
    'Buchs': 1.32,
    
    // Aargau canton
    'Aarau': 1.13,
    'Baden': 0.95,
    'Wettingen': 0.90,
    'Wohlen': 1.17,
    'Brugg': 1.08,
    
    // Ticino canton
    'Lugano': 0.90,
    'Bellinzona': 0.93,
    'Locarno': 0.90,
    'Chiasso': 0.95,
    'Mendrisio': 0.90
  };

  const multiplier = multipliers[municipality];
  if (multiplier) return multiplier;
  
  // If municipality is not found, use canton default multiplier
  // Get canton code from the CANTON_CODES mapping
  let cantonCode: string | undefined;
  
  // The CANTON_CODES is a const assertion, so we need to check if the canton exists
  if (canton in CANTON_CODES) {
    cantonCode = CANTON_CODES[canton as keyof typeof CANTON_CODES];
  }
  
  // If we have a valid canton code, get the multiplier from DEFAULT_TAX_MULTIPLIERS
  if (cantonCode && cantonCode in DEFAULT_TAX_MULTIPLIERS) {
    return DEFAULT_TAX_MULTIPLIERS[cantonCode] / 100; // Convert to decimal
  }
  
  return 1.0; // Default fallback
}

function calculateChurchTax(cantonalTax: number, personalInfo: PersonalInfo): {
  person1?: number;
  person2?: number;
  total: number;
} {
  const churchTaxRates: Record<string, number> = {
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
    'Vaud': 0.00, // No church tax in Vaud (included in cantonal tax)
    'Valais': 0.17,
    'Neuchâtel': 0.00, // No church tax in Neuchâtel
    'Geneva': 0.00, // No church tax in Geneva
    'Jura': 0.19
  };

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