import { CANTON_CODES } from './constants';

/**
 * Municipality interface with tax multiplier information
 */
export interface Municipality {
  name: string;
  cantonCode: string;
  zipCode: string;
  taxMultiplier: {
    '2024': number;
    '2025': number;
  };
}

/**
 * Type for municipalities grouped by canton
 */
export type CantonMunicipalities = {
  [cantonCode: string]: Municipality[];
};

/**
 * Type for default tax multipliers by canton
 */
export type DefaultMultipliers = {
  [cantonCode: string]: {
    '2024': number;
    '2025': number;
  };
};

/**
 * Default tax multipliers by canton code
 * Used as fallback when a specific municipality is not found
 */
export const DEFAULT_MULTIPLIERS: DefaultMultipliers = {
  'ZH': { '2024': 1.19, '2025': 1.19 },
  'BE': { '2024': 1.54, '2025': 1.54 },
  'LU': { '2024': 1.75, '2025': 1.75 },
  'UR': { '2024': 1.00, '2025': 1.00 },
  'SZ': { '2024': 1.30, '2025': 1.30 },
  'OW': { '2024': 1.32, '2025': 1.32 },
  'NW': { '2024': 1.37, '2025': 1.37 },
  'GL': { '2024': 0.63, '2025': 0.63 },
  'ZG': { '2024': 0.60, '2025': 0.60 },
  'FR': { '2024': 1.00, '2025': 1.00 },
  'SO': { '2024': 1.15, '2025': 1.15 },
  'BS': { '2024': 1.20, '2025': 1.20 },
  'BL': { '2024': 1.65, '2025': 1.65 },
  'SH': { '2024': 1.18, '2025': 1.18 },
  'AR': { '2024': 1.05, '2025': 1.05 },
  'AI': { '2024': 0.96, '2025': 0.96 },
  'SG': { '2024': 1.44, '2025': 1.44 },
  'GR': { '2024': 1.00, '2025': 1.00 },
  'AG': { '2024': 1.13, '2025': 1.13 },
  'TG': { '2024': 1.17, '2025': 1.17 },
  'TI': { '2024': 0.90, '2025': 0.90 },
  'VD': { '2024': 1.54, '2025': 1.54 },
  'VS': { '2024': 1.40, '2025': 1.40 },
  'NE': { '2024': 1.23, '2025': 1.23 },
  'GE': { '2024': 0.44, '2025': 0.44 },
  'JU': { '2024': 1.90, '2025': 1.90 }
};

/**
 * All Swiss municipalities organized by canton code
 * Includes major population centers and economic hubs from all 26 cantons
 */
