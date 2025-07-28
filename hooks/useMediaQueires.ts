import { mediaQueries } from "@/lib/utils"

// hook media queries
export const useMediaQueries = () => {
  return {
    isMobile: window.matchMedia(mediaQueries.mobile).matches,
    isTablet: window.matchMedia(mediaQueries.tablet).matches,
    isDesktop: window.matchMedia(mediaQueries.desktop).matches,
  }
}