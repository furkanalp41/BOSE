import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute() {
  const { token, loading } = useAuth()
  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">Yukleniyor...</div>
  return token ? <Outlet /> : <Navigate to="/login" replace />
}
