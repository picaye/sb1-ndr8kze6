import { t } from 'i18next';

export function validatePillar3aContribution(amount: number | string, yearlyIncome: number | string, age: number | string): {
  isValid: boolean;
  errorMessage: string | null;
} {
  const numericAmount = Number(amount) || 0;
  const numericIncome = Number(yearlyIncome) || 0;
  const numericAge = Number(age) || 0;

  // 2024 limits
  const EMPLOYED_LIMIT = 7056;
  const SELF_EMPLOYED_LIMIT = 35280;
  
  // Basic validation
  if (numericAmount < 0) {
    return {
      isValid: false,
      errorMessage: t('validation.pillar3a.negativeAmount')
    };
  }

  // No income validation
  if (numericIncome <= 0) {
    return {
      isValid: false,
      errorMessage: t('validation.pillar3a.incomeRequired')
    };
  }

  // Age validation
  if (numericAge < 18 || numericAge > 70) {
    return {
      isValid: false,
      errorMessage: t('validation.pillar3a.ageRestriction')
    };
  }

  // Check against maximum limits
  const maxLimit = numericIncome * 0.2; // 20% of yearly income
  const absoluteLimit = EMPLOYED_LIMIT; // Using employed limit as default

  const effectiveLimit = Math.min(maxLimit, absoluteLimit);

  if (numericAmount > effectiveLimit) {
    return {
      isValid: false,
      errorMessage: t('validation.pillar3a.maxAmount', { amount: effectiveLimit.toLocaleString() })
    };
  }

  return {
    isValid: true,
    errorMessage: null
  };
}