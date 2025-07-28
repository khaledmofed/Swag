"use client";
import { ThemeInitializer } from "@/components/theme/ThemeInitializer";
import { LanguageInitializer } from "@/components/language/LanguageInitializer";
import "./globals.css";
import { useLanguageStore } from "@/stores/languageStore";
import { SplashScreenInitializer } from "@/components/common/SplashScreenInitializer";
import { SplashScreen } from "@/components/common/SplashScreen";
import { QueryClientProvider } from "@/providers/QueryClientProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { language } = useLanguageStore();

  return (
    <html
      lang={language || "en"}
      dir={language === "ar" ? "rtl" : "ltr"}
      className={language === "ar" ? "font-ar" : "font-en"}
    >
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon1.png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
      </head>
      <body className="overflow-x-hidden overflowXHidden">
        <QueryClientProvider>
          <ThemeInitializer />
          <LanguageInitializer />
          <SplashScreenInitializer />
          <SplashScreen />
          {children}
        </QueryClientProvider>
      </body>
    </html>
  );
}
