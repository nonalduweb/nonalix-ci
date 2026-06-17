'use client';

import { NumberTicker } from '@/components/ui/NumberTicker';

const stats = [
  { value: 17, suffix: '', label: 'Entreprises accompagnées' },
  { value: 85, suffix: '%', label: "Taux d'automatisation" },
  { value: 200, suffix: 'K', label: 'Interactions IA / mois' },
  { value: 24, suffix: '/7', label: 'Disponibilité chatbot' },
];

export function StatsCounter() {
  return (
    <section className="section" id="stats-section">
      <div className="container">
        <div className="stats-grid">
          {stats.map((stat) => (
            <div key={stat.label} className="stat-card card">
              <div className="stat-number">
                <NumberTicker value={stat.value} suffix={stat.suffix} />
              </div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
