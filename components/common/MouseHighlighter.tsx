"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { cn } from "@/lib/utils";

interface MouseHighlighterProps {
  /** Whether the dot cursor is enabled */
  enabled?: boolean;
  /** Size of the dot in pixels */
  size?: number;
  /** Custom CSS classes for styling */
  className?: string;
  /** Color theme */
  color?: "primary" | "secondary" | "accent" | "custom";
  /** Custom color (when color is 'custom') */
  customColor?: string;
  /** Opacity of the dot */
  opacity?: number;
  /** Animation duration in milliseconds */
  animationDuration?: number;
  /** Z-index for positioning */
  zIndex?: number;
  /** Whether to show a subtle glow effect */
  showGlow?: boolean;
}

interface MousePosition {
  x: number;
  y: number;
}

const MouseHighlighter: React.FC<MouseHighlighterProps> = ({
  enabled = true,
  size = 8,
  className,
  color = "primary",
  customColor,
  opacity = 0.8,
  animationDuration = 150,
  zIndex = 9999,
  showGlow = false,
}) => {
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: 0,
    y: 0,
  });
  const [isVisible, setIsVisible] = useState(false);
  const frame = useRef(0);

  // Handle mouse movement
  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (frame.current) {
      cancelAnimationFrame(frame.current);
    }
    const { clientX, clientY } = event;
    frame.current = requestAnimationFrame(() => {
      setMousePosition({ x: clientX, y: clientY });
      setIsVisible(true);
    });
  }, []);

  // Handle mouse leave
  const handleMouseLeave = useCallback(() => {
    setIsVisible(false);
  }, []);

  // Set up event listeners and hide default cursor
  useEffect(() => {
    if (!enabled) {
      setIsVisible(false);
      // Restore default cursor
      document.body.style.cursor = "";
      return;
    }

    // Hide default cursor
    document.body.style.cursor = "none";

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      // Restore default cursor
      document.body.style.cursor = "";
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, [enabled, handleMouseMove, handleMouseLeave]);

  // Don't render if disabled or not visible
  if (!enabled || !isVisible) {
    return null;
  }

  // Get color classes based on theme
  const getColorClasses = () => {
    switch (color) {
      case "primary":
        return "bg-primary-500 dark:bg-primary-400";
      case "secondary":
        return "bg-secondary-500 dark:bg-secondary-400";
      case "accent":
        return "bg-accent dark:bg-accent";
      case "custom":
        return "";
      default:
        return "bg-primary-500 dark:bg-primary-400";
    }
  };

  // Dot cursor styles
  const dotStyles: React.CSSProperties = {
    left: mousePosition.x - size / 2,
    top: mousePosition.y - size / 2,
    width: size,
    height: size,
    opacity,
    transition: `all ${animationDuration}ms ease-out`,
    pointerEvents: "none",
    zIndex,
    backgroundColor:
      color === "custom" && customColor ? customColor : undefined,
  };

  return (
    <div
      className={cn(
        "fixed rounded-full",
        color !== "custom" && getColorClasses(),
        showGlow && "shadow-lg shadow-current",
        className
      )}
      style={dotStyles}
    />
  );
};

export default MouseHighlighter;