export const MUNICIPALITIES_BY_CANTON: CantonMunicipalities = {
  // Zürich (ZH)
  'ZH': [
    { name: 'Zürich', cantonCode: 'ZH', zipCode: '8000', taxMultiplier: { '2024': 1.19, '2025': 1.19 } },
    { name: 'Winterthur', cantonCode: 'ZH', zipCode: '8400', taxMultiplier: { '2024': 1.22, '2025': 1.22 } },
    { name: 'Uster', cantonCode: 'ZH', zipCode: '8610', taxMultiplier: { '2024': 1.10, '2025': 1.10 } },
    { name: 'Dübendorf', cantonCode: 'ZH', zipCode: '8600', taxMultiplier: { '2024': 0.97, '2025': 0.97 } },
    { name: 'Dietikon', cantonCode: 'ZH', zipCode: '8953', taxMultiplier: { '2024': 1.23, '2025': 1.23 } },
    { name: 'Wetzikon', cantonCode: 'ZH', zipCode: '8620', taxMultiplier: { '2024': 1.13, '2025': 1.13 } },
    { name: 'Opfikon', cantonCode: 'ZH', zipCode: '8152', taxMultiplier: { '2024': 0.96, '2025': 0.96 } },
    { name: 'Kloten', cantonCode: 'ZH', zipCode: '8302', taxMultiplier: { '2024': 0.98, '2025': 0.98 } },
    { name: 'Adliswil', cantonCode: 'ZH', zipCode: '8134', taxMultiplier: { '2024': 1.09, '2025': 1.09 } },
    { name: 'Horgen', cantonCode: 'ZH', zipCode: '8810', taxMultiplier: { '2024': 0.99, '2025': 0.99 } },
    { name: 'Wädenswil', cantonCode: 'ZH', zipCode: '8820', taxMultiplier: { '2024': 1.09, '2025': 1.09 } },
    { name: 'Thalwil', cantonCode: 'ZH', zipCode: '8800', taxMultiplier: { '2024': 1.04, '2025': 1.04 } },
    { name: 'Bülach', cantonCode: 'ZH', zipCode: '8180', taxMultiplier: { '2024': 1.05, '2025': 1.05 } },
    { name: 'Volketswil', cantonCode: 'ZH', zipCode: '8604', taxMultiplier: { '2024': 1.05, '2025': 1.05 } },
    { name: 'Zollikon', cantonCode: 'ZH', zipCode: '8702', taxMultiplier: { '2024': 0.82, '2025': 0.82 } },
    { name: 'Küsnacht', cantonCode: 'ZH', zipCode: '8700', taxMultiplier: { '2024': 0.77, '2025': 0.77 } },
    { name: 'Meilen', cantonCode: 'ZH', zipCode: '8706', taxMultiplier: { '2024': 0.87, '2025': 0.87 } },
    { name: 'Regensdorf', cantonCode: 'ZH', zipCode: '8105', taxMultiplier: { '2024': 0.97, '2025': 0.97 } },
    { name: 'Wallisellen', cantonCode: 'ZH', zipCode: '8304', taxMultiplier: { '2024': 0.94, '2025': 0.94 } },
    { name: 'Schlieren', cantonCode: 'ZH', zipCode: '8952', taxMultiplier: { '2024': 1.13, '2025': 1.13 } }
  ],
  
  // Bern (BE)
  'BE': [
    { name: 'Bern', cantonCode: 'BE', zipCode: '3000', taxMultiplier: { '2024': 1.54, '2025': 1.54 } },
    { name: 'Biel/Bienne', cantonCode: 'BE', zipCode: '2500', taxMultiplier: { '2024': 1.63, '2025': 1.63 } },
    { name: 'Thun', cantonCode: 'BE', zipCode: '3600', taxMultiplier: { '2024': 1.65, '2025': 1.65 } },
    { name: 'Köniz', cantonCode: 'BE', zipCode: '3098', taxMultiplier: { '2024': 1.49, '2025': 1.49 } },
    { name: 'Muri bei Bern', cantonCode: 'BE', zipCode: '3074', taxMultiplier: { '2024': 1.20, '2025': 1.20 } },
    { name: 'Burgdorf', cantonCode: 'BE', zipCode: '3400', taxMultiplier: { '2024': 1.63, '2025': 1.63 } },
    { name: 'Langenthal', cantonCode: 'BE', zipCode: '4900', taxMultiplier: { '2024': 1.59, '2025': 1.59 } },
    { name: 'Steffisburg', cantonCode: 'BE', zipCode: '3612', taxMultiplier: { '2024': 1.68, '2025': 1.68 } },
    { name: 'Spiez', cantonCode: 'BE', zipCode: '3700', taxMultiplier: { '2024': 1.65, '2025': 1.65 } },
    { name: 'Worb', cantonCode: 'BE', zipCode: '3076', taxMultiplier: { '2024': 1.60, '2025': 1.60 } },
    { name: 'Interlaken', cantonCode: 'BE', zipCode: '3800', taxMultiplier: { '2024': 1.75, '2025': 1.75 } },
    { name: 'Ostermundigen', cantonCode: 'BE', zipCode: '3072', taxMultiplier: { '2024': 1.65, '2025': 1.65 } },
    { name: 'Belp', cantonCode: 'BE', zipCode: '3123', taxMultiplier: { '2024': 1.54, '2025': 1.54 } },
    { name: 'Münsingen', cantonCode: 'BE', zipCode: '3110', taxMultiplier: { '2024': 1.58, '2025': 1.58 } }
  ],
  
  // Luzern (LU)
  'LU': [
    { name: 'Luzern', cantonCode: 'LU', zipCode: '6000', taxMultiplier: { '2024': 1.75, '2025': 1.75 } },
    { name: 'Emmen', cantonCode: 'LU', zipCode: '6032', taxMultiplier: { '2024': 1.95, '2025': 1.95 } },
    { name: 'Kriens', cantonCode: 'LU', zipCode: '6010', taxMultiplier: { '2024': 1.80, '2025': 1.80 } },
    { name: 'Horw', cantonCode: 'LU', zipCode: '6048', taxMultiplier: { '2024': 1.45, '2025': 1.45 } },
    { name: 'Sursee', cantonCode: 'LU', zipCode: '6210', taxMultiplier: { '2024': 1.70, '2025': 1.70 } },
    { name: 'Ebikon', cantonCode: 'LU', zipCode: '6030', taxMultiplier: { '2024': 1.85, '2025': 1.85 } },
    { name: 'Hochdorf', cantonCode: 'LU', zipCode: '6280', taxMultiplier: { '2024': 1.90, '2025': 1.90 } },
    { name: 'Willisau', cantonCode: 'LU', zipCode: '6130', taxMultiplier: { '2024': 1.85, '2025': 1.85 } }
  ],
  
  // Uri (UR)
  'UR': [
    { name: 'Altdorf', cantonCode: 'UR', zipCode: '6460', taxMultiplier: { '2024': 1.00, '2025': 1.00 } },
    { name: 'Bürglen', cantonCode: 'UR', zipCode: '6463', taxMultiplier: { '2024': 1.00, '2025': 1.00 } },
    { name: 'Schattdorf', cantonCode: 'UR', zipCode: '6467', taxMultiplier: { '2024': 1.00, '2025': 1.00 } },
    { name: 'Erstfeld', cantonCode: 'UR', zipCode: '6472', taxMultiplier: { '2024': 1.00, '2025': 1.00 } }
  ],
  
  // Schwyz (SZ)
  'SZ': [
    { name: 'Schwyz', cantonCode: 'SZ', zipCode: '6430', taxMultiplier: { '2024': 1.30, '2025': 1.30 } },
    { name: 'Freienbach', cantonCode: 'SZ', zipCode: '8807', taxMultiplier: { '2024': 0.85, '2025': 0.85 } },
    { name: 'Einsiedeln', cantonCode: 'SZ', zipCode: '8840', taxMultiplier: { '2024': 1.80, '2025': 1.80 } },
    { name: 'Küssnacht', cantonCode: 'SZ', zipCode: '6403', taxMultiplier: { '2024': 1.00, '2025': 1.00 } },
    { name: 'Arth', cantonCode: 'SZ', zipCode: '6410', taxMultiplier: { '2024': 1.60, '2025': 1.60 } },
    { name: 'Wollerau', cantonCode: 'SZ', zipCode: '8832', taxMultiplier: { '2024': 0.70, '2025': 0.70 } }
  ],
  
  // Obwalden (OW)
  'OW': [
    { name: 'Sarnen', cantonCode: 'OW', zipCode: '6060', taxMultiplier: { '2024': 1.32, '2025': 1.32 } },
    { name: 'Kerns', cantonCode: 'OW', zipCode: '6064', taxMultiplier: { '2024': 1.32, '2025': 1.32 } },
    { name: 'Alpnach', cantonCode: 'OW', zipCode: '6055', taxMultiplier: { '2024': 1.32, '2025': 1.32 } },
    { name: 'Sachseln', cantonCode: 'OW', zipCode: '6072', taxMultiplier: { '2024': 1.32, '2025': 1.32 } }
  ],
  
  // Nidwalden (NW)
  'NW': [
    { name: 'Stans', cantonCode: 'NW', zipCode: '6370', taxMultiplier: { '2024': 1.37, '2025': 1.37 } },
    { name: 'Hergiswil', cantonCode: 'NW', zipCode: '6052', taxMultiplier: { '2024': 1.37, '2025': 1.37 } },
    { name: 'Buochs', cantonCode: 'NW', zipCode: '6374', taxMultiplier: { '2024': 1.37, '2025': 1.37 } },
    { name: 'Stansstad', cantonCode: 'NW', zipCode: '6362', taxMultiplier: { '2024': 1.37, '2025': 1.37 } }
  ],
  
  // Glarus (GL)
  'GL': [
    { name: 'Glarus', cantonCode: 'GL', zipCode: '8750', taxMultiplier: { '2024': 0.63, '2025': 0.63 } },
    { name: 'Glarus Nord', cantonCode: 'GL', zipCode: '8752', taxMultiplier: { '2024': 0.63, '2025': 0.63 } },
    { name: 'Glarus Süd', cantonCode: 'GL', zipCode: '8762', taxMultiplier: { '2024': 0.63, '2025': 0.63 } }
  ],
  
  // Zug (ZG)
  'ZG': [
    { name: 'Zug', cantonCode: 'ZG', zipCode: '6300', taxMultiplier: { '2024': 0.60, '2025': 0.60 } },
    { name: 'Baar', cantonCode: 'ZG', zipCode: '6340', taxMultiplier: { '2024': 0.56, '2025': 0.56 } },
    { name: 'Cham', cantonCode: 'ZG', zipCode: '6330', taxMultiplier: { '2024': 0.65, '2025': 0.65 } },
    { name: 'Hünenberg', cantonCode: 'ZG', zipCode: '6331', taxMultiplier: { '2024': 0.72, '2025': 0.72 } },
    { name: 'Steinhausen', cantonCode: 'ZG', zipCode: '6312', taxMultiplier: { '2024': 0.60, '2025': 0.60 } },
    { name: 'Risch', cantonCode: 'ZG', zipCode: '6343', taxMultiplier: { '2024': 0.57, '2025': 0.57 } }
  ],
  
  // Fribourg (FR)
  'FR': [
    { name: 'Fribourg', cantonCode: 'FR', zipCode: '1700', taxMultiplier: { '2024': 0.83, '2025': 0.83 } },
    { name: 'Bulle', cantonCode: 'FR', zipCode: '1630', taxMultiplier: { '2024': 0.81, '2025': 0.81 } },
    { name: 'Villars-sur-Glâne', cantonCode: 'FR', zipCode: '1752', taxMultiplier: { '2024': 0.75, '2025': 0.75 } },
    { name: 'Marly', cantonCode: 'FR', zipCode: '1723', taxMultiplier: { '2024': 0.85, '2025': 0.85 } },
    { name: 'Düdingen', cantonCode: 'FR', zipCode: '3186', taxMultiplier: { '2024': 0.85, '2025': 0.85 } },
    { name: 'Murten', cantonCode: 'FR', zipCode: '3280', taxMultiplier: { '2024': 0.70, '2025': 0.70 } }
  ],
  
  // Solothurn (SO)
  'SO': [
    { name: 'Solothurn', cantonCode: 'SO', zipCode: '4500', taxMultiplier: { '2024': 1.15, '2025': 1.15 } },
    { name: 'Olten', cantonCode: 'SO', zipCode: '4600', taxMultiplier: { '2024': 1.15, '2025': 1.15 } },
    { name: 'Grenchen', cantonCode: 'SO', zipCode: '2540', taxMultiplier: { '2024': 1.20, '2025': 1.20 } },
    { name: 'Zuchwil', cantonCode: 'SO', zipCode: '4528', taxMultiplier: { '2024': 1.20, '2025': 1.20 } },
    { name: 'Biberist', cantonCode: 'SO', zipCode: '4562', taxMultiplier: { '2024': 1.20, '2025': 1.20 } }
  ],
  
  // Basel-Stadt (BS)
  'BS': [
    { name: 'Basel', cantonCode: 'BS', zipCode: '4000', taxMultiplier: { '2024': 1.20, '2025': 1.20 } },
    { name: 'Riehen', cantonCode: 'BS', zipCode: '4125', taxMultiplier: { '2024': 0.80, '2025': 0.80 } },
    { name: 'Bettingen', cantonCode: 'BS', zipCode: '4126', taxMultiplier: { '2024': 0.75, '2025': 0.75 } }
  ],
  
  // Basel-Landschaft (BL)
  'BL': [
    { name: 'Liestal', cantonCode: 'BL', zipCode: '4410', taxMultiplier: { '2024': 1.65, '2025': 1.65 } },
    { name: 'Allschwil', cantonCode: 'BL', zipCode: '4123', taxMultiplier: { '2024': 1.60, '2025': 1.60 } },
    { name: 'Reinach (BL)', cantonCode: 'BL', zipCode: '4153', taxMultiplier: { '2024': 1.58, '2025': 1.58 } },
    { name: 'Muttenz', cantonCode: 'BL', zipCode: '4132', taxMultiplier: { '2024': 1.57, '2025': 1.57 } },
    { name: 'Binningen', cantonCode: 'BL', zipCode: '4102', taxMultiplier: { '2024': 1.47, '2025': 1.47 } },
    { name: 'Pratteln', cantonCode: 'BL', zipCode: '4133', taxMultiplier: { '2024': 1.63, '2025': 1.63 } }
  ],
  
  // Schaffhausen (SH)
  'SH': [
    { name: 'Schaffhausen', cantonCode: 'SH', zipCode: '8200', taxMultiplier: { '2024': 1.18, '2025': 1.18 } },
    { name: 'Neuhausen am Rheinfall', cantonCode: 'SH', zipCode: '8212', taxMultiplier: { '2024': 1.18, '2025': 1.18 } },
    { name: 'Thayngen', cantonCode: 'SH', zipCode: '8240', taxMultiplier: { '2024': 1.18, '2025': 1.18 } }
  ],
  
  // Appenzell Ausserrhoden (AR)
  'AR': [
    { name: 'Herisau', cantonCode: 'AR', zipCode: '9100', taxMultiplier: { '2024': 1.05, '2025': 1.05 } },
    { name: 'Teufen', cantonCode: 'AR', zipCode: '9053', taxMultiplier: { '2024': 1.05, '2025': 1.05 } },
    { name: 'Speicher', cantonCode: 'AR', zipCode: '9042', taxMultiplier: { '2024': 1.05, '2025': 1.05 } }
  ],
  
  // Appenzell Innerrhoden (AI)
  'AI': [
    { name: 'Appenzell', cantonCode: 'AI', zipCode: '9050', taxMultiplier: { '2024': 0.96, '2025': 0.96 } },
    { name: 'Schwende', cantonCode: 'AI', zipCode: '9057', taxMultiplier: { '2024': 0.96, '2025': 0.96 } },
    { name: 'Rüte', cantonCode: 'AI', zipCode: '9050', taxMultiplier: { '2024': 0.96, '2025': 0.96 } }
  ],
  
  // St. Gallen (SG)
  'SG': [
    { name: 'St. Gallen', cantonCode: 'SG', zipCode: '9000', taxMultiplier: { '2024': 1.44, '2025': 1.44 } },
    { name: 'Rapperswil-Jona', cantonCode: 'SG', zipCode: '8640', taxMultiplier: { '2024': 1.34, '2025': 1.34 } },
    { name: 'Wil', cantonCode: 'SG', zipCode: '9500', taxMultiplier: { '2024': 1.48, '2025': 1.48 } },
    { name: 'Gossau', cantonCode: 'SG', zipCode: '9200', taxMultiplier: { '2024': 1.43, '2025': 1.43 } },
    { name: 'Buchs', cantonCode: 'SG', zipCode: '9470', taxMultiplier: { '2024': 1.32, '2025': 1.32 } },
    { name: 'Uzwil', cantonCode: 'SG', zipCode: '9240', taxMultiplier: { '2024': 1.44, '2025': 1.44 } }
  ],
  
  // Graubünden (GR)
  'GR': [
    { name: 'Chur', cantonCode: 'GR', zipCode: '7000', taxMultiplier: { '2024': 0.95, '2025': 0.95 } },
    { name: 'Davos', cantonCode: 'GR', zipCode: '7270', taxMultiplier: { '2024': 0.85, '2025': 0.85 } },
    { name: 'St. Moritz', cantonCode: 'GR', zipCode: '7500', taxMultiplier: { '2024': 0.75, '2025': 0.75 } },
    { name: 'Domat/Ems', cantonCode: 'GR', zipCode: '7013', taxMultiplier: { '2024': 0.95, '2025': 0.95 } },
    { name: 'Arosa', cantonCode: 'GR', zipCode: '7050', taxMultiplier: { '2024': 0.90, '2025': 0.90 } }
  ],
  
  // Aargau (AG)
  'AG': [
    { name: 'Aarau', cantonCode: 'AG', zipCode: '5000', taxMultiplier: { '2024': 1.13, '2025': 1.13 } },
    { name: 'Baden', cantonCode: 'AG', zipCode: '5400', taxMultiplier: { '2024': 0.95, '2025': 0.95 } },
    { name: 'Wettingen', cantonCode: 'AG', zipCode: '5430', taxMultiplier: { '2024': 0.90, '2025': 0.90 } },
    { name: 'Wohlen', cantonCode: 'AG', zipCode: '5610', taxMultiplier: { '2024': 1.17, '2025': 1.17 } },
    { name: 'Brugg', cantonCode: 'AG', zipCode: '5200', taxMultiplier: { '2024': 1.08, '2025': 1.08 } },
    { name: 'Zofingen', cantonCode: 'AG', zipCode: '4800', taxMultiplier: { '2024': 1.08, '2025': 1.08 } }
  ],
  
  // Thurgau (TG)
  'TG': [
    { name: 'Frauenfeld', cantonCode: 'TG', zipCode: '8500', taxMultiplier: { '2024': 1.17, '2025': 1.17 } },
    { name: 'Kreuzlingen', cantonCode: 'TG', zipCode: '8280', taxMultiplier: { '2024': 1.17, '2025': 1.17 } },
    { name: 'Arbon', cantonCode: 'TG', zipCode: '9320', taxMultiplier: { '2024': 1.17, '2025': 1.17 } },
    { name: 'Amriswil', cantonCode: 'TG', zipCode: '8580', taxMultiplier: { '2024': 1.17, '2025': 1.17 } },
    { name: 'Weinfelden', cantonCode: 'TG', zipCode: '8570', taxMultiplier: { '2024': 1.17, '2025': 1.17 } }
  ],
  
  // Ticino (TI)
  'TI': [
    { name: 'Lugano', cantonCode: 'TI', zipCode: '6900', taxMultiplier: { '2024': 0.90, '2025': 0.90 } },
    { name: 'Bellinzona', cantonCode: 'TI', zipCode: '6500', taxMultiplier: { '2024': 0.93, '2025': 0.93 } },
    { name: 'Locarno', cantonCode: 'TI', zipCode: '6600', taxMultiplier: { '2024': 0.90, '2025': 0.90 } },
    { name: 'Chiasso', cantonCode: 'TI', zipCode: '6830', taxMultiplier: { '2024': 0.95, '2025': 0.95 } },
    { name: 'Mendrisio', cantonCode: 'TI', zipCode: '6850', taxMultiplier: { '2024': 0.90, '2025': 0.90 } },
    { name: 'Biasca', cantonCode: 'TI', zipCode: '6710', taxMultiplier: { '2024': 0.95, '2025': 0.95 } }
  ],
  
  // Vaud (VD)
  'VD': [
    { name: 'Lausanne', cantonCode: 'VD', zipCode: '1000', taxMultiplier: { '2024': 1.54, '2025': 1.54 } },
    { name: 'Yverdon-les-Bains', cantonCode: 'VD', zipCode: '1400', taxMultiplier: { '2024': 1.77, '2025': 1.77 } },
    { name: 'Montreux', cantonCode: 'VD', zipCode: '1820', taxMultiplier: { '2024': 1.65, '2025': 1.65 } },
    { name: 'Nyon', cantonCode: 'VD', zipCode: '1260', taxMultiplier: { '2024': 1.35, '2025': 1.35 } },
    { name: 'Vevey', cantonCode: 'VD', zipCode: '1800', taxMultiplier: { '2024': 1.79, '2025': 1.79 } },
    { name: 'Renens', cantonCode: 'VD', zipCode: '1020', taxMultiplier: { '2024': 1.84, '2025': 1.84 } },
    { name: 'Morges', cantonCode: 'VD', zipCode: '1110', taxMultiplier: { '2024': 1.68, '2025': 1.68 } }
  ],
  
  // Valais (VS)
  'VS': [
    { name: 'Sion', cantonCode: 'VS', zipCode: '1950', taxMultiplier: { '2024': 1.20, '2025': 1.20 } },
    { name: 'Martigny', cantonCode: 'VS', zipCode: '1920', taxMultiplier: { '2024': 1.20, '2025': 1.20 } },
    { name: 'Monthey', cantonCode: 'VS', zipCode: '1870', taxMultiplier: { '2024': 1.20, '2025': 1.20 } },
    { name: 'Sierre', cantonCode: 'VS', zipCode: '3960', taxMultiplier: { '2024': 1.20, '2025': 1.20 } },
    { name: 'Brig-Glis', cantonCode: 'VS', zipCode: '3900', taxMultiplier: { '2024': 1.20, '2025': 1.20 } },
    { name: 'Visp', cantonCode: 'VS', zipCode: '3930', taxMultiplier: { '2024': 1.15, '2025': 1.15 } }
  ],
  
  // Neuchâtel (NE)
  'NE': [
    { name: 'Neuchâtel', cantonCode: 'NE', zipCode: '2000', taxMultiplier: { '2024': 1.23, '2025': 1.23 } },
    { name: 'La Chaux-de-Fonds', cantonCode: 'NE', zipCode: '2300', taxMultiplier: { '2024': 1.23, '2025': 1.23 } },
    { name: 'Le Locle', cantonCode: 'NE', zipCode: '2400', taxMultiplier: { '2024': 1.23, '2025': 1.23 } },
    { name: 'Val-de-Travers', cantonCode: 'NE', zipCode: '2114', taxMultiplier: { '2024': 1.23, '2025': 1.23 } }
  ],
  
  // Geneva (GE)
  'GE': [
    { name: 'Geneva', cantonCode: 'GE', zipCode: '1200', taxMultiplier: { '2024': 0.44, '2025': 0.44 } },
    { name: 'Vernier', cantonCode: 'GE', zipCode: '1214', taxMultiplier: { '2024': 0.47, '2025': 0.47 } },
    { name: 'Lancy', cantonCode: 'GE', zipCode: '1212', taxMultiplier: { '2024': 0.47, '2025': 0.47 } },
    { name: 'Meyrin', cantonCode: 'GE', zipCode: '1217', taxMultiplier: { '2024': 0.44, '2025': 0.44 } },
    { name: 'Carouge', cantonCode: 'GE', zipCode: '1227', taxMultiplier: { '2024': 0.44, '2025': 0.44 } },
    { name: 'Versoix', cantonCode: 'GE', zipCode: '1290', taxMultiplier: { '2024': 0.45, '2025': 0.45 } }
  ],
  
  // Jura (JU)
  'JU': [
    { name: 'Delémont', cantonCode: 'JU', zipCode: '2800', taxMultiplier: { '2024': 1.90, '2025': 1.90 } },
    { name: 'Porrentruy', cantonCode: 'JU', zipCode: '2900', taxMultiplier: { '2024': 1.90, '2025': 1.90 } },
    { name: 'Saignelégier', cantonCode: 'JU', zipCode: '2350', taxMultiplier: { '2024': 1.90, '2025': 1.90 } }
  ]
};

