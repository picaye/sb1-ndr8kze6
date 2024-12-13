import { useState, useCallback, useMemo, useEffect } from 'react';
import { getMunicipalitiesForCanton } from '../utils/swissData';

interface UseMunicipalityComboboxProps {
  canton: string;
  value: string;
  onChange: (value: string) => void;
  onValidationChange?: (isValid: boolean) => void;
}

export function useMunicipalityCombobox({
  canton,
  value,
  onChange,
  onValidationChange
}: UseMunicipalityComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(value || '');
  const [touched, setTouched] = useState(false);

  // Reset search term when canton changes
  useEffect(() => {
    setSearchTerm('');
    setTouched(false);
  }, [canton]);

  // Get municipalities for the selected canton
  const municipalities = useMemo(() => 
    getMunicipalitiesForCanton(canton),
    [canton]
  );

  // Validate the current value
  const isValid = useMemo(() => 
    !value || municipalities.includes(value),
    [value, municipalities]
  );

  // Filter municipalities based on search term
  const filteredMunicipalities = useMemo(() => {
    if (!searchTerm) return municipalities;
    const normalizedSearch = searchTerm.toLowerCase().trim();
    return municipalities.filter(municipality =>
      municipality.toLowerCase().includes(normalizedSearch)
    );
  }, [municipalities, searchTerm]);

  const handleInputChange = useCallback((newValue: string) => {
    setSearchTerm(newValue);
    setIsOpen(true);
  }, []);

  const handleSelectMunicipality = useCallback((municipality: string) => {
    setSearchTerm(municipality);
    onChange(municipality);
    setIsOpen(false);
    setTouched(true);
    onValidationChange?.(true);
  }, [onChange, onValidationChange]);

  const handleClickOutside = useCallback(() => {
    setIsOpen(false);
    setTouched(true);
    if (!municipalities.includes(searchTerm)) {
      setSearchTerm(value || '');
    }
    onValidationChange?.(isValid);
  }, [municipalities, searchTerm, value, isValid, onValidationChange]);

  return {
    isOpen,
    setIsOpen,
    searchTerm,
    touched,
    isValid,
    filteredMunicipalities,
    handleInputChange,
    handleSelectMunicipality,
    handleClickOutside
  };
}