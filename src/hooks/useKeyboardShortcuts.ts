"use client";

import { useEffect, useCallback } from "react";
import { useWheelStore } from "@/store/wheelStore";

interface UseKeyboardShortcutsOptions {
  onSpinSelected: () => void;
  onSpinAll: () => void;
}

export function useKeyboardShortcuts({
  onSpinSelected,
  onSpinAll,
}: UseKeyboardShortcutsOptions) {
  const { addWheel, manualSave, selectedWheelId } = useWheelStore();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;

      if (e.ctrlKey && e.key === "s") {
        e.preventDefault();
        manualSave();
        return;
      }

      if (e.ctrlKey && e.key === "n") {
        e.preventDefault();
        addWheel();
        return;
      }

      if (e.key === " " && !isInput) {
        e.preventDefault();
        if (e.shiftKey) {
          onSpinAll();
        } else if (selectedWheelId) {
          onSpinSelected();
        }
      }
    },
    [addWheel, manualSave, onSpinSelected, onSpinAll, selectedWheelId]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
}

export function useWindowSize() {
  const getSize = useCallback(() => {
    if (typeof window === "undefined") return { width: 800, height: 600 };
    return { width: window.innerWidth, height: window.innerHeight };
  }, []);

  return getSize();
}
