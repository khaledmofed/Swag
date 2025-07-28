import { notFound } from 'next/navigation';
import { ReactNode } from 'react';

interface LocaleLayoutProps {
  children: ReactNode;
  params: Promise<{
    locale: string;
  }>;
}

// Define supported locales
const supportedLocales = ['en', 'ar'];

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;

  // Validate locale
  if (!supportedLocales.includes(locale)) {
    notFound();
  }

  return (
    <div className={`locale-${locale}`}>
      {children}
    </div>
  );
}

// Generate static params for supported locales
export async function generateStaticParams() {
  return supportedLocales.map((locale) => ({
    locale,
  }));
}
