"use client";

import { 
  Cookie, 
  Plus, 
  TextAlignJustify, 
  Moon, // ✅ Import Icon
  Sun   // ✅ Import Icon
} from "lucide-react";
import { useEffect, useState } from "react"; // ✅ Import useState
import { cn } from "../../lib/utils";
import AddClassificationModal from "./AddClassificationModal";
import { deleteClassification } from "../../app/actions";
import { useTheme } from "next-themes"; // ✅ Import Theme Hook

import { SidebarList } from "./SidebarList";
import { FloatingToggle } from "./FloatingToggle";
import { useDataStore, useUIStore } from "@/stores/useStore";
import Link from "next/link";

const Navbar = () => {
  // 1. UI STORE
  const { navOpened, toggleNav, isModalOpen, setIsModalOpen } = useUIStore();
  
  // 2. THEME SETUP
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by waiting for mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // 3. DATA STORE
  const {
    classifications,
    classificationsLoading,
    classificationsError,
    fetchClassifications,
    setOptimisticClassifications,
  } = useDataStore();

  // --- DELETE HANDLER ---
  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this space?")) return;

    try {
      setOptimisticClassifications(
        classifications.filter((item) => item.id !== id)
      );
      const result = await deleteClassification(id);
      if (!result.success) throw new Error("Failed");
    } catch (err) {
      alert(`Could not delete item.${err}`);
      fetchClassifications();
    }
  };

  // --- DATA FETCHER ---
  useEffect(() => {
    fetchClassifications();
  }, [fetchClassifications]);

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 bottom-0 left-0 bg-primary-bg overflow-hidden shadow-2xl transition-all duration-500 ease-in-out whitespace-nowrap z-50",
          navOpened ? "w-90" : "w-0"
        )}
      >
        <div className="min-w-90 h-full flex flex-col">
          {/* --- HEADER --- */}
          <div className="flex items-center justify-between py-6 px-5 bg-secondary-bg border-b border-tertiary-text/30">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="bg-tertiary-bg p-2 rounded-lg shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Cookie size={24} className="text-primary-bg" />
              </div>
              <h1 className="text-2xl font-bold text-tertiary-bg">
                Issues Tracker
              </h1>
            </Link>
            <button
              onClick={toggleNav}
              className="p-2 rounded-lg hover:bg-primary-bg/50 transition-all duration-200 active:scale-95 cursor-pointer"
            >
              <TextAlignJustify size={24} className="text-gray-300" />
            </button>
          </div>

          {/* --- ADD BUTTON --- */}
          <div className="flex items-center justify-between pt-4 pb-5 px-6 border-b border-tertiary-text">
            <Link href="/spaces" className="text-xl text-secondary-text font-medium relative group cursor-pointer">
              My Spaces
              <span className="absolute -bottom-[1.35rem] left-0 w-0 h-2 rounded-t-lg bg-tertiary-bg group-hover:w-full transition-all duration-300 z-10"></span>
            </Link>
            <span className="h-12 w-0.5 mr-2 bg-tertiary-text/50 rounded-full"></span>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 font-bold bg-secondary-bg hover:bg-tertiary-bg text-secondary-text hover:text-primary-bg py-2 px-4 text-sm rounded-lg shadow-lg hover:shadow-tertiary-bg/50 transition-all duration-300 active:scale-95 cursor-pointer"
            >
              <Plus size={18} strokeWidth={3} />
              <span>Add Space</span>
            </button>
          </div>

          {/* --- DYNAMIC LIST AREA --- */}
          <div className="p-4 flex-1 overflow-y-auto custom-scrollbar">
            <SidebarList
              classifications={classifications}
              isLoading={classificationsLoading}
              error={classificationsError}
              onRetry={fetchClassifications}
              onDelete={handleDelete}
            />
          </div>

          {/* --- FOOTER (THEME TOGGLE) --- */}
          {/* mt-auto pushes this to the bottom, justify-end pushes button to right */}
          <div className="p-4 border-t border-tertiary-text/20 bg-secondary-bg/50 mt-auto flex justify-end items-center">
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="flex items-center gap-2 p-2 rounded-lg text-tertiary-text hover:text-white hover:bg-white/10 transition-all duration-300 active:scale-95"
                title="Toggle Theme"
              >
                <span className="text-xs font-medium uppercase tracking-wider hover:opacity-100 transition-opacity">
                    {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                </span>
                {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            )}
          </div>

        </div>
      </nav>

      <FloatingToggle key={navOpened ? "closed" : 'opened'} navOpened={navOpened} toggleNav={toggleNav} />
      <AddClassificationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default Navbar;