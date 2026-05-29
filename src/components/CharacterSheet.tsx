"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Scroll } from "lucide-react";
import type { Wheel } from "@/types";

interface CharacterSheetProps {
  wheels: Wheel[];
  visible: boolean;
}

export function CharacterSheet({ wheels, visible }: CharacterSheetProps) {
  const results = wheels.filter((w) => w.result);

  if (results.length === 0) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10 }}
          className="rounded-2xl border border-indigo-500/30 bg-indigo-500/10 backdrop-blur-xl p-6 shadow-2xl shadow-indigo-500/10"
        >
          <div className="flex items-center gap-2 mb-4">
            <Scroll className="h-5 w-5 text-indigo-400" />
            <h2 className="text-lg font-bold text-white">Character Sheet</h2>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((wheel) => (
              <div
                key={wheel.id}
                className="flex items-baseline gap-2 rounded-lg bg-white/5 px-3 py-2"
              >
                <span className="text-sm text-white/50 shrink-0">
                  {wheel.title}:
                </span>
                <span className="text-sm font-semibold text-indigo-200">
                  {wheel.result?.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
