import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../components/AppContext'

const CATEGORY_COLORS = ['#f5f5f5', '#fff3e0', '#e8f5e9', '#fce4ec', '#e3f2fd']

export default function List() {
  const { visibleProducts, setProducts, user, toggleFavorite, isFavorite } = useApp()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [sort, setSort] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('nikeProducts')
    if (stored && JSON.parse(stored).length > 0) {
      setProducts(JSON.parse(stored)); return
    }
    setLoading(true)
    fetch("https://fakestoreapi.com/products/category/men's%20clothing")
      .then(res => { if (!res.ok) throw new Error('API request failed'); return res.json() })
      .then(data => {
        const mapped = data.map((item, i) => ({
          id: item.id, title: item.title, description: item.description,
          price: item.price.toFixed(2), category: 'Lifestyle',
          image: item.image, color: CATEGORY_COLORS[i % 5],
        }))
        setProducts(mapped)
        localStorage.setItem('nikeProducts', JSON.stringify(mapped))
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [setProducts])

  const categories = [...new Set(visibleProducts.map(p => p.category).filter(Boolean))]

  const filtered = visibleProducts
    .filter(p =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      (p.category || '').toLowerCase().includes(search.toLowerCase())
    )
    .filter(p => category ? p.category === category : true)
    .sort((a, b) => {
      if (sort === 'price_asc') return Number(a.price) - Number(b.price)
      if (sort === 'price_desc') return Number(b.price) - Number(a.price)
      if (sort === 'name_asc') return a.title.localeCompare(b.title)
      if (sort === 'name_desc') return b.title.localeCompare(a.title)
      return 0
    })

  const clearAll = () => { setSearch(''); setCategory(''); setSort('') }
  const hasFilters = !!(category || sort || search)

  if (loading) return (
    <div style={s.center}>
      <div style={s.spinner} />
      <h2 style={s.loadText}>Loading products…</h2>
    </div>
  )

  if (error) return (
    <div style={s.center}>
      <p style={{ color: '#d32f2f', fontSize:'40px'}}>Error!!! {error}</p>
      <button style={s.btnDark} onClick={() => { localStorage.removeItem('nikeProducts'); window.location.reload() }}>
        Retry
      </button>
    </div>
  )

  return (
    <div style={s.page}>
      <style>{`
        @media (max-width: 600px) {
          .list-header { flex-direction: column !important; align-items: flex-start !important; gap: 12px !important; }
          .filters-row { flex-direction: column !important; }
          .pills-wrap { overflow-x: auto; white-space: nowrap; padding-bottom: 4px; }
          .sort-wrap { width: 100% !important; }
          .sort-wrap select { width: 100% !important; }
          .products-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 12px !important; }
        }
        @media (max-width: 380px) {
          .products-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div style={s.inner}>
        {/* Header */}
        <div className="list-header" style={s.header}>
          <div>
            <h1 style={s.title}>All Products</h1>
            <p style={s.subtitle}>{filtered.length} items</p>
          </div>
          <Link to="/items/create" style={s.btnDark}>+ Add Product</Link>
        </div>

        {/* Search */}
        <div style={s.searchWrap}>
          <span style={s.searchIcon}>🔍</span>
          <input
            style={s.searchInput}
            placeholder="Search products…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button style={s.clearSearch} onClick={() => setSearch('')}>✕</button>
          )}
        </div>

        {/* Filters */}
        <div className="filters-row" style={s.filtersRow}>
          <div className="pills-wrap" style={s.pillsWrap}>
            <button
              style={{ ...s.pill, ...(category === '' ? s.pillActive : {}) }}
              onClick={() => setCategory('')}
            >All</button>
            {categories.map(c => (
              <button
                key={c}
                style={{ ...s.pill, ...(category === c ? s.pillActive : {}) }}
                onClick={() => setCategory(category === c ? '' : c)}
              >{c}</button>
            ))}
          </div>

          <div className="sort-wrap" style={s.sortWrap}>
            <select style={s.select} value={sort} onChange={e => setSort(e.target.value)}>
              <option value="">Sort by…</option>
              <option value="price_asc">Price: Low → High</option>
              <option value="price_desc">Price: High → Low</option>
              <option value="name_asc">Name: A → Z</option>
              <option value="name_desc">Name: Z → A</option>
            </select>
            {hasFilters && (
              <button style={s.clearBtn} onClick={clearAll}>✕ Clear</button>
            )}
          </div>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div style={s.empty}>
            <p style={s.emptyTitle}>No products found</p>
            <p style={s.emptySub}>Try adjusting your search or filters.</p>
            <button style={s.btnDark} onClick={clearAll}>Clear filters</button>
          </div>
        ) : (
          <div className="products-grid" style={s.grid}>
            {filtered.map((product, i) => (
              <div key={product.id} style={s.cardWrap}>
                {user && (
                  <button
                    style={{ ...s.favBtn, color: isFavorite(product.id) ? '#e53935' : '#ccc' }}
                    onClick={e => { e.preventDefault(); toggleFavorite(product.id) }}
                    title={isFavorite(product.id) ? 'Remove from favorites' : 'Add to favorites'}
                    aria-label="Toggle favorite"
                  >
                    ♥
                  </button>
                )}
                <Link to={`/items/${product.id}`} style={s.card}>
                  <div style={{ ...s.cardImage, backgroundColor: product.color || CATEGORY_COLORS[i % 5] }}>
                    {product.image
                      ? <img src={product.image} alt={product.title} style={s.img} />
                      : <svg viewBox="0 0 100 40" width="64" height="26" fill="rgba(0,0,0,0.1)"><path d="M7.26,19.6C3.8,23.85,0,24.78,0,24.78c-.19.06.12-.24.12-.24L19.87,2.46A8.3,8.3,0,0,1,25.5.52a4.5,4.5,0,0,1,4.77,5c-.53,3.06-3.65,5.71-3.65,5.71L7.26,19.6Z"/></svg>
                    }
                  </div>
                  <div style={s.cardBody}>
                    <span style={s.cardCat}>{product.category}</span>
                    <h3 style={s.cardTitle}>{product.title}</h3>
                    <div style={s.cardFooter}>
                      <span style={s.cardPrice}>${product.price}</span>
                      <span style={s.cardArrow}>→</span>
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
  center: { height: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 },
  spinner: { width: 36, height: 36, border: '3px solid #f0f0f0', borderTop: '3px solid #111', borderRadius: '50%', animation: 'spin 0.8s linear infinite' },
  loadText: { color: '#757575', fontSize: 14 },

  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 28, fontWeight: 900, letterSpacing: '-0.02em' },
  subtitle: { fontSize: 13, color: '#757575', marginTop: 2 },
  btnDark: {
    display: 'inline-block', backgroundColor: '#111', color: '#fff',
    padding: '11px 22px', borderRadius: 30, textDecoration: 'none',
    fontWeight: 700, fontSize: 13, border: 'none', cursor: 'pointer', flexShrink: 0,
  },

  searchWrap: { position: 'relative', marginBottom: 14 },
  searchIcon: { position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', fontSize: 14, pointerEvents: 'none' },
  searchInput: {
    width: '100%', padding: '13px 44px', borderRadius: 30,
    border: '1.5px solid #e5e5e5', fontSize: 15, backgroundColor: '#f8f8f8',
    outline: 'none', boxSizing: 'border-box', WebkitAppearance: 'none',
  },
  clearSearch: { position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#999', fontSize: 14 },

  filtersRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 24, flexWrap: 'wrap' },
  pillsWrap: { display: 'flex', gap: 8, flexWrap: 'wrap' },
  pill: {
    padding: '8px 16px', borderRadius: 30, border: '1.5px solid #e5e5e5',
    backgroundColor: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer',
    color: '#555', transition: 'all 0.15s', whiteSpace: 'nowrap',
  },
  pillActive: { backgroundColor: '#111', color: '#fff', borderColor: '#111' },
  sortWrap: { display: 'flex', alignItems: 'center', gap: 8 },
  select: {
    padding: '9px 16px', borderRadius: 30, border: '1.5px solid #e5e5e5',
    fontSize: 13, backgroundColor: '#fff', outline: 'none', cursor: 'pointer',
    fontWeight: 600, color: '#111', WebkitAppearance: 'none',
  },
  clearBtn: {
    padding: '8px 14px', borderRadius: 30, border: '1.5px solid #e5e5e5',
    background: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', color: '#757575',
  },

  empty: { textAlign: 'center', padding: '60px 24px' },
  emptyTitle: { fontSize: 18, fontWeight: 800, marginBottom: 8 },
  emptySub: { color: '#757575', marginBottom: 20 },

  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 },
  cardWrap: { position: 'relative' },
  favBtn: {
    position: 'absolute', top: 10, right: 10, zIndex: 2,
    background: 'white', border: 'none', borderRadius: '50%',
    width: 34, height: 34, fontSize: 17, cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.12)', transition: 'color 0.2s',
  },
  card: {
    textDecoration: 'none', color: 'inherit',
    border: '1px solid #e5e5e5', borderRadius: 12,
    overflow: 'hidden', display: 'block', transition: 'box-shadow 0.2s',
  },
  cardImage: {
    height: 220, display: 'flex', alignItems: 'center',
    justifyContent: 'center', padding: 16,
  },
  img: { maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' },
  cardBody: { padding: '14px 16px 16px' },
  cardCat: {
    fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
    color: '#757575', marginBottom: 6, display: 'block',
  },
  cardTitle: { fontSize: 14, fontWeight: 700, margin: '0 0 12px', lineHeight: 1.3, minHeight: 36, overflow: 'hidden' },
  cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  cardPrice: { fontSize: 16, fontWeight: 800 },
  cardArrow: { fontSize: 16, color: '#aaa' },
}
