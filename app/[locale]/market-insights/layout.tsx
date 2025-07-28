'use client';

import { MainLayout } from '@/components/layout/MainLayout';
import { notFound } from 'next/navigation';
import { ReactNode } from 'react';
import { useParams } from 'next/navigation';

interface MarketInsightsLayoutProps {
  children: ReactNode;
}

// Define supported locales
const supportedLocales = ['en', 'ar'];

export default function LocalizedMarketInsightsLayout({ children }: MarketInsightsLayoutProps) {
  const params = useParams();
  const locale = params.locale as string;

  // Validate locale
  if (!supportedLocales.includes(locale)) {
    notFound();
  }

  return (
    <MainLayout isLiveMarketInsights={true}>
      {children}
    </MainLayout>
  );
}
