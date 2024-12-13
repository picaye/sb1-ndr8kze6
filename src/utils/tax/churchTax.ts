import { PersonalInfo } from '../../types/TaxInfo';

const CHURCH_TAX_RATES: Record<string, number> = {
  'Zürich': 0.08,
  'Bern': 0.21,
  'Luzern': 0.25,
  'Basel-Stadt': 0.1,
  'St. Gallen': 0.23,
  'Aargau': 0.15,
  'Ticino': 0.18,
  'Vaud': 0.15,
  'Geneva': 0
};

export function calculateChurchTax(cantonalTax: number, personalInfo: PersonalInfo): number | undefined {
  if (personalInfo.religion === 'none' || personalInfo.religion === 'other') {
    return undefined;
  }

  const rate = CHURCH_TAX_RATES[personalInfo.canton] || 0.08;
  return cantonalTax * rate;
}