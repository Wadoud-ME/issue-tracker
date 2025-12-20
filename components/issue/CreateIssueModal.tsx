"use client";

import { useUIStore, useDataStore } from "@/stores/useStore";
import { createIssue } from "@/app/actions";
import { X, Loader2, AlertCircle, Tag } from "lucide-react";
import { useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner"; // ✅ Import Toast

export default function CreateIssueModal() {
  const { isIssueModalOpen, setIsIssueModalOpen } = useUIStore();
  const { fetchIssues } = useDataStore();
  const params = useParams();
  const spaceId = params?.id as string;

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    formData.append("spaceId", spaceId);

    const result = await createIssue(formData);

    if (result.success) {
      await fetchIssues(spaceId); 
      setIsIssueModalOpen(false);
      toast.success("Issue created successfully!"); // ✅ Success Toast
    } else {
      toast.error("Error creating issue"); // 🔴 Error Toast
    }
    setIsLoading(false);
  };

  if (!isIssueModalOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-secondary-bg border border-tertiary-text/20 rounded-2xl shadow-2xl p-6 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">New Issue</h2>
          <button 
            onClick={() => setIsIssueModalOpen(false)}
            className="text-tertiary-text hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form action={handleSubmit} className="space-y-4">
          
          {/* Title Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-tertiary-text uppercase tracking-wider">Title</label>
            <input 
              name="title"
              required
              placeholder="e.g., Fix navigation bug"
              className="w-full bg-primary-bg border border-tertiary-text/30 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Priority Select */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-xs font-semibold text-tertiary-text uppercase tracking-wider">
                <AlertCircle size={12} /> Priority
              </label>
              <select 
                name="priority"
                className="w-full bg-primary-bg border border-tertiary-text/30 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-blue-500 appearance-none cursor-pointer"
              >
                <option value="medium">Medium</option>
                <option value="low">Low</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            {/* Label Select */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-xs font-semibold text-tertiary-text uppercase tracking-wider">
                <Tag size={12} /> Label
              </label>
              <select 
                name="label"
                className="w-full bg-primary-bg border border-tertiary-text/30 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-blue-500 appearance-none cursor-pointer"
              >
                <option value="feature">Feature</option>
                <option value="bug">Bug</option>
                <option value="improvement">Improvement</option>
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 rounded-lg shadow-lg shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 className="animate-spin" size={18} /> : "Create Issue"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}