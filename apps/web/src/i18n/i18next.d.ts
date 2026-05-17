import 'i18next';
import type en from './locales/en.json';

/** Types `t()` keys against the English resource file. */
declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation';
    resources: {
      translation: typeof en;
    };
  }
}
