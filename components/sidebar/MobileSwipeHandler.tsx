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

      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;

      const deltaX = touchEndX - touchStartX.current;
      const deltaY = touchEndY - touchStartY.current;

      // LOGIC:
      // We only want horizontal swipes, so ignore if they scrolled up/down too much
      // Increased tolerance to 60px to allow for natural diagonal thumb movement
      if (Math.abs(deltaY) > 60) {
        touchStartX.current = null;
        touchStartY.current = null;
        return;
      }

      // SWIPE RIGHT (Open Menu)
      // Condition 1: Moved right by at least 45px (Quick flick)
      // Condition 2: Started within the left 120px of the screen
      //    -> Old value was 40px (too close to edge, causing "Back" gesture conflict).
      //    -> New value 120px lets you swipe from inside the content area.
      if (!navOpened && deltaX > 65 && touchStartX.current < 400) {
        setNavOpened(true);
      }

      // SWIPE LEFT (Close Menu)
      // Condition: Swipe left anywhere on screen
      if (navOpened && deltaX < -45) {
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

  return null;
}