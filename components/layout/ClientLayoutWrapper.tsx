"use client";

import { useEffect } from "react";
import { useLanguageStore } from "@/stores/languageStore";

interface ClientLayoutWrapperProps {
  children: React.ReactNode;
}

export function ClientLayoutWrapper({ children }: ClientLayoutWrapperProps) {
  const { language } = useLanguageStore();

  useEffect(() => {
    // Update HTML attributes on the client side
    const html = document.documentElement;
    html.lang = language || "en";
    html.dir = language === "ar" ? "rtl" : "ltr";
    html.className = language === "ar" ? "font-ar" : "font-en";
  }, [language]);

  return <>{children}</>;
}
