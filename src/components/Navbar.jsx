import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useApp } from './AppContext'

export default function Navbar() {
  const { user, logout, favorites, isAdmin, exitAdminMode, enterAdminMode } = useApp()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [secretInput, setSecretInput] = useState('')
  const [showSecretBox, setShowSecretBox] = useState(false)
  const [secretError, setSecretError] = useState('')

  useEffect(() => { setMenuOpen(false) }, [location.pathname])

  const handleLogout = () => {
    logout()
    navigate('/')
    setMenuOpen(false)
  }

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path)

  const handleSecretSubmit = (e) => {
    e.preventDefault()
    const result = enterAdminMode(secretInput)
    if (result.success) {
      setShowSecretBox(false); setSecretInput(''); setSecretError('')
    } else {
      setSecretError(result.error)
    }
  }

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/items', label: 'Products' },
    { path: '/about', label: 'About' },
    ...(user ? [
      { path: '/dashboard', label: 'Dashboard' },
      { path: '/items/create', label: 'Create' },
      ...(isAdmin ? [{ path: '/admin', label: '⚡ Admin' }] : []),
    ] : []),
  ]

  const mobileLinks = [
    ...navLinks,
    ...(user ? [
      { path: '/profile', label: 'Profile' },
      { path: '/favorites', label: `Favorites${favorites.length ? ` (${favorites.length})` : ''}` },
    ] : [
      { path: '/login', label: 'Sign In' },
      { path: '/register', label: 'Join Us' },
    ]),
  ]

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .nav-links { display: none !important; }
          .nav-auth  { display: none !important; }
          .nav-burger { display: flex !important; }
        }
        @media (min-width: 769px) {
          .nav-mobile-menu { display: none !important; }
          .nav-secret-box-wrap { max-width: 1280px; margin: 0 auto; padding: 0 24px; }
        }
      `}</style>

      <nav style={styles.nav}>
        {isAdmin && (
          <div style={styles.adminBar}>
            <span>⚡ Admin Mode Active</span>
            <Link to="/admin" style={styles.adminLink}>Admin Panel</Link>
            <button style={styles.adminExit} onClick={exitAdminMode}>Exit</button>
          </div>
        )}

        <div style={styles.inner}>
          {/* Logo */}
          <Link to="/" style={styles.logo}>
            <svg viewBox="0 0 100 40" width="56" height="22" fill="currentColor">
              <path d="M7.26,19.6C3.8,23.85,0,24.78,0,24.78c-.19.06.12-.24.12-.24L19.87,2.46A8.3,8.3,0,0,1,25.5.52a4.5,4.5,0,0,1,4.77,5c-.53,3.06-3.65,5.71-3.65,5.71L7.26,19.6Z"/>
            </svg>
          </Link>

          {/* Desktop nav links */}
          <div className="nav-links" style={styles.links}>
            {navLinks.map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                style={{
                  ...styles.link,
                  borderBottomColor: isActive(path) ? '#111' : 'transparent',
                  fontWeight: isActive(path) ? 700 : 500,
                }}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Desktop auth */}
          <div className="nav-auth" style={styles.auth}>
            {user ? (
              <div style={styles.userRow}>
                <Link to="/favorites" style={styles.favBtn} title="Favorites">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill={favorites.length ? '#e53935' : 'none'} stroke={favorites.length ? '#e53935' : '#111'} strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                  {favorites.length > 0 && <span style={styles.favBadge}>{favorites.length}</span>}
                </Link>
                <Link to="/profile" style={styles.avatarBtn} title={user.name}>
                  {user.name.charAt(0).toUpperCase()}
                </Link>
                <button style={styles.btnOutline} onClick={handleLogout}>Sign Out</button>
              </div>
            ) : (
              <div style={styles.userRow}>
                <Link to="/login" style={{ ...styles.link, borderBottomColor: isActive('/login') ? '#111' : 'transparent' }}>Sign In</Link>
                <Link to="/register" style={styles.btnFilled}>Join Us</Link>
              </div>
            )}
            {user && !isAdmin && (
              <button style={styles.gearBtn} onClick={() => { setShowSecretBox(v => !v); setSecretError('') }} title="Admin access">⚙</button>
            )}
          </div>

          {/* Burger */}
          <button
            className="nav-burger"
            style={styles.burger}
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Menu"
            aria-expanded={menuOpen}
          >
            <span style={{ ...styles.bLine, transform: menuOpen ? 'rotate(45deg) translateY(7px)' : 'none' }} />
            <span style={{ ...styles.bLine, opacity: menuOpen ? 0 : 1, transform: menuOpen ? 'scaleX(0)' : 'none' }} />
            <span style={{ ...styles.bLine, transform: menuOpen ? 'rotate(-45deg) translateY(-7px)' : 'none' }} />
          </button>
        </div>

        {/* Secret box */}
        {showSecretBox && !isAdmin && (
          <div style={styles.secretWrap}>
            <form onSubmit={handleSecretSubmit} style={styles.secretForm}>
              <input
                autoFocus
                style={styles.secretInput}
                type="text"
                placeholder="Enter admin secret phrase…"
                value={secretInput}
                onChange={e => { setSecretInput(e.target.value); setSecretError('') }}
              />
              <button type="submit" style={styles.secretBtn}>Enter</button>
              <button type="button" style={styles.secretCancel} onClick={() => { setShowSecretBox(false); setSecretInput(''); setSecretError('') }}>✕</button>
            </form>
            {secretError && <p style={styles.secretError}>{secretError}</p>}
          </div>
        )}

        {/* Mobile menu */}
        <div
          className="nav-mobile-menu"
          style={{
            ...styles.mobileMenu,
            maxHeight: menuOpen ? '100vh' : 0,
            paddingTop: menuOpen ? 8 : 0,
            paddingBottom: menuOpen ? 16 : 0,
            overflow: 'hidden',
            transition: 'max-height 0.3s ease, padding 0.2s ease',
          }}
        >
          {mobileLinks.map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              style={{
                ...styles.mobileLink,
                backgroundColor: isActive(path) ? '#f5f5f5' : 'transparent',
                fontWeight: isActive(path) ? 700 : 500,
              }}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </Link>
          ))}
          {user && (
            <>
              <div style={styles.mobileDivider} />
              <div style={styles.mobileUserInfo}>
                <div style={styles.mobileAvatar}>{user.name.charAt(0).toUpperCase()}</div>
                <div>
                  <p style={styles.mobileUserName}>{user.name}</p>
                  <p style={styles.mobileUserEmail}>{user.email}</p>
                </div>
              </div>
              {!isAdmin && (
                <button
                  style={styles.mobileSecretBtn}
                  onClick={() => { setShowSecretBox(v => !v); setMenuOpen(false) }}
                >
                  ⚙ Admin Access
                </button>
              )}
              <button style={styles.mobileLogout} onClick={handleLogout}>Sign Out</button>
            </>
          )}
        </div>
      </nav>
    </>
  )
}

const styles = {
  nav: {
    position: 'sticky', top: 0, zIndex: 100,
    backgroundColor: '#fff', borderBottom: '1px solid #e5e5e5',
  },
  adminBar: {
    backgroundColor: '#fff8e1', borderBottom: '1px solid #ffe082',
    padding: '7px 16px', fontSize: 12, fontWeight: 600, color: '#f57f17',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    gap: 12, flexWrap: 'wrap',
  },
  adminLink: { color: '#f57f17', fontSize: 12, fontWeight: 700, textDecoration: 'underline' },
  adminExit: {
    backgroundColor: '#f57f17', color: '#fff', border: 'none',
    borderRadius: 20, padding: '3px 12px', fontSize: 11, fontWeight: 700, cursor: 'pointer',
  },
  inner: {
    maxWidth: 1280, margin: '0 auto', padding: '0 16px',
    height: 60, display: 'flex', alignItems: 'center',
    justifyContent: 'space-between', gap: 16,
  },
  logo: { color: '#111', flexShrink: 0, display: 'flex', alignItems: 'center' },
  links: { display: 'flex', gap: 24, flex: 1, justifyContent: 'center', alignItems: 'center' },
  link: {
    fontSize: 14, color: '#111', letterSpacing: '0.02em',
    paddingBottom: 3, borderBottom: '2px solid transparent',
    transition: 'border-color 0.15s', textDecoration: 'none',
  },
  auth: { display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 },
  userRow: { display: 'flex', alignItems: 'center', gap: 10 },
  favBtn: {
    position: 'relative', display: 'flex', alignItems: 'center',
    justifyContent: 'center', width: 36, height: 36,
    borderRadius: '50%', textDecoration: 'none',
  },
  favBadge: {
    position: 'absolute', top: 0, right: 0,
    backgroundColor: '#111', color: '#fff', fontSize: 9, fontWeight: 700,
    borderRadius: '50%', width: 15, height: 15,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  avatarBtn: {
    width: 34, height: 34, borderRadius: '50%',
    backgroundColor: '#111', color: '#fff',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 13, fontWeight: 700, textDecoration: 'none', flexShrink: 0,
  },
  btnFilled: {
    display: 'inline-block', backgroundColor: '#111', color: '#fff',
    fontSize: 13, fontWeight: 600, letterSpacing: '0.04em',
    padding: '8px 18px', borderRadius: 30, textDecoration: 'none',
  },
  btnOutline: {
    backgroundColor: 'transparent', border: '1.5px solid #111', color: '#111',
    fontSize: 13, fontWeight: 600, padding: '7px 16px', borderRadius: 30, cursor: 'pointer',
  },
  gearBtn: {
    background: 'none', border: 'none', cursor: 'pointer',
    fontSize: 15, color: '#ccc', padding: 4, transition: 'color 0.2s',
  },
  burger: {
    display: 'none', flexDirection: 'column', gap: 5,
    background: 'none', padding: 6, border: 'none', cursor: 'pointer',
    borderRadius: 8, flexShrink: 0,
  },
  bLine: {
    display: 'block', width: 22, height: 2,
    backgroundColor: '#111', borderRadius: 2, transition: 'all 0.25s',
  },
  secretWrap: {
    backgroundColor: '#f9f9f9', borderTop: '1px solid #e5e5e5', padding: '12px 16px',
  },
  secretForm: { display: 'flex', gap: 8, maxWidth: 480, margin: '0 auto' },
  secretInput: {
    flex: 1, padding: '10px 14px', borderRadius: 8,
    border: '1.5px solid #e5e5e5', fontSize: 14, outline: 'none',
  },
  secretBtn: {
    padding: '10px 18px', backgroundColor: '#111', color: '#fff',
    border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontSize: 13,
  },
  secretCancel: {
    padding: '10px 12px', backgroundColor: 'transparent',
    border: '1.5px solid #e5e5e5', borderRadius: 8, cursor: 'pointer', color: '#999',
  },
  secretError: { color: '#d32f2f', fontSize: 12, textAlign: 'center', marginTop: 6 },

  // Mobile menu
  mobileMenu: {
    borderTop: '1px solid #f0f0f0', backgroundColor: '#fff',
    display: 'flex', flexDirection: 'column',
  },
  mobileLink: {
    padding: '13px 16px', fontSize: 15, color: '#111',
    textDecoration: 'none', borderRadius: 8, margin: '1px 8px',
    transition: 'background 0.15s',
  },
  mobileDivider: { height: 1, backgroundColor: '#f0f0f0', margin: '8px 16px' },
  mobileUserInfo: {
    display: 'flex', alignItems: 'center', gap: 12,
    padding: '10px 16px 8px',
  },
  mobileAvatar: {
    width: 38, height: 38, borderRadius: '50%', backgroundColor: '#111',
    color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 15, fontWeight: 700, flexShrink: 0,
  },
  mobileUserName: { fontSize: 14, fontWeight: 700, color: '#111', margin: 0 },
  mobileUserEmail: { fontSize: 12, color: '#757575', margin: 0 },
  mobileSecretBtn: {
    margin: '2px 8px', padding: '12px 16px', fontSize: 14,
    fontWeight: 500, color: '#757575', background: 'none',
    border: 'none', cursor: 'pointer', textAlign: 'left', borderRadius: 8,
  },
  mobileLogout: {
    margin: '2px 8px 4px', padding: '13px 16px', fontSize: 15,
    fontWeight: 600, color: '#d32f2f', background: 'none',
    border: 'none', cursor: 'pointer', textAlign: 'left', borderRadius: 8,
  },
}
