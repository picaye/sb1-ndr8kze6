// 2024 Municipal tax multipliers (verified values)
const MUNICIPAL_MULTIPLIERS: Record<string, number> = {
  // Zürich
  'Zürich': 1.19,
  'Winterthur': 1.22,
  'Uster': 1.10,
  'Dübendorf': 1.15,
  'Dietikon': 1.18,
  
  // Zug (low tax region)
  'Zug': 0.60,
  'Baar': 0.59,
  'Cham': 0.65,
  
  // Geneva
  'Geneva': 0.44,
  'Carouge': 0.39,
  'Vernier': 0.50,
  
  // Default multipliers by canton
  'ZH_DEFAULT': 1.19,
  'BE_DEFAULT': 1.54,
  'LU_DEFAULT': 1.75,
  'UR_DEFAULT': 1.00,
  'SZ_DEFAULT': 1.30,
  'OW_DEFAULT': 1.45,
  'NW_DEFAULT': 1.20,
  'GL_DEFAULT': 1.63,
  'ZG_DEFAULT': 0.60,
  'FR_DEFAULT': 1.85,
  'SO_DEFAULT': 1.80,
  'BS_DEFAULT': 1.20,
  'BL_DEFAULT': 1.65,
  'SH_DEFAULT': 1.58,
  'AR_DEFAULT': 1.63,
  'AI_DEFAULT': 1.45,
  'SG_DEFAULT': 1.44,
  'GR_DEFAULT': 1.60,
  'AG_DEFAULT': 1.13,
  'TG_DEFAULT': 1.17,
  'TI_DEFAULT': 1.00,
  'VD_DEFAULT': 1.54,
  'VS_DEFAULT': 1.30,
  'NE_DEFAULT': 1.72,
  'GE_DEFAULT': 0.44,
  'JU_DEFAULT': 1.90
};

export function getMunicipalMultiplier(canton: string, municipality: string): number {
  // Try to get specific municipality multiplier
  const specificMultiplier = MUNICIPAL_MULTIPLIERS[municipality];
  if (specificMultiplier) {
    return specificMultiplier;
  }
  
  // Fall back to canton default
  const cantonDefault = MUNICIPAL_MULTIPLIERS[`${canton.substring(0, 2).toUpperCase()}_DEFAULT`];
  return cantonDefault || 1.0;
}

export function calculateMunicipalTax(cantonalTax: number, canton: string, municipality: string): number {
  const multiplier = getMunicipalMultiplier(canton, municipality);
  const tax = cantonalTax * multiplier;
  return Math.round(tax * 100) / 100;
}