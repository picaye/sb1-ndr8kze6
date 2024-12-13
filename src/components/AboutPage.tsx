import React from 'react';
import { useTranslation } from 'react-i18next';
import { Brain, Shield, Calculator, ChevronRight, Users, FileSpreadsheet } from 'lucide-react';

export function AboutPage() {
  const { t } = useTranslation();

  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-8 text-white mb-8">
        <h1 className="text-3xl font-bold mb-4">{t('about.title')}</h1>
        <p className="text-xl text-blue-100">{t('about.subtitle')}</p>
      </div>

      {/* Mission Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-start gap-4">
          <Calculator className="w-8 h-8 text-blue-600 flex-shrink-0" />
          <div>
            <h2 className="text-2xl font-semibold mb-3">{t('about.mission.title')}</h2>
            <p className="text-gray-600 leading-relaxed">{t('about.mission.description')}</p>
          </div>
        </div>
      </div>

      {/* AI Technology Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-start gap-4">
          <Brain className="w-8 h-8 text-blue-600 flex-shrink-0" />
          <div>
            <h2 className="text-2xl font-semibold mb-3">{t('about.ai.title')}</h2>
            <p className="text-gray-600 leading-relaxed mb-4">{t('about.ai.description')}</p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-gray-600">{t('about.ai.disclaimer')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-6">{t('about.howItWorks.title')}</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map((step) => (
            <div key={step} className="relative">
              <div className="bg-blue-50 rounded-lg p-6">
                <div className="text-blue-600 font-bold mb-2">
                  {t(`about.howItWorks.step${step}.title`)}
                </div>
                <p className="text-gray-600 text-sm">
                  {t(`about.howItWorks.step${step}.description`)}
                </p>
              </div>
              {step < 3 && (
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                  <ChevronRight className="w-8 h-8 text-blue-300" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-start gap-4">
            <Users className="w-6 h-6 text-blue-600" />
            <div>
              <h3 className="font-semibold mb-2">Personalized Advice</h3>
              <p className="text-gray-600 text-sm">
                Get tailored tax optimization recommendations based on your unique situation.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-start gap-4">
            <FileSpreadsheet className="w-6 h-6 text-blue-600" />
            <div>
              <h3 className="font-semibold mb-2">Detailed Analysis</h3>
              <p className="text-gray-600 text-sm">
                Comprehensive breakdown of your tax situation with clear savings opportunities.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Security Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-start gap-4">
          <Shield className="w-8 h-8 text-blue-600 flex-shrink-0" />
          <div>
            <h2 className="text-2xl font-semibold mb-3">{t('about.security.title')}</h2>
            <p className="text-gray-600 leading-relaxed">{t('about.security.description')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}