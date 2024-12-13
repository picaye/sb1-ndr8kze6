export interface MunicipalityData {
  name: string;
  taxMultiplier: number;
  type: 'municipality';
  canton?: string;
  taxData?: {
    year: number;
    baseRate: number;
    multiplier: number;
    specialDeductions?: {
      children?: number;
      childcare?: number;
      insurance?: number;
      commuting?: number;
    };
  }[];
}

export interface MunicipalitySearchResult {
  id: string;
  name: string;
  canton: string;
  type: 'municipality';
  taxMultiplier: number;
}