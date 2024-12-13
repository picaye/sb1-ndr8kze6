import React from 'react';
import { useTranslation } from 'react-i18next';
import { Save } from 'lucide-react';

export function AdminSettings() {
  const { t } = useTranslation();
  const [settings, setSettings] = React.useState({
    maxUsers: 5000,
    maxCalculationsPerDay: 1000,
    enableNewRegistrations: true,
    maintenanceMode: false,
    debugMode: false,
    apiTimeout: 30
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Save settings logic would go here
    console.log('Settings saved:', settings);
  };

  return (
    <div className="p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-6">{t('admin.settings.title')}</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t('admin.settings.maxUsers')}
            </label>
            <input
              type="number"
              name="maxUsers"
              value={settings.maxUsers}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t('admin.settings.maxCalculations')}
            </label>
            <input
              type="number"
              name="maxCalculationsPerDay"
              value={settings.maxCalculationsPerDay}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t('admin.settings.apiTimeout')}
            </label>
            <input
              type="number"
              name="apiTimeout"
              value={settings.apiTimeout}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              name="enableNewRegistrations"
              checked={settings.enableNewRegistrations}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-900">
              {t('admin.settings.enableRegistrations')}
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="maintenanceMode"
              checked={settings.maintenanceMode}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-900">
              {t('admin.settings.maintenanceMode')}
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="debugMode"
              checked={settings.debugMode}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-900">
              {t('admin.settings.debugMode')}
            </label>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Save className="w-4 h-4 mr-2" />
            {t('common.save')}
          </button>
        </div>
      </form>
    </div>
  );
}