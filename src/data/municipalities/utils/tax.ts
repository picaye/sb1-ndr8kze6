import { Municipality } from '../types';
import { DEFAULT_TAX_MULTIPLIERS } from '../constants';
import { getMunicipalityData } from './validation';

export function getTaxMultiplier(canton: string, municipality: string): number {
  const municipalityData = getMunicipalityData(canton, municipality);
  if (municipalityData) {
    return municipalityData.taxMultiplier;
  }
  
  // Fallback to canton default
  const cantonCode = Object.entries(DEFAULT_TAX_MULTIPLIERS)
    .find(([code]) => canton.startsWith(code))?.[0];
  return cantonCode ? DEFAULT_TAX_MULTIPLIERS[cantonCode] : 100;
}