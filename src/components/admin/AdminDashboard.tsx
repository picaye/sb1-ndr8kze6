import React from 'react';
import { useTranslation } from 'react-i18next';
import { Settings, Users, FileSpreadsheet, ChevronRight, Link } from 'lucide-react';
import { AdminStats } from './AdminStats';
import { AdminUserList } from './AdminUserList';
import { AdminSettings } from './AdminSettings';
import { AffiliateManagement } from './affiliates/AffiliateManagement';

export function AdminDashboard() {
  const { t } = useTranslation();
  const [activeSection, setActiveSection] = React.useState<'overview' | 'users' | 'settings' | 'affiliates'>('overview');

  const renderContent = () => {
    switch (activeSection) {
      case 'users':
        return <AdminUserList />;
      case 'settings':
        return <AdminSettings />;
      case 'affiliates':
        return <AffiliateManagement />;
      default:
        return <AdminStats />;
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">{t('admin.dashboard')}</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveSection('overview')}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium ${
                    activeSection === 'overview'
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <FileSpreadsheet className="w-5 h-5 mr-3" />
                  {t('admin.overview')}
                  <ChevronRight className="w-5 h-5 ml-auto" />
                </button>

                <button
                  onClick={() => setActiveSection('users')}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium ${
                    activeSection === 'users'
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Users className="w-5 h-5 mr-3" />
                  {t('admin.users')}
                  <ChevronRight className="w-5 h-5 ml-auto" />
                </button>

                <button
                  onClick={() => setActiveSection('affiliates')}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium ${
                    activeSection === 'affiliates'
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Link className="w-5 h-5 mr-3" />
                  {t('admin.affiliates.title')}
                  <ChevronRight className="w-5 h-5 ml-auto" />
                </button>

                <button
                  onClick={() => setActiveSection('settings')}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium ${
                    activeSection === 'settings'
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Settings className="w-5 h-5 mr-3" />
                  {t('admin.settings')}
                  <ChevronRight className="w-5 h-5 ml-auto" />
                </button>
              </nav>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}