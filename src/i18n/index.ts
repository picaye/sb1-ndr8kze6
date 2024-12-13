import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import de from './locales/de';
import en from './locales/en';
import fr from './locales/fr';
import it from './locales/it';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      de,
      en,
      fr,
      it,
    },
    lng: 'de', // default language
    fallbackLng: 'de',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;