import React from 'react';

interface Props {
  children: React.ReactNode;
  className?: string;
}

export function AnimatedGradientText({ children, className = '' }: Props) {
  return (
    <span className={`animated-gradient-text ${className}`}>
      {children}
    </span>
  );
}
