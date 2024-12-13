import { Municipality } from '../types';

export const zurichMunicipalities: Municipality[] = [
  { name: 'Zürich', taxMultiplier: 119 },
  { name: 'Winterthur', taxMultiplier: 122 },
  { name: 'Uster', taxMultiplier: 110 },
  // ... rest of Zürich municipalities
].sort((a, b) => a.name.localeCompare(b.name));