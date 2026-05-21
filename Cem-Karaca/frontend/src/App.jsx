import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import MarketAssets from './pages/MarketAssets'
import OrderHistory from './pages/OrderHistory'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/market" element={<MarketAssets />} />
        <Route path="/orders" element={<OrderHistory />} />
      </Route>
      <Route path="*" element={<Navigate to="/market" replace />} />
    </Routes>
  )
}
