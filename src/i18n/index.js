import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import es from './locales/es.json';
import de from './locales/de.json';
import pt from './locales/pt.json';

const resources = {
  en: { translation: en },
  es: { translation: es },
  de: { translation: de },
  pt: { translation: pt },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'es',
  fallbackLng: 'es',
  interpolation: { escapeValue: false },
  compatibilityJSON: 'v4',
});

export default i18n;
