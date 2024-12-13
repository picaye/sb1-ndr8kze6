import { Municipality } from '../types';

export const aargauMunicipalities: Municipality[] = [
  { name: 'Aarau', taxMultiplier: 97 },
  { name: 'Aarburg', taxMultiplier: 108 },
  { name: 'Abtwil', taxMultiplier: 95 },
  // ... rest of Aargau municipalities
].sort((a, b) => a.name.localeCompare(b.name));