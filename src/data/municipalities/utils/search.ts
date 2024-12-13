import { Municipality } from '../types';
import { municipalities } from '../index';

export function searchMunicipalities(
  canton: string,
  query: string
): Municipality[] {
  const municipalityList = municipalities[canton] || [];
  if (!query) return municipalityList;
  
  const normalizedQuery = query.toLowerCase().trim();
  return municipalityList.filter(municipality => 
    municipality.name.toLowerCase().includes(normalizedQuery)
  );
}

export function getMunicipalitiesForCanton(canton: string): Municipality[] {
  return municipalities[canton] || [];
}