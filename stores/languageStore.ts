import { create } from "zustand";
import { persist } from "zustand/middleware";
import i18n from "@/lib/i18n";
import { invalidateAllQueries } from "@/lib/queryInvalidation";

export type Language = "en" | "ar";

interface LanguageState {
  language: Language;
  isRTL: boolean;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
  refreshApiData: () => void;
  changeUrlLocale: (newLanguage: Language) => void;
  initializeLanguageFromURL: () => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      language: "en",
      isRTL: false,

      // Initialize language from URL
      initializeLanguageFromURL: () => {
        if (typeof window !== "undefined") {
          const pathname = window.location.pathname;
          const locale = pathname.split("/")[1];
          console.log(
            "initializeLanguageFromURL - pathname:",
            pathname,
            "locale:",
            locale
          );
          if (locale === "ar" || locale === "en") {
            console.log("Initializing language from URL:", locale);
            const currentLanguage = get().language;
            console.log("Current language in store:", currentLanguage);
            if (currentLanguage !== locale) {
              console.log(
                "Language changed from",
                currentLanguage,
                "to",
                locale
              );
              get().setLanguage(locale as Language);
            } else {
              console.log("Language already set to:", locale);
            }
          } else {
            console.log("No valid locale found in URL, using default");
          }
        }
      },

      changeUrlLocale: (newLanguage: Language) => {
        if (typeof window !== "undefined") {
          const currentPath = window.location.pathname;
          const currentSearch = window.location.search;
          const currentHash = window.location.hash;

          // Remove current locale from path
          const pathWithoutLocale =
            currentPath.replace(/^\/(en|ar)/, "") || "/";

          // Create new URL with new locale
          const newUrl = `/${newLanguage}${pathWithoutLocale}${currentSearch}${currentHash}`;

          // Navigate to new URL
          window.history.pushState({}, "", newUrl);

          // Trigger a popstate event to update any components listening to route changes
          window.dispatchEvent(new PopStateEvent("popstate"));
        }
      },

      setLanguage: (language: Language) => {
        console.log("Setting language to:", language);
        const isRTL = language === "ar";

        // Update i18n language
        i18n.changeLanguage(language);

        // Update document direction, lang attribute, and font class
        if (typeof document !== "undefined") {
          document.documentElement.dir = isRTL ? "rtl" : "ltr";
          document.documentElement.lang = language;

          // Remove existing font classes
          document.documentElement.classList.remove("font-en", "font-ar");

          // Add appropriate font class based on language
          document.documentElement.classList.add(`font-${language}`);
        }

        set({ language, isRTL });

        // Change URL locale
        get().changeUrlLocale(language);

        // Refresh API data when language changes
        get().refreshApiData();
      },

      toggleLanguage: () => {
        const currentLanguage = get().language;
        const newLanguage: Language = currentLanguage === "en" ? "ar" : "en";
        get().setLanguage(newLanguage);
      },

      refreshApiData: async () => {
        console.log("Refreshing API data due to language change");
        // Invalidate all React Query queries to refetch with new language
        if (typeof window !== "undefined") {
          try {
            await invalidateAllQueries();
            console.log("Successfully invalidated all queries");
          } catch (error) {
            console.warn("Could not invalidate queries:", error);
          }
        }
      },
    }),
    {
      name: "language-storage",
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Ensure i18n is updated when store is rehydrated
          state.setLanguage(state.language);
          // Initialize language from URL
          state.initializeLanguageFromURL();
        }
      },
    }
  )
);
