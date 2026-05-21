import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import AIReportGenerator from './pages/AIReportGenerator'
import AIAnalysisView from './pages/AIAnalysisView'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/analysis" element={<AIReportGenerator />} />
        <Route path="/chat" element={<AIAnalysisView />} />
      </Route>
      <Route path="*" element={<Navigate to="/analysis" replace />} />
    </Routes>
  )
}
