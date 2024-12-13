import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../stores/authStore';
import { LogIn, Save } from 'lucide-react';

export function SaveDataPrompt() {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuthStore();

  const handleSave = async () => {
    // Local storage is handled automatically by the store
    console.log('Data saved to local storage');
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-gray-600">
            {t('auth.loginPrompt')}
          </div>
          <a
            href="/login"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <LogIn className="w-4 h-4 mr-2" />
            {t('auth.login')}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
      <button
        onClick={handleSave}
        className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
      >
        <Save className="w-4 h-4 mr-2" />
        {t('common.save')}
      </button>
    </div>
  );
}