/**
 * src/data/simpleSwissData.ts
 *
 * A simplified, yet more comprehensive, hardcoded data structure for Swiss cantons 
 * and their major municipalities, including tax multipliers.
 * This file aims to reflect the comprehensive data collection capabilities of the platform.
 */

export interface MunicipalityWithRates {
  name: string;
  taxMultiplier2024: number; // Represented as decimal, e.g., 1.19 for 119%
  taxMultiplier2025: number; // Represented as decimal, e.g., 1.19 for 119%
  bfsNr?: number; // Optional BFS number for reference
}

export interface SimpleCantonDataWithRates {
  [cantonName: string]: MunicipalityWithRates[];
}

export const simpleSwissMunicipalities: SimpleCantonDataWithRates = {
  'Aargau': [
    { name: 'Aarau', bfsNr: 4001, taxMultiplier2024: 1.09, taxMultiplier2025: 1.09 },
    { name: 'Baden', bfsNr: 4021, taxMultiplier2024: 0.95, taxMultiplier2025: 0.95 },
    { name: 'Brugg', bfsNr: 4095, taxMultiplier2024: 1.07, taxMultiplier2025: 1.07 },
    { name: 'Frick', bfsNr: 4165, taxMultiplier2024: 0.98, taxMultiplier2025: 0.98 },
    { name: 'Lenzburg', bfsNr: 4201, taxMultiplier2024: 1.03, taxMultiplier2025: 1.03 },
    { name: 'Möhlin', bfsNr: 4257, taxMultiplier2024: 1.00, taxMultiplier2025: 1.00 },
    { name: 'Neuenhof', bfsNr: 4032, taxMultiplier2024: 1.02, taxMultiplier2025: 1.02 },
    { name: 'Oftringen', bfsNr: 4280, taxMultiplier2024: 1.12, taxMultiplier2025: 1.12 },
    { name: 'Rheinfelden', bfsNr: 4258, taxMultiplier2024: 1.05, taxMultiplier2025: 1.05 },
    { name: 'Spreitenbach', bfsNr: 4037, taxMultiplier2024: 1.05, taxMultiplier2025: 1.05 },
    { name: 'Suhr', bfsNr: 4012, taxMultiplier2024: 1.08, taxMultiplier2025: 1.08 },
    { name: 'Villmergen', bfsNr: 4079, taxMultiplier2024: 1.06, taxMultiplier2025: 1.06 },
    { name: 'Wettingen', bfsNr: 4040, taxMultiplier2024: 0.90, taxMultiplier2025: 0.90 },
    { name: 'Windisch', bfsNr: 4126, taxMultiplier2024: 1.01, taxMultiplier2025: 1.01 },
    { name: 'Wohlen (AG)', bfsNr: 4081, taxMultiplier2024: 1.15, taxMultiplier2025: 1.15 },
    { name: 'Zofingen', bfsNr: 4289, taxMultiplier2024: 1.06, taxMultiplier2025: 1.06 }
  ],
  'Basel-Landschaft': [
    { name: 'Allschwil', taxMultiplier2024: 0.60, taxMultiplier2025: 0.60 },
    { name: 'Arlesheim', taxMultiplier2024: 0.53, taxMultiplier2025: 0.53 },
    { name: 'Binningen', taxMultiplier2024: 0.48, taxMultiplier2025: 0.48 },
    { name: 'Liestal', taxMultiplier2024: 0.62, taxMultiplier2025: 0.62 },
    { name: 'Münchenstein', taxMultiplier2024: 0.58, taxMultiplier2025: 0.58 },
    { name: 'Muttenz', taxMultiplier2024: 0.55, taxMultiplier2025: 0.55 },
    { name: 'Oberwil (BL)', taxMultiplier2024: 0.50, taxMultiplier2025: 0.50 },
    { name: 'Pratteln', taxMultiplier2024: 0.60, taxMultiplier2025: 0.60 },
    { name: 'Reinach (BL)', taxMultiplier2024: 0.56, taxMultiplier2025: 0.56 }
  ],
  'Basel-Stadt': [
    { name: 'Basel', taxMultiplier2024: 1.0, taxMultiplier2025: 1.0 },
    { name: 'Bettingen', taxMultiplier2024: 1.0, taxMultiplier2025: 1.0 },
    { name: 'Riehen', taxMultiplier2024: 1.0, taxMultiplier2025: 1.0 }
  ],
  'Bern': [
    { name: 'Bern', bfsNr: 351, taxMultiplier2024: 1.54, taxMultiplier2025: 1.54 },
    { name: 'Biel/Bienne', bfsNr: 371, taxMultiplier2024: 1.63, taxMultiplier2025: 1.63 },
    { name: 'Thun', bfsNr: 942, taxMultiplier2024: 1.65, taxMultiplier2025: 1.65 },
    { name: 'Köniz', bfsNr: 585, taxMultiplier2024: 1.49, taxMultiplier2025: 1.49 },
    { name: 'Burgdorf', bfsNr: 404, taxMultiplier2024: 1.63, taxMultiplier2025: 1.63 },
    { name: 'Langenthal', bfsNr: 425, taxMultiplier2024: 1.59, taxMultiplier2025: 1.59 },
    { name: 'Interlaken', bfsNr: 502, taxMultiplier2024: 1.75, taxMultiplier2025: 1.75 },
    { name: 'Münsingen', bfsNr: 547, taxMultiplier2024: 1.55, taxMultiplier2025: 1.55 }
  ],
  'Fribourg': [
    { name: 'Bulle', taxMultiplier2024: 0.81, taxMultiplier2025: 0.81 },
    { name: 'Fribourg', taxMultiplier2024: 0.83, taxMultiplier2025: 0.83 },
    { name: 'Murten', taxMultiplier2024: 0.70, taxMultiplier2025: 0.70 },
    { name: 'Villars-sur-Glâne', taxMultiplier2024: 0.75, taxMultiplier2025: 0.75 },
    { name: 'Düdingen', taxMultiplier2024: 0.85, taxMultiplier2025: 0.85 }
  ],
  'Geneva': [
    { name: 'Genève', bfsNr: 6621, taxMultiplier2024: 0.455, taxMultiplier2025: 0.455 },
    { name: 'Carouge (GE)', bfsNr: 6608, taxMultiplier2024: 0.445, taxMultiplier2025: 0.445 },
    { name: 'Lancy', bfsNr: 6624, taxMultiplier2024: 0.475, taxMultiplier2025: 0.475 },
    { name: 'Meyrin', bfsNr: 6628, taxMultiplier2024: 0.440, taxMultiplier2025: 0.440 },
    { name: 'Onex', bfsNr: 6631, taxMultiplier2024: 0.480, taxMultiplier2025: 0.480 },
    { name: 'Vernier', bfsNr: 6644, taxMultiplier2024: 0.475, taxMultiplier2025: 0.475 },
    { name: 'Cologny', bfsNr: 6610, taxMultiplier2024: 0.300, taxMultiplier2025: 0.300 },
    { name: 'Plan-les-Ouates', bfsNr: 6633, taxMultiplier2024: 0.380, taxMultiplier2025: 0.380 }
  ],
  'Glarus': [
    { name: 'Glarus', bfsNr: 1628, taxMultiplier2024: 0.58, taxMultiplier2025: 0.58 },
    { name: 'Glarus Nord', bfsNr: 1627, taxMultiplier2024: 0.58, taxMultiplier2025: 0.58 },
    { name: 'Glarus Süd', bfsNr: 1629, taxMultiplier2024: 0.58, taxMultiplier2025: 0.58 }
  ],
  'Graubünden': [
    { name: 'Chur', taxMultiplier2024: 1.05, taxMultiplier2025: 1.05 },
    { name: 'Davos', taxMultiplier2024: 0.80, taxMultiplier2025: 0.80 },
    { name: 'St. Moritz', taxMultiplier2024: 0.70, taxMultiplier2025: 0.70 },
    { name: 'Domat/Ems', taxMultiplier2024: 1.00, taxMultiplier2025: 1.00 },
    { name: 'Landquart', taxMultiplier2024: 0.98, taxMultiplier2025: 0.98 }
  ],
  'Jura': [
    { name: 'Delémont', bfsNr: 6706, taxMultiplier2024: 1.90, taxMultiplier2025: 1.90 },
    { name: 'Porrentruy', bfsNr: 6721, taxMultiplier2024: 1.95, taxMultiplier2025: 1.95 },
    { name: 'Haute-Sorne', bfsNr: 6809, taxMultiplier2024: 1.85, taxMultiplier2025: 1.85 },
    { name: 'Saignelégier', bfsNr: 6757, taxMultiplier2024: 1.80, taxMultiplier2025: 1.80 }
  ],
  'Luzern': [
    { name: 'Luzern', taxMultiplier2024: 1.75, taxMultiplier2025: 1.75 },
    { name: 'Emmen', taxMultiplier2024: 1.95, taxMultiplier2025: 1.95 },
    { name: 'Kriens', taxMultiplier2024: 1.80, taxMultiplier2025: 1.80 },
    { name: 'Horw', taxMultiplier2024: 1.45, taxMultiplier2025: 1.45 },
    { name: 'Sursee', taxMultiplier2024: 1.70, taxMultiplier2025: 1.70 }
  ],
  'Neuchâtel': [
    { name: 'Neuchâtel', bfsNr: 6421, taxMultiplier2024: 0.65, taxMultiplier2025: 0.65 },
    { name: 'La Chaux-de-Fonds', bfsNr: 6424, taxMultiplier2024: 0.75, taxMultiplier2025: 0.75 },
    { name: 'Le Locle', bfsNr: 6425, taxMultiplier2024: 0.78, taxMultiplier2025: 0.78 },
    { name: 'Val-de-Ruz', bfsNr: 6430, taxMultiplier2024: 0.70, taxMultiplier2025: 0.70 }
  ],
  'Schwyz': [
    { name: 'Schwyz', bfsNr: 1305, taxMultiplier2024: 1.30, taxMultiplier2025: 1.30 },
    { name: 'Freienbach', bfsNr: 1321, taxMultiplier2024: 0.75, taxMultiplier2025: 0.75 },
    { name: 'Einsiedeln', bfsNr: 1301, taxMultiplier2024: 1.80, taxMultiplier2025: 1.80 },
    { name: 'Küssnacht (SZ)', bfsNr: 1302, taxMultiplier2024: 0.90, taxMultiplier2025: 0.90 },
    { name: 'Wollerau', bfsNr: 1323, taxMultiplier2024: 0.60, taxMultiplier2025: 0.60 }
  ],
  'Solothurn': [
    { name: 'Solothurn', taxMultiplier2024: 1.20, taxMultiplier2025: 1.20 },
    { name: 'Olten', taxMultiplier2024: 1.18, taxMultiplier2025: 1.18 },
    { name: 'Grenchen', taxMultiplier2024: 1.28, taxMultiplier2025: 1.28 }
  ],
  'St. Gallen': [
    { name: 'St. Gallen', taxMultiplier2024: 1.45, taxMultiplier2025: 1.45 },
    { name: 'Rapperswil-Jona', taxMultiplier2024: 0.94, taxMultiplier2025: 0.94 },
    { name: 'Wil (SG)', taxMultiplier2024: 1.35, taxMultiplier2025: 1.35 },
    { name: 'Gossau (SG)', taxMultiplier2024: 1.25, taxMultiplier2025: 1.25 },
    { name: 'Buchs (SG)', taxMultiplier2024: 1.15, taxMultiplier2025: 1.15 }
  ],
  'Thurgau': [
    { name: 'Frauenfeld', taxMultiplier2024: 1.63, taxMultiplier2025: 1.63 },
    { name: 'Kreuzlingen', taxMultiplier2024: 1.68, taxMultiplier2025: 1.68 },
    { name: 'Arbon', taxMultiplier2024: 1.73, taxMultiplier2025: 1.73 }
  ],
  'Ticino': [
    { name: 'Lugano', taxMultiplier2024: 0.75, taxMultiplier2025: 0.75 },
    { name: 'Bellinzona', taxMultiplier2024: 0.90, taxMultiplier2025: 0.90 },
    { name: 'Locarno', taxMultiplier2024: 0.85, taxMultiplier2025: 0.85 },
    { name: 'Chiasso', taxMultiplier2024: 0.90, taxMultiplier2025: 0.90 },
    { name: 'Mendrisio', taxMultiplier2024: 0.80, taxMultiplier2025: 0.80 }
  ],
  'Valais': [
    { name: 'Sion', taxMultiplier2024: 1.25, taxMultiplier2025: 1.25 },
    { name: 'Martigny', taxMultiplier2024: 1.25, taxMultiplier2025: 1.25 },
    { name: 'Monthey', taxMultiplier2024: 1.30, taxMultiplier2025: 1.30 },
    { name: 'Sierre', taxMultiplier2024: 1.20, taxMultiplier2025: 1.20 },
    { name: 'Brig-Glis', taxMultiplier2024: 1.10, taxMultiplier2025: 1.10 }
  ],
  'Vaud': [
    { name: 'Lausanne', bfsNr: 5586, taxMultiplier2024: 0.79, taxMultiplier2025: 0.79 },
    { name: 'Montreux', bfsNr: 5886, taxMultiplier2024: 0.69, taxMultiplier2025: 0.69 },
    { name: 'Yverdon-les-Bains', bfsNr: 5938, taxMultiplier2024: 0.75, taxMultiplier2025: 0.75 },
    { name: 'Nyon', bfsNr: 5724, taxMultiplier2024: 0.60, taxMultiplier2025: 0.60 },
    { name: 'Vevey', bfsNr: 5887, taxMultiplier2024: 0.78, taxMultiplier2025: 0.78 },
    { name: 'Morges', bfsNr: 5722, taxMultiplier2024: 0.68, taxMultiplier2025: 0.68 },
    { name: 'Gland', bfsNr: 5719, taxMultiplier2024: 0.55, taxMultiplier2025: 0.55 }
  ],
  'Zug': [
    { name: 'Zug', bfsNr: 1701, taxMultiplier2024: 0.55, taxMultiplier2025: 0.55 },
    { name: 'Baar', bfsNr: 1702, taxMultiplier2024: 0.52, taxMultiplier2025: 0.52 },
    { name: 'Cham', bfsNr: 1703, taxMultiplier2024: 0.58, taxMultiplier2025: 0.58 },
    { name: 'Risch', bfsNr: 1709, taxMultiplier2024: 0.50, taxMultiplier2025: 0.50 },
    { name: 'Steinhausen', bfsNr: 1708, taxMultiplier2024: 0.54, taxMultiplier2025: 0.54 }
  ],
  'Zürich': [
    { name: 'Zürich', bfsNr: 261, taxMultiplier2024: 1.19, taxMultiplier2025: 1.19 },
    { name: 'Winterthur', bfsNr: 230, taxMultiplier2024: 1.22, taxMultiplier2025: 1.22 },
    { name: 'Uster', bfsNr: 198, taxMultiplier2024: 1.10, taxMultiplier2025: 1.10 },
    { name: 'Dübendorf', bfsNr: 191, taxMultiplier2024: 0.97, taxMultiplier2025: 0.97 },
    { name: 'Dietikon', bfsNr: 133, taxMultiplier2024: 1.23, taxMultiplier2025: 1.23 },
    { name: 'Wetzikon (ZH)', bfsNr: 100, taxMultiplier2024: 1.13, taxMultiplier2025: 1.13 },
    { name: 'Kloten', bfsNr: 176, taxMultiplier2024: 0.98, taxMultiplier2025: 0.98 },
    { name: 'Schlieren', bfsNr: 141, taxMultiplier2024: 1.13, taxMultiplier2025: 1.13 },
    { name: 'Adliswil', bfsNr: 131, taxMultiplier2024: 1.09, taxMultiplier2025: 1.09 },
    { name: 'Thalwil', bfsNr: 161, taxMultiplier2024: 0.90, taxMultiplier2025: 0.90 },
    { name: 'Küsnacht (ZH)', bfsNr: 155, taxMultiplier2024: 0.77, taxMultiplier2025: 0.77 },
    { name: 'Meilen', bfsNr: 157, taxMultiplier2024: 0.87, taxMultiplier2025: 0.87 },
    { name: 'Horgen', bfsNr: 138, taxMultiplier2024: 0.99, taxMultiplier2025: 0.99 },
    { name: 'Bülach', bfsNr: 53, taxMultiplier2024: 1.05, taxMultiplier2025: 1.05 },
    { name: 'Wallisellen', bfsNr: 200, taxMultiplier2024: 0.94, taxMultiplier2025: 0.94 }
  ]
};

