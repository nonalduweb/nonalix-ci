'use client';

import { useEffect, useRef } from 'react';

interface Props {
  color?: string;
  quantity?: number;
  speed?: number;
  size?: number;
  opacity?: number;
}

export function Particles({
  color = '#ffffff',
  quantity = 80,
  speed = 0.35,
  size = 1.4,
  opacity = 0.22,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf: number;
    type P = { x: number; y: number; vx: number; vy: number; r: number; a: number };
    let pts: P[] = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    const spawn = () => {
      resize();
      pts = [];
      const n = Math.max(20, Math.floor((canvas.width * canvas.height) / 14000) * (quantity / 60));
      for (let i = 0; i < n; i++) {
        pts.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * speed,
          vy: (Math.random() - 0.5) * speed,
          r: Math.random() * size + 0.4,
          a: Math.random() * opacity + 0.04,
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of pts) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = p.a;
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    };

    spawn();
    draw();
    window.addEventListener('resize', spawn);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', spawn);
    };
  }, [color, quantity, speed, size, opacity]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
    />
  );
}
