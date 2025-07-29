import { Metadata } from "next";
import { generateAddressesMetadata, SupportedLocale } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return generateAddressesMetadata(locale as SupportedLocale);
}

export default function AddressesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
