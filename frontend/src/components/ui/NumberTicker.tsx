'use client';

import { useEffect, useRef, useState } from 'react';

interface Props {
  value: number;
  suffix?: string;
  duration?: number;
  className?: string;
}

export function NumberTicker({ value, suffix = '', duration = 2200, className = '' }: Props) {
  // Toujours afficher la valeur finale par défaut (rendu serveur + avant exécution du JS) :
  // un visiteur sur connexion lente ou un moteur de recherche ne doit jamais voir "0".
  const [display, setDisplay] = useState(value);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Si l'élément est déjà visible au montage (au-dessus de la ligne de flottaison), on ne
    // rejoue pas l'animation de comptage pour éviter un flash valeur -> 0 -> valeur.
    const rect = el.getBoundingClientRect();
    const alreadyVisible = rect.top < window.innerHeight && rect.bottom > 0;
    if (alreadyVisible) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        obs.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 4); // ease-out quart
          setDisplay(Math.floor(eased * value));
          if (p < 1) requestAnimationFrame(tick);
          else setDisplay(value);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [value, duration]);

  return (
    <span ref={ref} className={`number-ticker ${className}`}>
      {display}{suffix}
    </span>
  );
}
