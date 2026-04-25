import { useParams, useNavigate, Link } from 'react-router-dom'
import { useApp } from '../components/AppContext'

export default function Delete() {
  const { id } = useParams()
  const { products, deleteProduct } = useApp()
  const navigate = useNavigate()

  const product = products.find(p => String(p.id) === String(id))

  if (!product) {
    return (
      <div style={s.center}>
        <p style={{ color: '#757575', marginBottom: 16 }}>Product not found.</p>
        <Link to="/items" style={s.link}>Back to Products</Link>
      </div>
    )
  }

  const handleDelete = () => {
    deleteProduct(id)
    navigate('/items')
  }

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.icon}>⚠️</div>
        <h1 style={s.title}>Delete Product?</h1>
        <p style={s.text}>
          You're about to permanently delete <strong>"{product.title}"</strong>.
          This action cannot be undone.
        </p>
        <div style={s.actions}>
          <button style={s.cancelBtn} onClick={() => navigate(-1)}>Cancel</button>
          <button style={s.deleteBtn} onClick={handleDelete}>Yes, Delete</button>
        </div>
      </div>
    </div>
  )
}

const s = {
  page: {
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    minHeight: 'calc(100vh - 60px)', padding: '24px 16px',
    backgroundColor: '#f9f9f9',
  },
  center: { height: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' },
  card: {
    maxWidth: 440, width: '100%', padding: '40px 32px',
    backgroundColor: '#fff', borderRadius: 16,
    boxShadow: '0 8px 40px rgba(0,0,0,0.1)',
    textAlign: 'center', border: '1px solid #e5e5e5',
  },
  icon: { fontSize: 48, marginBottom: 16 },
  title: { fontSize: 24, fontWeight: 900, marginBottom: 12, color: '#111' },
  text: { color: '#555', lineHeight: 1.6, marginBottom: 32, fontSize: 15 },
  actions: { display: 'flex', gap: 12 },
  cancelBtn: {
    flex: 1, padding: '14px', backgroundColor: '#f5f5f5',
    border: '1.5px solid #e5e5e5', borderRadius: 30,
    fontWeight: 600, cursor: 'pointer', fontSize: 14, color: '#111',
  },
  deleteBtn: {
    flex: 1, padding: '14px', backgroundColor: '#d32f2f', color: '#fff',
    border: 'none', borderRadius: 30, fontWeight: 700, cursor: 'pointer', fontSize: 14,
  },
  link: { color: '#111', fontWeight: 700, textDecoration: 'underline' },
}
