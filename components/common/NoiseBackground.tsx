"use client"

import { useThemeStore } from "@/stores/themeStore"
import { useEffect, useState } from "react"

interface NoiseBackgroundProps {
  children: React.ReactNode
  className?: string
  intensity?: 'light' | 'medium' | 'heavy'
}

export function NoiseBackground({ 
  children, 
  className = "",
  intensity = 'medium'
}: NoiseBackgroundProps) {
  const { mode } = useThemeStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className={className}>{children}</div>
  }

  const intensityClasses = {
    light: 'opacity-20',
    medium: 'opacity-30', 
    heavy: 'opacity-40'
  }

  return (
    <div className={`relative ${className}`}>
      {/* Noise texture overlay for dark mode only */}
      {mode === 'dark' && (
        <div 
          className={`absolute inset-0 pointer-events-none z-0 ${intensityClasses[intensity]}`}
          style={{
            backgroundImage: 'url("/images/noise-texture.svg")',
            backgroundSize: '200px 200px',
            backgroundRepeat: 'repeat',
            mixBlendMode: 'overlay'
          }}
        />
      )}
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}
