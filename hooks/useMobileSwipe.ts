import { useUIStore } from "@/stores/useStore";
import { useEffect, useRef } from "react";

export function useMobileSwipe() {
  const { navOpened, setNavOpened } = useUIStore();

  // 1. REFS vs STATE
  // We use useRef because we want to store numbers (coordinates) 
  // without triggering a re-render every time the user touches the screen.
  // This keeps performance high.
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  useEffect(() => {
    // --------------------------------------------------------
    // EVENT 1: TOUCH START (Finger touches glass)
    // --------------------------------------------------------
    const handleTouchStart = (e: TouchEvent) => {
      // Record the exact pixel where the finger landed.
      // clientX = Horizontal (0 is left edge)
      // clientY = Vertical (0 is top edge)
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
    };

    // --------------------------------------------------------
    // EVENT 2: TOUCH END (Finger leaves glass)
    // --------------------------------------------------------
    const handleTouchEnd = (e: TouchEvent) => {
      // Safety: If we missed the start event, stop.
      if (touchStartX.current === null || touchStartY.current === null) return;

      // CRITICAL: We use 'changedTouches' because 'touches' is empty 
      // (the finger is gone!). changedTouches tells us where it *was* when it left.
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;

      // MATH: Calculate distance moved (End - Start)
      // Positive X = Swipe Right ->
      // Negative X = Swipe Left <-
      const deltaX = touchEndX - touchStartX.current;
      const deltaY = touchEndY - touchStartY.current;

      // LOGIC CHECK 1: Is this a scroll?
      // If the user moved their finger UP/DOWN by more than 60px, 
      // they are likely scrolling the page, not trying to open the menu.
      if (Math.abs(deltaY) > 60) {
        touchStartX.current = null;
        touchStartY.current = null;
        return; 
      }

      // LOGIC CHECK 2: Swipe Right (Open Menu)
      // 1. Menu must be closed (!navOpened)
      // 2. Swipe must be fast/long enough (> 45px)
      // 3. CRITICAL: Must start at the EDGE (< 50px). 
      //    If we don't check this, swiping a table in the middle of screen would open the menu.
      if (!navOpened && deltaX > 45 && touchStartX.current < 50) {
        setNavOpened(true);
      }

      // LOGIC CHECK 3: Swipe Left (Close Menu)
      // 1. Menu must be open
      // 2. Swipe must be negative (< -45px)
      // We don't care where it started; you can close the menu from anywhere.
      if (navOpened && deltaX < -45) {
        setNavOpened(false);
      }

      // Cleanup: Reset for next gesture
      touchStartX.current = null;
      touchStartY.current = null;
    };

    // Attach listeners to the window so gestures work anywhere
    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchend", handleTouchEnd);

    // Clean up listeners when component unmounts
    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [navOpened, setNavOpened]);
}