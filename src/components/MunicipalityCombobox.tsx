import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, ChevronDown, ChevronUp, Check } from 'lucide-react';
import { getMunicipalitiesForCanton, filterMunicipalities } from '../utils/swissData';
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
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [touched, setTouched] = React.useState(false);

  // Get municipalities for the selected canton
  const municipalities = React.useMemo(() => 
    getMunicipalitiesForCanton(canton).sort((a, b) => a.localeCompare(b)),
    [canton]
  );

  // Filter municipalities based on search term
  const filteredMunicipalities = React.useMemo(() => {
    if (!searchTerm.trim()) {
      return municipalities; // Show all municipalities if no search term
    }
    return filterMunicipalities(canton, searchTerm);
  }, [canton, municipalities, searchTerm]);

  // Handle click outside
  useOnClickOutside(containerRef, () => {
    setIsOpen(false);
    setTouched(true);
    if (!municipalities.includes(searchTerm)) {
      setSearchTerm(value || '');
    }
  });

  // Reset when canton changes
  React.useEffect(() => {
    setSearchTerm('');
    setTouched(false);
    setIsOpen(false);
  }, [canton]);

  // Update search term when value changes externally
  React.useEffect(() => {
    if (!isOpen) {
      setSearchTerm(value || '');
    }
  }, [value, isOpen]);

  // Validate and notify parent
  React.useEffect(() => {
    if (touched || value) {
      const isValid = municipalities.includes(value);
      onValidationChange?.(isValid);
    }
  }, [value, touched, municipalities, onValidationChange]);

  const handleSelect = (municipality: string) => {
    setSearchTerm(municipality);
    onChange(municipality);
    setIsOpen(false);
    setTouched(true);
  };

  const isValid = municipalities.includes(value);
  const showError = touched && !isValid && searchTerm !== '';

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={t('forms.personalInfo.municipality')}
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
          onClick={() => setIsOpen(!isOpen)}
          className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-400 hover:text-gray-600"
        >
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      {showError && (
        <p className="mt-1 text-sm text-red-600">
          {t('validation.municipality.invalid')}
        </p>
      )}

      {isOpen && filteredMunicipalities.length > 0 && (
        <ul className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 
                     text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
          {filteredMunicipalities.map((municipality) => (
            <li
              key={municipality}
              onClick={() => handleSelect(municipality)}
              className={`cursor-pointer select-none relative py-2 pl-3 pr-9 
                ${municipality === value ? 'bg-blue-50 text-blue-900' : 'text-gray-900'}
                hover:bg-blue-50`}
            >
              <span className="block truncate">{municipality}</span>
              {municipality === value && (
                <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-blue-600">
                  <Check className="w-5 h-5" />
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}