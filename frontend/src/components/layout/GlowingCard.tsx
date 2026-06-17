'use client';

import React, { MouseEvent, useRef, useState } from 'react';

interface GlowingCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export default function GlowingCard({
  children,
  className = '',
  onClick,
  style,
}: GlowingCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const card = cardRef.current;
    const rect = card.getBoundingClientRect();

    // Mouse coordinates relative to the card container
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setCoords({ x, y });

    // 3D Tilt calculation
    const width = rect.width;
    const height = rect.height;

    // Normalize coordinates to range [-0.5, 0.5]
    const normX = (x / width) - 0.5;
    const normY = (y / height) - 0.5;

    // Subtle 3D tilt (max 3 degrees) for a natural, tactile depth feel
    const rotateX = -normY * 3;
    const rotateY = normX * 3;

    setTilt({ rotateX, rotateY });
  };

  const handleMouseLeave = () => {
    // Reset tilt when cursor leaves the card area
    setTilt({ rotateX: 0, rotateY: 0 });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`glowing-card ${className}`}
      style={{
        ...style,
        // Custom CSS variables for hover glow gradient tracking
        // @ts-ignore
        '--mouse-x': `${coords.x}px`,
        // @ts-ignore
        '--mouse-y': `${coords.y}px`,
        transform: `${style?.transform || ''} perspective(1000px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`.trim(),
      }}
    >
      {children}
    </div>
  );
}
