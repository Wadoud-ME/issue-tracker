"use client";

import { Issue } from "@/types";
import { useDataStore } from "@/stores/useStore";
import { updateIssue, deleteIssue } from "@/app/actions";
// 1. New Imports for Toast & Time
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { 
  AlertCircle, 
  CheckCircle2, 
  Circle, 
  Signal, 
  Tag, 
  Trash2,
  ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface IssueRowProps {
  issue: Issue;
  spaceId: string;
}

export default function IssueRow({ issue, spaceId }: IssueRowProps) {
  const { updateIssueOptimistic, deleteIssueOptimistic, fetchIssues } = useDataStore();

  // --- HANDLERS ---
  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!confirm("Delete this issue?")) return;
    
    // Optimistic Delete
    deleteIssueOptimistic(issue.id);
    toast.success("Issue deleted"); // ✅ Success Toast

    const result = await deleteIssue(issue.id, spaceId);
    
    // Revert if server fails
    if (!result.success) { 
      toast.error("Failed to delete issue"); // 🔴 Error Toast
      fetchIssues(spaceId); 
    }
  };

  const handleUpdate = async (field: "status" | "priority", value: string) => {
    updateIssueOptimistic(issue.id, { [field]: value });
    
    const result = await updateIssue(issue.id, spaceId, { [field]: value });
    
    if (!result.success) {
      toast.error(`Failed to update ${field}`); // 🔴 Error Toast
      fetchIssues(spaceId);
    }
  };

  return (
    <div className="group grid grid-cols-12 gap-4 items-center px-4 py-4 border-b border-tertiary-text/10 hover:bg-secondary-bg/40 transition-colors">
      
      {/* 1. TITLE & ID & TIME */}
      <div className="col-span-6 flex items-start gap-3">
        <div className="mt-1">
          {getPriorityIcon(issue.priority)}
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-200 group-hover:text-blue-400 transition-colors">
            {issue.title}
          </h3>
          {/* ✅ Relative Time Added Here */}
          <div className="flex items-center gap-2 text-[10px] text-tertiary-text font-mono uppercase mt-0.5">
            <span>ID: {issue.id.slice(-6)}</span>
            <span className="w-0.5 h-0.5 bg-tertiary-text/50 rounded-full" />
            <span>{formatDistanceToNow(new Date(issue.createdAt), { addSuffix: true })}</span>
          </div>
        </div>
      </div>

      {/* 2. STATUS */}
      <div className="col-span-2 relative">
        <Dropdown
          value={issue.status}
          onChange={(val) => handleUpdate("status", val)}
          options={[
            { value: "todo", label: "To Do", icon: <Circle size={14} className="text-gray-400" /> },
            { value: "in_progress", label: "In Progress", icon: <div className="w-3.5 h-3.5 rounded-full border-2 border-blue-400 border-t-transparent animate-spin" /> },
            { value: "done", label: "Done", icon: <CheckCircle2 size={14} className="text-emerald-400" /> },
          ]}
          renderTrigger={(value) => <StatusBadge status={value} />}
        />
      </div>

      {/* 3. PRIORITY */}
      <div className="col-span-2 relative">
         <Dropdown
          value={issue.priority}
          onChange={(val) => handleUpdate("priority", val)}
          options={[
            { value: "low", label: "Low", icon: <Signal size={14} className="text-gray-500" /> },
            { value: "medium", label: "Medium", icon: <Signal size={14} className="text-yellow-400" /> },
            { value: "high", label: "High", icon: <AlertCircle size={14} className="text-orange-400" /> },
            { value: "critical", label: "Critical", icon: <AlertCircle size={14} className="text-red-400" /> },
          ]}
          renderTrigger={(value) => <PriorityBadge priority={value} />}
        />
      </div>

      {/* 4. CATEGORY & DELETE */}
      <div className="col-span-2 flex items-center justify-between">
        <span className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-tertiary-text capitalize">
          <Tag size={10} />
          {issue.label}
        </span>
        
        <button 
            onClick={handleDelete}
            className="p-1.5 text-tertiary-text hover:text-red-400 hover:bg-red-400/10 rounded-md opacity-0 group-hover:opacity-100 transition-all cursor-pointer z-10"
            title="Delete Issue"
        >
            <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}

// ... Dropdown, StatusBadge, PriorityBadge, getPriorityIcon stay EXACTLY the same as before ...
// (I didn't repeat them to save space, but keep them in the file!)

// ==========================================
// 🎨 NEW COMPONENT: CUSTOM STYLED DROPDOWN
// ==========================================

interface DropdownProps {
  value: string;
  options: { value: string; label: string; icon?: React.ReactNode }[];
  onChange: (value: string) => void;
  renderTrigger: (value: string) => React.ReactNode;
}

function Dropdown({ value, options, onChange, renderTrigger }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      {/* 1. The Badge (Click to toggle) */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="outline-none focus:ring-2 focus:ring-blue-500/50 rounded-md"
      >
        {renderTrigger(value)}
      </button>

      {/* 2. Backdrop (Click anywhere else to close) */}
      {isOpen && (
        <div className="fixed inset-0 z-40 cursor-default" onClick={() => setIsOpen(false)} />
      )}

      {/* 3. The Menu (Visible only when open) */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-48 bg-[#1E2028] border border-white/10 rounded-xl shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-100 overflow-hidden flex flex-col p-1.5">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={cn(
                "flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors text-left",
                value === option.value 
                  ? "bg-blue-600/10 text-blue-400" 
                  : "text-gray-300 hover:bg-white/5 hover:text-white"
              )}
            >
              {option.icon && <span className="shrink-0">{option.icon}</span>}
              <span>{option.label}</span>
              {value === option.value && <CheckCircle2 size={12} className="ml-auto opacity-50" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// --- HELPER VISUALS (Updated to look better as triggers) ---

function StatusBadge({ status }: { status: string }) {
  const content = (() => {
    if (status === "done") return { color: "text-emerald-400", icon: <CheckCircle2 size={14} />, label: "Done" };
    if (status === "in_progress") return { color: "text-blue-400", icon: <div className="w-3.5 h-3.5 rounded-full border-2 border-blue-400 border-t-transparent animate-spin" />, label: "In Progress" };
    return { color: "text-gray-400", icon: <Circle size={14} />, label: "To Do" };
  })();

  return (
    <div className={cn("flex items-center gap-2 text-xs min-w-25 px-2 py-1.5 rounded hover:bg-white/5 transition-colors cursor-pointer select-none", content.color)}>
      {content.icon}
      <span className="font-medium">{content.label}</span>
      <ChevronDown size={10} className="ml-auto opacity-30" />
    </div>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  const styles: Record<string, string> = {
    critical: "bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20",
    high: "bg-orange-500/10 text-orange-400 border-orange-500/20 hover:bg-orange-500/20",
    medium: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20 hover:bg-yellow-500/20",
    low: "bg-gray-500/10 text-gray-400 border-gray-500/20 hover:bg-gray-500/20",
  };

  return (
    <div className={cn("px-2.5 py-1 rounded text-[10px] font-medium border uppercase tracking-wide min-w-20 text-center cursor-pointer transition-all select-none flex items-center justify-center gap-2", styles[priority] || styles.low)}>
      <span>{priority}</span>
    </div>
  );
}

function getPriorityIcon(priority: string) {
  if (priority === "critical" || priority === "high") return <AlertCircle size={16} className="text-red-400" />;
  if (priority === "medium") return <Signal size={16} className="text-yellow-400" />;
  return <Signal size={16} className="text-gray-500" />;
}