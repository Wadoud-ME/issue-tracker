"use client";

import { cn } from "@/lib/utils";
import { useDataStore, useUIStore } from "@/stores/useStore";
import { useParams } from "next/navigation";
import React, { useEffect, useState, useMemo } from "react"; // ✅ Added useState, useMemo
import {
  Filter,
  Plus,
  Search,
  Loader2,
  XCircle, // ✅ Added Icons
  Check, // ✅ Added Icons
} from "lucide-react";
import CreateIssueModal from "@/components/issue/CreateIssueModal";
import IssueRow from "@/components/issue/IssueRow";

export default function IssuesPage() {
  const params = useParams();
  const spaceId = params?.id as string;

  // --- 1. STATE FOR FILTERS ---
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { navOpened, setIsIssueModalOpen } = useUIStore();
  const { classifications, issues, issuesLoading, fetchIssues } =
    useDataStore();

  useEffect(() => {
    if (spaceId) fetchIssues(spaceId);
  }, [spaceId, fetchIssues]);

  const currentSpace = classifications.find((c) => c.id === spaceId);

  // --- 2. FILTERING LOGIC ---
  const filteredIssues = useMemo(() => {
    return issues.filter((issue) => {
      // Search Logic (Title or ID)
      const matchesSearch =
        issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.id.toLowerCase().includes(searchQuery.toLowerCase());

      // Status Logic
      const matchesStatus =
        statusFilter === "all" ? true : issue.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [issues, searchQuery, statusFilter]);

  return (
    <>
      <main
        className={cn(
          "min-h-screen bg-primary-bg text-secondary-text transition-all duration-500 ease-in-out",
          navOpened ? "ml-90" : "ml-0"
        )}
      >
        <div className="p-8 max-w-6xl mx-auto">
          {/* --- HEADER --- */}
          <header className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 text-tertiary-text text-sm mb-1">
                <span>Space</span>
                <span>/</span>
                <span>{spaceId}</span>
              </div>
              <h1 className="text-3xl font-bold text-white">
                {currentSpace ? currentSpace.name : "Loading..."}
              </h1>
            </div>
            <button
              onClick={() => setIsIssueModalOpen(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium shadow-lg shadow-blue-500/20 transition-all active:scale-95"
            >
              <Plus size={18} />
              <span>New Issue</span>
            </button>
          </header>

          {/* --- FILTERS BAR --- */}
          <div className="flex items-center justify-between gap-4 mb-6 bg-secondary-bg/30 p-2 rounded-xl border border-tertiary-text/10">
            <div className="flex items-center gap-2 flex-1">
              {/* SEARCH INPUT */}
              <div className="relative group flex-1 max-w-md">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-tertiary-text group-hover:text-white transition-colors"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Search issues by title or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)} // ✅ CONNECTED
                  className="w-full bg-transparent border-none outline-none text-sm text-white pl-10 py-2 placeholder:text-tertiary-text/50"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-tertiary-text hover:text-white"
                  >
                    <XCircle size={14} />
                  </button>
                )}
              </div>

              <div className="h-6 w-px bg-tertiary-text/20 mx-2" />

              {/* FILTER DROPDOWN */}
              <div className="relative">
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors border",
                    statusFilter !== "all"
                      ? "bg-blue-500/10 border-blue-500/50 text-blue-400"
                      : "border-transparent text-tertiary-text hover:text-white hover:bg-white/5"
                  )}
                >
                  <Filter size={14} />
                  {statusFilter === "all"
                    ? "Filter"
                    : formatStatus(statusFilter)}
                </button>

                {/* The Filter Menu */}
                {isFilterOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setIsFilterOpen(false)}
                    />
                    <div className="absolute top-full left-0 mt-2 w-48 bg-[#1E2028] border border-white/10 rounded-xl shadow-2xl z-20 overflow-hidden flex flex-col p-1.5 animate-in fade-in zoom-in-95 duration-100">
                      <div className="px-2 py-1.5 text-[10px] font-semibold text-tertiary-text uppercase tracking-wider">
                        Filter by Status
                      </div>

                      {["all", "todo", "in_progress", "done"].map((status) => (
                        <button
                          key={status}
                          onClick={() => {
                            setStatusFilter(status);
                            setIsFilterOpen(false);
                          }}
                          className={cn(
                            "flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors text-left capitalize",
                            statusFilter === status
                              ? "bg-blue-600/10 text-blue-400"
                              : "text-gray-300 hover:bg-white/5 hover:text-white"
                          )}
                        >
                          {formatStatus(status)}
                          {statusFilter === status && <Check size={14} />}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* RESULTS COUNT */}
            <div className="text-xs text-tertiary-text px-4">
              {filteredIssues.length} result{filteredIssues.length !== 1 && "s"}
            </div>
          </div>

          {/* --- TABLE HEADER --- */}
          <div className="grid grid-cols-12 gap-4 px-4 py-3 border-b border-tertiary-text/20 text-xs font-semibold text-tertiary-text uppercase tracking-wider">
            <div className="col-span-6">Issue</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Priority</div>
            <div className="col-span-2">Category</div>
          </div>

          {/* --- ISSUES LIST CONTENT --- */}
          <div className="flex flex-col">
            {issuesLoading ? (
              <div className="py-20 flex justify-center text-blue-400">
                <Loader2 className="animate-spin" size={32} />
              </div>
            ) : filteredIssues.length === 0 ? (
              <div className="py-20 text-center text-tertiary-text border-b border-tertiary-text/10">
                {searchQuery || statusFilter !== "all" ? (
                  <p>No issues match your filters.</p>
                ) : (
                  <p>No issues found. Create one to get started.</p>
                )}
              </div>
            ) : (
              // ✅ Iterate over filteredIssues, NOT issues
              filteredIssues.map((issue) => (
                <IssueRow key={issue.id} issue={issue} spaceId={spaceId} />
              ))
            )}
          </div>
        </div>
      </main>

      <CreateIssueModal />
    </>
  );
}

function formatStatus(status: string) {
  if (status === "all") return "All Issues";
  return status.replace("_", " ");
}
