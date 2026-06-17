import React from 'react';

interface Props {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  colorFrom?: string;
  colorTo?: string;
  duration?: number;
}

export function BorderBeam({
  children,
  className = '',
  style,
  colorFrom = 'var(--color-accent-glow)',
  colorTo = 'var(--color-highlight)',
  duration = 4,
}: Props) {
  return (
    <div
      className={`border-beam ${className}`}
      style={{
        '--beam-color-from': colorFrom,
        '--beam-color-to': colorTo,
        '--beam-duration': `${duration}s`,
        ...style,
      } as React.CSSProperties}
    >
      <span className="border-beam-track" aria-hidden="true" />
      <span className="border-beam-fill" aria-hidden="true" />
      <div className="border-beam-content">{children}</div>
    </div>
  );
}
