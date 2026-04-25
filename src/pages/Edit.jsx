import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useApp } from '../components/AppContext'

const CATEGORIES = ['Running', 'Training', 'Lifestyle', 'Basketball', 'Soccer']
const COLORS = ['#f5f5f5', '#fff3e0', '#e8f5e9', '#fce4ec', '#e3f2fd']

export default function Edit() {
  const { id } = useParams()
  const { products, updateProduct } = useApp()
  const navigate = useNavigate()

  const [form, setForm] = useState({ title: '', description: '', price: '', category: '', color: '#f5f5f5' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    const item = products.find(p => String(p.id) === String(id))
    if (item) setForm(item)
    else setNotFound(true)
  }, [id, products])

  if (notFound) {
    return (
      <div style={s.notFound}>
        <p style={{ color: '#757575', marginBottom: 16 }}>Product not found.</p>
        <Link to="/items" style={s.back}>← Back to Products</Link>
      </div>
    )
  }

  const validate = () => {
    const e = {}
    if (!form.title.trim()) e.title = 'Title is required'
    if (!form.description.trim()) e.description = 'Description is required'
    if (!form.price) e.price = 'Price is required'
    else if (isNaN(form.price) || Number(form.price) <= 0) e.price = 'Enter a valid price'
    if (!form.category) e.category = 'Select a category'
    return e
  }

  const handleChange = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }))
    setErrors(prev => ({ ...prev, [field]: '' }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    setTimeout(() => {
      updateProduct(id, form)
      setSuccess(true); setLoading(false)
      setTimeout(() => navigate(`/items/${id}`), 1200)
    }, 700)
  }

  return (
    <div style={s.page}>
      <style>{`
        @media (max-width: 900px) {
          .edit-layout { grid-template-columns: 1fr !important; }
          .edit-preview { display: none !important; }
        }
        @media (max-width: 600px) {
          .edit-inner { padding: 20px 16px 40px !important; }
          .edit-form { padding: 24px 20px !important; }
          .price-row { flex-direction: column !important; }
        }
      `}</style>

      <div className="edit-inner" style={s.inner}>
        <Link to={`/items/${id}`} style={s.back}>← Back to Product</Link>
        <div style={s.headerRow}>
          <h1 style={s.title}>Edit Product</h1>
          <p style={s.sub}>Update the product details.</p>
        </div>

        <div className="edit-layout" style={s.layout}>
          {/* Preview */}
          <div className="edit-preview" style={s.previewSide}>
            <p style={s.previewLabel}>Live Preview</p>
            <div style={s.previewCard}>
              <div style={{ ...s.previewImg, backgroundColor: form.color }} />
              <div style={s.previewBody}>
                <span style={s.previewCat}>{form.category || 'Category'}</span>
                <p style={s.previewTitle}>{form.title || 'Product Name'}</p>
                <p style={s.previewPrice}>{form.price ? `$${form.price}` : '$0.00'}</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="edit-form" style={s.formCard}>
            {success && <div style={s.successBanner}>✓ Updated! Redirecting…</div>}

            <form onSubmit={handleSubmit} noValidate>
              <Field label="Product Name" error={errors.title}>
                <input style={inp(errors.title)} value={form.title} onChange={handleChange('title')} placeholder="Product name" />
              </Field>

              <Field label="Description" error={errors.description}>
                <textarea style={{ ...inp(errors.description), height: 90, resize: 'vertical' }} value={form.description} onChange={handleChange('description')} placeholder="Description…" />
              </Field>

              <div className="price-row" style={s.row}>
                <Field label="Price (USD)" error={errors.price} style={{ flex: 1 }}>
                  <input style={inp(errors.price)} type="number" min="0" step="0.01" value={form.price} onChange={handleChange('price')} placeholder="99.99" />
                </Field>
                <Field label="Category" error={errors.category} style={{ flex: 1 }}>
                  <select style={{ ...inp(errors.category), backgroundColor: '#fff' }} value={form.category} onChange={handleChange('category')}>
                    <option value="">Select…</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </Field>
              </div>

              <div style={s.colorField}>
                <label style={s.fieldLabel}>Card Color</label>
                <div style={s.colors}>
                  {COLORS.map(c => (
                    <button
                      key={c} type="button"
                      onClick={() => setForm(p => ({ ...p, color: c }))}
                      style={{ ...s.colorDot, backgroundColor: c, boxShadow: form.color === c ? '0 0 0 3px #111' : '0 0 0 1px #e5e5e5' }}
                    />
                  ))}
                </div>
              </div>

              <div style={s.btnRow}>
                <button type="button" style={s.cancelBtn} onClick={() => navigate(`/items/${id}`)}>
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || success}
                  style={{ ...s.submitBtn, opacity: loading || success ? 0.7 : 1, backgroundColor: success ? '#2e7d32' : '#111' }}
                >
                  {loading ? 'Saving…' : success ? '✓ Saved!' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

function Field({ label, error, children, style }) {
  return (
    <div style={{ marginBottom: 18, ...style }}>
      <label style={s.fieldLabel}>{label}</label>
      {children}
      {error && <p style={s.fieldError}>{error}</p>}
    </div>
  )
}

const inp = (hasError) => ({
  width: '100%', padding: '13px 14px',
  border: `1.5px solid ${hasError ? '#d32f2f' : '#e5e5e5'}`,
  borderRadius: 8, fontSize: 15, color: '#111',
  fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
  WebkitAppearance: 'none',
})

const s = {
  page: { minHeight: 'calc(100vh - 60px)', backgroundColor: '#f5f5f5' },
  inner: { maxWidth: 1100, margin: '0 auto', padding: '28px 24px 48px' },
  notFound: { height: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' },
  back: { display: 'inline-block', marginBottom: 20, color: '#555', fontSize: 14, fontWeight: 500, textDecoration: 'none' },
  headerRow: { marginBottom: 28 },
  title: { fontSize: 28, fontWeight: 900, letterSpacing: '-0.02em' },
  sub: { fontSize: 14, color: '#757575', marginTop: 4 },
  layout: { display: 'grid', gridTemplateColumns: '300px 1fr', gap: 28, alignItems: 'start' },
  previewSide: {},
  previewLabel: { fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#757575', marginBottom: 10 },
  previewCard: { backgroundColor: '#fff', borderRadius: 12, overflow: 'hidden', border: '1px solid #e5e5e5', position: 'sticky', top: 80 },
  previewImg: { height: 160, transition: 'background-color 0.3s' },
  previewBody: { padding: '14px 18px 18px' },
  previewCat: { fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#757575', display: 'block', marginBottom: 6 },
  previewTitle: { fontSize: 14, fontWeight: 700, color: '#111', marginBottom: 6 },
  previewPrice: { fontSize: 16, fontWeight: 800 },
  formCard: { backgroundColor: '#fff', borderRadius: 16, padding: '32px 36px', boxShadow: '0 2px 20px rgba(0,0,0,0.06)' },
  successBanner: { backgroundColor: '#e8f5e9', color: '#2e7d32', padding: '12px 14px', borderRadius: 8, fontSize: 14, fontWeight: 600, marginBottom: 20 },
  row: { display: 'flex', gap: 14 },
  colorField: { marginBottom: 24 },
  fieldLabel: { display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8, color: '#111' },
  fieldError: { fontSize: 12, color: '#d32f2f', marginTop: 5 },
  colors: { display: 'flex', gap: 10 },
  colorDot: { width: 30, height: 30, borderRadius: '50%', cursor: 'pointer', transition: 'box-shadow 0.15s', border: 'none' },
  btnRow: { display: 'flex', gap: 12 },
  cancelBtn: { flex: '0 0 auto', padding: '14px 24px', backgroundColor: '#f5f5f5', color: '#555', border: '1.5px solid #e5e5e5', borderRadius: 30, fontWeight: 600, cursor: 'pointer', fontSize: 14 },
  submitBtn: { flex: 1, padding: '14px', color: '#fff', fontSize: 15, fontWeight: 700, borderRadius: 30, border: 'none', cursor: 'pointer', transition: 'background 0.3s, opacity 0.2s' },
}
