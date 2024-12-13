import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

interface Props {
  onBack: () => void;
}

export function ForgotPasswordForm({ onBack }: Props) {
  const { t } = useTranslation();
  const { resetPassword } = useAuthStore();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setError('');

    try {
      await resetPassword(email);
      setStatus('success');
    } catch (error) {
      setStatus('error');
      setError(t('auth.validation.emailNotFound'));
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <button
        onClick={onBack}
        className="flex items-center text-sm text-blue-600 hover:text-blue-500 mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        {t('auth.backToLogin')}
      </button>

      <h2 className="text-2xl font-bold mb-6">{t('auth.forgotPassword.title')}</h2>
      
      <p className="text-gray-600 mb-6">
        {t('auth.forgotPassword.description')}
      </p>

      {status === 'success' ? (
        <div className="rounded-md bg-green-50 p-4">
          <p className="text-sm font-medium text-green-800">
            {t('auth.forgotPassword.checkEmail')}
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('auth.email')}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={status === 'sending'}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
          >
            {status === 'sending' ? t('auth.forgotPassword.sending') : t('auth.forgotPassword.submit')}
          </button>
        </form>
      )}
    </div>
  );
}