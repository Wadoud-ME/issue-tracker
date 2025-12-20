'use client'

import { useUIStore } from "@/stores/useStore";
import { Layout, ArrowLeft, CheckCircle2, BarChart3, Layers } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function HomePage() {
  const setNavOpened = useUIStore(s => s.setNavOpened);
  useEffect(() => {
    setNavOpened(false)
  }, [setNavOpened]);
  
  return (
    <main className="h-dvh w-full flex flex-col items-center justify-center bg-primary-bg text-secondary-text p-8 animate-in fade-in duration-700">
      {/* Decorative Background Blob */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-tertiary-bg/10 rounded-full blur-3xl -z-10" />

      <div className="max-w-2xl text-center space-y-8">
        {/* Icon Header */}
        <div className="flex justify-center mb-6">
          <div className="bg-secondary-bg/50 p-4 rounded-2xl border border-tertiary-text/30 shadow-xl ring-1 ring-secondary-text/10">
            <Layout size={48} className="text-tertiary-bg" />
          </div>
        </div>

        {/* Main Text */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-secondary-text">
            Welcome to Issues Tracker
          </h1>
          <p className="text-lg text-tertiary-text max-w-lg mx-auto leading-relaxed">
            Manage your projects efficiently. Select a space from the sidebar to start tracking issues, or create a new one to get started.
          </p>
        </div>

        {/* Feature Grid (Visual Filler) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-8 text-left">
          <FeatureCard 
            icon={<Layers size={20} className="text-tertiary-bg" />} 
            title="Organize" 
            desc="Group tasks by spaces" 
          />
          <FeatureCard 
            icon={<CheckCircle2 size={20} className="text-tertiary-bg" />} 
            title="Track" 
            desc="Monitor progress easily" 
          />
          <FeatureCard 
            icon={<BarChart3 size={20} className="text-tertiary-bg" />} 
            title="Analyze" 
            desc="Keep projects on time" 
          />
        </div>

        {/* Call to Action / Arrow */}
        <div className="pt-12 flex flex-col items-center gap-3 opacity-80">
          <p className="text-sm font-medium text-tertiary-text uppercase tracking-widest">
            Get Started
          </p>
          <Link href='/spaces' className="flex items-center gap-2 text-tertiary-bg hover:brightness-110 transition-all animate-pulse">
            <ArrowLeft size={20} />
            <span className="text-sm font-semibold">Open sidebar to select a space</span>
          </Link>
        </div>
      </div>
    </main>
  );
}

// Simple internal component for the 3 grid items
function FeatureCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="p-4 rounded-xl bg-secondary-bg/30 border border-tertiary-text/30 hover:bg-secondary-bg/50 transition-colors">
      <div className="mb-3">{icon}</div>
      <h3 className="font-semibold text-secondary-text">{title}</h3>
      <p className="text-sm text-tertiary-text">{desc}</p>
    </div>
  );
}

