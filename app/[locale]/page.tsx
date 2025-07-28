import { Metadata } from "next";
import HydratedHomepage from "@/components/homePage";
import {
  generateHomeMetadata,
  generateOrganizationStructuredData,
} from "@/lib/seo";
import { SupportedLocale } from "@/lib/seo";

interface HomePageProps {
  params: Promise<{
    locale: string;
  }>;
}

// Generate metadata for the home page
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return generateHomeMetadata(locale as SupportedLocale);
}

export default async function Homepage({ params }: HomePageProps) {
  const { locale } = await params;

  // Generate structured data for the organization
  const organizationStructuredData = generateOrganizationStructuredData(
    locale as SupportedLocale
  );

  return (
    <>
      {/* Organization Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationStructuredData),
        }}
      />
      <HydratedHomepage />
    </>
  );
}
