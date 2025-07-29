import { Metadata } from "next";
import MarketInsights from "@/components/marketInsights";
import { notFound } from "next/navigation";
import {
  generateMarketInsightsMetadata,
  generateBreadcrumbStructuredData,
} from "@/lib/seo";
import { SupportedLocale } from "@/lib/seo";

// Define supported locales
const supportedLocales = ["en", "ar"];

interface MarketInsightsPageProps {
  params: Promise<{
    locale: string;
  }>;
}

// Generate metadata for the market insights page
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return generateMarketInsightsMetadata(locale as SupportedLocale);
}

export default async function LocalizedMarketInsightsPage({
  params,
}: MarketInsightsPageProps) {
  const { locale } = await params;

  // Validate locale
  if (!supportedLocales.includes(locale)) {
    notFound();
  }

  // Generate breadcrumb structured data
  const breadcrumbStructuredData = generateBreadcrumbStructuredData(
    locale as SupportedLocale,
    [
      { name: locale === "ar" ? "الرئيسية" : "Home", url: `/${locale}` },
      {
        name: locale === "ar" ? "رؤى السوق" : "Market Insights",
        url: `/${locale}/market-insights`,
      },
    ]
  );

  return (
    <>
      {/* Breadcrumb Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbStructuredData),
        }}
      />
      <MarketInsights />
    </>
  );
}
