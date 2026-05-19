import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';

/**
 * i18n setup. English-only for now; resources are bundled (imported), so no
 * async loading and no Suspense boundary is needed. Adding a locale later is
 * just another entry under `resources`.
 */
void i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false, // React already escapes
  },
  react: {
    useSuspense: false,
  },
});

export default i18n;
