import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../components/AppContext'

export default function AdminPanel() {
  const { user, isAdmin, products, deleteProduct } = useApp()
  const [search, setSearch] = useState('')
  const [tab, setTab] = useState('products')
  const [confirmId, setConfirmId] = useState(null)

  if (!user || !isAdmin) {
    return (
      <div style={s.locked}>
        <div style={s.lockIcon}>⛔</div>
        <h2 style={s.lockTitle}>Admin Access Only</h2>
        <p style={s.lockSub}>You need admin privileges to view this page.</p>
        <Link to="/" style={s.btnDark}>Go Home</Link>
      </div>
    )
  }

  const allUsers = JSON.parse(localStorage.getItem('nikeUsers') || '[]')
  const totalValue = products.reduce((s, p) => s + Number(p.price || 0), 0)
  const categories = [...new Set(products.map(p => p.category).filter(Boolean))]

  const filteredProducts = products.filter(p =>
    p.title?.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase())
  )
  const filteredUsers = allUsers.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  )

  const handleDelete = (id) => { deleteProduct(id); setConfirmId(null) }

  const colors = ['#ef9a9a','#90caf9','#a5d6a7','#fff176','#ce93d8','#80cbc4','#ffcc80']
  const avatarColor = (name = '') => colors[name.charCodeAt(0) % colors.length]

  return (
    <div style={s.page}>
      <style>{`
        @media (max-width: 768px) {
          .admin-topstats { grid-template-columns: repeat(2, 1fr) !important; gap: 10px !important; }
          .admin-table-wrap table { min-width: 520px; }
        }
        @media (max-width: 500px) {
          .admin-top-inner { flex-direction: column !important; align-items: flex-start !important; gap: 16px !important; }
          .admin-search-row { flex-direction: column !important; align-items: stretch !important; }
          .admin-search-row a { text-align: center; }
        }
      `}</style>

      <div style={s.topBar}>
        <div className="admin-top-inner" style={s.topInner}>
          <div style={s.topLeft}>
            <span style={s.topIcon}>⚡</span>
            <div>
              <h1 style={s.topTitle}>Admin Panel</h1>
              <p style={s.topSub}>Full system control</p>
            </div>
          </div>
          <div className="admin-topstats" style={s.topStats}>
            {[
              { num: products.length, label: 'Products' },
              { num: allUsers.length, label: 'Users' },
              { num: `$${totalValue.toFixed(0)}`, label: 'Total Value' },
              { num: categories.length, label: 'Categories' },
            ].map(st => (
              <div key={st.label} style={s.topStat}>
                <span style={s.topNum}>{st.num}</span>
                <span style={s.topLabel}>{st.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={s.inner}>
        {/* Tabs */}
        <div style={s.tabs}>
          <button style={{ ...s.tab, ...(tab === 'products' ? s.tabActive : {}) }} onClick={() => { setTab('products'); setSearch('') }}>
            📦 Products <span style={s.badge}>{products.length}</span>
          </button>
          <button style={{ ...s.tab, ...(tab === 'users' ? s.tabActive : {}) }} onClick={() => { setTab('users'); setSearch('') }}>
            👥 Users <span style={s.badge}>{allUsers.length}</span>
          </button>
        </div>

        <div className="admin-search-row" style={s.searchRow}>
          <div style={s.searchWrap}>
            <span style={s.searchIcon}>🔍</span>
            <input
              style={s.searchInput}
              placeholder={tab === 'products' ? 'Search products…' : 'Search users…'}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && <button style={s.clearBtn} onClick={() => setSearch('')}>✕</button>}
          </div>
          {tab === 'products' && (
            <Link to="/items/create" style={s.btnDark}>+ Add Product</Link>
          )}
        </div>

        {/* Products table */}
        {tab === 'products' && (
          <div className="admin-table-wrap" style={s.tableWrap}>
            <div style={s.scrollWrap}>
              <table style={s.table}>
                <thead>
                  <tr>
                    {['#', 'Color', 'Title', 'Category', 'Price', 'Owner', 'Actions'].map(h => (
                      <th key={h} style={s.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((p, i) => {
                    const owner = allUsers.find(u => String(u.id) === String(p.userId))
                    return (
                      <tr key={p.id} style={s.tr}>
                        <td style={s.td}><span style={s.num}>{i + 1}</span></td>
                        <td style={s.td}>
                          <div style={{ width: 22, height: 22, borderRadius: '50%', backgroundColor: p.color || '#f5f5f5', border: '1px solid #e5e5e5' }} />
                        </td>
                        <td style={s.td}>
                          <Link to={`/items/${p.id}`} style={s.productLink}>{p.title}</Link>
                        </td>
                        <td style={s.td}><span style={s.catPill}>{p.category || '—'}</span></td>
                        <td style={s.td}><strong>${p.price}</strong></td>
                        <td style={s.td}><span style={s.ownerText}>{owner ? owner.name : p.userId ? 'Unknown' : 'System'}</span></td>
                        <td style={s.td}>
                          <div style={s.actionBtns}>
                            <Link to={`/items/${p.id}/edit`} style={s.editBtn}>Edit</Link>
                            {confirmId === p.id ? (
                              <>
                                <button style={s.confirmBtn} onClick={() => handleDelete(p.id)}>Confirm</button>
                                <button style={s.cancelBtn2} onClick={() => setConfirmId(null)}>✕</button>
                              </>
                            ) : (
                              <button style={s.deleteBtn} onClick={() => setConfirmId(p.id)}>Delete</button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              {filteredProducts.length === 0 && <div style={s.empty}>No products match your search.</div>}
            </div>
          </div>
        )}

        {tab === 'users' && (
          <div className="admin-table-wrap" style={s.tableWrap}>
            <div style={s.scrollWrap}>
              <table style={s.table}>
                <thead>
                  <tr>
                    {['#', 'Avatar', 'Name', 'Email', 'Products', 'Joined'].map(h => (
                      <th key={h} style={s.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u, i) => {
                    const count = products.filter(p => String(p.userId) === String(u.id)).length
                    const isCurrent = String(u.id) === String(user.id)
                    return (
                      <tr key={u.id} style={{ ...s.tr, backgroundColor: isCurrent ? '#fffde7' : 'transparent' }}>
                        <td style={s.td}><span style={s.num}>{i + 1}</span></td>
                        <td style={s.td}>
                          <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: avatarColor(u.name), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#333' }}>
                            {u.name?.charAt(0).toUpperCase()}
                          </div>
                        </td>
                        <td style={s.td}>
                          <span style={{ fontWeight: 600, fontSize: 14 }}>{u.name}</span>
                          {isCurrent && <span style={s.youBadge}>you</span>}
                        </td>
                        <td style={s.td}><span style={{ fontSize: 13, color: '#555' }}>{u.email}</span></td>
                        <td style={s.td}><span style={s.catPill}>{count}</span></td>
                        <td style={s.td}>
                          <span style={{ fontSize: 12, color: '#aaa' }}>
                            {new Date(Number(u.id)).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              {filteredUsers.length === 0 && <div style={s.empty}>No users match your search.</div>}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const s = {
  page: { minHeight: 'calc(100vh - 60px)', backgroundColor: '#f9f9f9' },
  locked: { textAlign: 'center', padding: '100px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 },
  lockIcon: { fontSize: 52 },
  lockTitle: { fontSize: 24, fontWeight: 900 },
  lockSub: { color: '#757575', fontSize: 15 },
  btnDark: { display: 'inline-block', backgroundColor: '#111', color: '#fff', padding: '11px 22px', borderRadius: 30, fontWeight: 700, fontSize: 13, textDecoration: 'none', flexShrink: 0 },

  topBar: { backgroundColor: '#111', color: '#fff', padding: '28px 16px' },
  topInner: { maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 20, flexWrap: 'wrap' },
  topLeft: { display: 'flex', alignItems: 'center', gap: 14 },
  topIcon: { fontSize: 36 },
  topTitle: { fontSize: 24, fontWeight: 900, letterSpacing: '-0.02em' },
  topSub: { color: 'rgba(255,255,255,0.45)', fontSize: 13 },
  topStats: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 },
  topStat: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 },
  topNum: { fontSize: 24, fontWeight: 900 },
  topLabel: { fontSize: 10, color: 'rgba(255,255,255,0.45)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' },

  inner: { maxWidth: 1200, margin: '0 auto', padding: '28px 16px 48px' },
  tabs: { display: 'flex', borderBottom: '1px solid #e5e5e5', marginBottom: 20 },
  tab: { padding: '11px 20px', fontSize: 14, fontWeight: 600, color: '#757575', background: 'none', border: 'none', cursor: 'pointer', borderBottom: '2px solid transparent', marginBottom: -1, display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap' },
  tabActive: { color: '#111', borderBottomColor: '#111' },
  badge: { backgroundColor: '#f0f0f0', borderRadius: 20, padding: '2px 8px', fontSize: 11, fontWeight: 700, color: '#555' },

  searchRow: { display: 'flex', gap: 12, marginBottom: 20, alignItems: 'center' },
  searchWrap: { flex: 1, position: 'relative' },
  searchIcon: { position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 13, pointerEvents: 'none' },
  searchInput: { width: '100%', padding: '11px 40px', borderRadius: 30, border: '1.5px solid #e5e5e5', fontSize: 14, outline: 'none', backgroundColor: '#fff', boxSizing: 'border-box', WebkitAppearance: 'none' },
  clearBtn: { position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#aaa', fontSize: 13 },

  tableWrap: { backgroundColor: '#fff', borderRadius: 14, border: '1px solid #e5e5e5', overflow: 'hidden' },
  scrollWrap: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: 14 },
  th: { padding: '11px 14px', textAlign: 'left', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#757575', borderBottom: '1px solid #e5e5e5', backgroundColor: '#f9f9f9', whiteSpace: 'nowrap' },
  tr: { borderBottom: '1px solid #f0f0f0' },
  td: { padding: '13px 14px', verticalAlign: 'middle' },
  num: { fontSize: 12, color: '#aaa', fontWeight: 600 },
  productLink: { fontWeight: 600, color: '#111', textDecoration: 'none', fontSize: 13 },
  catPill: { display: 'inline-block', backgroundColor: '#f5f5f5', borderRadius: 20, padding: '3px 10px', fontSize: 12, fontWeight: 600, color: '#555' },
  ownerText: { fontSize: 12, color: '#757575' },
  actionBtns: { display: 'flex', gap: 6, flexWrap: 'wrap' },
  editBtn: { display: 'inline-block', padding: '5px 12px', backgroundColor: '#111', color: '#fff', borderRadius: 20, fontSize: 12, fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap' },
  deleteBtn: { padding: '5px 12px', backgroundColor: '#fff', color: '#d32f2f', border: '1.5px solid #d32f2f', borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' },
  confirmBtn: { padding: '5px 12px', backgroundColor: '#d32f2f', color: '#fff', border: 'none', borderRadius: 20, fontSize: 12, fontWeight: 700, cursor: 'pointer' },
  cancelBtn2: { padding: '5px 10px', backgroundColor: '#f0f0f0', color: '#555', border: 'none', borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: 'pointer' },
  youBadge: { marginLeft: 7, fontSize: 9, fontWeight: 700, backgroundColor: '#111', color: '#fff', padding: '1px 6px', borderRadius: 20 },
  empty: { padding: '36px', textAlign: 'center', color: '#aaa', fontSize: 13 },
}
