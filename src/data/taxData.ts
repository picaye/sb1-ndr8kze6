import { MunicipalityTaxData, CantonTaxData } from '../types/TaxData';

// Example data for a few municipalities in Zürich
export const municipalityTaxData: MunicipalityTaxData[] = [
  {
    id: 'zh-zurich',
    name: 'Zürich',
    canton: 'Zürich',
    taxMultiplier: {
      2024: 119,
      2023: 119,
      2022: 119,
      2021: 119,
      2020: 119,
    },
    churchTaxMultiplier: {
      2024: 10,
      2023: 10,
      2022: 10,
      2021: 10,
      2020: 10,
    },
    wealthTaxRate: {
      2024: 0.3,
      2023: 0.3,
      2022: 0.3,
      2021: 0.3,
      2020: 0.3,
    },
    specialDeductions: {
      childDeduction: 9000,
      childcareDeduction: 10100,
      insuranceDeduction: 2600,
      commutingDeduction: 3000,
    },
    notes: [
      'Progressive tax rate system',
      'Special deductions for energy-efficient renovations',
      'Additional deductions for public transport users',
    ],
  },
  {
    id: 'zh-winterthur',
    name: 'Winterthur',
    canton: 'Zürich',
    taxMultiplier: {
      2024: 122,
      2023: 122,
      2022: 124,
      2021: 124,
      2020: 124,
    },
    churchTaxMultiplier: {
      2024: 11,
      2023: 11,
      2022: 11,
      2021: 11,
      2020: 11,
    },
    wealthTaxRate: {
      2024: 0.3,
      2023: 0.3,
      2022: 0.3,
      2021: 0.3,
      2020: 0.3,
    },
    specialDeductions: {
      childDeduction: 9000,
      childcareDeduction: 10100,
      insuranceDeduction: 2600,
      commutingDeduction: 3000,
    },
  },
];

// Canton base tax rates and rules
export const cantonTaxData: CantonTaxData[] = [
  {
    id: 'zh',
    name: 'Zürich',
    baseTaxRate: {
      2024: 100,
      2023: 100,
      2022: 100,
      2021: 100,
      2020: 100,
    },
    wealthTaxBase: {
      2024: 0.3,
      2023: 0.3,
      2022: 0.3,
      2021: 0.3,
      2020: 0.3,
    },
    specialRules: {
      maxCommutingDeduction: 5000,
      maxChildcareDeduction: 10100,
      maxInsuranceDeduction: 2600,
      maxPillar3aDeduction: 7056,
    },
    notes: [
      'Progressive tax rate system with 13 brackets',
      'Special deductions for energy-efficient renovations',
      'Additional deductions for public transport users',
    ],
  },
];

export function getTaxDataForMunicipality(municipalityId: string, year: number): MunicipalityTaxData | null {
  const municipality = municipalityTaxData.find(m => m.id === municipalityId);
  if (!municipality) return null;

  return {
    ...municipality,
    taxMultiplier: { [year]: municipality.taxMultiplier[year] },
    churchTaxMultiplier: municipality.churchTaxMultiplier ? 
      { [year]: municipality.churchTaxMultiplier[year] } : undefined,
    wealthTaxRate: municipality.wealthTaxRate ?
      { [year]: municipality.wealthTaxRate[year] } : undefined,
  };
}

export function getCantonTaxData(cantonId: string, year: number): CantonTaxData | null {
  const canton = cantonTaxData.find(c => c.id === cantonId);
  if (!canton) return null;

  return {
    ...canton,
    baseTaxRate: { [year]: canton.baseTaxRate[year] },
    wealthTaxBase: canton.wealthTaxBase ?
      { [year]: canton.wealthTaxBase[year] } : undefined,
  };
}