import React from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, Clock } from 'lucide-react';
import { ContactForm } from './contact/ContactForm';

export function ContactPage() {
  const { t } = useTranslation();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-8 text-white mb-8">
        <h1 className="text-3xl font-bold mb-4">{t('contact.title')}</h1>
        <p className="text-xl text-blue-100">{t('contact.subtitle')}</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <ContactForm />
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              {t('contact.office.title')}
            </h3>
            <address className="not-italic text-gray-600 whitespace-pre-line">
              {t('contact.office.address')}
            </address>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              {t('contact.hours.title')}
            </h3>
            <div className="text-gray-600 space-y-2">
              <div>
                <div className="font-medium">{t('contact.hours.weekdays')}</div>
                <div>{t('contact.hours.weekdayHours')}</div>
              </div>
              <div>
                <div className="font-medium">{t('contact.hours.saturday')}</div>
                <div>{t('contact.hours.saturdayHours')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}