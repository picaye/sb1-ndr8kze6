import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Logo } from './Logo';
import { LanguageSelector } from './LanguageSelector';
import { useAuthStore } from '../stores/authStore';

export function Header() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <a href="/" className="flex items-center space-x-3">
            <Logo />
          </a>
          
          <div className="flex items-center space-x-6">
            <nav className="hidden md:flex space-x-6">
              <a href="/" className="text-gray-600 hover:text-blue-600">
                {t('header.home')}
              </a>
              <a href="/about" className="text-gray-600 hover:text-blue-600">
                {t('header.about')}
              </a>
              <a href="/contact" className="text-gray-600 hover:text-blue-600">
                {t('header.contact')}
              </a>
              {isAdmin && (
                <a href="/admin" className="text-gray-600 hover:text-blue-600">
                  {t('header.admin')}
                </a>
              )}
            </nav>
            
            <LanguageSelector />
            
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-600"
              >
                <LogOut className="h-5 w-5" />
                <span>{t('auth.logout')}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}