import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTaxPlanningStore } from '../stores/taxPlanningStore';
import { SaveDataPrompt } from './SaveDataPrompt';
import { cantons } from '../utils/swissData';
import { MunicipalitySelect } from './MunicipalitySelect';

export function PersonalInfoForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isMunicipalityValid, setIsMunicipalityValid] = useState(false);
  
  const personalInfo = useTaxPlanningStore((state) => state.personalInfo);
  const setPersonalInfo = useTaxPlanningStore((state) => state.setPersonalInfo);

  const isPartnershipOrMarried = personalInfo?.maritalStatus === 'married' || 
                                personalInfo?.maritalStatus === 'registered_partnership';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (name === 'canton') {
      setPersonalInfo({
        ...personalInfo!,
        [name]: value,
        municipality: ''
      });
      setIsMunicipalityValid(false);
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
        ...personalInfo!.spouse,
        [name]: newValue
      }
    });
  };

  const handleNext = () => {
    if (!isMunicipalityValid) return;
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
            <label className="block text-sm font-medium text-gray-700">{t('forms.personalInfo.person1.age')}</label>
            <input
              type="number"
              name="age"
              value={personalInfo.age || ''}
              onChange={handleChange}
              min="0"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">{t('forms.personalInfo.person1.religion.label')}</label>
            <select
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
        <label className="block text-sm font-medium text-gray-700">{t('forms.personalInfo.maritalStatus.label')}</label>
        <select
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
              <label className="block text-sm font-medium text-gray-700">{t('forms.personalInfo.person2.age')}</label>
              <input
                type="number"
                name="age"
                value={personalInfo.spouse?.age || ''}
                onChange={handlePartnerChange}
                min="0"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">{t('forms.personalInfo.person2.religion.label')}</label>
              <select
                name="religion"
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
          <label className="block text-sm font-medium text-gray-700">{t('forms.personalInfo.canton')}</label>
          <select
            name="canton"
            value={personalInfo.canton}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            {cantons.map(canton => (
              <option key={canton} value={canton}>{canton}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">{t('forms.personalInfo.municipality')}</label>
          <MunicipalitySelect
            canton={personalInfo.canton}
            value={personalInfo.municipality || ''}
            onChange={(value) => {
              setPersonalInfo({
                ...personalInfo!,
                municipality: value
              });
              setIsMunicipalityValid(!!value);
            }}
            onValidationChange={setIsMunicipalityValid}
          />
        </div>
      </div>

      {/* Children Section */}
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            name="hasChildren"
            checked={personalInfo.hasChildren}
            onChange={handleChange}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label className="text-sm font-medium text-gray-700">
            {t('forms.personalInfo.children.question')}
          </label>
        </div>

        {personalInfo.hasChildren && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t('forms.personalInfo.children.number')}
            </label>
            <input
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

      {/* Navigation */}
      <div className="flex justify-end mt-8">
        <button
          onClick={handleNext}
          disabled={!isMunicipalityValid}
          className={`px-4 py-2 rounded-md ${
            isMunicipalityValid
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {t('navigation.next')}
        </button>
      </div>
    </div>
  );
}