'use client'

import { useUIStore, useDataStore } from "@/stores/useStore";
import { useEffect } from "react";
import Link from "next/link";
import { FolderOpen, Plus, ArrowRight, Sparkles } from "lucide-react";

const SpacesPage = () => {
  const { setNavOpened, setIsModalOpen } = useUIStore();
  const { classifications, classificationsLoading, fetchClassifications } = useDataStore();

  useEffect(() => {
    setNavOpened(false);
    // 2. ALWAYS fetch fresh data when mounting this page
    // This ensures the "_count" is updated after you come back from an issue page
    fetchClassifications();
  }, [setNavOpened, fetchClassifications]);

  return (
    <div className="min-h-dvh w-full bg-primary-bg text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-8 py-12">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-bold bg-linear-to-r from-white to-gray-400 bg-clip-text text-transparent">
              My Spaces
            </h1>
            <p className="text-secondary-text mt-2">Select a space to manage your issues</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            aria-label="Create Space"
            className="flex items-center gap-2 bg-tertiary-bg hover:brightness-110 text-primary-bg px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-tertiary-bg/20 transition-all duration-300 active:scale-95"
          >
            <Plus size={20} strokeWidth={2.5} />
            Create Space
          </button>
        </div>

        {/* Content States */}
        {classificationsLoading ? (
          // Loading Skeleton with Stagger Animation
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div 
                key={i} 
                className="h-48 bg-secondary-bg/50 rounded-2xl animate-pulse border border-tertiary-text/20"
                style={{ animationDelay: `${i * 100}ms` }}
              />
            ))}
          </div>
        ) : classifications.length === 0 ? (
          // Empty State with Better Visual Hierarchy
          <div className="flex flex-col items-center justify-center py-24 px-6 border-2 border-dashed border-tertiary-text/30 rounded-3xl bg-secondary-bg/20 backdrop-blur-sm">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-tertiary-bg/20 blur-3xl rounded-full" />
              <FolderOpen size={64} className="relative text-tertiary-bg" strokeWidth={1.5} />
            </div>
            <h3 className="text-2xl font-bold text-secondary-text mb-2">No spaces yet</h3>
            <p className="text-tertiary-text text-center max-w-md mb-8">
              Create your first space to start organizing and tracking your issues
            </p>
            <button 
              onClick={() => setIsModalOpen(true)}
              aria-label="Create First Space"
              className="flex items-center gap-2 bg-tertiary-bg hover:brightness-110 text-primary-bg px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-tertiary-bg/50 transition-all duration-300 active:scale-95"
            >
              <Sparkles size={20} />
              Create Your First Space
            </button>
          </div>
        ) : (
          // Grid of Spaces with Enhanced Hover Effects
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {classifications.map((space, index) => (
              <Link 
                key={space.id} 
                href={`/spaces/${space.id}`}
                className="group relative p-6 bg-secondary-bg/50 border border-tertiary-text/20 rounded-2xl hover:bg-secondary-bg hover:border-tertiary-bg/50 transition-all duration-300 flex flex-col justify-between h-48 overflow-hidden"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Gradient Overlay on Hover */}
                <div className="absolute inset-0 bg-linear-to-br from-tertiary-bg/0 to-tertiary-bg/0 group-hover:from-tertiary-bg/5 group-hover:to-tertiary-bg/20 transition-all duration-500 rounded-2xl" />
                
                {/* Top Section */}
                <div className="relative flex items-start justify-between">
                  <div className="p-3 bg-tertiary-bg/10 rounded-xl text-tertiary-bg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                    <FolderOpen size={28} strokeWidth={2} />
                  </div>
                  {/* Badge - Placeholder for future issue count */}
                  <div className="px-3 py-1 bg-primary-bg/50 rounded-full text-xs font-medium text-secondary-text opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {space._count?.issues || 0} issues
                  </div>
                </div>
                
                {/* Bottom Section */}
                <div className="relative flex items-end justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-secondary-text group-hover:text-tertiary-bg transition-colors duration-300 mb-1 truncate">
                      {space.name}
                    </h3>
                    <p className="text-sm text-tertiary-text group-hover:text-secondary-text transition-colors duration-300">
                      View board
                    </p>
                  </div>
                  <ArrowRight 
                    size={24} 
                    className="text-tertiary-text group-hover:text-tertiary-bg translate-x-0 group-hover:translate-x-1 transition-all duration-300" 
                    strokeWidth={2.5}
                  />
                </div>

                {/* Shine Effect on Hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-800">
                  <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SpacesPage;