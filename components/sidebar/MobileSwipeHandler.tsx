"use client";

import { useUIStore } from "@/stores/useStore";
import { useEffect, useRef } from "react";

export default function MobileSwipeHandler() {
  const { navOpened, setNavOpened } = useUIStore();
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  useEffect(() => {
    // 1. When finger touches screen
    const handleTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
    };

    // 2. When finger leaves screen
    const handleTouchEnd = (e: TouchEvent) => {
      if (touchStartX.current === null || touchStartY.current === null) return;

      // Get the end position (need to check generic type for TypeScript safety)
      const touchEndX = (e as TouchEvent).changedTouches[0].clientX;
      const touchEndY = (e as TouchEvent).changedTouches[0].clientY;

      const deltaX = touchEndX - touchStartX.current;
      const deltaY = touchEndY - touchStartY.current;

      // LOGIC:
      // We only want horizontal swipes, so ignore if they scrolled up/down too much
      if (Math.abs(deltaY) > 50) {
        touchStartX.current = null;
        touchStartY.current = null;
        return;
      }

      // SWIPE RIGHT (Open Menu)
      // Condition: Swipe must be > 50px AND start near the left edge (< 40px)
      // The "Edge" check prevents opening menu when scrolling a table in the middle of screen
      if (!navOpened && deltaX > 50 && touchStartX.current < 40) {
        setNavOpened(true);
      }

      // SWIPE LEFT (Close Menu)
      // Condition: Swipe must be < -50px
      if (navOpened && deltaX < -50) {
        setNavOpened(false);
      }

      // Reset
      touchStartX.current = null;
      touchStartY.current = null;
    };

    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [navOpened, setNavOpened]);

  return null; // This component renders nothing visual
}