import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

export default function NotFound() {
  const navigate = useNavigate()
  const [count, setCount] = useState(5)

  useEffect(() => {
    const t = setInterval(() => {
      setCount(prev => {
        if (prev <= 1) { clearInterval(t); navigate('/'); return 0 }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(t)
  }, [navigate])

  return (
    <div style={s.page}>
      <div style={s.inner}>
        <div style={s.bigNum}>404</div>
        <h1 style={s.title}>Page Not Found</h1>
        <p style={s.sub}>The page you're looking for doesn't exist or has been moved.</p>
        <p style={s.redirect}>Redirecting home in <strong>{count}s</strong></p>
        <div style={s.actions}>
          <Link to="/" style={s.btnPrimary}>Go Home</Link>
          <Link to="/items" style={s.btnSecondary}>Browse Products</Link>
        </div>
      </div>
    </div>
  )
}

const s = {
  page: {
    minHeight: 'calc(100vh - 60px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#fff', textAlign: 'center', padding: '24px 20px',
  },
  inner: { maxWidth: 440 },
  bigNum: {
    fontSize: 'clamp(100px, 25vw, 180px)', fontWeight: 900, lineHeight: 1,
    color: '#f0f0f0', letterSpacing: '-0.05em', userSelect: 'none',
  },
  title: { fontSize: 'clamp(22px, 5vw, 32px)', fontWeight: 900, letterSpacing: '-0.02em', color: '#111', marginBottom: 10, marginTop: -10 },
  sub: { fontSize: 15, color: '#757575', lineHeight: 1.6, marginBottom: 8 },
  redirect: { fontSize: 13, color: '#aaa', marginBottom: 32 },
  actions: { display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' },
  btnPrimary: {
    display: 'inline-block', backgroundColor: '#111', color: '#fff',
    padding: '13px 32px', borderRadius: 30, fontWeight: 700, fontSize: 14, textDecoration: 'none',
  },
  btnSecondary: {
    display: 'inline-block', backgroundColor: '#fff', color: '#111',
    padding: '12px 32px', borderRadius: 30, fontWeight: 700, fontSize: 14,
    border: '2px solid #111', textDecoration: 'none',
  },
}
