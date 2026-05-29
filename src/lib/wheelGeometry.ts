import type { WheelEntry, SegmentGeometry, SpinResult } from "@/types";
import { weightedRandom } from "@/lib/weightedRandom";

const POINTER_ANGLE = -Math.PI / 2;

export function computeSegments(entries: WheelEntry[]): SegmentGeometry[] {
  const totalWeight = entries.reduce((sum, e) => sum + e.weight, 0);
  if (totalWeight <= 0) return [];

  let currentAngle = 0;
  return entries.map((entry) => {
    const sweep = (entry.weight / totalWeight) * Math.PI * 2;
    const segment: SegmentGeometry = {
      entry,
      startAngle: currentAngle,
      endAngle: currentAngle + sweep,
      midAngle: currentAngle + sweep / 2,
    };
    currentAngle += sweep;
    return segment;
  });
}

export function pickSpinResult(
  entries: WheelEntry[],
  currentRotation: number
): SpinResult | null {
  const winner = weightedRandom(entries);
  if (!winner) return null;

  const segments = computeSegments(entries);
  const segmentIndex = segments.findIndex((s) => s.entry.id === winner.id);
  if (segmentIndex === -1) return null;

  const segment = segments[segmentIndex];
  const fullSpins = 5 + Math.floor(Math.random() * 4);
  const midAngle = segment.midAngle;

  const normalizedCurrent = currentRotation % (Math.PI * 2);
  const targetMod = POINTER_ANGLE - midAngle;
  let delta = targetMod - normalizedCurrent;

  while (delta < Math.PI * 2) delta += Math.PI * 2;

  const targetRotation =
    currentRotation - normalizedCurrent + fullSpins * Math.PI * 2 + delta;

  return {
    entry: winner,
    targetRotation,
    segmentIndex,
  };
}

export function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export function getSegmentAtPointer(
  entries: WheelEntry[],
  rotation: number
): number {
  const segments = computeSegments(entries);
  const pointerInWheel = POINTER_ANGLE - rotation;
  const normalized =
    ((pointerInWheel % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);

  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    if (normalized >= seg.startAngle && normalized < seg.endAngle) {
      return i;
    }
  }
  return segments.length > 0 ? segments.length - 1 : -1;
}