/**
 * All Swiss municipalities as a flat array
 */
export const ALL_MUNICIPALITIES: Municipality[] = Object.values(MUNICIPALITIES_BY_CANTON).flat();

/**
 * Get a municipality by name and canton
 * @param name Municipality name
 * @param canton Canton name or code
 * @returns Municipality object or undefined if not found
 */
export function getMunicipality(name: string, canton: string): Municipality | undefined {
  // Determine canton code
  let cantonCode = canton;
  if (canton.length > 2) {
    // If canton name is provided, convert to code
    const cantonEntry = Object.entries(CANTON_CODES).find(([cantonName]) => 
      cantonName.toLowerCase() === canton.toLowerCase()
    );
    if (cantonEntry) {
      cantonCode = cantonEntry[1];
    }
  }
  
  // First try exact match
  let municipality = ALL_MUNICIPALITIES.find(m => 
    m.name.toLowerCase() === name.toLowerCase() && 
    (m.cantonCode === cantonCode || m.cantonCode === canton)
  );
  
  // If not found, try partial match
  if (!municipality) {
    municipality = ALL_MUNICIPALITIES.find(m => 
      m.name.toLowerCase().includes(name.toLowerCase()) && 
      (m.cantonCode === cantonCode || m.cantonCode === canton)
    );
  }
  
  return municipality;
}

