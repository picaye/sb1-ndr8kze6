import { municipalities } from '../data/municipalities';

export const cantons = [
  'Aargau',
  'Appenzell Ausserrhoden',
  'Appenzell Innerrhoden',
  'Basel-Landschaft',
  'Basel-Stadt',
  'Bern',
  'Fribourg',
  'Geneva',
  'Glarus',
  'Graubünden',
  'Jura',
  'Luzern',
  'Neuchâtel',
  'Nidwalden',
  'Obwalden',
  'Schaffhausen',
  'Schwyz',
  'Solothurn',
  'St. Gallen',
  'Thurgau',
  'Ticino',
  'Uri',
  'Valais',
  'Vaud',
  'Zug',
  'Zürich'
].sort((a, b) => a.localeCompare(b, 'de'));

export function getMunicipalitiesForCanton(canton: string): string[] {
  const municipalityList = municipalities[canton] || [];
  return municipalityList.map(m => m.name);
}

export function getMunicipalityTaxMultiplier(canton: string, municipality: string): number {
  const municipalityList = municipalities[canton] || [];
  const found = municipalityList.find(m => m.name === municipality);
  return found?.taxMultiplier || 100;
}