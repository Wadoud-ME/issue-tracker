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
  const [showButton, setShowButton] = useState<boolean>(false);

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
    <>
      <button
        onClick={toggleNav}
        className={cn(
          "fixed hidden md:block top-6 left-0 z-50 p-2 rounded-r-lg bg-secondary-bg hover:bg-tertiary-bg shadow-lg transition-all duration-300 ease-out cursor-pointer",
          showButton
            ? "translate-x-0 opacity-100"
            : "-translate-x-full opacity-0 pointer-events-none"
        )}
        aria-label="Open menu"
      >
        <TextAlignJustify
          size={24}
          className="text-gray-300 hover:text-white"
        />
      </button>
      {!navOpened && (
        <div 
          onClick={toggleNav}
          className={cn("fixed top-6 left-0 h-16 w-1.5 bg-tertiary-bg/60 hover:bg-tertiary-bg rounded-r-full cursor-pointer transition-all duration-300 z-40 hover:w-2 hover:shadow-2xl",
            showButton ? '-left-full opacity-0' : 'left-0 opacity-100'
          )}
          title="Open Sidebar"
        />
      )}
    </>
  );
};
