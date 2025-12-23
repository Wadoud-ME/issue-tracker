"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { FolderOpen, Trash2, Loader2, AlertCircle } from "lucide-react";

type Classification = { id: string; name: string };

interface SidebarListProps {
  classifications: Classification[];
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
}

export const SidebarList = ({
  classifications,
  isLoading,
  error,
  onRetry,
  onDelete,
}: SidebarListProps) => {
  const params = useParams();
  const currentId = params?.id as string;

  // 1. LOADING STATE
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-gray-500 animate-pulse">
        <Loader2 size={24} className="animate-spin mb-2" />
        <p className="text-xs">Syncing spaces...</p>
      </div>
    );
  }

  // 2. ERROR STATE
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-red-400 text-center px-4 bg-red-500/10 rounded-lg border border-red-500/20">
        <AlertCircle size={24} className="mb-2" />
        <p className="text-sm font-medium">{error}</p>
        <button
          aria-label="Try agaom"
          onClick={onRetry}
          className="mt-3 text-xs underline hover:text-red-300"
        >
          Retry
        </button>
      </div>
    );
  }

  // 3. EMPTY STATE
  if (classifications.length === 0) {
    return (
      <div className="text-center mt-10 opacity-50">
        <p className="text-base text-gray-400">No spaces yet.</p>
        <p className="text-sm text-gray-500">
          Click &quot;Add Space&quot; to start.
        </p>
      </div>
    );
  }
  // 4. LIST STATE
  return (
    <div className="flex flex-col gap-2">
      {classifications.map((item) => {
        // 3. Check if this item is the active one
        const isActive = currentId === item.id;

        return (
          <div key={item.id} className="relative group">
            {/* 4. WRAP IN LINK - Navigate to the URL */}
            <Link
              href={`/spaces/${item.id}`} // <--- This changes the URL
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg transition-all duration-200",
                isActive
                  ? "bg-secondary-bg/40 text-white shadow-md" // Active Style
                  : "text-gray-400 hover:text-white hover:bg-white/5" // Inactive Style
              )}
            >
              <div className="flex items-center gap-3 flex-1 overflow-hidden">
                <FolderOpen
                  size={20}
                  className={cn(
                    "transition-transform",
                    isActive
                      ? "text-yellow-300"
                      : "text-tertiary-bg group-hover:scale-110"
                  )}
                />
                <span className="font-medium tracking-wide truncate">
                  {item.name}
                </span>
              </div>
            </Link>

            {/* Delete Button (Keep this outside the Link so clicking it doesn't navigate) */}
            <button
              aria-label="Delete Space"
              onClick={(e) => onDelete(item.id, e)}
              className="absolute right-2 top-2 p-2 rounded-md text-gray-200 hover:bg-red-500/20 hover:text-red-400 opacity-100 md:opacity-0 group-hover:opacity-100 transition-all"
            >
              <Trash2 size={18} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
