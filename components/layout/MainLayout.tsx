"use client";

import { Header } from "./Header";
import { Footer } from "./Footer";
import { NoiseBackground } from "@/components/common/NoiseBackground";
import { PromoBanner } from "@/components/homePage/PromoBanner";
import { Toast } from "@/components/common/Toast";
import { usePathname } from "next/navigation";
import { useToastStore } from "@/stores/toastStore";

interface MainLayoutProps {
  children: React.ReactNode;
  isBlogDetailsPage?: boolean;
  isLiveMarketInsights?: boolean;
}

export function MainLayout({
  children,
  isBlogDetailsPage = false,
  isLiveMarketInsights = false,
}: MainLayoutProps) {
  const pathname = usePathname();
  const isHome = pathname === "/" || pathname === "/ar" || pathname === "/en";
  const { message, isVisible, hideToast } = useToastStore();

  return (
    <>
      {!isHome && <PromoBanner speed="slow" />}
      <NoiseBackground className="min-h-screen bg-white-50 dark:bg-dark-secondary-600 transition-colors duration-300">
        <Header
          isBlogDetailsPage={isBlogDetailsPage}
          isLiveMarketInsights={isLiveMarketInsights}
        />

        {/* Main content area */}
        <main className="flex-1 min-h-[80vh] overflow-x-hidden">
          {children}
        </main>

        {/* Footer */}
        <Footer />

        {/* Toast */}
        <Toast message={message} isVisible={isVisible} onClose={hideToast} />
      </NoiseBackground>
    </>
  );
}
