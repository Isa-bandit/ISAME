import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useApp } from '../components/AppContext'

export default function Login() {
  const { login } = useApp()
  const navigate = useNavigate()
  const location = useLocation()

  // Redirect back to the page the user tried to visit, or /dashboard by default
  const from = location.state?.from?.pathname || '/dashboard'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email || !password) { setError('Please fill in all fields'); return }
    setLoading(true)
    setError('')
    setTimeout(() => {
      const res = login(email, password)
      if (res.success) {
        navigate(from, { replace: true })
      } else {
        setError(res.error)
      }
      setLoading(false)
    }, 500)
  }

  return (
    <div style={s.page}>
      <div style={s.card}>
        {/* Logo */}
        <Link to="/" style={s.logoLink}>
          <svg viewBox="0 0 100 40" width="48" height="20" fill="#111">
            <path d="M7.26,19.6C3.8,23.85,0,24.78,0,24.78c-.19.06.12-.24.12-.24L19.87,2.46A8.3,8.3,0,0,1,25.5.52a4.5,4.5,0,0,1,4.77,5c-.53,3.06-3.65,5.71-3.65,5.71L7.26,19.6Z"/>
          </svg>
        </Link>

        <h1 style={s.title}>Welcome back.</h1>
        <p style={s.sub}>Sign in to your ISAME account.</p>

        {error && <div style={s.error}>{error}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <label style={s.label}>Email</label>
          <input
            style={s.input}
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={e => { setEmail(e.target.value); setError('') }}
            autoComplete="email"
          />

          <label style={s.label}>Password</label>
          <input
            style={s.input}
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={e => { setPassword(e.target.value); setError('') }}
            autoComplete="current-password"
          />

          <button style={{ ...s.btn, opacity: loading ? 0.7 : 1 }} disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p style={s.footer}>
          New here?{' '}
          <Link to="/register" style={s.link}>Create an account</Link>
        </p>
      </div>
    </div>
  )
}

const s = {
  page: {
    minHeight: 'calc(100vh - 60px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    padding: '24px 16px',
  },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: '40px 32px',
    boxShadow: '0 4px 40px rgba(0,0,0,0.08)',
  },
  logoLink: { display: 'inline-block', marginBottom: 28, color: '#111' },
  title: { fontSize: 28, fontWeight: 900, letterSpacing: '-0.02em', marginBottom: 6 },
  sub: { fontSize: 14, color: '#757575', marginBottom: 28 },
  error: {
    backgroundColor: '#ffebee', color: '#c62828',
    padding: '12px 14px', borderRadius: 8, fontSize: 13,
    marginBottom: 20, fontWeight: 500,
  },
  label: {
    display: 'block', fontSize: 12, fontWeight: 700,
    letterSpacing: '0.08em', textTransform: 'uppercase',
    marginBottom: 8, color: '#111',
  },
  input: {
    width: '100%', padding: '14px 16px',
    border: '1.5px solid #e5e5e5', borderRadius: 8,
    fontSize: 15, marginBottom: 18,
    fontFamily: 'inherit', outline: 'none',
    boxSizing: 'border-box',
    WebkitAppearance: 'none',
  },
  btn: {
    width: '100%', padding: '15px',
    backgroundColor: '#111', color: '#fff',
    border: 'none', borderRadius: 30,
    fontSize: 15, fontWeight: 700,
    letterSpacing: '0.04em', cursor: 'pointer',
    marginTop: 4,
  },
  footer: { textAlign: 'center', marginTop: 24, fontSize: 14, color: '#757575' },
  link: { color: '#111', fontWeight: 700, borderBottom: '1.5px solid #111' },
}
