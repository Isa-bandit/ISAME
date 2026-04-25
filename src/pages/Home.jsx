import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div style={s.page}>
      <style>{`
        @media (max-width: 768px) {
          .hero-grid { flex-direction: column !important; min-height: unset !important; padding: 48px 20px 40px !important; }
          .hero-visual { display: none !important; }
          .hero-title { font-size: 64px !important; }
          .features-grid { grid-template-columns: 1fr !important; }
          .stats-grid { grid-template-columns: 1fr 1fr !important; }
          .banner-title { font-size: 36px !important; }
        }
        @media (max-width: 480px) {
          .hero-title { font-size: 52px !important; }
          .hero-actions { flex-direction: column !important; }
          .hero-actions a { text-align: center; }
        }
      `}</style>

      {/* Hero */}
      <section className="hero-grid" style={s.hero}>
        <div style={s.heroContent}>
          <p style={s.eyebrow}>New Collection 2026</p>
          <h1 className="hero-title" style={s.heroTitle}>
            MAKE<br />DREAMS<br />COME TRUE.
          </h1>
          <p style={s.heroSub}>
            Discover the latest drops. Built for athletes. Made for everyone.
          </p>
          <div className="hero-actions" style={s.heroActions}>
            <Link to="/items" style={s.btnPrimary}>Shop Now</Link>
            <Link to="/items/create" style={s.btnSecondary}>Create Item</Link>
          </div>
        </div>
        <div className="hero-visual" style={s.heroVisual}>
          <div style={s.heroCircle} />
          <svg style={s.bigSwoosh} viewBox="0 0 300 120" fill="none">
            <path d="M20 90C60 30 160 -10 280 20C200 60 100 80 20 90Z" fill="rgba(0,0,0,0.08)"/>
          </svg>
          <span style={s.heroNumber}>2026</span>
        </div>
      </section>

      {/* Features */}
      <section>
        <div className="features-grid" style={s.features}>
          {[
            { icon: '⚡', title: 'Performance', desc: 'Engineered for peak athletic output.' },
            { icon: '🎨', title: 'Style', desc: 'Bold design meets everyday versatility.' },
            { icon: '♻️', title: 'Sustainable', desc: 'Built with the planet in mind.' },
          ].map(({ icon, title, desc }) => (
            <div key={title} style={s.featureCard}>
              <div style={s.featureIcon}>{icon}</div>
              <h3 style={s.featureTitle}>{title}</h3>
              <p style={s.featureDesc}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section style={s.statsSection}>
        <div className="stats-grid" style={s.statsGrid}>
          {[
            { num: '30+', label: 'Years crafting' },
            { num: '47', label: 'Countries' },
            { num: '4K', label: 'Team members' },
            { num: '2M+', label: 'Community' },
          ].map(s2 => (
            <div key={s2.label} style={s.stat}>
              <span style={s.statNum}>{s2.num}</span>
              <span style={s.statLabel}>{s2.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section style={s.banner}>
        <div style={s.bannerInner}>
          <h2 className="banner-title" style={s.bannerTitle}>Don't Miss Out.</h2>
          <p style={s.bannerSub}>New arrivals drop every week. Be first in line.</p>
          <Link to="/register" style={s.btnWhite}>Join ISAME</Link>
        </div>
      </section>

      <footer style={s.footer}>
        <p style={s.footerText}>© 2026 ISAME. All rights reserved.</p>
      </footer>
    </div>
  )
}

const s = {
  page: { minHeight: '100vh', backgroundColor: '#fff' },
  hero: {
    maxWidth: 1280, margin: '0 auto', padding: '80px 24px',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    minHeight: 'calc(100vh - 60px)', gap: 40,
  },
  heroContent: { flex: 1, maxWidth: 560 },
  eyebrow: { fontSize: 12, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#757575', marginBottom: 16 },
  heroTitle: { fontSize: 'clamp(64px, 10vw, 140px)', fontWeight: 900, lineHeight: 0.9, letterSpacing: '-0.03em', color: '#111', marginBottom: 24 },
  heroSub: { fontSize: 17, color: '#555', lineHeight: 1.6, marginBottom: 36, maxWidth: 420 },
  heroActions: { display: 'flex', gap: 14, flexWrap: 'wrap' },
  btnPrimary: {
    display: 'inline-block', backgroundColor: '#111', color: '#fff',
    fontSize: 14, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
    padding: '15px 36px', borderRadius: 30, textDecoration: 'none',
  },
  btnSecondary: {
    display: 'inline-block', backgroundColor: 'transparent', color: '#111',
    fontSize: 14, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
    padding: '13px 36px', borderRadius: 30, border: '2px solid #111', textDecoration: 'none',
  },
  heroVisual: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', minHeight: 400 },
  heroCircle: { width: 380, height: 380, borderRadius: '50%', backgroundColor: '#f5f5f5', position: 'absolute' },
  bigSwoosh: { width: 320, height: 130, position: 'relative', zIndex: 1 },
  heroNumber: { position: 'absolute', bottom: 20, right: 20, fontSize: 100, fontWeight: 900, color: 'rgba(0,0,0,0.04)', letterSpacing: '-0.05em', userSelect: 'none' },

  features: {
    display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 1, backgroundColor: '#e5e5e5', borderTop: '1px solid #e5e5e5',
  },
  featureCard: { backgroundColor: '#fff', padding: '48px 32px', textAlign: 'center' },
  featureIcon: { fontSize: 36, marginBottom: 16 },
  featureTitle: { fontSize: 18, fontWeight: 800, marginBottom: 8 },
  featureDesc: { fontSize: 14, color: '#757575', lineHeight: 1.6 },

  statsSection: { borderTop: '1px solid #e5e5e5', padding: '48px 24px' },
  statsGrid: { maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, textAlign: 'center' },
  stat: { display: 'flex', flexDirection: 'column', gap: 6 },
  statNum: { fontSize: 44, fontWeight: 900, letterSpacing: '-0.03em', color: '#111' },
  statLabel: { fontSize: 13, color: '#757575', fontWeight: 500 },

  banner: { backgroundColor: '#111', color: '#fff', padding: '72px 24px', textAlign: 'center' },
  bannerInner: { maxWidth: 640, margin: '0 auto' },
  bannerTitle: { fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: 900, letterSpacing: '-0.02em', marginBottom: 14 },
  bannerSub: { fontSize: 16, color: 'rgba(255,255,255,0.65)', marginBottom: 32, lineHeight: 1.6 },
  btnWhite: {
    display: 'inline-block', backgroundColor: '#fff', color: '#111',
    fontSize: 14, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
    padding: '15px 44px', borderRadius: 30, textDecoration: 'none',
  },
  footer: { padding: '28px 24px', textAlign: 'center', borderTop: '1px solid #e5e5e5' },
  footerText: { fontSize: 12, color: '#aaa', letterSpacing: '0.05em' },
}
