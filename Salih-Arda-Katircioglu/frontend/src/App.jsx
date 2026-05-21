import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import LiveTicker from './pages/LiveTicker'
import Watchlist from './pages/Watchlist'
import AlertsDashboard from './pages/AlertsDashboard'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/ticker" element={<LiveTicker />} />
        <Route path="/watchlist" element={<Watchlist />} />
        <Route path="/alerts" element={<AlertsDashboard />} />
      </Route>
      <Route path="*" element={<Navigate to="/ticker" replace />} />
    </Routes>
  )
}
