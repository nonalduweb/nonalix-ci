'use client';

import dynamic from 'next/dynamic';

const AnimatedGridPattern = dynamic(
  () => import('./AnimatedGridPattern').then((m) => ({ default: m.AnimatedGridPattern })),
  { ssr: false }
);

export function GridBackground() {
  return null;
}
