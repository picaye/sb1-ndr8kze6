import React from 'react';
import { useTranslation } from 'react-i18next';
import { getMunicipalitiesForCanton } from '../utils/swissData';

interface Props {
  canton: string;
  value: string;
  onChange: (value: string) => void;
  onValidationChange?: (isValid: boolean) => void;
}

export function MunicipalitySelect({ canton, value, onChange, onValidationChange }: Props) {
  const { t } = useTranslation();
  
  // Get and sort municipalities
  const municipalities = React.useMemo(() => {
    return getMunicipalitiesForCanton(canton).sort((a, b) => 
      a.localeCompare(b, 'de')
    );
  }, [canton]);

  // Handle validation
  React.useEffect(() => {
    onValidationChange?.(!!value);
  }, [value, onValidationChange]);

  return (
    <div>
      <select
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          onValidationChange?.(!!e.target.value);
        }}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
      >
        <option value="">{t('forms.personalInfo.selectMunicipality')}</option>
        {municipalities.map((municipality) => (
          <option key={municipality} value={municipality}>
            {municipality}
          </option>
        ))}
      </select>
      {!value && (
        <p className="mt-1 text-sm text-red-600">
          {t('validation.municipality.required')}
        </p>
      )}
    </div>
  );
}