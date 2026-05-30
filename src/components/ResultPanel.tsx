"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Trophy } from "lucide-react";
import type { WheelEntry } from "@/types";

interface ResultPanelProps {
  result?: WheelEntry;
  title?: string;
}

export function ResultPanel({ result, title }: ResultPanelProps) {
  return (
    <AnimatePresence mode="wait">
      {result ? (
        <motion.div
          key={result.id}
          initial={{ opacity: 0, scale: 0.9, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="flex items-center gap-2 rounded-xl bg-accent/10 border border-accent/30 px-3 py-2"
        >
          <Trophy className="h-4 w-4 text-accent shrink-0" />
          <div className="min-w-0">
            {title && (
              <span className="text-xs text-foreground/50 block">{title}</span>
            )}
            <span className="text-sm font-semibold text-accent truncate block">
              {result.label}
            </span>
          </div>
        </motion.div>
      ) : (
        <motion.p
          key="empty"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-foreground/30 italic text-center py-2"
        >
          Spin to reveal result
        </motion.p>
      )}
    </AnimatePresence>
  );
}
