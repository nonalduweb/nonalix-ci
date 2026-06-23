const testimonials = [
  {
    text: "Grâce à l'agent IA de NONALIX, nous avons généré +147% de leads qualifiés en seulement 60 jours. Notre équipe commerciale ne perd plus de temps sur les prospects non qualifiés — l'IA fait le tri automatiquement.",
    name: 'Kouadio Yao',
    role: 'Directeur Commercial, TechPlus Abidjan',
    initials: 'KY',
  },
  {
    text: "Les workflows automatisés ont libéré 25 heures par semaine pour notre équipe. Relances clients, facturation, suivi de commandes — tout tourne en pilote automatique. On se concentre enfin sur la stratégie.",
    name: 'Aminata Diallo',
    role: 'CEO, DigiServices CI',
    initials: 'AD',
  },
  {
    text: "Notre chatbot WhatsApp génère 35% de nos ventes sans aucune intervention humaine. Les clients commandent, paient et reçoivent leur confirmation directement dans la conversation. Révolutionnaire.",
    name: 'Jean-Marc Bamba',
    role: 'Fondateur, AfriShop',
    initials: 'JB',
  },
];

export function Testimonials() {
  return (
    <section className="section" id="testimonials-section" style={{ background: 'var(--color-surface)' }}>
      <div className="container">
        <div className="section-header">
          <span className="badge badge-success">Témoignages</span>
          <h2 style={{ marginTop: 'var(--space-md)' }}>
            Ils nous font <span className="text-gradient">confiance</span>
          </h2>
          <p>
            Découvrez comment nos clients transforment leur business
            grâce à nos solutions digitales et IA.
          </p>
        </div>

        <div className="testimonials-scroll">
          {testimonials.map((testimonial) => (
            <div key={testimonial.name} className="testimonial-card card">
              <p className="testimonial-text">
                &ldquo;{testimonial.text}&rdquo;
              </p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">{testimonial.initials}</div>
                <div>
                  <div className="testimonial-name">{testimonial.name}</div>
                  <div className="testimonial-role">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
