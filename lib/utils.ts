import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Convert relative image paths to full URLs
export function getImageUrl(path: string | null | undefined): string {
  if (!path) return "/images/placeholder.png";

  // If it's already a full URL, return as is
  if (path.startsWith("http://") || path.startsWith("https://")) {
    // Replace localhost with the correct domain if present
    if (path.includes("localhost")) {
      return path.replace("http://localhost", "https://admin.swaggold.co");
    }
    return path;
  }

  // If it's a relative path starting with /storage, convert to full URL
  if (path.startsWith("/storage/")) {
    return `https://admin.swaggold.co${path}`;
  }

  // If it's a relative path without /storage, assume it's from public folder
  if (path.startsWith("/")) {
    return path;
  }

  // Default fallback
  return `/images/${path}`;
}

// media qeueries
export const mediaQueries = {
  mobile: "@media (max-width: 767px)",
  tablet: "@media (min-width: 768px) and (max-width: 1023px)",
  desktop: "@media (min-width: 1024px)",
};
