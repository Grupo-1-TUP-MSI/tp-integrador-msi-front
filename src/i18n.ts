import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translationES from './locales/es/translation.json';
import translationPT from './locales/pt/translation.json';

const resources = {
  en: {
    translation: translationES,
  },
  de: {
    translation: translationPT,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'es',

  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
