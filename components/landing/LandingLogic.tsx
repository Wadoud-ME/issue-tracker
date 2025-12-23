"use client";

import { useUIStore } from "@/stores/useStore";
import { useEffect } from "react";

export const LandingLogic = () => {
  const setNavOpened = useUIStore((s) => s.setNavOpened);

  useEffect(() => {
    // Close sidebar immediately when mounting the landing page
    setNavOpened(false);
  }, [setNavOpened]);

  return null; // This component renders nothing visually
};