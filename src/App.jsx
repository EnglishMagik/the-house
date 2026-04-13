import React, { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import NavBar from './components/shared/NavBar'
import Toast from './components/shared/Toast'
import NeighbourhoodPage from './pages/NeighbourhoodPage'
import HousePage from './pages/HousePage'
import MyHousePage from './pages/MyHousePage'
import AuthPage from './pages/AuthPage'
import AdminPage from './pages/AdminPage'
import LoadingScreen from './components/shared/LoadingScreen'

export default function App() {
  const { init, loading } = useAuthStore()

  useEffect(() => { init() }, [])

  if (loading) return <LoadingScreen />

  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/"            element={<NeighbourhoodPage />} />
        <Route path="/auth"        element={<AuthPage />} />
        <Route path="/my-house"    element={<ProtectedRoute><MyHousePage /></ProtectedRoute>} />
        <Route path="/admin"       element={<AdminRoute><AdminPage /></AdminRoute>} />
        <Route path="/:username"   element={<HousePage />} />
        <Route path="*"            element={<Navigate to="/" replace />} />
      </Routes>
      <Toast />
    </>
  )
}

function ProtectedRoute({ children }) {
  const user = useAuthStore((s) => s.user)
  return user ? children : <Navigate to="/auth" replace />
}

function AdminRoute({ children }) {
  const profile = useAuthStore((s) => s.profile)
  return profile?.is_admin ? children : <Navigate to="/" replace />
}
