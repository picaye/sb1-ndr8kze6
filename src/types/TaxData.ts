export interface MunicipalityTaxData {
  id: string;
  name: string;
  canton: string;
  taxMultiplier: Record<number, number>; // Year -> Tax multiplier
  churchTaxMultiplier?: Record<number, number>; // Year -> Church tax multiplier
  wealthTaxRate?: Record<number, number>; // Year -> Wealth tax rate in ‰
  specialDeductions?: {
    childDeduction?: number;
    childcareDeduction?: number;
    insuranceDeduction?: number;
    commutingDeduction?: number;
  };
  notes?: string[];
}

export interface CantonTaxData {
  id: string;
  name: string;
  baseTaxRate: Record<number, number>; // Year -> Base tax rate
  wealthTaxBase?: Record<number, number>; // Year -> Base wealth tax rate in ‰
  specialRules?: {
    maxCommutingDeduction?: number;
    maxChildcareDeduction?: number;
    maxInsuranceDeduction?: number;
    maxPillar3aDeduction?: number;
  };
  notes?: string[];
}