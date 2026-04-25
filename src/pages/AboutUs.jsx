export default function AboutUs() {
  const timeline = [
    { year: '1996', title: 'The Spark', desc: 'Founded in a small garage in Bishkek by two childhood friends. The first ISAME shoe was stitched by hand.' },
    { year: '2003', title: 'First Collection', desc: '"Ground Zero" sold out in 72 hours across Central Asia. Critics called the silhouette "aggressively functional."' },
    { year: '2009', title: 'Going Global', desc: 'ISAME opened its first flagship outside Kyrgyzstan in Tokyo\'s Harajuku district. Queues stretched around the block.' },
    { year: '2015', title: 'Sustainability Pivot', desc: 'We signed the Planet Pledge — committing to 80% recycled materials by 2025.' },
    { year: '2020', title: 'Digital Era', desc: 'Launched the ISAME Community platform, connecting 2 million athletes and creators.' },
    { year: '2026', title: 'Now', desc: 'ISAME operates in 47 countries, employs 4,000 people, and remains obsessed with one question: what does movement feel like when it\'s truly yours?' },
  ]

  const values = [
    { icon: '⚡', title: 'Forward Motion', desc: 'We believe standing still is the only failure. Every product pushes someone one step further.' },
    { icon: '🌍', title: 'Radical Honesty', desc: 'No greenwashing. We publish our supply chain, carbon numbers, and failures alongside our wins.' },
    { icon: '🤝', title: 'Community First', desc: 'Athletes, artists, workers, wanderers — ISAME exists for everyone who puts one foot in front of the other.' },
  ]

  return (
    <div style={s.page}>
      <style>{`
        @media (max-width: 768px) {
          .about-hero { grid-template-columns: 1fr !important; padding: 48px 20px 40px !important; }
          .about-hero-visual { display: none !important; }
          .about-hero-title { font-size: clamp(36px, 10vw, 60px) !important; }
          .values-grid { grid-template-columns: 1fr !important; }
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .timeline-item { gap: 16px !important; }
          .timeline-left { min-width: 60px !important; }
        }
        @media (max-width: 480px) {
          .stats-grid { grid-template-columns: 1fr 1fr !important; }
          .quote-section { padding: 48px 20px !important; }
        }
      `}</style>

      {/* Hero */}
      <section className="about-hero" style={s.hero}>
        <div style={s.heroInner}>
          <p style={s.eyebrow}>Est. 1996 · Bishkek, Kyrgyzstan</p>
          <h1 className="about-hero-title" style={s.heroTitle}>
            We don't make shoes.<br />We make the next step possible.
          </h1>
          <p style={s.heroSub}>
            ISAME was born from a simple belief: that the right gear can change
            what a person thinks is possible.
          </p>
        </div>
        <div className="about-hero-visual" style={s.heroBg}>
          <span style={s.bgText}>ISAME</span>
        </div>
      </section>

      {/* Values */}
      <section style={s.valuesSection}>
        <div style={s.sectionInner}>
          <p style={s.sectionLabel}>What We Stand For</p>
          <h2 style={s.sectionTitle}>Three beliefs.<br />Everything else follows.</h2>
          <div className="values-grid" style={s.valuesGrid}>
            {values.map(v => (
              <div key={v.title} style={s.valueCard}>
                <div style={s.valueIcon}>{v.icon}</div>
                <h3 style={s.valueTitle}>{v.title}</h3>
                <p style={s.valueDesc}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section style={s.timelineSection}>
        <div style={s.sectionInner}>
          <p style={s.sectionLabel}>Our Story</p>
          <h2 style={s.sectionTitle}>Thirty years of<br />forward motion.</h2>
          <div>
            {timeline.map((item, i) => (
              <div key={item.year} className="timeline-item" style={s.timelineItem}>
                <div className="timeline-left" style={s.timelineLeft}>
                  <span style={s.timelineYear}>{item.year}</span>
                  {i < timeline.length - 1 && <div style={s.timelineLine} />}
                </div>
                <div style={s.timelineRight}>
                  <h3 style={s.timelineTitle}>{item.title}</h3>
                  <p style={s.timelineDesc}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="quote-section" style={s.quoteSection}>
        <div style={s.quoteInner}>
          <svg viewBox="0 0 100 40" width="40" height="16" fill="rgba(255,255,255,0.4)" style={{ marginBottom: 28 }}>
            <path d="M7.26,19.6C3.8,23.85,0,24.78,0,24.78c-.19.06.12-.24.12-.24L19.87,2.46A8.3,8.3,0,0,1,25.5.52a4.5,4.5,0,0,1,4.77,5c-.53,3.06-3.65,5.71-3.65,5.71L7.26,19.6Z"/>
          </svg>
          <blockquote style={s.quote}>
            "The athlete of tomorrow isn't someone with a trophy. It's everyone who laces up and decides today is the day."
          </blockquote>
          <p style={s.quoteAuthor}>— Aibek Dzhaksybekov, Co-Founder & CEO</p>
        </div>
      </section>

      {/* Stats */}
      <section style={s.statsSection}>
        <div className="stats-grid" style={s.statsGrid}>
          {[
            { num: '30+', label: 'Years of craftsmanship' },
            { num: '47', label: 'Countries worldwide' },
            { num: '4K', label: 'People on our team' },
            { num: '2M+', label: 'Community members' },
          ].map(st => (
            <div key={st.label} style={s.stat}>
              <span style={s.statNum}>{st.num}</span>
              <span style={s.statLabel}>{st.label}</span>
            </div>
          ))}
        </div>
      </section>

      <footer style={s.footer}>
        <p style={s.footerText}>© 2026 ISAME. All rights reserved. · Bishkek, Kyrgyzstan</p>
      </footer>
    </div>
  )
}

const s = {
  page: { minHeight: '100vh', backgroundColor: '#fff' },

  hero: { maxWidth: 1280, margin: '0 auto', padding: '80px 24px 60px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center', position: 'relative', overflow: 'hidden' },
  heroInner: { position: 'relative', zIndex: 1 },
  eyebrow: { fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#757575', marginBottom: 18 },
  heroTitle: { fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 900, lineHeight: 1.05, letterSpacing: '-0.03em', color: '#111', marginBottom: 22 },
  heroSub: { fontSize: 16, color: '#555', lineHeight: 1.7, maxWidth: 460 },
  heroBg: { position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 200 },
  bgText: { fontSize: 'clamp(60px, 10vw, 120px)', fontWeight: 900, color: 'rgba(0,0,0,0.04)', letterSpacing: '-0.05em', userSelect: 'none' },

  valuesSection: { backgroundColor: '#f9f9f9', padding: '64px 24px' },
  sectionInner: { maxWidth: 1100, margin: '0 auto' },
  sectionLabel: { fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#757575', marginBottom: 10 },
  sectionTitle: { fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 900, letterSpacing: '-0.02em', color: '#111', marginBottom: 40, lineHeight: 1.1 },
  valuesGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 },
  valueCard: { backgroundColor: '#fff', padding: '36px 28px', borderRadius: 14, border: '1px solid #e5e5e5' },
  valueIcon: { fontSize: 36, marginBottom: 18 },
  valueTitle: { fontSize: 18, fontWeight: 800, marginBottom: 10 },
  valueDesc: { fontSize: 14, color: '#666', lineHeight: 1.7 },

  timelineSection: { padding: '64px 24px', backgroundColor: '#fff' },
  timelineItem: { display: 'flex', gap: 28, marginBottom: 0 },
  timelineLeft: { display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 72 },
  timelineYear: { fontSize: 12, fontWeight: 800, color: '#111', backgroundColor: '#f0f0f0', padding: '4px 10px', borderRadius: 20, whiteSpace: 'nowrap' },
  timelineLine: { width: 2, flex: 1, backgroundColor: '#e5e5e5', margin: '8px 0', minHeight: 36 },
  timelineRight: { paddingBottom: 36 },
  timelineTitle: { fontSize: 18, fontWeight: 800, marginBottom: 6, marginTop: 2 },
  timelineDesc: { fontSize: 14, color: '#666', lineHeight: 1.7, maxWidth: 560 },

  quoteSection: { backgroundColor: '#111', padding: '72px 24px', textAlign: 'center' },
  quoteInner: { maxWidth: 680, margin: '0 auto' },
  quote: { fontSize: 'clamp(18px, 3vw, 28px)', fontWeight: 700, color: '#fff', lineHeight: 1.5, letterSpacing: '-0.01em', fontStyle: 'italic', marginBottom: 20 },
  quoteAuthor: { fontSize: 13, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.05em' },

  statsSection: { borderTop: '1px solid #e5e5e5', padding: '52px 24px' },
  statsGrid: { maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, textAlign: 'center' },
  stat: { display: 'flex', flexDirection: 'column', gap: 6 },
  statNum: { fontSize: 42, fontWeight: 900, letterSpacing: '-0.03em', color: '#111' },
  statLabel: { fontSize: 13, color: '#757575', fontWeight: 500 },

  footer: { padding: '28px 24px', textAlign: 'center', borderTop: '1px solid #e5e5e5' },
  footerText: { fontSize: 12, color: '#aaa', letterSpacing: '0.05em' },
}
