import React from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle, XCircle } from 'lucide-react';

interface Props {
  status: 'idle' | 'sending' | 'success' | 'error';
}

export function ContactFormStatus({ status }: Props) {
  const { t } = useTranslation();

  if (status === 'success') {
    return (
      <div className="rounded-md bg-green-50 p-4">
        <div className="flex">
          <CheckCircle className="h-5 w-5 text-green-400" />
          <div className="ml-3">
            <p className="text-sm font-medium text-green-800">
              {t('contact.successMessage')}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="flex">
          <XCircle className="h-5 w-5 text-red-400" />
          <div className="ml-3">
            <p className="text-sm font-medium text-red-800">
              {t('contact.errorMessage')}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}