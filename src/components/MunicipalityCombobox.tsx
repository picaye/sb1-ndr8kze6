import React, { useRef, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, ChevronDown, ChevronUp, Check } from 'lucide-react';
import { getMunicipalitiesForCanton } from '../utils/swissData';
import { useOnClickOutside } from '../hooks/useOnClickOutside';

interface Props {
  canton: string;
  value: string;
  onChange: (value: string) => void;
  onValidationChange?: (isValid: boolean) => void;
}

export function MunicipalityCombobox({ canton, value, onChange, onValidationChange }: Props) {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [touched, setTouched] = useState(false);

  // Debug: Log component re-render and props
  console.log('[MunicipalityCombobox] Re-render. Props:', { canton, value });

  // Get municipalities for the selected canton
  const municipalities = useMemo(() => {
    console.log(`[MunicipalityCombobox useMemo - municipalities] Canton changed to: "${canton}". Fetching municipalities.`);
    const fetchedMunicipalities = getMunicipalitiesForCanton(canton).sort((a, b) => a.localeCompare(b));
    if (canton === 'Zürich' || canton === 'Zurich' || canton === 'ZH') {
      console.log(`[MunicipalityCombobox useMemo - municipalities] For Zürich: Found ${fetchedMunicipalities.length} municipalities. Sample:`, fetchedMunicipalities.slice(0, 5));
    }
    return fetchedMunicipalities;
  }, [canton]);

  // Filter municipalities based on search term
  const filteredMunicipalities = useMemo(() => {
    const normalizedSearch = searchTerm.toLowerCase().trim();
    const filtered = municipalities.filter(municipality =>
      municipality.toLowerCase().includes(normalizedSearch)
    );
    // console.log(`[MunicipalityCombobox useMemo - filteredMunicipalities] SearchTerm: "${searchTerm}", Found: ${filtered.length} municipalities.`);
    if (canton === 'Zürich' || canton === 'Zurich' || canton === 'ZH') {
        console.log(`[MunicipalityCombobox useMemo - filteredMunicipalities] For Zürich, SearchTerm: "${searchTerm}", Filtered: ${filtered.length} municipalities. Sample:`, filtered.slice(0,5));
    }
    return filtered;
  }, [municipalities, searchTerm, canton]); // Added canton to dependencies to log specifically for Zurich

  // Handle click outside
  useOnClickOutside(containerRef, () => {
    if (isOpen) {
        // console.log('[MunicipalityCombobox] Clicked outside, closing dropdown.');
        setIsOpen(false);
        setTouched(true); // Mark as touched when dropdown closes after interaction
        // If current search term is not a valid municipality, revert to the selected value or empty
        if (!municipalities.includes(searchTerm)) {
            // console.log(`[MunicipalityCombobox] Search term "${searchTerm}" not in municipalities list. Reverting to value: "${value || ''}"`);
            setSearchTerm(value || '');
        }
    }
  });

  // Reset when canton changes
  useEffect(() => {
    console.log(`[MunicipalityCombobox useEffect - canton change] Canton changed to: "${canton}". Resetting search term, touched state, and closing dropdown.`);
    setSearchTerm(''); // Reset search term
    onChange(''); // Reset selected municipality value in parent form
    setTouched(false); // Reset touched state
    setIsOpen(false); // Close dropdown
    onValidationChange?.(false); // Notify parent that selection is now invalid/empty
  }, [canton, onChange, onValidationChange]); // Added onChange and onValidationChange to dependencies

  // Update search term when value changes externally (e.g., from store or parent)
  // This ensures the input field reflects the actual selected value when not actively editing.
  useEffect(() => {
    if (!isOpen && value !== searchTerm) { // Only update if dropdown is closed and value differs
      // console.log(`[MunicipalityCombobox useEffect - value change] External value changed to: "${value}". Updating searchTerm.`);
      setSearchTerm(value || '');
    }
  }, [value]); // Removed isOpen from dependencies to prevent loop, ensure searchTerm reflects value when closed

  // Validate and notify parent
  // This effect runs when the selected `value` (from parent), `touched` state, or `municipalities` list changes.
  useEffect(() => {
    // console.log(`[MunicipalityCombobox useEffect - validation] Value: "${value}", Touched: ${touched}`);
    if (touched || value) { // Validate if touched or if a value is already set (e.g. on load)
      const isValid = municipalities.includes(value);
      // console.log(`[MunicipalityCombobox useEffect - validation] Is valid: ${isValid}`);
      onValidationChange?.(isValid);
    } else if (!value && touched) { // If value is empty AND it has been touched (e.g. user cleared selection)
        onValidationChange?.(false); // It's not valid if empty and touched
    }
  }, [value, touched, municipalities, onValidationChange]);

  const handleSelect = (municipality: string) => {
    // console.log(`[MunicipalityCombobox] Selected: "${municipality}"`);
    setSearchTerm(municipality); // Update input field to show selected municipality
    onChange(municipality);    // Notify parent of the change
    setIsOpen(false);          // Close dropdown
    setTouched(true);          // Mark as touched
  };

  const isValidSelection = municipalities.includes(value);
  // Show error if:
  // 1. The field has been "touched" (interacted with, or dropdown closed).
  // 2. The current `value` (master value from parent) is not in the list of valid municipalities for the canton.
  // 3. AND the `searchTerm` is not empty (to avoid showing error when field is initially empty and not yet interacted with).
  // This logic might need refinement based on desired UX for initial empty state vs. user clearing selection.
  const showError = touched && !isValidSelection && value !== '';


  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            const newSearchTerm = e.target.value;
            // console.log(`[MunicipalityCombobox] Input onChange. New search term: "${newSearchTerm}"`);
            setSearchTerm(newSearchTerm);
            if (!isOpen) setIsOpen(true); // Open dropdown if not already open
            // Tentatively set onChange to current search term to allow parent to react,
            // but final validation happens on selection or blur.
            // This might not be ideal if parent reacts too strongly to intermediate input.
            // onChange(newSearchTerm); // This might be problematic if parent validates immediately
          }}
          onFocus={() => {
            // console.log('[MunicipalityCombobox] Input onFocus. Opening dropdown.');
            setIsOpen(true);
            setTouched(true); // Mark as touched on focus
          }}
          placeholder={t('forms.personalInfo.selectMunicipality')}
          className={`mt-1 block w-full rounded-md shadow-sm pl-10 pr-10
            ${showError 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className={`h-5 w-5 ${showError ? 'text-red-400' : 'text-gray-400'}`} />
        </div>
        <button
          type="button"
          onClick={() => {
            // console.log(`[MunicipalityCombobox] Toggle button clicked. Current isOpen: ${isOpen}`);
            setIsOpen(!isOpen);
            if (!isOpen) setTouched(true); // If opening dropdown, mark as touched
          }}
          className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-400 hover:text-gray-600"
          aria-label={isOpen ? t('common.closeDropdown', {defaultValue: 'Close dropdown'}) : t('common.openDropdown', {defaultValue: 'Open dropdown'})}
        >
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      {showError && (
        <p className="mt-1 text-sm text-red-600" role="alert">
          {t('validation.municipality.invalid')}
        </p>
      )}

      {isOpen && (
        <ul className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 
                     text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
          {filteredMunicipalities.length > 0 ? (
            filteredMunicipalities.map((municipality) => (
              <li
                key={municipality}
                onClick={() => handleSelect(municipality)}
                onMouseDown={(e) => e.preventDefault()} // Prevents input blur before click registers
                className={`cursor-pointer select-none relative py-2 pl-3 pr-9 
                  ${municipality === value ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-900'}
                  hover:bg-blue-50`}
                role="option"
                aria-selected={municipality === value}
              >
                <span className="block truncate">{municipality}</span>
                {municipality === value && (
                  <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-blue-600">
                    <Check className="w-5 h-5" />
                  </span>
                )}
              </li>
            ))
          ) : (
            <li className="px-3 py-2 text-gray-500 italic">
              {searchTerm ? t('common.noResultsFound', {defaultValue: 'No results found'}) : t('common.typeToSearch', {defaultValue: 'Type to search or select a canton'})}
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
