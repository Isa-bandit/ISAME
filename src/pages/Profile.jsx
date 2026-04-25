import { useApp } from '../components/AppContext'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'

const CATEGORY_COLORS = ['#f5f5f5', '#fff3e0', '#e8f5e9', '#fce4ec', '#e3f2fd']

export default function Profile() {
  const { user, products, visibleProducts, favorites, logout, toggleFavorite, isAdmin } = useApp()
  const navigate = useNavigate()
  const [tab, setTab] = useState('products')

  if (!user) {
    return (
      <div style={s.emptyPage}>
        <p style={{ color: '#757575', marginBottom: 24 }}>Please sign in to view your profile.</p>
        <Link to="/login" style={s.btnDark}>Sign In</Link>
      </div>
    )
  }

  const myProducts = products.filter(p => p.userId && String(p.userId) === String(user.id))
  const favProducts = visibleProducts.filter(p => favorites.includes(String(p.id)))
  const allUsers = JSON.parse(localStorage.getItem('nikeUsers') || '[]')
  const displayList = tab === 'products' ? myProducts : favProducts

  return (
    <div style={s.page}>
      <style>{`
        @media (max-width: 600px) {
          .profile-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 12px !important; }
          .profile-hero { padding: 24px 16px 20px !important; }
          .profile-tabs { overflow-x: auto; white-space: nowrap; }
        }
        @media (max-width: 380px) {
          .profile-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>


      <div className="profile-hero" style={s.hero}>
        <div style={s.avatar}>{user.name?.charAt(0).toUpperCase()}</div>
        <h1 style={s.userName}>{user.name}</h1>
        <p style={s.userEmail}>{user.email}</p>
        {isAdmin && <span style={s.adminChip}>⚡ Admin</span>}
        <div style={s.heroActions}>
          <Link to="/items/create" style={s.btnDark}>+ Add Product</Link>
          <button onClick={() => { logout(); navigate('/') }} style={s.btnOutline}>Sign Out</button>
        </div>
      </div>

      <div style={s.divider} />


      <div className="profile-tabs" style={s.tabs}>
        <button style={{ ...s.tab, ...(tab === 'products' ? s.tabActive : {}) }} onClick={() => setTab('products')}>
          My Products <span style={s.tabBadge}>{myProducts.length}</span>
        </button>
        <button style={{ ...s.tab, ...(tab === 'favorites' ? s.tabActive : {}) }} onClick={() => setTab('favorites')}>
          Favorites <span style={s.tabBadge}>{favProducts.length}</span>
        </button>
        {isAdmin && (
          <button style={{ ...s.tab, ...(tab === 'users' ? { ...s.tabActive, color: '#f57f17', borderBottomColor: '#f57f17' } : {}) }} onClick={() => setTab('users')}>
            ⚡ Users <span style={s.tabBadge}>{allUsers.length}</span>
          </button>
        )}
      </div>

      <div style={s.content}>
        {tab === 'users' && isAdmin ? (
          <UsersTable users={allUsers} products={products} currentUserId={user.id} />
        ) : displayList.length === 0 ? (
          <div style={s.empty}>
            {tab === 'products' ? (
              <>
                <p style={s.emptyText}>No products yet.</p>
                <Link to="/items/create" style={s.btnDark}>Create your first</Link>
              </>
            ) : (
              <>
                <p style={s.emptyText}>No favorites yet.</p>
                <Link to="/items" style={s.btnDark}>Browse products</Link>
              </>
            )}
          </div>
        ) : (
          <div className="profile-grid" style={s.grid}>
            {displayList.map((product, i) => (
              <div key={product.id} style={s.cardWrap}>
                {tab === 'favorites' && (
                  <button style={s.favBtn} onClick={() => toggleFavorite(product.id)} title="Remove">♥</button>
                )}
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
                      <span style={{ color: '#aaa' }}>→</span>
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

function UsersTable({ users, products, currentUserId }) {
  const [search, setSearch] = useState('')
  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )
  const colors = ['#ef9a9a','#90caf9','#a5d6a7','#fff176','#ce93d8','#80cbc4','#ffcc80']

  return (
    <div>
      <div style={t.header}>
        <div>
          <h2 style={t.title}>Registered Users</h2>
          <p style={t.sub}>{users.length} total</p>
        </div>
        <input style={t.search} placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      <div style={t.wrap}>
        <table style={t.table}>
          <thead>
            <tr>{['#', 'User', 'Email', 'Products', 'Joined'].map(h => <th key={h} style={t.th}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {filtered.map((u, i) => {
              const count = products.filter(p => String(p.userId) === String(u.id)).length
              const isCurrent = String(u.id) === String(currentUserId)
              const bg = colors[u.name?.charCodeAt(0) % colors.length]
              return (
                <tr key={u.id} style={{ backgroundColor: isCurrent ? '#fffde7' : 'transparent' }}>
                  <td style={t.td}><span style={{ fontSize: 12, color: '#aaa' }}>{i + 1}</span></td>
                  <td style={t.td}>
                    <div style={t.userCell}>
                      <div style={{ ...t.avatar, backgroundColor: bg }}>{u.name?.charAt(0).toUpperCase()}</div>
                      <span style={{ fontWeight: 600, fontSize: 14 }}>
                        {u.name} {isCurrent && <span style={t.you}>you</span>}
                      </span>
                    </div>
                  </td>
                  <td style={t.td}><span style={{ fontSize: 13, color: '#555' }}>{u.email}</span></td>
                  <td style={t.td}><span style={t.badge}>{count}</span></td>
                  <td style={t.td}><span style={{ fontSize: 12, color: '#aaa' }}>{new Date(Number(u.id)).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span></td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {filtered.length === 0 && <div style={t.empty}>No users found.</div>}
      </div>
    </div>
  )
}

const t = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 16, flexWrap: 'wrap', gap: 12 },
  title: { fontSize: 20, fontWeight: 800 },
  sub: { fontSize: 13, color: '#757575' },
  search: { padding: '9px 16px', borderRadius: 30, border: '1.5px solid #e5e5e5', fontSize: 13, outline: 'none', minWidth: 200 },
  wrap: { overflowX: 'auto', borderRadius: 12, border: '1px solid #e5e5e5' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: 14, minWidth: 480 },
  th: { padding: '11px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#757575', borderBottom: '1px solid #e5e5e5', backgroundColor: '#f9f9f9' },
  td: { padding: '13px 14px', borderBottom: '1px solid #f0f0f0', verticalAlign: 'middle' },
  userCell: { display: 'flex', alignItems: 'center', gap: 10 },
  avatar: { width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#333', flexShrink: 0 },
  you: { marginLeft: 6, fontSize: 10, fontWeight: 700, backgroundColor: '#111', color: '#fff', padding: '1px 6px', borderRadius: 20 },
  badge: { display: 'inline-block', backgroundColor: '#f0f0f0', borderRadius: 20, padding: '2px 10px', fontSize: 12, fontWeight: 700 },
  empty: { padding: '32px', textAlign: 'center', color: '#aaa' },
}

const s = {
  page: { maxWidth: 1100, margin: '0 auto', padding: '0 16px 48px' },
  hero: { textAlign: 'center', padding: '36px 24px 28px' },
  avatar: { width: 72, height: 72, backgroundColor: '#111', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 700, margin: '0 auto 16px' },
  userName: { fontSize: 26, fontWeight: 900, letterSpacing: '-0.02em', marginBottom: 4 },
  userEmail: { color: '#757575', fontSize: 15, marginBottom: 8 },
  adminChip: { display: 'inline-block', backgroundColor: '#fff8e1', color: '#f57f17', fontSize: 12, fontWeight: 700, padding: '4px 12px', borderRadius: 20, border: '1px solid #ffe082', marginBottom: 16 },
  heroActions: { display: 'flex', justifyContent: 'center', gap: 12, marginTop: 12, flexWrap: 'wrap' },
  btnDark: { display: 'inline-block', backgroundColor: '#111', color: '#fff', padding: '11px 22px', borderRadius: 30, textDecoration: 'none', fontWeight: 700, fontSize: 13, border: 'none', cursor: 'pointer' },
  btnOutline: { padding: '10px 22px', borderRadius: 30, border: '1.5px solid #ddd', background: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: 13 },
  divider: { height: 1, backgroundColor: '#eee', margin: '0 0 0' },
  tabs: { display: 'flex', gap: 0, borderBottom: '1px solid #e5e5e5', marginBottom: 28 },
  tab: { padding: '13px 20px', fontSize: 14, fontWeight: 600, color: '#757575', background: 'none', border: 'none', cursor: 'pointer', borderBottom: '2px solid transparent', marginBottom: -1, display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap' },
  tabActive: { color: '#111', borderBottomColor: '#111' },
  tabBadge: { backgroundColor: '#f0f0f0', borderRadius: 20, padding: '2px 8px', fontSize: 11, fontWeight: 700 },
  content: {},
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 },
  cardWrap: { position: 'relative' },
  favBtn: { position: 'absolute', top: 10, right: 10, zIndex: 2, background: 'white', border: 'none', borderRadius: '50%', width: 34, height: 34, fontSize: 17, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.12)', color: '#e53935' },
  card: { textDecoration: 'none', color: 'inherit', border: '1px solid #e5e5e5', borderRadius: 12, overflow: 'hidden', display: 'block' },
  cardImage: { height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 },
  img: { maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' },
  cardBody: { padding: '14px 16px 16px' },
  cardCat: { fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: '#757575', marginBottom: 6, display: 'block' },
  cardTitle: { fontSize: 14, fontWeight: 700, margin: '0 0 12px', lineHeight: 1.3, minHeight: 36 },
  cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  cardPrice: { fontSize: 16, fontWeight: 800 },
  empty: { textAlign: 'center', padding: '60px 0', backgroundColor: '#f9f9f9', borderRadius: 16 },
  emptyText: { color: '#757575', marginBottom: 16 },
  emptyPage: { height: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' },
}
