import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTaxPlanningStore } from '../stores/taxPlanningStore';
import { SaveDataPrompt } from './SaveDataPrompt';
import { cantons, getMunicipalitiesForCanton } from '../utils/swissData'; // Added getMunicipalitiesForCanton for debugging
import { MunicipalityCombobox } from './MunicipalityCombobox'; // Changed from MunicipalitySelect

export function PersonalInfoForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isMunicipalityValid, setIsMunicipalityValid] = useState(false);
  
  const personalInfo = useTaxPlanningStore((state) => state.personalInfo);
  const setPersonalInfo = useTaxPlanningStore((state) => state.setPersonalInfo);

  const isPartnershipOrMarried = personalInfo?.maritalStatus === 'married' || 
                                personalInfo?.maritalStatus === 'registered_partnership';

  // Debugging: Log when canton changes and what municipalities are found
  useEffect(() => {
    if (personalInfo?.canton) {
      console.log('[PersonalInfoForm EFFECT] Canton changed to:', personalInfo.canton);
      const municipalitiesForCanton = getMunicipalitiesForCanton(personalInfo.canton);
      console.log('[PersonalInfoForm EFFECT] Municipalities found for ' + personalInfo.canton + ':', municipalitiesForCanton.length, municipalitiesForCanton.slice(0, 5));
    }
  }, [personalInfo?.canton]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (name === 'canton') {
      console.log('[PersonalInfoForm HANDLER] Canton changed to:', value);
      setPersonalInfo({
        ...personalInfo!,
        [name]: value,
        municipality: '' // Reset municipality when canton changes
      });
      setIsMunicipalityValid(false); // Municipality needs to be re-validated
    } else {
      const newValue = type === 'number' ? (value === '' ? '' : Number(value)) : 
                       type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
                       value;
      setPersonalInfo({
        ...personalInfo!,
        [name]: newValue
      });
    }
  };

  const handlePartnerChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === 'number' ? (value === '' ? '' : Number(value)) : value;
    
    setPersonalInfo({
      ...personalInfo!,
      spouse: {
        // Ensure spouse object exists, providing default values if not
        age: personalInfo?.spouse?.age || '',
        religion: personalInfo?.spouse?.religion || 'none',
        ...personalInfo!.spouse,
        [name]: newValue
      }
    });
  };

  const handleNext = () => {
    if (!isMunicipalityValid && personalInfo?.municipality) { // Allow next if municipality is selected and valid
        console.warn('[PersonalInfoForm] Attempting to proceed with invalid municipality selection.');
        // Optionally, trigger validation again or show a more prominent error
        return;
    }
    if (!personalInfo?.municipality) {
        console.warn('[PersonalInfoForm] Municipality not selected.');
        // Optionally, set an error state to highlight the municipality field
        return;
    }
    navigate('/financial-info');
  };

  if (!personalInfo) return null;

  return (
    <div className="space-y-6">
      <SaveDataPrompt />
      
      <h2 className="text-xl font-semibold text-gray-900">{t('forms.personalInfo.title')}</h2>

      {/* Person 1 Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">{t('forms.personalInfo.person1.title')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="age" className="block text-sm font-medium text-gray-700">{t('forms.personalInfo.person1.age')}</label>
            <input
              id="age"
              type="number"
              name="age"
              value={personalInfo.age || ''}
              onChange={handleChange}
              min="0"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="religion" className="block text-sm font-medium text-gray-700">{t('forms.personalInfo.person1.religion.label')}</label>
            <select
              id="religion"
              name="religion"
              value={personalInfo.religion}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="none">{t('forms.personalInfo.person1.religion.none')}</option>
              <option value="roman_catholic">{t('forms.personalInfo.person1.religion.romanCatholic')}</option>
              <option value="protestant">{t('forms.personalInfo.person1.religion.protestant')}</option>
              <option value="other">{t('forms.personalInfo.person1.religion.other')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Marital Status */}
      <div>
        <label htmlFor="maritalStatus" className="block text-sm font-medium text-gray-700">{t('forms.personalInfo.maritalStatus.label')}</label>
        <select
          id="maritalStatus"
          name="maritalStatus"
          value={personalInfo.maritalStatus}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="single">{t('forms.personalInfo.maritalStatus.single')}</option>
          <option value="married">{t('forms.personalInfo.maritalStatus.married')}</option>
          <option value="registered_partnership">{t('forms.personalInfo.maritalStatus.registeredPartnership')}</option>
          <option value="divorced">{t('forms.personalInfo.maritalStatus.divorced')}</option>
          <option value="widowed">{t('forms.personalInfo.maritalStatus.widowed')}</option>
        </select>
      </div>

      {/* Person 2 Section (Conditional) */}
      {isPartnershipOrMarried && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">{t('forms.personalInfo.person2.title')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="spouseAge" className="block text-sm font-medium text-gray-700">{t('forms.personalInfo.person2.age')}</label>
              <input
                id="spouseAge"
                type="number"
                name="age" // This should be distinct if spouse is a nested object property, e.g., "spouse.age" or handled by handlePartnerChange
                value={personalInfo.spouse?.age || ''}
                onChange={handlePartnerChange}
                min="0"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="spouseReligion" className="block text-sm font-medium text-gray-700">{t('forms.personalInfo.person2.religion.label')}</label>
              <select
                id="spouseReligion"
                name="religion" // Similar to age, ensure this targets spouse.religion
                value={personalInfo.spouse?.religion || 'none'}
                onChange={handlePartnerChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="none">{t('forms.personalInfo.person2.religion.none')}</option>
                <option value="roman_catholic">{t('forms.personalInfo.person2.religion.romanCatholic')}</option>
                <option value="protestant">{t('forms.personalInfo.person2.religion.protestant')}</option>
                <option value="other">{t('forms.personalInfo.person2.religion.other')}</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Location Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="canton" className="block text-sm font-medium text-gray-700">{t('forms.personalInfo.canton')}</label>
          <select
            id="canton"
            name="canton"
            value={personalInfo.canton}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            {cantons.map(canton => (
              <option key={canton} value={canton}>{canton}</option>
            ))}\
          </select>
        </div>

        <div>
          <label htmlFor="municipality" className="block text-sm font-medium text-gray-700">{t('forms.personalInfo.municipality')}</label>
          <MunicipalityCombobox
            canton={personalInfo.canton}
            value={personalInfo.municipality || ''}
            onChange={(value) => {
              console.log('[PersonalInfoForm] MunicipalityCombobox new value:', value);
              setPersonalInfo(prev => ({
                ...prev!,
                municipality: value
              }));
              // Validity will be set by onValidationChange
            }}
            onValidationChange={(isValid) => {
                console.log('[PersonalInfoForm] MunicipalityCombobox validation changed to:', isValid);
                setIsMunicipalityValid(isValid);
            }}
          />
        </div>
      </div>

      {/* Children Section */}
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <input
            id="hasChildren"
            type="checkbox"
            name="hasChildren"
            checked={personalInfo.hasChildren}
            onChange={handleChange}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
          />
          <label htmlFor="hasChildren" className="text-sm font-medium text-gray-700">
            {t('forms.personalInfo.children.question')}
          </label>
        </div>

        {personalInfo.hasChildren && (
          <div>
            <label htmlFor="numberOfChildren" className="block text-sm font-medium text-gray-700">
              {t('forms.personalInfo.children.number')}
            </label>
            <input
              id="numberOfChildren"
              type="number"
              name="numberOfChildren"
              value={personalInfo.numberOfChildren || ''}
              onChange={handleChange}
              min="0"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        )}
      </div>
      
      {/* Withholding Tax Section */}
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <input
            id="isWithholdingTaxEligible"
            type="checkbox"
            name="isWithholdingTaxEligible"
            checked={!!personalInfo.isWithholdingTaxEligible}
            onChange={handleChange}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
          />
          <label htmlFor="isWithholdingTaxEligible" className="text-sm font-medium text-gray-700">
            {t('forms.personalInfo.isWithholdingTaxEligible')}
          </label>
        </div>
      </div>


      {/* Navigation */}
      <div className="flex justify-end mt-8">
        <button
          onClick={handleNext}
          disabled={!isMunicipalityValid && !!personalInfo.municipality} // Disable if municipality selected but not valid
          className={`px-4 py-2 rounded-md text-white font-semibold
            ${(isMunicipalityValid || !personalInfo.municipality) // Enable if valid OR if municipality is not yet selected (to allow selection)
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
        >
          {t('navigation.next')}
        </button>
      </div>
    </div>
  );
}
