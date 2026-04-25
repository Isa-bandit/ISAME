import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppProvider } from './components/AppContext'
import Navbar from './components/Navbar'

import Home       from './pages/Home'
import List       from './pages/List'
import Details    from './pages/Details'
import Create     from './pages/Create'
import Edit       from './pages/Edit'
import Delete     from './pages/Delete'
import Login      from './pages/Login'
import Register   from './pages/Register'
import Dashboard  from './pages/Dashboard'
import Profile    from './pages/Profile'
import Favorites  from './pages/Favorites'
import AboutUs    from './pages/AboutUs'
import AdminPanel from './pages/AdminPanel'
import NotFound   from './pages/NotFound'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* Public */}
          <Route path="/"         element={<Home />} />
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about"    element={<AboutUs />} />

          {/* Items — public */}
          <Route path="/items"     element={<List />} />
          <Route path="/items/:id" element={<Details />} />

          {/* Items — protected */}
          <Route path="/items/create"     element={<ProtectedRoute><Create /></ProtectedRoute>} />
          <Route path="/items/:id/edit"   element={<ProtectedRoute><Edit /></ProtectedRoute>} />
          <Route path="/items/:id/delete" element={<ProtectedRoute><Delete /></ProtectedRoute>} />

          {/* Protected pages */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/profile"   element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
          <Route path="/admin"     element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}
