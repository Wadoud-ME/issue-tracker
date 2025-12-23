import { Classification, Issue } from "@/types";
import { create } from "zustand";
import { getClassifications, getIssues } from "../app/actions";

//! STORE 01: UI (Visuals)
type UIStore = {
  navOpened: boolean;
  isModalOpen: boolean;
  isIssueModalOpen: boolean;

  toggleNav: () => void;
  setNavOpened: (value: boolean) => void;
  setIsModalOpen: (value: boolean) => void;
  setIsIssueModalOpen: (value: boolean) => void;
};

export const useUIStore = create<UIStore>((set) => ({
  navOpened: false,
  isModalOpen: false,
  isIssueModalOpen: false,

  toggleNav: () => set((state) => ({ navOpened: !state.navOpened })),
  setNavOpened: (value) => set({ navOpened: value }),
  setIsModalOpen: (value) => set({ isModalOpen: value }),
  setIsIssueModalOpen: (value) => set({ isIssueModalOpen: value }),
}));

//! STORE 02: DATA (Business Logic)
export type DataStore = {
  // --- NAMESPACED: CLASSIFICATIONS ---
  classifications: Classification[];
  classificationsLoading: boolean; // Renamed for safety
  classificationsError: string | null; // Renamed for safety

  fetchClassifications: () => Promise<void>;
  setOptimisticClassifications: (items: Classification[]) => void;

  // --- NAMESPACED: ISSUES ---
  issues: Issue[];
  issuesLoading: boolean;
  fetchIssues: (spaceId: string) => Promise<void>;
  deleteIssueOptimistic: (issueId: string) => void;
  updateIssueOptimistic: (issueId: string, updates: Partial<Issue>) => void;
};

export const useDataStore = create<DataStore>((set) => ({
  classifications: [],
  classificationsLoading: false,
  classificationsError: null,

  setOptimisticClassifications: (items) => set({ classifications: items }),

  fetchClassifications: async () => {
    // We explicitly touch only the classification flags
    set({ classificationsLoading: true, classificationsError: null });
    try {
      const data = await getClassifications();
      set({ classifications: data, classificationsLoading: false });
    } catch (err) {
      console.error(err);
      set({
        classificationsError: "Failed to load spaces.",
        classificationsLoading: false,
      });
    }
  },

  // --- NEW ISSUE LOGIC ---
  issues: [],
  issuesLoading: false,

  fetchIssues: async (spaceId) => {
    set({ issuesLoading: true, issues: [] });
    try {
      const data = await getIssues(spaceId);
      set({ issues: data as Issue[], issuesLoading: false });
    } catch (err) {
      console.error(err);
      set({ issuesLoading: false });
    }
  },

  deleteIssueOptimistic: (issueId) => {
    set((state) => ({
      issues: state.issues.filter((issue) => issue.id !== issueId)
    }))
  },

  updateIssueOptimistic: (issueId, updates) => {
    set((state) => ({
      issues: state.issues.map((issue) => 
        issue.id === issueId ? { ...issue, ...updates } : issue
      ),
    }))
  },
}));
