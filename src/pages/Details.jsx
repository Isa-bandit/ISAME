import { useParams, useNavigate, Link } from 'react-router-dom'
import { useApp } from '../components/AppContext'

export default function Details() {
  const { id } = useParams()
  const { visibleProducts, deleteProduct, user, isAdmin, toggleFavorite, isFavorite, loadingProducts } = useApp()
  const navigate = useNavigate()

  const product = visibleProducts.find(p => String(p.id) === String(id))

  if (loadingProducts) {
  return (
    <div style={s.notFound}>
      <div style={{ width: 32, height: 32, border: '3px solid #f0f0f0', borderTop: '3px solid #111', borderRadius: '50%', animation: 'spin 0.8s linear infinite', marginBottom: 12 }} />
      <p style={{ color: '#757575' }}>Loading…</p>
    </div>
  )
}


  if (!product) {
    return (
      <div style={s.notFound}>
        <p style={{ color: '#757575', marginBottom: 16 }}>Product not found</p>
        <Link to="/items" style={s.backLink}>← Return to Products</Link>
      </div>
    )
  }

  const isOwner = user && product.userId && String(product.userId) === String(user.id)
  const canEdit = isAdmin || isOwner || !product.userId

  const handleDelete = () => {
    if (window.confirm(`Delete "${product.title}"? This cannot be undone.`)) {
      deleteProduct(id)
      navigate('/items')
    }
  }

  return (
    <div style={s.page}>
      <style>{`
        @media (max-width: 640px) {
          .details-card { padding: 24px 20px !important; }
          .details-top { flex-direction: column !important; align-items: flex-start !important; gap: 12px !important; }
          .details-title { font-size: 26px !important; }
          .details-actions { flex-direction: column !important; }
          .details-actions button,
          .details-actions a { width: 100%; text-align: center; display: block; box-sizing: border-box; }
        }
      `}</style>

      <div style={s.inner}>
        <Link to="/items" style={s.backLink}>← Back to Products</Link>

        <div className="details-card" style={s.card}>
          {isAdmin && (
            <div style={s.adminBadge}>⚡ Admin Mode — full access</div>
          )}

          {/* Product image area */}
          {product.image && (
            <div style={{ ...s.imageWrap, backgroundColor: product.color || '#f5f5f5' }}>
              <img src={product.image} alt={product.title} style={s.productImg} />
            </div>
          )}

          <div className="details-top" style={s.cardTop}>
            <div style={{ flex: 1 }}>
              <h1 className="details-title" style={s.title}>{product.title}</h1>
              <p style={s.price}>${product.price}</p>
            </div>
            {user && (
              <button
                style={{
                  ...s.favBtn,
                  color: isFavorite(product.id) ? '#e53935' : '#888',
                  borderColor: isFavorite(product.id) ? '#e53935' : '#e5e5e5',
                  backgroundColor: isFavorite(product.id) ? '#fff5f5' : '#fff',
                }}
                onClick={() => toggleFavorite(product.id)}
              >
                ♥ {isFavorite(product.id) ? 'Saved' : 'Save'}
              </button>
            )}
          </div>

          {product.category && <span style={s.badge}>{product.category}</span>}

          <div style={s.divider} />
          <p style={s.descLabel}>Description</p>
          <p style={s.desc}>{product.description}</p>

          {canEdit && (
            <div className="details-actions" style={s.actions}>
              <Link to={`/items/${product.id}/edit`} style={s.editBtn}>
                Edit Product
              </Link>
              <button style={s.deleteBtn} onClick={handleDelete}>
                Delete Product
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const s = {
  page: { padding: '24px 16px 48px', backgroundColor: '#f9f9f9', minHeight: 'calc(100vh - 60px)' },
  inner: { maxWidth: 720, margin: '0 auto' },
  notFound: { height: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' },
  backLink: {
    display: 'inline-block', marginBottom: 20, color: '#555',
    fontSize: 14, fontWeight: 500, textDecoration: 'none',
  },
  card: {
    backgroundColor: '#fff', padding: '36px 32px',
    borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
    border: '1px solid #e5e5e5',
  },
  adminBadge: {
    backgroundColor: '#fff8e1', color: '#f57f17', fontSize: 12, fontWeight: 700,
    padding: '8px 14px', borderRadius: 8, marginBottom: 20, border: '1px solid #ffe082',
  },
  imageWrap: {
    borderRadius: 12, marginBottom: 24,
    height: 280, display: 'flex', alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden',
  },
  productImg: { maxHeight: '100%', maxWidth: '100%', objectFit: 'contain', padding: 20 },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  title: { fontSize: 30, fontWeight: 900, color: '#111', margin: '0 0 8px', letterSpacing: '-0.02em' },
  price: { fontSize: 22, fontWeight: 700, color: '#111', margin: 0 },
  badge: {
    display: 'inline-block', backgroundColor: '#f5f5f5', color: '#555',
    fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
    letterSpacing: '0.1em', padding: '4px 12px', borderRadius: 20, marginBottom: 16,
  },
  favBtn: {
    display: 'flex', alignItems: 'center', gap: 6,
    padding: '10px 18px', borderRadius: 30, border: '1.5px solid #e5e5e5',
    fontSize: 14, fontWeight: 600, cursor: 'pointer',
    transition: 'all 0.2s', flexShrink: 0, whiteSpace: 'nowrap',
  },
  divider: { height: 1, backgroundColor: '#f0f0f0', margin: '20px 0' },
  descLabel: { fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#aaa', fontWeight: 700, marginBottom: 10 },
  desc: { fontSize: 16, lineHeight: 1.7, color: '#444', marginBottom: 32 },
  actions: { display: 'flex', gap: 12 },
  editBtn: {
    display: 'inline-block', padding: '13px 24px', backgroundColor: '#111', color: '#fff',
    border: 'none', borderRadius: 30, fontWeight: 700, cursor: 'pointer',
    fontSize: 14, textDecoration: 'none', textAlign: 'center',
  },
  deleteBtn: {
    padding: '13px 24px', backgroundColor: '#fff', color: '#d32f2f',
    border: '1.5px solid #d32f2f', borderRadius: 30, fontWeight: 700,
    cursor: 'pointer', fontSize: 14,
  },
}
