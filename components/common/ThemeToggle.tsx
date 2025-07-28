"use client"

import { useTheme } from "@/stores/themeStore"
import { Icon } from "@/components/common/Icon"

export function ThemeToggle({
  isBlogDetailsPage
}: {
  isBlogDetailsPage?: boolean
}) {
  const { mode, toggleTheme } = useTheme()

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="relative p-3 rounded-full transition-all duration-300 ease-in-out
        bg-button-background-icon
        hover:[#FDFEFE50]
        shadow-sm hover:shadow-md
        focus:outline-none
        transform hover:scale-105 active:scale-95"
      aria-label={`Switch to ${mode === "light" ? "dark" : "light"} theme`}
    >
      <div className="relative w-4 h-4">
        {/* Sun icon */}
        <Icon
          name="sun"
          size={16}
          className={`absolute inset-0 transition-all duration-300
            text-primary-50,
            ${isBlogDetailsPage && "text-secondary-500 dark:text-primary-50"}
            
            ${
              mode === "light"
                ? "opacity-100 rotate-0 scale-100"
                : "opacity-0 rotate-180 scale-0"
            }`}
        />

        {/* Moon icon */}
        <Icon
          name="moon"
          size={16}
          className={`absolute inset-0 transition-all duration-300
            text-primary-50,
            ${isBlogDetailsPage && "text-secondary-500 dark:text-primary-50"}
             ${
               mode === "dark"
                 ? "opacity-100 rotate-0 scale-100"
                 : "opacity-0 -rotate-180 scale-0"
             }`}
        />
      </div>
    </button>
  )
}
