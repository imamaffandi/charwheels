export interface WeightedItem {
  weight: number;
}

export function weightedRandom<T extends WeightedItem>(items: T[]): T | null {
  if (items.length === 0) return null;

  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
  if (totalWeight <= 0) return null;

  let random = Math.random() * totalWeight;

  for (const item of items) {
    random -= item.weight;
    if (random < 0) return item;
  }

  return items[items.length - 1] ?? null;
}

export function calculateProbabilities<T extends WeightedItem & { label: string }>(
  items: T[]
): { label: string; weight: number; probability: number }[] {
  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
  if (totalWeight <= 0) return [];

  return items.map((item) => ({
    label: item.label,
    weight: item.weight,
    probability: (item.weight / totalWeight) * 100,
  }));
}
