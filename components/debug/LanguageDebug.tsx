'use client';

import { useLanguageStore } from '@/stores/languageStore';
import { useFooterWithStore, useSystemSettingsWithStore } from '@/hooks';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';

export function LanguageDebug() {
  const { language, isRTL, setLanguage, toggleLanguage } = useLanguageStore();
  const { t } = useTranslation();
  const pathname = usePathname();
  
  // Test API hooks to see if they refetch when language changes
  const { data: footer, isLoading: footerLoading, dataUpdatedAt: footerUpdatedAt } = useFooterWithStore({
    enabled: typeof window !== 'undefined'
  });
  
  const { data: settings, isLoading: settingsLoading, dataUpdatedAt: settingsUpdatedAt } = useSystemSettingsWithStore({
    enabled: typeof window !== 'undefined'
  });

  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-4 shadow-lg max-w-sm z-50">
      <h3 className="font-bold text-lg mb-3">Language Debug</h3>
      
      {/* Current State */}
      <div className="space-y-2 mb-4">
        <p><strong>Current Language:</strong> {language}</p>
        <p><strong>Is RTL:</strong> {isRTL ? 'Yes' : 'No'}</p>
        <p><strong>Current Path:</strong> {pathname}</p>
        <p><strong>Translation Test:</strong> {t('navigation.home')}</p>
      </div>

      {/* API Data Status */}
      <div className="space-y-2 mb-4 text-sm">
        <h4 className="font-semibold">API Data Status:</h4>
        <p>
          <strong>Footer:</strong> {footerLoading ? 'Loading...' : footer ? 'Loaded' : 'No data'}
          {footerUpdatedAt && (
            <span className="block text-xs text-gray-500">
              Updated: {new Date(footerUpdatedAt).toLocaleTimeString()}
            </span>
          )}
        </p>
        <p>
          <strong>Settings:</strong> {settingsLoading ? 'Loading...' : settings ? 'Loaded' : 'No data'}
          {settingsUpdatedAt && (
            <span className="block text-xs text-gray-500">
              Updated: {new Date(settingsUpdatedAt).toLocaleTimeString()}
            </span>
          )}
        </p>
      </div>

      {/* Controls */}
      <div className="space-y-2">
        <Button 
          onClick={toggleLanguage}
          className="w-full"
          size="sm"
        >
          Toggle Language ({language === 'en' ? 'Switch to AR' : 'Switch to EN'})
        </Button>
        
        <div className="flex gap-2">
          <Button 
            onClick={() => setLanguage('en')}
            variant={language === 'en' ? 'default' : 'outline'}
            size="sm"
            className="flex-1"
          >
            EN
          </Button>
          <Button 
            onClick={() => setLanguage('ar')}
            variant={language === 'ar' ? 'default' : 'outline'}
            size="sm"
            className="flex-1"
          >
            AR
          </Button>
        </div>
      </div>
    </div>
  );
}
