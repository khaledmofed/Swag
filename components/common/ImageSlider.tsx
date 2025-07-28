"use client"

import React, { useCallback, useEffect, useState } from "react"
import useEmblaCarousel from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"
import { Icon } from "@/components/common/Icon"
import { cn } from "@/lib/utils"
import { useLanguageStore } from "@/stores/languageStore"

interface ImageSliderProps {
  images: {
    src: string
    alt: string
  }[]
  autoplay?: boolean
  autoplayDelay?: number
  className?: string
  noArrows?: boolean
  noCounter?: boolean
  noOverlay?: boolean
  classImage?: string
}

export function ImageSlider({
  images,
  autoplay = true,
  autoplayDelay = 4000,
  className,
  noArrows,
  noCounter,
  noOverlay,
  classImage
}: ImageSliderProps) {
  const { isRTL } = useLanguageStore()
  const [selectedIndex, setSelectedIndex] = useState(0)

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "center",
      skipSnaps: false,
      dragFree: false,
      duration: 30, // Faster slide transition for fade effect
      axis: "x"
    },
    autoplay
      ? [Autoplay({ delay: autoplayDelay, stopOnInteraction: false })]
      : []
  )

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  const onSelect = useCallback((emblaApi: any) => {
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [])

  useEffect(() => {
    if (!emblaApi) return

    onSelect(emblaApi)
    emblaApi.on("select", onSelect)
  }, [emblaApi, onSelect])

  return (
    <div className={cn("relative w-full", className)}>
      {/* Main Slider with Fade Effect */}
      <div className="relative w-full h-[60vh] md:h-[70vh] lg:h-[80vh] overflow-hidden">
        {images.map((image, index) => (
          <div
            key={index}
            className={cn(
              "absolute inset-0 transition-opacity duration-1000 ease-in-out",
              index === selectedIndex ? "opacity-100 z-10" : "opacity-0 z-0"
            )}
          >
            <img
              src={image.src}
              alt={image.alt}
              className={cn("w-full h-full object-cover", classImage)}
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.style.display = "none"
              }}
            />
            {/* Dark overlay for better contrast */}
            {!noOverlay && <div className="absolute inset-0 bg-black/20" />}
          </div>
        ))}

        {/* Hidden Embla container for navigation logic */}
        <div
          className="absolute inset-0 opacity-0 pointer-events-none"
          ref={emblaRef}
        >
          <div className="flex">
            {images.map((_, index) => (
              <div key={index} className="flex-[0_0_100%] min-w-0 h-full" />
            ))}
          </div>
        </div>
      </div>

      {/* Slide Counter and Navigation - Bottom Right */}
      {!noCounter && !noArrows && (
        <div className="absolute bottom-4 md:bottom-8 right-4 md:right-8 z-10 flex items-center gap-3">
          {/* Previous Arrow */}
          <button
            type="button"
            className="
                     rounded-full p-2 md:p-3
                     transition-all duration-300 hover:scale-110
                     text-white hover:text-white hover:scale-"
            onClick={scrollPrev}
            aria-label="Previous image"
          >
            <Icon
              name={isRTL ? "right-arrow-slide" : "left-arrow-slide"}
              size={16}
            />
          </button>

          {/* Slide Counter */}
          <div className="  px-4 py-2  ">
            <span className="text-white font-medium text-sm md:text-base">
              {String(selectedIndex + 1).padStart(2, "0")} /{" "}
              {String(images.length).padStart(2, "0")}
            </span>
          </div>

          {/* Next Arrow */}
          <button
            type="button"
            className="
                     p-2 md:p-3
                     transition-all duration-300 hover:scale-110
                     text-white hover:text-white"
            onClick={scrollNext}
            aria-label="Next image"
          >
            <Icon
              name={isRTL ? "left-arrow-slide" : "right-arrow-slide"}
              size={16}
            />
          </button>
        </div>
      )}
    </div>
  )
}
