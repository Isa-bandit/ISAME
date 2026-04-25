import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../components/AppContext'

export default function Register() {
  const { register } = useApp()
  const navigate = useNavigate()

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState('')
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.email) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email'
    if (!form.password) e.password = 'Password is required'
    else if (form.password.length < 6) e.password = 'At least 6 characters'
    if (!form.confirm) e.confirm = 'Please confirm password'
    else if (form.confirm !== form.password) e.confirm = 'Passwords do not match'
    return e
  }

  const handleChange = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }))
    setErrors(prev => ({ ...prev, [field]: '' }))
    setApiError('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    setTimeout(() => {
      const result = register(form.name, form.email, form.password)
      if (result.success) navigate('/dashboard')
      else setApiError(result.error)
      setLoading(false)
    }, 600)
  }

  const fields = [
    { key: 'name', label: 'Full Name', type: 'text', placeholder: 'John Doe', auto: 'name' },
    { key: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com', auto: 'email' },
    { key: 'password', label: 'Password', type: 'password', placeholder: '••••••••', auto: 'new-password' },
    { key: 'confirm', label: 'Confirm Password', type: 'password', placeholder: '••••••••', auto: 'new-password' },
  ]

  return (
    <div style={s.page}>
      <div style={s.card}>
        <Link to="/" style={s.logoLink}>
          <svg viewBox="0 0 100 40" width="48" height="20" fill="#111">
            <path d="M7.26,19.6C3.8,23.85,0,24.78,0,24.78c-.19.06.12-.24.12-.24L19.87,2.46A8.3,8.3,0,0,1,25.5.52a4.5,4.5,0,0,1,4.77,5c-.53,3.06-3.65,5.71-3.65,5.71L7.26,19.6Z"/>
          </svg>
        </Link>

        <h1 style={s.title}>Become a Member.</h1>
        <p style={s.sub}>Create your ISAME account — free to join.</p>

        {apiError && <div style={s.apiError}>{apiError}</div>}

        <form onSubmit={handleSubmit} noValidate>
          {fields.map(({ key, label, type, placeholder, auto }) => (
            <div key={key} style={s.field}>
              <label style={s.label}>{label}</label>
              <input
                type={type}
                value={form[key]}
                onChange={handleChange(key)}
                placeholder={placeholder}
                autoComplete={auto}
                style={{ ...s.input, borderColor: errors[key] ? '#d32f2f' : '#e5e5e5' }}
              />
              {errors[key] && <p style={s.fieldErr}>{errors[key]}</p>}
            </div>
          ))}

          <button
            type="submit"
            style={{ ...s.btn, opacity: loading ? 0.7 : 1 }}
            disabled={loading}
          >
            {loading ? 'Creating Account…' : 'Join Us'}
          </button>
        </form>

        <p style={s.terms}>
          By joining, you agree to our{' '}
          <span style={s.termsLink}>Terms</span> and{' '}
          <span style={s.termsLink}>Privacy Policy</span>.
        </p>
        <p style={s.footer}>
          Already a member?{' '}
          <Link to="/login" style={s.link}>Sign In</Link>
        </p>
      </div>
    </div>
  )
}

const s = {
  page: {
    minHeight: 'calc(100vh - 60px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#f5f5f5', padding: '24px 16px',
  },
  card: {
    width: '100%', maxWidth: 440,
    backgroundColor: '#fff', borderRadius: 16,
    padding: '40px 32px', boxShadow: '0 4px 40px rgba(0,0,0,0.08)',
  },
  logoLink: { display: 'inline-block', marginBottom: 28, color: '#111' },
  title: { fontSize: 26, fontWeight: 900, letterSpacing: '-0.02em', marginBottom: 6 },
  sub: { fontSize: 14, color: '#757575', marginBottom: 28 },
  apiError: { backgroundColor: '#fce4e4', color: '#c62828', padding: '12px 14px', borderRadius: 8, fontSize: 13, marginBottom: 20, fontWeight: 500 },
  field: { marginBottom: 18 },
  label: { display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 7, color: '#111' },
  input: {
    width: '100%', padding: '13px 14px',
    border: '1.5px solid #e5e5e5', borderRadius: 8,
    fontSize: 15, transition: 'border-color 0.2s',
    backgroundColor: '#fff', color: '#111',
    fontFamily: 'inherit', outline: 'none',
    boxSizing: 'border-box', WebkitAppearance: 'none',
  },
  fieldErr: { fontSize: 12, color: '#d32f2f', marginTop: 5 },
  btn: {
    width: '100%', padding: '15px',
    backgroundColor: '#111', color: '#fff',
    border: 'none', borderRadius: 30,
    fontSize: 15, fontWeight: 700,
    letterSpacing: '0.04em', cursor: 'pointer', marginTop: 4,
  },
  terms: { fontSize: 12, color: '#aaa', textAlign: 'center', marginTop: 18, lineHeight: 1.6 },
  termsLink: { fontWeight: 600, borderBottom: '1px solid #ccc', cursor: 'pointer' },
  footer: { textAlign: 'center', marginTop: 14, fontSize: 14, color: '#555' },
  link: { color: '#111', fontWeight: 700, borderBottom: '1.5px solid #111' },
}
