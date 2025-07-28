'use client';

import { useEffect } from 'react';
import { useSplashStore } from '@/stores/themeStore';

export function SplashScreenInitializer() {
  const initialize = useSplashStore((state) => state.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return null;
}
