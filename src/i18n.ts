import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend'; // Import the backend plugin

i18n
  .use(HttpBackend) // Add the backend plugin so we load it from public/locales
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: import.meta.env.DEV, // Ensure this matches your environment setup
    interpolation: {
      escapeValue: false, // React handles escaping by default
    },
    supportedLngs: ['en', 'te'],
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json', // Configure the path to your translation files
    },
  });

export default i18n;