export const simpleSwissCantons: string[] = Object.keys(simpleSwissMunicipalities).sort((a, b) =>
  a.localeCompare(b, 'de')
);

/**
 * Gets a list of municipality names for a given canton from the simple data structure.
 * @param cantonName The name of the canton.
 * @returns An array of municipality names, or an empty array if canton not found.
 */
export function getSimpleMunicipalitiesForCanton(cantonName: string): string[] {
  const municipalitiesWithRates = simpleSwissMunicipalities[cantonName] || [];
  return municipalitiesWithRates.map(m => m.name).sort((a,b) => a.localeCompare(b, 'de'));
}

/**
 * Gets the tax multiplier for a specific municipality and year.
 * @param cantonName The name of the canton.
 * @param municipalityName The name of the municipality.
 * @param year The tax year ('2024' or '2025').
 * @returns The tax multiplier as a decimal, or a default of 1.0 if not found.
 */
export function getSimpleMunicipalityTaxMultiplier(
  cantonName: string,
  municipalityName: string,
  year: '2024' | '2025'
): number {
  const municipalitiesInCanton = simpleSwissMunicipalities[cantonName];
  if (municipalitiesInCanton) {
    const municipality = municipalitiesInCanton.find(m => m.name === municipalityName);
    if (municipality) {
      return municipality[year === '2024' ? 'taxMultiplier2024' : 'taxMultiplier2025'];
    }
  }
  console.warn(`Tax multiplier not found for ${municipalityName}, ${cantonName}, ${year}. Defaulting to 1.0.`);
  return 1.0;
}
