import type { WheelEntry } from "@/types";
import { generateId } from "@/lib/utils";
import { WHEEL_COLORS } from "@/lib/constants";

export interface ParsedEntry {
  label: string;
  weight: number;
}

export function parseWheelInput(input: string): ParsedEntry[] {
  const lines = input.split("\n");
  const results: ParsedEntry[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const commaIndex = trimmed.indexOf(",");
    if (commaIndex === -1) {
      results.push({ label: trimmed, weight: 1 });
      continue;
    }

    const weightStr = trimmed.slice(0, commaIndex).trim();
    const label = trimmed.slice(commaIndex + 1).trim();

    if (!label) continue;

    const weight = parseFloat(weightStr);
    if (isNaN(weight) || weight <= 0) continue;

    results.push({ label, weight });
  }

  return results;
}

export function entriesToRawInput(entries: WheelEntry[]): string {
  return entries.map((e) => `${e.weight},${e.label}`).join("\n");
}

export function parsedToEntries(parsed: ParsedEntry[]): WheelEntry[] {
  return parsed.map((p, i) => ({
    id: generateId(),
    label: p.label,
    weight: p.weight,
    color: WHEEL_COLORS[i % WHEEL_COLORS.length],
  }));
}

export function sortEntriesByWeightDesc(entries: WheelEntry[]): WheelEntry[] {
  return [...entries].sort((a, b) => b.weight - a.weight);
}
