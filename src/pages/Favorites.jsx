import { Link } from 'react-router-dom'
import { useApp } from '../components/AppContext'

const CATEGORY_COLORS = ['#f5f5f5', '#fff3e0', '#e8f5e9', '#fce4ec', '#e3f2fd']

export default function Favorites() {
  const { visibleProducts, favorites, toggleFavorite } = useApp()
  const favProducts = visibleProducts.filter(p => favorites.includes(String(p.id)))

  return (
    <div style={s.page}>
      <style>{`
        @media (max-width: 600px) {
          .fav-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 12px !important; }
        }
        @media (max-width: 380px) {
          .fav-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div style={s.inner}>
        <div style={s.header}>
          <h1 style={s.title}>My Favorites</h1>
          <p style={s.subtitle}>{favProducts.length} saved item{favProducts.length !== 1 ? 's' : ''}</p>
        </div>

        {favProducts.length === 0 ? (
          <div style={s.empty}>
            <div style={s.emptyHeart}>♥</div>
            <h2 style={s.emptyTitle}>Nothing saved yet</h2>
            <p style={s.emptyText}>Tap the heart on any product to save it here.</p>
            <Link to="/items" style={s.btnDark}>Browse Products</Link>
          </div>
        ) : (
          <div className="fav-grid" style={s.grid}>
            {favProducts.map((product, i) => (
              <div key={product.id} style={s.cardWrap}>
                <button
                  style={s.favBtn}
                  onClick={() => toggleFavorite(product.id)}
                  title="Remove from favorites"
                  aria-label="Remove from favorites"
                >
                  ♥
                </button>
                <Link to={`/items/${product.id}`} style={s.card}>
                  <div style={{ ...s.cardImage, backgroundColor: product.color || CATEGORY_COLORS[i % 5] }}>
                    {product.image
                      ? <img src={product.image} alt={product.title} style={s.img} />
                      : <svg viewBox="0 0 100 40" width="64" height="26" fill="rgba(0,0,0,0.1)"><path d="M7.26,19.6C3.8,23.85,0,24.78,0,24.78c-.19.06.12-.24.12-.24L19.87,2.46A8.3,8.3,0,0,1,25.5.52a4.5,4.5,0,0,1,4.77,5c-.53,3.06-3.65,5.71-3.65,5.71L7.26,19.6Z"/></svg>
                    }
                  </div>
                  <div style={s.cardBody}>
                    <span style={s.cardCat}>{product.category || 'Lifestyle'}</span>
                    <h3 style={s.cardTitle}>{product.title}</h3>
                    <div style={s.cardFooter}>
                      <span style={s.cardPrice}>${product.price}</span>
                      <span style={{ color: '#aaa', fontSize: 16 }}>→</span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const s = {
  page: { backgroundColor: '#fff', minHeight: 'calc(100vh - 60px)' },
  inner: { maxWidth: 1200, margin: '0 auto', padding: '32px 16px 48px' },
  header: { marginBottom: 28 },
  title: { fontSize: 28, fontWeight: 900, letterSpacing: '-0.02em' },
  subtitle: { fontSize: 13, color: '#757575', marginTop: 4 },
  empty: { textAlign: 'center', padding: '60px 24px' },
  emptyHeart: { fontSize: 56, color: '#e5e5e5', marginBottom: 16 },
  emptyTitle: { fontSize: 22, fontWeight: 800, marginBottom: 8 },
  emptyText: { color: '#757575', marginBottom: 28, fontSize: 15 },
  btnDark: { display: 'inline-block', backgroundColor: '#111', color: '#fff', padding: '13px 32px', borderRadius: 30, fontWeight: 700, fontSize: 14, textDecoration: 'none' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 },
  cardWrap: { position: 'relative' },
  favBtn: {
    position: 'absolute', top: 10, right: 10, zIndex: 2,
    background: 'white', border: 'none', borderRadius: '50%',
    width: 34, height: 34, fontSize: 17, cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.12)', color: '#e53935', transition: 'transform 0.15s',
  },
  card: { textDecoration: 'none', color: 'inherit', border: '1px solid #e5e5e5', borderRadius: 12, overflow: 'hidden', display: 'block' },
  cardImage: { height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 },
  img: { maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' },
  cardBody: { padding: '14px 16px 16px' },
  cardCat: { fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: '#757575', marginBottom: 6, display: 'block' },
  cardTitle: { fontSize: 14, fontWeight: 700, margin: '0 0 12px', lineHeight: 1.3, minHeight: 36 },
  cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  cardPrice: { fontSize: 16, fontWeight: 800 },
}
