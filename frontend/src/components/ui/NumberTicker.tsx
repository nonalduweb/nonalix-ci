'use client';

import { useEffect, useRef, useState } from 'react';

interface Props {
  value: number;
  suffix?: string;
  duration?: number;
  className?: string;
}

export function NumberTicker({ value, suffix = '', duration = 2200, className = '' }: Props) {
  const [display, setDisplay] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStarted(true); obs.disconnect(); } },
      { threshold: 0.3 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 4); // ease-out quart
      setDisplay(Math.floor(eased * value));
      if (p < 1) requestAnimationFrame(tick);
      else setDisplay(value);
    };
    requestAnimationFrame(tick);
  }, [started, value, duration]);

  return (
    <span ref={ref} className={`number-ticker ${className}`}>
      {display}{suffix}
    </span>
  );
}
