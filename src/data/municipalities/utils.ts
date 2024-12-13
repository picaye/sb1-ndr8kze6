import { Municipality } from './types';
import { municipalities } from './index';

export function getMunicipalitiesForCanton(canton: string): string[] {
  return (municipalities[canton] || []).map(m => m.name);
}

export function getMunicipalityTaxMultiplier(canton: string, municipality: string): number {
  const municipalityData = municipalities[canton]?.find(m => m.name === municipality);
  return municipalityData?.taxMultiplier || 100;
}

export function filterMunicipalities(canton: string, query: string): string[] {
  const municipalityList = getMunicipalitiesForCanton(canton);
  if (!query) return municipalityList;
  
  const normalizedQuery = query.toLowerCase().trim();
  return municipalityList.filter(municipality => 
    municipality.toLowerCase().includes(normalizedQuery)
  );
}

export function validateMunicipality(canton: string, municipality: string): boolean {
  return getMunicipalitiesForCanton(canton).includes(municipality);
}