import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import 'intl-pluralrules';

import en from './locales/en.json'; // English translations
import es from './locales/es.json'; // Spanish translations

// Initialize i18n
i18n.use(initReactI18next).init({
  resources: {
    en: {translation: en},
    es: {translation: es},
  },
  lng: 'en', // Default language
  fallbackLng: 'en', // Fallback language
  interpolation: {
    escapeValue: false, // React already safe from XSS
  },
});

export default i18n;
