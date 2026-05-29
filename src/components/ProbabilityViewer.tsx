"use client";

import { calculateProbabilities } from "@/lib/weightedRandom";
import type { WheelEntry } from "@/types";

interface ProbabilityViewerProps {
  entries: WheelEntry[];
}

export function ProbabilityViewer({ entries }: ProbabilityViewerProps) {
  const probabilities = calculateProbabilities(entries);

  if (probabilities.length === 0) {
    return (
      <p className="text-xs text-white/40 italic">No entries to analyze</p>
    );
  }

  return (
    <div className="space-y-1.5" aria-label="Probability distribution">
      {probabilities.map((item) => (
        <div key={item.label} className="space-y-0.5">
          <div className="flex justify-between text-xs">
            <span className="text-white/80 truncate mr-2">{item.label}</span>
            <span className="text-indigo-300 font-mono shrink-0">
              {item.probability.toFixed(1)}%
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
              style={{ width: `${item.probability}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
