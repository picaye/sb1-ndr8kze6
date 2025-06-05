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

// Import all canton municipality files
import { zurichMunicipalities } from '../data/municipalities/zurich';
import { bernMunicipalities } from '../data/municipalities/bern';
import { baselMunicipalities } from '../data/municipalities/basel';
import { genevaMunicipalities } from '../data/municipalities/geneva';
import { vaudMunicipalities } from '../data/municipalities/vaud';
import { zugMunicipalities } from '../data/municipalities/zug';
import { lucerneMunicipalities } from '../data/municipalities/lucerne';
import { stGallenMunicipalities } from '../data/municipalities/stgallen';
import { valaisMunicipalities } from '../data/municipalities/valais';
import { aargauMunicipalities } from '../data/municipalities/aargau';
import { appenzellInnerrhodenMunicipalities } from '../data/municipalities/appenzell-innerrhoden';
import { appenzellAusserrhodenMunicipalities } from '../data/municipalities/appenzell-ausserrhoden';
import { baselLandschaftMunicipalities } from '../data/municipalities/basel-landschaft';
import { fribourgMunicipalities } from '../data/municipalities/fribourg';
import { glarusMunicipalities } from '../data/municipalities/glarus';
import { graubuendenMunicipalities } from '../data/municipalities/graubuenden';
import { juraMunicipalities } from '../data/municipalities/jura';
import { neuchatelMunicipalities } from '../data/municipalities/neuchatel';
import { nidwaldenMunicipalities } from '../data/municipalities/nidwalden';
import { obwaldenMunicipalities } from '../data/municipalities/obwalden';
import { schaffhausenMunicipalities } from '../data/municipalities/schaffhausen';
import { schwyzMunicipalities } from '../data/municipalities/schwyz';
import { solothurnMunicipalities } from '../data/municipalities/solothurn';
import { thurgauMunicipalities } from '../data/municipalities/thurgau';
import { ticinoMunicipalities } from '../data/municipalities/ticino';
import { uriMunicipalities } from '../data/municipalities/uri';

// Create a comprehensive mapping for all cantons with their municipalities
const cantonMunicipalitiesMap: Record<string, { name: string; taxMultiplier: number }[]> = {
  // Direct mappings
  'Aargau': aargauMunicipalities,
  'Appenzell Ausserrhoden': appenzellAusserrhodenMunicipalities,
  'Appenzell Innerrhoden': appenzellInnerrhodenMunicipalities,
  'Basel-Stadt': baselMunicipalities.filter(m => m.canton === 'Basel-Stadt'),
  'Basel-Landschaft': baselLandschaftMunicipalities,
  'Bern': bernMunicipalities,
  'Fribourg': fribourgMunicipalities,
  'Geneva': genevaMunicipalities,
  'Glarus': glarusMunicipalities,
  'Graubünden': graubuendenMunicipalities,
  'Jura': juraMunicipalities,
  'Luzern': lucerneMunicipalities,
  'Neuchâtel': neuchatelMunicipalities,
  'Nidwalden': nidwaldenMunicipalities,
  'Obwalden': obwaldenMunicipalities,
  'Schaffhausen': schaffhausenMunicipalities,
  'Schwyz': schwyzMunicipalities,
  'Solothurn': solothurnMunicipalities,
  'St. Gallen': stGallenMunicipalities,
  'Thurgau': thurgauMunicipalities,
  'Ticino': ticinoMunicipalities,
  'Uri': uriMunicipalities,
  'Valais': valaisMunicipalities,
  'Vaud': vaudMunicipalities,
  'Zug': zugMunicipalities,
  'Zürich': zurichMunicipalities,
  
  // Alternative spellings and encoding variants
  'Zurich': zurichMunicipalities,
  'Genève': genevaMunicipalities,
  'Neuchatel': neuchatelMunicipalities,
  'Graubunden': graubuendenMunicipalities,
  'St.Gallen': stGallenMunicipalities
};