/**
 * Get tax multiplier for a municipality
 * @param name Municipality name
 * @param canton Canton name or code
 * @param year Tax year (defaults to 2024)
 * @returns Tax multiplier as decimal
 */
export function getMunicipalityTaxMultiplier(name: string, canton: string, year: '2024' | '2025' = '2024'): number {
  const municipality = getMunicipality(name, canton);
  
  if (municipality) {
    return municipality.taxMultiplier[year];
  }
  
  // Fallback to default multiplier for canton
  let cantonCode = canton;
  if (canton.length > 2) {
    // If canton name is provided, convert to code
    const cantonEntry = Object.entries(CANTON_CODES).find(([cantonName]) => 
      cantonName.toLowerCase() === canton.toLowerCase()
    );
    if (cantonEntry) {
      cantonCode = cantonEntry[1];
    }
  }
  
  // Return default multiplier for canton or 1.0 if not found
  return DEFAULT_MULTIPLIERS[cantonCode]?.[year] || 1.0;
}

/**
 * Get all municipalities for a canton
 * @param canton Canton name or code
 * @returns Array of municipalities
 */
export function getMunicipalitiesByCantonName(canton: string): Municipality[] {
  // If canton code is provided
  if (canton.length === 2) {
    return MUNICIPALITIES_BY_CANTON[canton] || [];
  }
  
  // If canton name is provided
  const cantonCode = Object.entries(CANTON_CODES).find(([cantonName]) => 
    cantonName.toLowerCase() === canton.toLowerCase()
  )?.[1];
  
  if (cantonCode) {
    return MUNICIPALITIES_BY_CANTON[cantonCode] || [];
  }
  
  return [];
}

