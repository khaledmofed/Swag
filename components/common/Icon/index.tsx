"use client"

import React from 'react'
import { iconMap, type IconProps, type IconName } from './types'

/**
 * Centralized Icon component using react-icons
 * 
 * @example
 * ```tsx
 * import { Icon } from '@/components/common/Icon'
 * 
 * // Basic usage
 * <Icon name="arrow-right" />
 * 
 * // With custom size and styling
 * <Icon name="home" size={24} className="text-blue-500" />
 * 
 * // With click handler
 * ```
 */
export function Icon({ 
  name, 
  size = 16, 
  className = '', 
  color, 
  style = {}, 
  onClick,
  'aria-label': ariaLabel,
  ...props 
}: IconProps) {
  const IconComponent = iconMap[name]
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in iconMap`)
    return null
  }

  const iconStyle = {
    ...style,
    ...(color && { color }),
  }

  const iconProps = {
    size: typeof size === 'string' ? parseInt(size, 10) : size,
    className,
    style: iconStyle,
    'aria-label': ariaLabel || name,
    ...(onClick && { 
      onClick,
      role: 'button',
      tabIndex: 0,
      onKeyDown: (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      }
    }),
    ...props
  }

  return <IconComponent {...iconProps} />
}

/**
 * Hook to get an icon component by name
 * Useful for dynamic icon rendering
 */
export function useIcon(name: IconName) {
  return iconMap[name]
}

/**
 * Get all available icon names
 */
export function getAvailableIcons(): IconName[] {
  return Object.keys(iconMap) as IconName[]
}

/**
 * Check if an icon exists
 */
export function hasIcon(name: string): name is IconName {
  return name in iconMap
}

// Re-export types for convenience
export type { IconProps, IconName } from './types'

// Default export for easier importing
export default Icon
