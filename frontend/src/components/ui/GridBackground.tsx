'use client';

import dynamic from 'next/dynamic';

const AnimatedGridPattern = dynamic(
  () => import('./AnimatedGridPattern').then((m) => ({ default: m.AnimatedGridPattern })),
  { ssr: false }
);

export function GridBackground() {
  return (
    <AnimatedGridPattern
      strokeColor="rgba(255,255,255,0.025)"
      fillColor="rgba(37,99,235,0.04)"
      cellSize={52}
      highlightChance={0.025}
      intervalMs={2200}
    />
  );
}