/**
 * Add a new municipality to the database
 * @param municipality Municipality object to add
 */
export function addMunicipality(municipality: Municipality): void {
  if (!MUNICIPALITIES_BY_CANTON[municipality.cantonCode]) {
    MUNICIPALITIES_BY_CANTON[municipality.cantonCode] = [];
  }
  
  // Check if municipality already exists
  const existingIndex = MUNICIPALITIES_BY_CANTON[municipality.cantonCode].findIndex(
    m => m.name.toLowerCase() === municipality.name.toLowerCase()
  );
  
  if (existingIndex >= 0) {
    // Update existing municipality
    MUNICIPALITIES_BY_CANTON[municipality.cantonCode][existingIndex] = municipality;
  } else {
    // Add new municipality
    MUNICIPALITIES_BY_CANTON[municipality.cantonCode].push(municipality);
  }
}

/**
 * Update tax multipliers for a specific year
 * @param municipality Municipality name
 * @param canton Canton name or code
 * @param year Tax year
 * @param multiplier New tax multiplier
 * @returns True if successful, false if municipality not found
 */
export function updateMunicipalityTaxMultiplier(
  municipality: string, 
  canton: string, 
  year: '2024' | '2025', 
  multiplier: number
): boolean {
  const muni = getMunicipality(municipality, canton);
  
  if (muni) {
    muni.taxMultiplier[year] = multiplier;
    return true;
  }
  
  return false;
}
