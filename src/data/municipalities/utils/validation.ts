import { Municipality } from '../types';
import { municipalities } from '../index';

export function validateMunicipality(canton: string, municipality: string): boolean {
  const municipalityList = municipalities[canton];
  return municipalityList?.some(m => m.name === municipality) ?? false;
}

export function getMunicipalityData(canton: string, municipality: string): Municipality | undefined {
  const municipalityList = municipalities[canton];
  return municipalityList?.find(m => m.name === municipality);
}