"use client";
import { TextAlignJustify } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface FloatingToggleProps {
  navOpened: boolean;
  toggleNav: () => void;
}

export const FloatingToggle = ({
  navOpened,
  toggleNav,
}: FloatingToggleProps) => {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    if (navOpened) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (e.clientX <= 15) setShowButton(true);
      else if (e.clientX > 100) setShowButton(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [navOpened]);

  if (navOpened) return null;

  return (
    <button
      onClick={toggleNav}
      className={cn(
        "fixed top-6 left-0 z-50 p-2 rounded-r-lg bg-secondary-bg hover:bg-tertiary-bg shadow-lg transition-all duration-300 ease-out cursor-pointer",
        showButton
          ? "translate-x-0 opacity-100"
          : "-translate-x-full opacity-0 pointer-events-none"
      )}
      aria-label="Open menu"
    >
      <TextAlignJustify size={24} className="text-gray-300 hover:text-white" />
    </button>
  );
};
