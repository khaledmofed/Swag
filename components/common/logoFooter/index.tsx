import React, { useState } from "react";
import Image from "next/image";
import { getImageUrl } from "@/lib/utils";

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  onClick?: () => void;
  white?: boolean;
  logo?: string;
}

export default function LogoFooter({
  width = 120,
  height = 40,
  className = "",
  priority = false,
  white = false,
  onClick,
  logo,
  ...props
}: LogoProps) {
  const [imageError, setImageError] = useState(false);

  // Determine which logo to use based on theme
  const logoSrc = logo
    ? getImageUrl(logo)
    : !white
    ? "/images/logo-swag-dark.png"
    : "/images/swag-logo-white.png";

  const logoAlt = "Jewelry Premium Logo";

  // Fallback logo component when images are not available

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const handleImageError = () => {
    setImageError(true);
    console.warn(`Logo image failed to load: ${logoSrc}`);
  };

  const handleImageLoad = () => {
    setImageError(false);
  };

  return (
    <div
      className={`relative flex items-center ${
        onClick ? "cursor-pointer" : ""
      } ${className}`}
      onClick={handleClick}
    >
      <Image
        src={logoSrc}
        alt={logoAlt}
        width={width}
        height={height}
        priority={priority}
        className="transition-opacity w-auto max-h-[80px] duration-300  mobile-logo-image"
        onError={handleImageError}
        onLoad={handleImageLoad}
      />
    </div>
  );
}
