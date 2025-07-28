import 'react-i18next';

// Import the translation files to get their types
import { enTranslations } from '@/locales/en/common';

declare module 'react-i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation';
    resources: {
      translation: typeof enTranslations;
    };
  }
}
