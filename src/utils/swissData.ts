import { municipalities } from '../data/municipalities';
import i18n from '../i18n';

// Canton names used as keys in the municipalities object
export const cantonKeys = [
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
];

// Canton names translated for display
export const cantons = cantonKeys.sort((a, b) => a.localeCompare(b, 'de'));

// Mapping between language-specific canton names and their keys
const cantonTranslations: Record<string, Record<string, string>> = {
  en: {}, // English uses the same names as keys
  de: {}, // German uses the same names as keys
  fr: {
    // French translations to their corresponding keys
    'argovie': 'Aargau',
    'appenzell rhodes-extérieures': 'Appenzell Ausserrhoden',
    'appenzell rhodes-intérieures': 'Appenzell Innerrhoden',
    'bâle-campagne': 'Basel-Landschaft',
    'bâle-ville': 'Basel-Stadt',
    'berne': 'Bern',
    'fribourg': 'Fribourg',
    'genève': 'Geneva',
    'glaris': 'Glarus',
    'grisons': 'Graubünden',
    'jura': 'Jura',
    'lucerne': 'Luzern',
    'neuchâtel': 'Neuchâtel',
    'nidwald': 'Nidwalden',
    'obwald': 'Obwalden',
    'schaffhouse': 'Schaffhausen',
    'schwytz': 'Schwyz',
    'soleure': 'Solothurn',
    'saint-gall': 'St. Gallen',
    'thurgovie': 'Thurgau',
    'tessin': 'Ticino',
    'uri': 'Uri',
    'valais': 'Valais',
    'vaud': 'Vaud',
    'zoug': 'Zug',
    'zurich': 'Zürich'
  },
  it: {
    // Italian translations to their corresponding keys
    'argovia': 'Aargau',
    'appenzello esterno': 'Appenzell Ausserrhoden',
    'appenzello interno': 'Appenzell Innerrhoden',
    'basilea campagna': 'Basel-Landschaft',
    'basilea città': 'Basel-Stadt',
    'berna': 'Bern',
    'friburgo': 'Fribourg',
    'ginevra': 'Geneva',
    'glarona': 'Glarus',
    'grigioni': 'Graubünden',
    'giura': 'Jura',
    'lucerna': 'Luzern',
    'neuchâtel': 'Neuchâtel',
    'nidvaldo': 'Nidwalden',
    'obvaldo': 'Obwalden',
    'sciaffusa': 'Schaffhausen',
    'svitto': 'Schwyz',
    'soletta': 'Solothurn',
    'san gallo': 'St. Gallen',
    'turgovia': 'Thurgau',
    'ticino': 'Ticino',
    'uri': 'Uri',
    'vallese': 'Valais',
    'vaud': 'Vaud',
    'zugo': 'Zug',
    'zurigo': 'Zürich'
  }
};

/**
 * Convert a translated canton name to its internal key
 */
export function getCantonKey(translatedName: string): string {
  if (!translatedName) return '';
  
  const currentLanguage = i18n.language || 'en';
  const normalizedTranslatedName = translatedName.toLowerCase().trim();
  
  // English/German direct mapping with special case handling
  if (['en', 'de'].includes(currentLanguage)) {
    // Special case normalization for English/German
    if (/^zurich$/i.test(normalizedTranslatedName)) return 'Zürich';
    if (/^graubunden$/i.test(normalizedTranslatedName)) return 'Graubünden';
    
    // Check for exact match in cantonKeys (case-insensitive)
    const exactMatch = cantonKeys.find(
      key => key.toLowerCase() === normalizedTranslatedName
    );
    if (exactMatch) return exactMatch;

    // Return original if no match found (fallback)
    return translatedName;
  }
  
  // For other languages, try the translation mapping
  const translations = cantonTranslations[currentLanguage] || {};
  
  // Look for case-insensitive match in translations
  for (const [translatedKey, originalKey] of Object.entries(translations)) {
    if (translatedKey.toLowerCase() === normalizedTranslatedName) {
      return originalKey;
    }
  }
  
  // Direct match attempt with cantonKeys as fallback
  const exactMatch = cantonKeys.find(
    key => key.toLowerCase() === normalizedTranslatedName
  );
  if (exactMatch) return exactMatch;
  
  // If all else fails, return the original name
  return translatedName;
}

export function getMunicipalitiesForCanton(canton: string): string[] {
  // Convert the displayed canton name to its key used in the municipalities object
  const cantonKey = getCantonKey(canton);
  const municipalityList = municipalities[cantonKey] || [];
  return municipalityList.map(m => m.name);
}

export function getMunicipalityTaxMultiplier(canton: string, municipality: string): number {
  // Convert the displayed canton name to its key used in the municipalities object
  const cantonKey = getCantonKey(canton);
  const municipalityList = municipalities[cantonKey] || [];
  const found = municipalityList.find(m => m.name === municipality);
  return found?.taxMultiplier || 100;
}

// Helper function to filter municipalities for search functionality
export function filterMunicipalities(canton: string, searchText: string): string[] {
  if (!searchText) return [];
  
  const municipalityList = getMunicipalitiesForCanton(canton);
  const normalizedSearch = searchText.toLowerCase().trim();
  
  return municipalityList.filter(municipality =>
    municipality.toLowerCase().includes(normalizedSearch)
  );
}