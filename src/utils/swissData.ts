import { 
  MUNICIPALITIES_BY_CANTON, 
  DEFAULT_MULTIPLIERS,
  Municipality as ComprehensiveMunicipality // Renaming to avoid conflict if any local Municipality type exists
} from '../data/municipalities/comprehensive';
import { CANTON_CODES } from '../data/municipalities/constants';

/**
 * Sorted list of Swiss canton names.
 */
export const cantons: string[] = Object.keys(CANTON_CODES)
  .sort((a, b) => a.localeCompare(b, 'de'));

/**
 * Helper function to resolve a canton name or code to its official 2-letter code.
 * @param cantonIdentifier - The canton name (e.g., "Zürich", "Zurich") or code (e.g., "ZH").
 * @returns The 2-letter canton code (e.g., "ZH") or undefined if not found.
 */
function resolveCantonCode(cantonIdentifier: string): string | undefined {
  if (!cantonIdentifier) return undefined;
  const trimmedIdentifier = cantonIdentifier.trim();

  // Check if it's already a valid 2-letter code present in our comprehensive data
  if (trimmedIdentifier.length === 2 && MUNICIPALITIES_BY_CANTON[trimmedIdentifier.toUpperCase()]) {
    return trimmedIdentifier.toUpperCase();
  }

  // Try to find by full name (case-insensitive and accent-insensitive)
  const normalizedInput = trimmedIdentifier.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  
  for (const [cantonName, cantonCode] of Object.entries(CANTON_CODES)) {
    const normalizedCantonName = cantonName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if (normalizedCantonName === normalizedInput) {
      return cantonCode;
    }
  }
  
  // Fallback: check if the input is a value in CANTON_CODES (i.e., it's a code like 'ZH' but wasn't a direct key match earlier)
  const upperIdentifier = trimmedIdentifier.toUpperCase();
  if (Object.values(CANTON_CODES).includes(upperIdentifier)) {
      return upperIdentifier;
  }

  console.warn(`[resolveCantonCode] Could not resolve canton identifier: "${cantonIdentifier}" to a known code.`);
  return undefined;
}

/**
 * Retrieves a list of municipality names for a given canton.
 * @param cantonNameOrCode - The name (e.g., "Zürich", "Zurich") or 2-letter code (e.g., "ZH") of the canton.
 * @returns An array of municipality names, sorted alphabetically. Returns an empty array if the canton is not found or has no municipalities.
 */
export function getMunicipalitiesForCanton(cantonNameOrCode: string): string[] {
  if (!cantonNameOrCode) {
    console.warn('[getMunicipalitiesForCanton] Canton name or code is empty or undefined.');
    return [];
  }

  const cantonCode = resolveCantonCode(cantonNameOrCode);

  if (!cantonCode) {
    console.warn(`[getMunicipalitiesForCanton] No valid canton code found for input: "${cantonNameOrCode}".`);
    return [];
  }

  const municipalitiesList: ComprehensiveMunicipality[] | undefined = MUNICIPALITIES_BY_CANTON[cantonCode];

  if (municipalitiesList && municipalitiesList.length > 0) {
    // console.log(`[getMunicipalitiesForCanton] Found ${municipalitiesList.length} municipalities for canton code "${cantonCode}" (input: "${cantonNameOrCode}").`);
    return municipalitiesList.map(m => m.name).sort((a, b) => a.localeCompare(b, 'de'));
  } else {
    console.warn(`[getMunicipalitiesForCanton] No municipalities found in MUNICIPALITIES_BY_CANTON for resolved canton code: "${cantonCode}" (input: "${cantonNameOrCode}").`);
    return [];
  }
}

/**
 * Retrieves the tax multiplier for a specific municipality and year.
 * @param cantonNameOrCode - The name (e.g., "Zürich") or 2-letter code (e.g., "ZH") of the canton.
 * @param municipalityName - The name of the municipality.
 * @param year - The tax year for which to get the multiplier (e.g., "2024", "2025").
 * @returns The tax multiplier as a decimal (e.g., 1.19 for 119%). Returns a default of 1.0 if not found.
 */
export function getMunicipalityTaxMultiplier(
  cantonNameOrCode: string,
  municipalityName: string,
  year: '2024' | '2025' // Ensure year is a valid key for taxMultiplier
): number {
  if (!cantonNameOrCode || !municipalityName) {
    console.warn('[getMunicipalityTaxMultiplier] Canton or municipality name is empty or undefined.');
    return 1.0; // Default multiplier
  }

  const cantonCode = resolveCantonCode(cantonNameOrCode);
  const normalizedMunicipalityName = municipalityName.trim().toLowerCase();

  if (!cantonCode) {
    console.warn(`[getMunicipalityTaxMultiplier] No valid canton code found for input: "${cantonNameOrCode}". Using default multiplier.`);
    return 1.0;
  }

  const municipalitiesList: ComprehensiveMunicipality[] | undefined = MUNICIPALITIES_BY_CANTON[cantonCode];

  if (municipalitiesList) {
    const foundMunicipality = municipalitiesList.find(
      m => m.name.toLowerCase() === normalizedMunicipalityName
    );

    if (foundMunicipality && foundMunicipality.taxMultiplier && foundMunicipality.taxMultiplier[year] !== undefined) {
      // console.log(`[getMunicipalityTaxMultiplier] Found specific multiplier for ${municipalityName}, ${cantonCode}, ${year}: ${foundMunicipality.taxMultiplier[year]}`);
      return foundMunicipality.taxMultiplier[year];
    } else {
      // console.log(`[getMunicipalityTaxMultiplier] Specific multiplier not found for ${municipalityName}, ${cantonCode}, ${year}. Falling back to default.`);
    }
  } else {
    // console.log(`[getMunicipalityTaxMultiplier] No municipality list for canton code ${cantonCode}. Falling back to default.`);
  }

  // Fallback to default multiplier for the canton and year
  const defaultCantonMultipliers = DEFAULT_MULTIPLIERS[cantonCode];
  if (defaultCantonMultipliers && defaultCantonMultipliers[year] !== undefined) {
    console.warn(`[getMunicipalityTaxMultiplier] Using default multiplier for canton ${cantonCode}, year ${year}: ${defaultCantonMultipliers[year]}`);
    return defaultCantonMultipliers[year];
  }

  console.warn(`[getMunicipalityTaxMultiplier] No specific or default multiplier found for ${municipalityName}, ${cantonCode}, ${year}. Returning 1.0.`);
  return 1.0; // Absolute fallback default
}

/**
 * Gets a list of all canton names.
 * @returns An array of canton names.
 */
export function getAllCantonNames(): string[] {
    return [...cantons]; // Return a copy
}

/**
 * Gets the canton code for a given canton name.
 * @param cantonName - The full name of the canton.
 * @returns The 2-letter canton code or undefined if not found.
 */
export function getCantonCode(cantonName: string): string | undefined {
    return resolveCantonCode(cantonName);
}
