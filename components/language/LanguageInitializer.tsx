'use client';

import { useEffect } from 'react';
import { useLanguageStore } from '@/stores/languageStore';
import '@/lib/i18n'; // Import to initialize i18n

export function LanguageInitializer() {
  const { language, setLanguage } = useLanguageStore();

  useEffect(() => {
    // Initialize language on mount
    setLanguage(language);
  }, [language, setLanguage]);

  return null;
}
