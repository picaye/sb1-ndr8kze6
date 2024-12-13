import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTaxPlanningStore } from '../stores/taxPlanningStore';
import { SaveDataPrompt } from './SaveDataPrompt';

export function FinancialInfoForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const financialInfo = useTaxPlanningStore((state) => state.financialInfo);
  const setFinancialInfo = useTaxPlanningStore((state) => state.setFinancialInfo);
  const personalInfo = useTaxPlanningStore((state) => state.personalInfo);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === 'checkbox' ? e.target.checked : 
                     type === 'number' ? (value === '' ? 0 : Number(value)) : 
                     value;
    
    setFinancialInfo({
      ...financialInfo!,
      [name]: newValue
    });
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.target.type === 'number' && e.target.value === '0') {
      e.target.value = '';
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.target.type === 'number' && e.target.value === '') {
      e.target.value = '0';
      handleChange(e as any);
    }
  };

  const handleNext = () => {
    navigate('/results');
  };

  const handleBack = () => {
    navigate('/');
  };

  if (!financialInfo) return null;

  return (
    <div className="space-y-6">
      <SaveDataPrompt />
      
      <h2 className="text-xl font-semibold text-gray-900">{t('forms.financialInfo.title')}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            {t('forms.financialInfo.yearlyIncome')}
          </label>
          <input
            type="number"
            name="yearlyIncome"
            value={financialInfo.yearlyIncome === 0 ? '0' : financialInfo.yearlyIncome || ''}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            min="0"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {(personalInfo?.maritalStatus === 'married' || personalInfo?.maritalStatus === 'registered_partnership') && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t('forms.financialInfo.spouseYearlyIncome')}
            </label>
            <input
              type="number"
              name="spouseYearlyIncome"
              value={financialInfo.spouseYearlyIncome === 0 ? '0' : financialInfo.spouseYearlyIncome || ''}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              min="0"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">
            {t('forms.financialInfo.wealthAmount')}
          </label>
          <input
            type="number"
            name="wealthAmount"
            value={financialInfo.wealthAmount === 0 ? '0' : financialInfo.wealthAmount || ''}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            min="0"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            {t('forms.financialInfo.mortgageDebt')}
          </label>
          <input
            type="number"
            name="mortgageDebt"
            value={financialInfo.mortgageDebt === 0 ? '0' : financialInfo.mortgageDebt || ''}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            min="0"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            {t('forms.financialInfo.pensionContributions')}
          </label>
          <input
            type="number"
            name="pensionContributions"
            value={financialInfo.pensionContributions === 0 ? '0' : financialInfo.pensionContributions || ''}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            min="0"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {(personalInfo?.maritalStatus === 'married' || personalInfo?.maritalStatus === 'registered_partnership') && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t('forms.financialInfo.spousePensionContributions')}
              </label>
              <input
                type="number"
                name="spousePensionContributions"
                value={financialInfo.spousePensionContributions === 0 ? '0' : financialInfo.spousePensionContributions || ''}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                min="0"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t('forms.financialInfo.spousePillar3aContributions')}
              </label>
              <input
                type="number"
                name="spousePillar3aContributions"
                value={financialInfo.spousePillar3aContributions === 0 ? '0' : financialInfo.spousePillar3aContributions || ''}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                min="0"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">
            {t('forms.financialInfo.pillar3aContributions')}
          </label>
          <input
            type="number"
            name="pillar3aContributions"
            value={financialInfo.pillar3aContributions === 0 ? '0' : financialInfo.pillar3aContributions || ''}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            min="0"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            {t('forms.financialInfo.charitableDonations')}
          </label>
          <input
            type="number"
            name="charitableDonations"
            value={financialInfo.charitableDonations === 0 ? '0' : financialInfo.charitableDonations || ''}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            min="0"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            {t('forms.financialInfo.currentTaxBurden')}
          </label>
          <input
            type="number"
            name="currentTaxBurden"
            value={financialInfo.currentTaxBurden === 0 ? '0' : financialInfo.currentTaxBurden || ''}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            min="0"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div className="col-span-2 space-y-4">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              name="propertyOwnership"
              checked={financialInfo.propertyOwnership}
              onChange={handleChange}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label className="text-sm font-medium text-gray-700">
              {t('forms.financialInfo.propertyOwnership')}
            </label>
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              name="selfEmployed"
              checked={financialInfo.selfEmployed}
              onChange={handleChange}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label className="text-sm font-medium text-gray-700">
              {t('forms.financialInfo.selfEmployed')}
            </label>
          </div>

          {(personalInfo?.maritalStatus === 'married' || personalInfo?.maritalStatus === 'registered_partnership') && (
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                name="spouseSelfEmployed"
                checked={financialInfo.spouseSelfEmployed}
                onChange={handleChange}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label className="text-sm font-medium text-gray-700">
                {t('forms.financialInfo.spouseSelfEmployed')}
              </label>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={handleBack}
          className="px-4 py-2 text-gray-600 hover:text-gray-900"
        >
          {t('navigation.back')}
        </button>
        <button
          onClick={handleNext}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {t('navigation.viewRecommendations')}
        </button>
      </div>
    </div>
  );
}