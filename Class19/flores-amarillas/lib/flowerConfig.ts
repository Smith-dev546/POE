export type FlowerSize = "sm" | "md" | "lg";

export interface FlowerSpec {
  id: string;
  size: FlowerSize;
  delay: number;
  sway: number;
  rotation: number;
  scale: number;
}

export function createGarden(count = 9): FlowerSpec[] {
  const sizes: FlowerSize[] = ["md", "lg", "sm"];

  return Array.from({ length: count }, (_, i) => {
    const seed = i + 1;
    return {
      id: `flower-${seed}`,
      size: sizes[i % sizes.length],
      delay: (seed % 5) * 0.25,
      sway: 3 + (seed % 4) * 0.6,
      rotation: ((seed * 37) % 20) - 10,
      scale: 0.85 + ((seed * 13) % 30) / 100,
    };
  });
}