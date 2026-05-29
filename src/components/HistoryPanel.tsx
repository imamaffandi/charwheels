"use client";

import { History, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWheelStore } from "@/store/wheelStore";

export function HistoryPanel() {
  const { history, clearHistory } = useWheelStore();

  if (history.length === 0) return null;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <History className="h-4 w-4 text-indigo-400" />
          Roll History
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={clearHistory}>
          <Trash2 className="h-3.5 w-3.5" />
          Clear
        </Button>
      </CardHeader>
      <CardContent className="max-h-48 overflow-y-auto space-y-2">
        {history.map((roll) => (
          <div
            key={roll.id}
            className="rounded-lg bg-white/5 px-3 py-2 text-xs border border-white/5"
          >
            <span className="text-white/40 block mb-1">
              {new Date(roll.timestamp).toLocaleString()}
            </span>
            <div className="flex flex-wrap gap-x-3 gap-y-0.5">
              {roll.results.map((r) => (
                <span key={`${roll.id}-${r.wheelId}`} className="text-white/80">
                  <span className="text-white/50">{r.wheelTitle}:</span>{" "}
                  {r.entry.label}
                </span>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
