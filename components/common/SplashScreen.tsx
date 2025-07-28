"use client"

import React, { useEffect } from "react"
import Logo from "./logo"
import { useSplashStore } from "@/stores/themeStore"

export function SplashScreen() {
  const { isVisible, isAnimating, hideSplash } = useSplashStore()
  const backgroundClass =
    "bg-gradient-to-b from-dark-secondary-600 via-dark-secondary-500 to-dark-secondary-600"

  useEffect(() => {
    // Auto-hide splash screen after 2.5 seconds
    const timer = setTimeout(() => {
      hideSplash()
    }, 2500)

    return () => clearTimeout(timer)
  }, [hideSplash])

  // Handle click to skip splash screen
  const handleSkip = () => {
    if (!isAnimating) {
      hideSplash()
    }
  }

  if (!isVisible) return null

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-1000 ease-in-out cursor-pointer ${
        isAnimating ? "opacity-0 scale-110" : "opacity-100 scale-100"
      } ${backgroundClass}`}
      onClick={handleSkip}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className={`absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_50%_50%,rgba(255,215,0,0.1),transparent_70%)]`}
        />

        {/* Animated rings */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className={`absolute w-96 h-96 rounded-full border opacity-20 splash-ring border-amber-400/30`}
          />
          <div
            className={`absolute w-80 h-80 rounded-full border opacity-30 splash-ring splash-delay-500 "border-amber-300/40`}
          />
          <div
            className={`absolute w-64 h-64 rounded-full border opacity-40 splash-ring splash-delay-1000 
               border-amber-200/50
            `}
          />
        </div>
      </div>

      {/* Logo Container */}
      <div className="relative z-10 flex flex-col items-center space-y-6">
        {/* Logo with animation */}
        <div
          className={`transform transition-all duration-1000 ease-out ${
            isAnimating ? "scale-90 opacity-0" : "scale-100 opacity-100"
          }`}
        >
          <Logo
            width={200}
            height={80}
            priority={true}
            className="drop-shadow-lg"
            logo="/images/logo-swag-gold.png"
          />
        </div>
      </div>
    </div>
  )
}
