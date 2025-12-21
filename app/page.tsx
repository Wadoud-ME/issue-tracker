"use client";

import { useUIStore } from "@/stores/useStore";
import { Layout, ArrowLeft, CheckCircle2, BarChart3, Layers } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function HomePage() {
  const setNavOpened = useUIStore((s) => s.setNavOpened);
  
  useEffect(() => {
    setNavOpened(false);
  }, [setNavOpened]);

  return (
    <main className="min-h-dvh w-full flex flex-col items-center justify-center bg-primary-bg text-secondary-text p-4 md:p-8 animate-in fade-in duration-700 relative overflow-hidden">
      
      {/* Decorative Background Blob - Smaller on mobile */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 md:w-96 md:h-96 bg-tertiary-bg/10 rounded-full blur-3xl -z-10" />

      <div className="max-w-2xl w-full text-center space-y-6 md:space-y-8 z-10">
        
        {/* Icon Header */}
        <div className="flex justify-center mb-4 md:mb-6">
          <div className="bg-secondary-bg/50 p-3 md:p-4 rounded-2xl border border-tertiary-text/30 shadow-xl ring-1 ring-secondary-text/10">
            {/* Responsive Icon Size */}
            <Layout className="text-tertiary-bg w-10 h-10 md:w-12 md:h-12" />
          </div>
        </div>

        {/* Main Text */}
        <div className="space-y-3 md:space-y-4 px-2">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-secondary-text leading-tight">
            Welcome to Issues Tracker
          </h1>
          <p className="text-base sm:text-lg text-tertiary-text max-w-lg mx-auto leading-relaxed">
            Manage your projects efficiently. Select a space from the sidebar to start tracking issues, or create a new one to get started.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 pt-4 md:pt-8 w-full">
          <FeatureCard
            icon={<Layers className="text-tertiary-bg w-5 h-5 md:w-6 md:h-6" />}
            title="Organize"
            desc="Group tasks by spaces"
          />
          <FeatureCard
            icon={<CheckCircle2 className="text-tertiary-bg w-5 h-5 md:w-6 md:h-6" />}
            title="Track"
            desc="Monitor progress easily"
          />
          <FeatureCard
            icon={<BarChart3 className="text-tertiary-bg w-5 h-5 md:w-6 md:h-6" />}
            title="Analyze"
            desc="Keep projects on time"
          />
        </div>

        {/* Call to Action / Arrow */}
        <div className="pt-8 md:pt-12 flex flex-col items-center gap-3 opacity-80">
          <p className="text-xs md:text-sm font-medium text-tertiary-text uppercase tracking-widest">
            Get Started
          </p>
          <Link
            href="/spaces"
            className="flex items-center gap-2 text-tertiary-bg hover:brightness-110 transition-all animate-pulse group py-2"
          >
            <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-semibold">Open sidebar to select a space</span>
          </Link>
        </div>
      </div>
    </main>
  );
}

// Internal Component: Responsive Card
// On Mobile: Flex Row (Icon Left, Text Right) for compactness
// On Desktop: Stacked (Icon Top, Text Bottom) for grid look
function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="p-3 md:p-4 rounded-xl bg-secondary-bg/30 border border-tertiary-text/30 hover:bg-secondary-bg/50 transition-colors flex sm:flex-col items-center sm:items-start gap-3 sm:gap-2 text-left">
      <div className="shrink-0">{icon}</div>
      <div>
        <h3 className="font-semibold text-secondary-text text-sm md:text-base">
          {title}
        </h3>
        <p className="text-xs md:text-sm text-tertiary-text leading-snug">
          {desc}
        </p>
      </div>
    </div>
  );
}