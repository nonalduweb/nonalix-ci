const testimonials = [
  {
    text: "NONALIX CI a transformé notre approche commerciale. Grâce à leur chatbot IA, nous répondons à nos clients 24h/24 et nos ventes ont augmenté de 40% en 3 mois.",
    name: 'Kouadio Yao',
    role: 'Directeur Commercial, TechPlus Abidjan',
    initials: 'KY',
  },
  {
    text: "L'automatisation mise en place par NONALIX nous a permis de réduire nos tâches administratives de 60%. Notre équipe se concentre désormais sur ce qui compte vraiment.",
    name: 'Aminata Diallo',
    role: 'CEO, DigiServices CI',
    initials: 'AD',
  },
  {
    text: "Notre boutique en ligne avec paiement Orange Money a été livrée en 2 semaines. Le résultat est professionnel et nos clients adorent la simplicité du processus d'achat.",
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
          <span className="badge badge-success">⭐ Témoignages</span>
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
