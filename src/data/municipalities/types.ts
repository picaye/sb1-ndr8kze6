export interface Municipality {
  name: string;
  taxMultiplier: number;
  canton?: string;
}

export interface MunicipalitySearchResult {
  id: string;
  name: string;
  canton: string;
  type: 'municipality';
  taxMultiplier: number;
}