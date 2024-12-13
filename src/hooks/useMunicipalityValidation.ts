import { useMemo } from 'react';
import { getMunicipalitiesForCanton } from '../utils/swissData';
import { useTranslation } from 'react-i18next';

export function useMunicipalityValidation(canton: string, municipality: string) {
  const { t } = useTranslation();
  
  return useMemo(() => {
    if (!municipality.trim()) {
      return {
        isValid: false,
        errorMessage: t('validation.municipality.required')
      };
    }

    const validMunicipalities = getMunicipalitiesForCanton(canton);
    const isValid = validMunicipalities.includes(municipality);

    return {
      isValid,
      errorMessage: isValid ? '' : t('validation.municipality.invalid')
    };
  }, [canton, municipality, t]);
}