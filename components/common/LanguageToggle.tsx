"use client";

import { useLanguageStore, type Language } from "@/stores/languageStore";
import { useTranslation } from "react-i18next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/common/Icon";
import { cn } from "@/lib/utils";

export function LanguageToggle({
  isBlogDetailsPage,
  className = "",
}: {
  isBlogDetailsPage?: boolean;
  className?: string;
}) {
  const { language, setLanguage } = useLanguageStore();
  const { t } = useTranslation();

  const languages = [
    { code: "en" as Language, label: "English", flag: "🇺🇸" },
    { code: "ar" as Language, label: "العربية", flag: "🇸🇦" },
  ];

  const currentLanguage = languages.find((lang) => lang.code === language);

  const handleLanguageSelect = (langCode: Language) => {
    // إضافة تأثير انتقالي سلس
    const currentPath = window.location.pathname;
    const newPath = currentPath.replace(/^\/(en|ar)/, `/${langCode}`);

    // تحديث اللغة في المتجر
    setLanguage(langCode);

    // الانتقال إلى الصفحة الجديدة مع اللغة المحدثة
    if (newPath !== currentPath) {
      window.location.href = newPath;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "flex items-center gap-2 px-3 h-10 rounded-lg  hover:bg-button-background-icon  transition-colors duration-200 text-sm font-medium text-primary-50",
            isBlogDetailsPage && "text-secondary-500 dark:text-primary-50",
            className
          )}
          title={t("language.toggle_language")}
          aria-label={t("language.toggle_language")}
        >
          <Icon name="globe" size={20} />
          <span className="hidden sm:inline">
            {currentLanguage?.code.toUpperCase()}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageSelect(lang.code)}
            className="flex items-center gap-3 cursor-pointer"
          >
            <span className="text-lg">{lang.flag}</span>
            <span className="flex-1">{lang.label}</span>
            {language === lang.code && (
              <Icon name="check" size={16} className="text-primary-50" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
