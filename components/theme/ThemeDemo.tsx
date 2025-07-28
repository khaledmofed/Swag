'use client';

import { useThemeAdvanced } from '@/stores/themeStore';

export function ThemeDemo() {
  const {
    mode,
    systemPreference,
    isDark,
    isLight,
    isSystemDark,
    matchesSystem,
    toggleTheme,
    setMode,
  } = useThemeAdvanced();

  return (
    <div className="p-6 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4">
        🎨 Zustand Theme Store Demo
      </h3>
      
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-slate-400">Current Mode:</span>
          <span className="font-medium text-gray-900 dark:text-slate-100">
            {mode} {isDark ? '🌙' : '☀️'}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-slate-400">System Preference:</span>
          <span className="font-medium text-gray-900 dark:text-slate-100">
            {systemPreference} {isSystemDark ? '🌙' : '☀️'}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-slate-400">Matches System:</span>
          <span className="font-medium text-gray-900 dark:text-slate-100">
            {matchesSystem ? '✅ Yes' : '❌ No'}
          </span>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={toggleTheme}
          className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg
            hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-200 text-sm font-medium"
        >
          Toggle Theme
        </button>
        
        <button
          type="button"
          onClick={() => setMode('light')}
          className="px-4 py-2 bg-gray-200 dark:bg-slate-700 text-gray-900 dark:text-slate-100 rounded-lg
            hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors duration-200 text-sm font-medium"
        >
          Force Light
        </button>
        
        <button
          type="button"
          onClick={() => setMode('dark')}
          className="px-4 py-2 bg-gray-800 dark:bg-slate-600 text-white rounded-lg
            hover:bg-gray-900 dark:hover:bg-slate-500 transition-colors duration-200 text-sm font-medium"
        >
          Force Dark
        </button>
      </div>
    </div>
  );
}
