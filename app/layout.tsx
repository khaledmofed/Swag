import { ThemeInitializer } from "@/components/theme/ThemeInitializer";
import { LanguageInitializer } from "@/components/language/LanguageInitializer";
import "./globals.css";
import { SplashScreenInitializer } from "@/components/common/SplashScreenInitializer";
import { SplashScreen } from "@/components/common/SplashScreen";
import { QueryClientProvider } from "@/providers/QueryClientProvider";
import { ClientLayoutWrapper } from "@/components/layout/ClientLayoutWrapper";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr" className="font-en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon1.png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
      </head>
      <body className="overflow-x-hidden overflowXHidden">
        <QueryClientProvider>
          <ClientLayoutWrapper>
            <ThemeInitializer />
            <LanguageInitializer />
            <SplashScreenInitializer />
            <SplashScreen />
            {children}
          </ClientLayoutWrapper>
        </QueryClientProvider>
      </body>
    </html>
  );
}
