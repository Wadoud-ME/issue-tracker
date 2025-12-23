"use client";

import { X } from "lucide-react";
import { createClassification } from "@/app/actions";
import { useState, useEffect } from "react";
import { useDataStore } from "@/stores/useStore";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddClassificationModal = ({ isOpen, onClose }: ModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fetchClassifications = useDataStore(
    (state) => state.fetchClassifications
  );

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isSubmitting) onClose();
    };

    if (isOpen) {
      window.addEventListener("keydown", handleEscape);
    }

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose, isSubmitting]);

  // 1. Change the signature to handle the Event, not just FormData
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Stop the browser from reloading
    setIsSubmitting(true); // This will now force a re-render immediately

    const formData = new FormData(e.currentTarget); // Extract data manually

    try {
      const result = await createClassification(formData);
      if (result.success) {
        // Fetch FIRST, then close. This prevents a flicker of old data.
        await fetchClassifications(); 
        onClose();
      } else {
        alert(result.error || "Failed to create space");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={!isSubmitting ? handleBackdropClick : undefined}
    >
      <div className="w-full max-w-md bg-secondary-bg p-6 rounded-xl border border-tertiary-text/20 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-tertiary-bg">New Space</h2>
          <button
            aria-label="Close Modal"
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
            disabled={isSubmitting}
          >
            <X size={20} />
          </button>
        </div>

        {/* 2. Use onSubmit instead of action */}
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm text-gray-400 mb-2">Name</label>
            <input
              name="name"
              type="text"
              placeholder="e.g. Work, Study, Health"
              className="w-full p-3 rounded-lg bg-primary-bg text-white border border-tertiary-text/30 focus:border-tertiary-bg outline-none transition-colors disabled:opacity-50"
              required
              autoFocus
              disabled={isSubmitting}
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              aria-label="Close Modal"
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-white px-4 text-sm font-medium disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              aria-label="Submit"
              type="submit"
              className="bg-tertiary-bg text-primary-bg font-bold px-6 py-2 rounded-lg hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddClassificationModal;