import { useApp } from '../components/AppContext'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'

export default function Dashboard() {
  const { visibleProducts, user, favorites, isAdmin, products } = useApp()
  const [animate, setAnimate] = useState(false)

  useEffect(() => { const t = setTimeout(() => setAnimate(true), 80); return () => clearTimeout(t) }, [])

  if (!user) {
    return (
      <div style={s.locked}>
        <div style={s.lockIcon}>🔒</div>
        <h2 style={s.lockTitle}>Sign in to view Dashboard</h2>
        <Link to="/login" style={s.btnDark}>Sign In</Link>
      </div>
    )
  }

  const myProducts = products.filter(p => p.userId && String(p.userId) === String(user.id))
  const totalValue = myProducts.reduce((sum, p) => sum + Number(p.price || 0), 0)
  const allUsers = JSON.parse(localStorage.getItem('nikeUsers') || '[]')

  const catCounts = {}
  visibleProducts.forEach(p => { const c = p.category || 'Other'; catCounts[c] = (catCounts[c] || 0) + 1 })
  const catEntries = Object.entries(catCounts).sort((a, b) => b[1] - a[1])
  const maxCat = catEntries[0]?.[1] || 1

  const priceRanges = [
    { label: '<$25', count: visibleProducts.filter(p => Number(p.price) < 25).length },
    { label: '$25–50', count: visibleProducts.filter(p => Number(p.price) >= 25 && Number(p.price) < 50).length },
    { label: '$50–100', count: visibleProducts.filter(p => Number(p.price) >= 50 && Number(p.price) < 100).length },
    { label: '$100+', count: visibleProducts.filter(p => Number(p.price) >= 100).length },
  ]
  const maxPrice = Math.max(...priceRanges.map(r => r.count), 1)

  const stats = [
    { label: 'Products', value: visibleProducts.length, icon: '📦', link: '/items' },
    { label: 'My Items', value: myProducts.length, icon: '✏️', link: '/profile' },
    { label: 'Favorites', value: favorites.length, icon: '♥', link: '/favorites' },
    { label: 'Portfolio', value: `$${totalValue.toFixed(0)}`, icon: '💰' },
    ...(isAdmin ? [
      { label: 'Users', value: allUsers.length, icon: '👥', link: '/admin' },
      { label: 'All Items', value: products.length, icon: '🗄️' },
    ] : []),
  ]

  return (
    <div style={s.page}>
      <style>{`
        @media (max-width: 768px) {
          .dash-header { flex-direction: column !important; align-items: flex-start !important; }
          .dash-stats { grid-template-columns: repeat(2, 1fr) !important; }
          .dash-charts { grid-template-columns: 1fr !important; }
          .dash-recent { grid-template-columns: repeat(2, 1fr) !important; }
          .dash-quick { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 480px) {
          .dash-page { padding: 20px 14px 40px !important; }
          .dash-stats { grid-template-columns: repeat(2, 1fr) !important; gap: 10px !important; }
          .dash-recent { grid-template-columns: 1fr 1fr !important; }
          .dash-quick { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>

      <div className="dash-page" style={s.inner}>
        {/* Header */}
        <div className="dash-header" style={s.header}>
          <div>
            <p style={s.eyebrow}>Dashboard</p>
            <h1 style={s.title}>Welcome, {user.name.split(' ')[0]}.</h1>
            {isAdmin && <span style={s.adminChip}>⚡ Admin</span>}
          </div>
          <div style={s.headerBtns}>
            <Link to="/items/create" style={s.btnDark}>+ New Product</Link>
            <Link to="/items" style={s.btnOutline}>Browse All</Link>
          </div>
        </div>

        {/* Stats */}
        <div className="dash-stats" style={s.statsGrid}>
          {stats.map((st, i) => (
            <div key={st.label} style={{ ...s.statCard, opacity: animate ? 1 : 0, transform: animate ? 'none' : 'translateY(16px)', transition: `opacity 0.35s ease ${i * 0.06}s, transform 0.35s ease ${i * 0.06}s` }}>
              <div style={s.statIcon}>{st.icon}</div>
              <div style={s.statValue}>{st.value}</div>
              <div style={s.statLabel}>{st.label}</div>
              {st.link && <Link to={st.link} style={s.statLink}>View →</Link>}
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="dash-charts" style={s.chartsRow}>
          {/* Category bars */}
          <div style={s.chartCard}>
            <h2 style={s.chartTitle}>By Category</h2>
            <p style={s.chartSub}>{visibleProducts.length} products</p>
            {catEntries.length === 0
              ? <p style={s.noData}>No products yet</p>
              : catEntries.map(([cat, count]) => (
                <div key={cat} style={s.barRow}>
                  <span style={s.barLabel}>{cat}</span>
                  <div style={s.barTrack}>
                    <div style={{ ...s.barFill, width: animate ? `${(count / maxCat) * 100}%` : '0%', transition: 'width 0.8s cubic-bezier(.4,0,.2,1)' }} />
                  </div>
                  <span style={s.barNum}>{count}</span>
                </div>
              ))
            }
          </div>

          {/* Price chart */}
          <div style={s.chartCard}>
            <h2 style={s.chartTitle}>Price Distribution</h2>
            <p style={s.chartSub}>Range breakdown</p>
            <div style={s.priceChart}>
              {priceRanges.map((r, i) => (
                <div key={r.label} style={s.priceCol}>
                  <span style={s.priceCount}>{r.count}</span>
                  <div style={s.priceBarWrap}>
                    <div style={{ ...s.priceBar, height: animate ? `${(r.count / maxPrice) * 120}px` : '0px', backgroundColor: ['#111','#333','#555','#888'][i], transition: `height 0.7s cubic-bezier(.4,0,.2,1) ${i * 0.1}s` }} />
                  </div>
                  <span style={s.priceLabel}>{r.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent products */}
        <div style={s.recentCard}>
          <div style={s.recentHeader}>
            <div>
              <h2 style={s.chartTitle}>Recent Products</h2>
              <p style={s.chartSub}>Latest additions</p>
            </div>
            <Link to="/items" style={s.viewAll}>View all →</Link>
          </div>
          {visibleProducts.length === 0
            ? <div style={s.emptyBox}><p style={{ color: '#aaa', marginBottom: 12 }}>No products yet.</p><Link to="/items/create" style={s.btnDark}>Create First</Link></div>
            : (
              <div className="dash-recent" style={s.recentGrid}>
                {visibleProducts.slice(0, 4).map((p, i) => (
                  <Link key={p.id} to={`/items/${p.id}`} style={{ ...s.recentItem, opacity: animate ? 1 : 0, transition: `opacity 0.35s ease ${0.3 + i * 0.07}s` }}>
                    <div style={{ ...s.recentImg, backgroundColor: p.color || '#f5f5f5' }}>
                      {p.image ? <img src={p.image} alt={p.title} style={s.rImg} /> : <svg viewBox="0 0 100 40" width="40" height="16" fill="rgba(0,0,0,0.1)"><path d="M7.26,19.6C3.8,23.85,0,24.78,0,24.78c-.19.06.12-.24.12-.24L19.87,2.46A8.3,8.3,0,0,1,25.5.52a4.5,4.5,0,0,1,4.77,5c-.53,3.06-3.65,5.71-3.65,5.71L7.26,19.6Z"/></svg>}
                    </div>
                    <div style={s.recentBody}>
                      <span style={s.rCat}>{p.category}</span>
                      <p style={s.rTitle}>{p.title}</p>
                      <p style={s.rPrice}>${p.price}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )
          }
        </div>

        {/* Quick links */}
        <div className="dash-quick" style={s.quickGrid}>
          {[
            { label: '+ Create Product', to: '/items/create', desc: 'Add new item' },
            { label: '♥ Favorites', to: '/favorites', desc: `${favorites.length} saved` },
            { label: '👤 Profile', to: '/profile', desc: 'Manage account' },
            { label: '🛍 Browse', to: '/items', desc: 'All products' },
          ].map(l => (
            <Link key={l.to} to={l.to} style={s.quickLink}>
              <span style={s.quickLabel}>{l.label}</span>
              <span style={s.quickDesc}>{l.desc}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

const s = {
  page: { minHeight: 'calc(100vh - 60px)', backgroundColor: '#f9f9f9' },
  inner: { maxWidth: 1200, margin: '0 auto', padding: '32px 16px 48px' },
  locked: { textAlign: 'center', padding: '100px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 },
  lockIcon: { fontSize: 52 },
  lockTitle: { fontSize: 24, fontWeight: 900, marginBottom: 8 },
  btnDark: { display: 'inline-block', backgroundColor: '#111', color: '#fff', padding: '12px 26px', borderRadius: 30, fontWeight: 700, fontSize: 13, textDecoration: 'none', border: 'none', cursor: 'pointer' },
  btnOutline: { display: 'inline-block', backgroundColor: '#fff', color: '#111', padding: '11px 26px', borderRadius: 30, fontWeight: 700, fontSize: 13, textDecoration: 'none', border: '2px solid #111' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28, gap: 16 },
  eyebrow: { fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#757575', marginBottom: 6 },
  title: { fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: 900, letterSpacing: '-0.02em', marginBottom: 6 },
  adminChip: { display: 'inline-block', backgroundColor: '#fff8e1', color: '#f57f17', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, border: '1px solid #ffe082' },
  headerBtns: { display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', flexShrink: 0 },

  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 14, marginBottom: 24 },
  statCard: { backgroundColor: '#fff', border: '1px solid #e5e5e5', borderRadius: 14, padding: '22px 18px' },
  statIcon: { fontSize: 24, marginBottom: 10 },
  statValue: { fontSize: 28, fontWeight: 900, letterSpacing: '-0.02em', color: '#111', marginBottom: 2 },
  statLabel: { fontSize: 12, fontWeight: 700, color: '#555', marginBottom: 4 },
  statLink: { display: 'inline-block', fontSize: 11, fontWeight: 700, color: '#111', textDecoration: 'none', borderBottom: '1px solid #111' },

  chartsRow: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginBottom: 24 },
  chartCard: { backgroundColor: '#fff', border: '1px solid #e5e5e5', borderRadius: 14, padding: '24px 20px' },
  chartTitle: { fontSize: 16, fontWeight: 800, marginBottom: 2 },
  chartSub: { fontSize: 12, color: '#aaa', marginBottom: 20 },
  noData: { color: '#aaa', fontSize: 13, textAlign: 'center', padding: '16px 0' },
  barRow: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 },
  barLabel: { fontSize: 12, fontWeight: 600, color: '#555', minWidth: 72, textAlign: 'right' },
  barTrack: { flex: 1, height: 8, backgroundColor: '#f0f0f0', borderRadius: 4, overflow: 'hidden' },
  barFill: { height: '100%', backgroundColor: '#111', borderRadius: 4 },
  barNum: { fontSize: 12, fontWeight: 700, minWidth: 20, textAlign: 'right' },
  priceChart: { display: 'flex', gap: 16, alignItems: 'flex-end', height: 180, paddingTop: 16 },
  priceCol: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 },
  priceBarWrap: { width: '100%', display: 'flex', alignItems: 'flex-end', height: 120 },
  priceBar: { width: '100%', borderRadius: '4px 4px 0 0', minHeight: 4 },
  priceCount: { fontSize: 13, fontWeight: 800 },
  priceLabel: { fontSize: 10, fontWeight: 600, color: '#757575', textAlign: 'center' },

  recentCard: { backgroundColor: '#fff', border: '1px solid #e5e5e5', borderRadius: 14, padding: '24px 20px', marginBottom: 24 },
  recentHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  viewAll: { fontSize: 13, fontWeight: 700, color: '#111', textDecoration: 'none' },
  emptyBox: { textAlign: 'center', padding: '32px 0' },
  recentGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 14 },
  recentItem: { borderRadius: 10, overflow: 'hidden', border: '1px solid #e5e5e5', textDecoration: 'none', color: 'inherit', display: 'block' },
  recentImg: { height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  rImg: { maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' },
  recentBody: { padding: '10px 12px' },
  rCat: { fontSize: 9, fontWeight: 700, textTransform: 'uppercase', color: '#aaa', display: 'block', marginBottom: 3 },
  rTitle: { fontSize: 12, fontWeight: 700, marginBottom: 4, color: '#111', overflow: 'hidden', maxHeight: 32 },
  rPrice: { fontSize: 13, fontWeight: 800 },

  quickGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 },
  quickLink: { backgroundColor: '#fff', border: '1px solid #e5e5e5', borderRadius: 12, padding: '18px 20px', textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', gap: 3 },
  quickLabel: { fontSize: 14, fontWeight: 800, color: '#111' },
  quickDesc: { fontSize: 12, color: '#757575' },
}
