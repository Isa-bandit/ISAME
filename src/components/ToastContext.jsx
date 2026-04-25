import { createContext, useContext, useState, useCallback } from 'react'

const ToastContext = createContext()

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 350000)
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)

function ToastContainer({ toasts, onRemove }) {
  if (toasts.length === 0) return null

  return (
    <div style={styles.container}>
      {toasts.map(toast => (
        <div
          key={toast.id}
          style={{
            ...styles.toast,
            backgroundColor: toast.type === 'error' ? '#d32f2f' : toast.type === 'info' ? '#1565c0' : '#2e7d32',
          }}
        >
          <span style={styles.icon}>
            {toast.type === 'error' ? '✕' : toast.type === 'info' ? 'ℹ' : '✓'}
          </span>
          <span style={styles.message}>{toast.message}</span>
          <button style={styles.close} onClick={() => onRemove(toast.id)}>✕</button>
        </div>
      ))}
    </div>
  )
}

const styles = {
  container: {
    position: 'fixed',
    bottom: 32,
    right: 32,
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    maxWidth: 380,
  },
  toast: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '14px 18px',
    borderRadius: 12,
    color: '#fff',
    fontSize: 14,
    fontWeight: 500,
    boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
    animation: 'slideIn 0.3s ease',
  },
  icon: { fontSize: 16, fontWeight: 700, flexShrink: 0 },
  message: { flex: 1, lineHeight: 1.4 },
  close: {
    background: 'none',
    border: 'none',
    color: 'rgba(255,255,255,0.7)',
    cursor: 'pointer',
    fontSize: 14,
    padding: 2,
    flexShrink: 0,
  },
}
