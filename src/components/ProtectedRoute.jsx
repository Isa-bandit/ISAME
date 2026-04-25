import { Navigate, useLocation } from 'react-router-dom'
import { useApp } from './AppContext'

export default function ProtectedRoute({ children }) {
  const { user } = useApp()
  const location = useLocation()

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}
