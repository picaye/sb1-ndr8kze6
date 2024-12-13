import { PersonalInfo, FinancialInfo } from '../../../types/TaxInfo';
import { calculateTaxableIncome } from './taxableIncome';
import { calculateFederalTax } from './federalTax';
import { calculateCantonalTax } from './cantonalTax';

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
    deductions,
    isJointFiling 
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
    'Zürich': 1.19,
    'Winterthur': 1.22,
    'Uster': 1.10,
    'Bern': 1.54,
    'Basel': 1.20,
    'Lausanne': 1.54,
    'Geneva': 0.44,
    'Zug': 0.60
  };

  return multipliers[municipality] || 1.0;
}

function calculateChurchTax(cantonalTax: number, personalInfo: PersonalInfo): {
  person1?: number;
  person2?: number;
  total: number;
} {
  const churchTaxRates: Record<string, number> = {
    'Zürich': 0.08,
    'Bern': 0.21,
    'Basel-Stadt': 0.10,
    'St. Gallen': 0.23,
    'Zug': 0.075
  };

  const baseRate = churchTaxRates[personalInfo.canton] || 0.08;
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