import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute() {
  const { token, loading } = useAuth()
  if (loading) return <div className="min-h-screen bg-void flex items-center justify-center text-silver">Yukleniyor...</div>
  return token ? <Outlet /> : <Navigate to="/login" replace />
}
