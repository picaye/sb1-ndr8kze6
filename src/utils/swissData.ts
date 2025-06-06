/**
 * src/utils/swissData.ts
 *
 * Utility functions for accessing Swiss canton and municipality data.
 * This version is designed to consume data from a comprehensive data source
 * reflecting the platform's full data collection capabilities.
 */

import {
  simpleSwissCantons,
  getSimpleMunicipalitiesForCanton,
  simpleSwissMunicipalities, // Used by getCantonCode to validate canton names
  getSimpleMunicipalityTaxMultiplier, // Import the new function
} from '../data/simpleSwissData'; // Changed back to simpleSwissData

/**
 * Sorted list of Swiss canton names, sourced from the comprehensive dataset.
 */
export const cantons: string[] = [...simpleSwissCantons]; // Export a copy

/**
 * Retrieves a list of municipality names for a given canton using the comprehensive data.
 * @param cantonName - The name of the canton (e.g., "Zürich").
 * @returns An array of municipality names, sorted alphabetically. Returns an empty array if the canton is not found.
 */
export function getMunicipalitiesForCanton(cantonName: string): string[] {
  if (!cantonName) {
    // console.warn('[getMunicipalitiesForCanton] Canton name is empty or undefined.');
    return [];
  }
  // Directly use the function from the comprehensive data source
  const municipalities = getSimpleMunicipalitiesForCanton(cantonName);
  if (municipalities.length === 0) {
    // console.warn(`[getMunicipalitiesForCanton] No municipalities found for canton: "${cantonName}" in comprehensive data.`);
  }
  return municipalities; 
}

/**
 * Gets a list of all canton names from the comprehensive data.
 * @returns An array of canton names.
 */
export function getAllCantonNames(): string[] {
  return [...simpleSwissCantons]; // Return a copy
}

/**
 * For the comprehensive data structure, this function checks if the provided name
 * is a valid canton name (a key in simpleSwissMunicipalities).
 * It does not return a "code" like "ZH" as the data primarily uses full names.
 * If a code is needed, a mapping would have to be reintroduced or managed elsewhere.
 *
 * @param cantonName - The full name of the canton to check.
 * @returns The canton name itself if it's a valid key, otherwise undefined.
 */
export function getCantonCode(cantonName: string): string | undefined {
  if (!cantonName) {
    return undefined;
  }
  // Check if the provided name is a key in our comprehensive data structure
  if (simpleSwissMunicipalities.hasOwnProperty(cantonName)) {
    return cantonName; // In this model, the "code" is the name itself if it's valid
  }
  // console.warn(`[getCantonCode] Canton name "${cantonName}" not found in simpleSwissMunicipalities.`);
  return undefined;
}

/**
 * Retrieves the tax multiplier for a specific municipality and year using the comprehensive data structure.
 * @param cantonName - The name of the canton (e.g., "Zürich").
 * @param municipalityName - The name of the municipality.
 * @param year - The tax year for which to get the multiplier (e.g., "2024", "2025").
 * @returns The tax multiplier as a decimal (e.g., 1.19 for 119%). Returns a default of 1.0 if not found.
 */
export function getMunicipalityTaxMultiplier(
  cantonName: string,
  municipalityName: string,
  year: '2024' | '2025'
): number {
  if (!cantonName || !municipalityName) {
    console.warn('[getMunicipalityTaxMultiplier] Canton or municipality name is empty or undefined in swissData.ts.');
    return 1.0; // Default multiplier
  }
  
  // Directly use the function from the comprehensive data source
  return getSimpleMunicipalityTaxMultiplier(cantonName, municipalityName, year);
}
