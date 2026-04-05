import { useState } from 'react'
import { motion } from 'framer-motion'
import Sidebar from '../components/layout/Sidebar'

// AI Analysis Pages
import PortfolioAnalysis from './PortfolioAnalysis'
import WatchlistAnalysis from './WatchlistAnalysis'
import TransactionAnalysis from './TransactionAnalysis'
import AIChat from './AIChat'

function PortfolioSection() { return <PortfolioAnalysis /> }
function WatchlistSection() { return <WatchlistAnalysis /> }
function TransactionsSection() { return <TransactionAnalysis /> }
function ChatSection() { return <AIChat /> }

const SECTIONS = {
  portfolio: PortfolioSection,
  watchlist: WatchlistSection,
  transactions: TransactionsSection,
  chat: ChatSection,
}

const SECTION_TITLES = {
  portfolio: 'Portfolio Analysis',
  watchlist: 'Watchlist Analysis',
  transactions: 'Transaction Analysis',
  chat: 'AI Chat',
}

export default function DashboardPage() {
  const [activeSection, setActiveSection] = useState('portfolio')
  const ActiveComponent = SECTIONS[activeSection] || PortfolioSection

  return (
    <div className="flex min-h-screen bg-void">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />

      <main className="flex-1 overflow-y-auto">
        <div className="sticky top-0 z-10 glass border-b border-border px-8 py-4 flex items-center justify-between">
          <h2 className="text-cloud font-bold text-lg">{SECTION_TITLES[activeSection]}</h2>
          <div className="flex items-center gap-2 text-silver/40 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-neon animate-pulse" />
            AI Powered
          </div>
        </div>

        <div className="p-6 md:p-8">
          <motion.div key={activeSection} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}>
            <ActiveComponent />
          </motion.div>
        </div>
      </main>
    </div>
  )
}