export function getMunicipalitiesForCanton(canton: string): string[] {
  const normalizedCanton = canton.trim();
  
  // Try direct lookup first - this should catch most cases with our expanded mapping
  const directResult = cantonMunicipalitiesMap[normalizedCanton];
  if (directResult && directResult.length > 0) {
    console.log(`Found ${directResult.length} municipalities for canton "${normalizedCanton}" via direct lookup`);
    return directResult.map(m => m.name);
  }
  
  // Try case-insensitive matching
  const caseInsensitiveKey = Object.keys(cantonMunicipalitiesMap).find(key =>
    key.toLowerCase() === normalizedCanton.toLowerCase());
  
  if (caseInsensitiveKey) {
    const result = cantonMunicipalitiesMap[caseInsensitiveKey];
    console.log(`Found ${result.length} municipalities for "${normalizedCanton}" via case-insensitive match to "${caseInsensitiveKey}"`);
    return result.map(m => m.name);
  }
  
  // Try removing diacritics/accents
  const withoutAccents = normalizedCanton.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const accentKey = Object.keys(cantonMunicipalitiesMap).find(key =>
    key.normalize("NFD").replace(/[\u0300-\u036f]/g, "") === withoutAccents);
  
  if (accentKey) {
    const result = cantonMunicipalitiesMap[accentKey];
    console.log(`Found ${result.length} municipalities for "${normalizedCanton}" via accent normalization to "${accentKey}"`);
    return result.map(m => m.name);
  }
  
  // As a fallback, check the original municipalities object
  if (municipalities[normalizedCanton] && municipalities[normalizedCanton].length > 0) {
    const result = municipalities[normalizedCanton];
    console.log(`Found ${result.length} municipalities for "${normalizedCanton}" via original municipalities object`);
    return result.map(m => m.name);
  }
  
  // Log a warning for debugging
  console.warn(`No municipalities found for canton: "${normalizedCanton}"`);
  console.log("Available cantons:", Object.keys(cantonMunicipalitiesMap).join(", "));
  
  // Create a last resort fallback for specific problematic cantons
  const fallbacks: Record<string, { name: string; taxMultiplier: number }[]> = {
    'Zürich': zurichMunicipalities,
    'Bern': bernMunicipalities,
    'Aargau': aargauMunicipalities,
    'Vaud': vaudMunicipalities,
    'Basel': baselMunicipalities
  };
  
  // Check our fallbacks
  const fallbackKey = Object.keys(fallbacks).find(key =>
    normalizedCanton.includes(key) || key.includes(normalizedCanton));
  
  if (fallbackKey) {
    const result = fallbacks[fallbackKey];
    console.log(`Using fallback for "${normalizedCanton}" via partial match to "${fallbackKey}"`);
    return result.map(m => m.name);
  }
  
  // If all else fails, return an empty array
  return [];
}

export function getMunicipalityTaxMultiplier(canton: string, municipality: string): number {
  const normalizedCanton = canton.trim();
  const normalizedMunicipality = municipality.trim();
  
  // First try using our comprehensive mapping
  const cantonMunicipalities = cantonMunicipalitiesMap[normalizedCanton];
  if (cantonMunicipalities) {
    const found = cantonMunicipalities.find(m => m.name === normalizedMunicipality);
    if (found) {
      return found.taxMultiplier;
    }
  }
  
  // If that fails, try case-insensitive search in our comprehensive mapping
  const caseInsensitiveKey = Object.keys(cantonMunicipalitiesMap).find(key =>
    key.toLowerCase() === normalizedCanton.toLowerCase());
  
  if (caseInsensitiveKey) {
    const list = cantonMunicipalitiesMap[caseInsensitiveKey];
    const found = list.find(m => m.name === normalizedMunicipality);
    if (found) {
      return found.taxMultiplier;
    }
    
    // Try case-insensitive municipality match
    const fuzzyMatch = list.find(m =>
      m.name.toLowerCase() === normalizedMunicipality.toLowerCase());
    if (fuzzyMatch) {
      return fuzzyMatch.taxMultiplier;
    }
  }
  
  // As a fallback, check the original municipalities object
  const municipalityList = municipalities[normalizedCanton] || [];
  const found = municipalityList.find(m => m.name === normalizedMunicipality);
  if (found) {
    return found.taxMultiplier;
  }
  
  // Default to 100 if we can't find the tax multiplier
  // This is a conventional value used as a baseline in Switzerland
  return 100;
}