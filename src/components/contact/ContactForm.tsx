import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, Phone, Send } from 'lucide-react';
import { sendEmail } from '../../utils/email';
import { ContactFormInput } from './ContactFormInput';
import { ContactFormStatus } from './ContactFormStatus';

interface FormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

const initialFormData: FormData = {
  name: '',
  email: '',
  phone: '',
  message: ''
};

export function ContactForm() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const success = await sendEmail({
        ...formData,
        subject: 'New Contact Form Submission - Steuerberatung.ch',
      });

      if (success) {
        setStatus('success');
        setFormData(initialFormData);
      } else {
        throw new Error('Failed to send email');
      }
    } catch (error) {
      setStatus('error');
      console.error('Form submission error:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6">{t('contact.title')}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <ContactFormInput
            label={t('contact.name')}
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <ContactFormInput
            label={t('contact.email')}
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            icon={<Mail className="h-5 w-5 text-gray-400" />}
          />

          <ContactFormInput
            label={t('contact.phone')}
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            icon={<Phone className="h-5 w-5 text-gray-400" />}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t('contact.message')}
            </label>
            <textarea
              name="message"
              rows={4}
              value={formData.message}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                       focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={status === 'sending'}
            className="w-full flex justify-center items-center px-4 py-2 border border-transparent 
                     rounded-md shadow-sm text-base font-medium text-white bg-blue-600 
                     hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 
                     focus:ring-blue-500 disabled:bg-blue-300"
          >
            {status === 'sending' ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t('contact.sending')}
              </span>
            ) : (
              <span className="flex items-center">
                <Send className="w-5 h-5 mr-2" />
                {t('contact.submit')}
              </span>
            )}
          </button>

          <ContactFormStatus status={status} />
        </form>
      </div>
    </div>
  );
}