import { createContext, useContext, useState, useEffect } from 'react'

const AppContext = createContext()
const ADMIN_SECRET = 'final wish'

export function AppProvider({ children }) {
  const [products, setProducts] = useState([])
  const [user, setUser] = useState(
    () => JSON.parse(localStorage.getItem('nikeUser')) || null
  )
  const [favorites, setFavorites] = useState([])
  const [isAdmin, setIsAdmin] = useState(
    () => localStorage.getItem('nikeAdmin') === 'true'
  )

  useEffect(() => {
    const stored = localStorage.getItem('nikeProducts')
    if (stored) setProducts(JSON.parse(stored))
  }, [])

  useEffect(() => {
    if (user) {
      const stored = localStorage.getItem(`favorites_${user.id}`)
      setFavorites(stored ? JSON.parse(stored) : [])
    } else {
      setFavorites([])
    }
  }, [user])

  const enterAdminMode = (secret) => {
    if (secret.trim().toLowerCase() === ADMIN_SECRET) {
      setIsAdmin(true)
      localStorage.setItem('nikeAdmin', 'true')
      return { success: true }
    }
    return { success: false, error: 'Wrong secret phrase' }
  }

  const exitAdminMode = () => {
    setIsAdmin(false)
    localStorage.removeItem('nikeAdmin')
  }

  const addProduct = (product) => {
    const newProduct = { ...product, id: Date.now(), userId: user ? user.id : null }
    const updated = [newProduct, ...products]
    setProducts(updated)
    localStorage.setItem('nikeProducts', JSON.stringify(updated))
  }

  const deleteProduct = (id) => {
    const updated = products.filter(p => String(p.id) !== String(id))
    setProducts(updated)
    localStorage.setItem('nikeProducts', JSON.stringify(updated))
  }

  const updateProduct = (id, updatedData) => {
    const updated = products.map(p =>
      String(p.id) === String(id) ? { ...p, ...updatedData } : p
    )
    setProducts(updated)
    localStorage.setItem('nikeProducts', JSON.stringify(updated))
  }

  const toggleFavorite = (productId) => {
    if (!user) return
    const id = String(productId)
    const isFav = favorites.includes(id)
    const updated = isFav ? favorites.filter(f => f !== id) : [...favorites, id]
    setFavorites(updated)
    localStorage.setItem(`favorites_${user.id}`, JSON.stringify(updated))
  }

  const isFavorite = (productId) => favorites.includes(String(productId))

  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem('nikeUsers') || '[]')
    const found = users.find(u => u.email === email && u.password === password)
    if (found) {
      setUser(found)
      localStorage.setItem('nikeUser', JSON.stringify(found))
      return { success: true }
    }
    return { success: false, error: 'Invalid email or password' }
  }

  const register = (name, email, password) => {
    const users = JSON.parse(localStorage.getItem('nikeUsers') || '[]')
    if (users.find(u => u.email === email)) {
      return { success: false, error: 'Email already registered' }
    }
    const newUser = { id: Date.now(), name, email, password }
    localStorage.setItem('nikeUsers', JSON.stringify([...users, newUser]))
    setUser(newUser)
    localStorage.setItem('nikeUser', JSON.stringify(newUser))
    return { success: true }
  }

const logout = () => {
  setUser(null)
  setFavorites([])
  setIsAdmin(false)                   
  localStorage.removeItem('nikeUser')
  localStorage.removeItem('nikeAdmin')
}

  const visibleProducts = isAdmin
    ? products
    : products.filter(p => !p.userId || (user && String(p.userId) === String(user.id)))

  return (
    <AppContext.Provider value={{
      products,
      visibleProducts,
      setProducts,
      addProduct,
      deleteProduct,
      updateProduct,
      favorites,
      toggleFavorite,
      isFavorite,
      user,
      login,
      register,
      logout,
      isAdmin,
      enterAdminMode,
      exitAdminMode,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
