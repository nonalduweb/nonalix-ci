'use client';

import { useEffect, useId, useState } from 'react';

interface Props {
  className?: string;
  cellSize?: number;
  strokeColor?: string;
  fillColor?: string;
  highlightChance?: number;
  intervalMs?: number;
}

export function AnimatedGridPattern({
  className = '',
  cellSize = 44,
  strokeColor = 'rgba(255,255,255,0.03)',
  fillColor = 'rgba(231, 173, 5, 0.05)',
  highlightChance = 0.035,
  intervalMs = 1800,
}: Props) {
  const id = useId();
  const [dims, setDims] = useState({ w: 0, h: 0 });
  const [highlighted, setHighlighted] = useState<Set<number>>(new Set());

  useEffect(() => {
    const update = () => setDims({ w: window.innerWidth, h: window.innerHeight });
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  useEffect(() => {
    if (!dims.w) return;
    const cols = Math.ceil(dims.w / cellSize) + 1;
    const rows = Math.ceil(dims.h / cellSize) + 1;
    const total = cols * rows;

    const tick = () => {
      const next = new Set<number>();
      for (let i = 0; i < total; i++) {
        if (Math.random() < highlightChance) next.add(i);
      }
      setHighlighted(next);
    };

    tick();
    const iv = setInterval(tick, intervalMs);
    return () => clearInterval(iv);
  }, [dims, cellSize, highlightChance, intervalMs]);

  if (!dims.w) return null;

  const cols = Math.ceil(dims.w / cellSize) + 1;
  const rows = Math.ceil(dims.h / cellSize) + 1;

  return (
    <div
      className={`animated-grid-pattern ${className}`}
      aria-hidden="true"
    >
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id={`grid-${id}`} x="0" y="0" width={cellSize} height={cellSize} patternUnits="userSpaceOnUse">
            <path
              d={`M ${cellSize} 0 L 0 0 0 ${cellSize}`}
              fill="none"
              stroke={strokeColor}
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#grid-${id})`} />
        {Array.from(highlighted).map((idx) => {
          const col = idx % cols;
          const row = Math.floor(idx / cols);
          return (
            <rect
              key={idx}
              x={col * cellSize}
              y={row * cellSize}
              width={cellSize}
              height={cellSize}
              fill={fillColor}
              className="grid-cell-flash"
            />
          );
        })}
      </svg>
    </div>
  );
}
