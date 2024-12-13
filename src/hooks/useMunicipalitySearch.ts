import { useMemo } from 'react';
import { getMunicipalitiesForCanton } from '../utils/swissData';

interface UseMunicipalitySearchProps {
  canton: string;
  searchTerm: string;
  value: string;
}

export function useMunicipalitySearch({ canton, searchTerm, value }: UseMunicipalitySearchProps) {
  // Get municipalities for the selected canton
  const municipalities = useMemo(() => {
    return getMunicipalitiesForCanton(canton);
  }, [canton]);

  // Filter municipalities based on search term
  const filteredMunicipalities = useMemo(() => {
    if (!searchTerm) return municipalities;
    const normalizedSearch = searchTerm.toLowerCase().trim();
    return municipalities.filter(municipality =>
      municipality.toLowerCase().includes(normalizedSearch)
    );
  }, [municipalities, searchTerm]);

  // Validate selected value
  const isValid = useMemo(() => {
    return !value || municipalities.includes(value);
  }, [municipalities, value]);

  return {
    municipalities,
    filteredMunicipalities,
    isValid
  };
}