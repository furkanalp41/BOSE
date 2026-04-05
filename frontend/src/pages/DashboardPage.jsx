import { useState } from 'react'
import { motion } from 'framer-motion'
import Sidebar from '../components/layout/Sidebar'

// Overview
import BalanceHero from '../components/dashboard/BalanceHero'
import PortfolioChart from '../components/dashboard/PortfolioChart'

// Market
import { useMarketSocket } from '../hooks/useMarketSocket'
import StatusBar from '../components/market/StatusBar'
import TickerTape from '../components/market/TickerTape'
import AssetCard from '../components/market/AssetCard'
import DetailPanel from '../components/market/DetailPanel'

// Trading (Cem)
import OrderForm from '../components/trading/OrderForm'
import OrderSummary from '../components/trading/OrderSummary'
import PositionsList from '../components/trading/PositionsList'
import TradeHistory from '../components/trading/TradeHistory'

// Watchlist & Alerts (Arda)
import WatchlistManager from '../components/watchlist/WatchlistManager'
import AlertsManager from '../components/watchlist/AlertsManager'

// AI Analysis (Enes)
import PortfolioAnalysis from './PortfolioAnalysis'
import WatchlistAnalysis from './WatchlistAnalysis'
import TransactionAnalysis from './TransactionAnalysis'
import AIChat from './AIChat'

// Leaderboard
import RankTable from '../components/leaderboard/RankTable'
import BadgeDisplay from '../components/leaderboard/BadgeDisplay'

// Profile
import ProfileCard from '../components/dashboard/ProfileCard'
import AIPreferences from '../components/dashboard/AIPreferences'
import DangerZone from '../components/dashboard/DangerZone'

// Admin (Furkan)
import AdminPanel from './AdminPanel'

const MARKET_CATEGORIES = ['all', 'crypto', 'bist', 'nasdaq']

function OverviewSection() {
  return (
    <div className="space-y-6">
      <BalanceHero />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PortfolioChart />
        <PositionsList />
      </div>
      <TradeHistory />
    </div>
  )
}

function MarketSection() {
  const { prices, history, assets, status } = useMarketSocket()
  const [selectedSymbol, setSelectedSymbol] = useState(null)
  const [filter, setFilter] = useState('all')

  const filtered = filter === 'all' ? assets : assets.filter(a => a.category === filter)
  const selectedAsset = assets.find(a => a.symbol === selectedSymbol) ?? null

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <StatusBar status={status} />
        <span className="text-silver/30 text-[10px] font-mono">
          {assets.length} assets tracked · Prices update every 2s
        </span>
      </div>

      {assets.length > 0 && <TickerTape prices={prices} assets={assets} />}

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-80 xl:w-96 flex flex-col gap-4 shrink-0">
          <div className="flex gap-2 flex-wrap">
            {MARKET_CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setFilter(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold uppercase tracking-wider transition-all
                  ${filter === cat
                    ? 'bg-brand/20 text-brand border border-brand/30 shadow-glow-brand'
                    : 'text-white/40 border border-white/8 hover:text-white/70 hover:border-white/15'}`}>
                {cat}
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-3 overflow-y-auto pr-1" style={{ maxHeight: 'calc(100vh - 280px)' }}>
            {filtered.length === 0 ? (
              <div className="text-white/25 text-xs font-mono text-center py-8">Loading assets…</div>
            ) : (
              filtered.map(asset => (
                <AssetCard key={asset.symbol} asset={asset} price={prices[asset.symbol]}
                  history={history[asset.symbol]} selected={selectedSymbol === asset.symbol}
                  onSelect={() => setSelectedSymbol(prev => prev === asset.symbol ? null : asset.symbol)} />
              ))
            )}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <DetailPanel asset={selectedAsset}
            price={selectedAsset ? prices[selectedAsset.symbol] : null}
            history={selectedAsset ? history[selectedAsset.symbol] : null} />
        </div>
      </div>
    </div>
  )
}

function TradingSection() {
  const [refreshKey, setRefreshKey] = useState(0)
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OrderForm onOrderPlaced={() => setRefreshKey(k => k + 1)} />
        <OrderSummary refreshKey={refreshKey} />
      </div>
      <TradeHistory />
    </div>
  )
}

function WatchlistSection() { return <WatchlistManager /> }
function AlertsSection() { return <AlertsManager /> }
function PortfolioAnalysisSection() { return <PortfolioAnalysis /> }
function WatchlistAnalysisSection() { return <WatchlistAnalysis /> }
function TransactionAnalysisSection() { return <TransactionAnalysis /> }
function AIChatSection() { return <AIChat /> }

function LeaderboardSection() {
  return (
    <div className="space-y-6">
      <RankTable />
      <BadgeDisplay />
    </div>
  )
}

function ProfileSection() {
  return (
    <div className="space-y-6">
      <ProfileCard />
      <AIPreferences />
      <DangerZone />
    </div>
  )
}

function AdminSection() { return <AdminPanel /> }

const SECTIONS = {
  overview: OverviewSection,
  markets: MarketSection,
  trading: TradingSection,
  watchlists: WatchlistSection,
  alerts: AlertsSection,
  'portfolio-analysis': PortfolioAnalysisSection,
  'watchlist-analysis': WatchlistAnalysisSection,
  'transaction-analysis': TransactionAnalysisSection,
  'ai-chat': AIChatSection,
  leaderboard: LeaderboardSection,
  profile: ProfileSection,
  admin: AdminSection,
}

const SECTION_TITLES = {
  overview: 'Dashboard Overview',
  markets: 'Live Market',
  trading: 'Trading Terminal',
  watchlists: 'Watchlists',
  alerts: 'Price Alerts',
  'portfolio-analysis': 'Portfolio Analysis',
  'watchlist-analysis': 'Watchlist Analysis',
  'transaction-analysis': 'Transaction Analysis',
  'ai-chat': 'AI Chat',
  leaderboard: 'Leaderboard',
  profile: 'Account Settings',
  admin: 'Admin Panel',
}

export default function DashboardPage() {
  const [activeSection, setActiveSection] = useState('overview')
  const ActiveComponent = SECTIONS[activeSection] || OverviewSection

  return (
    <div className="flex min-h-screen bg-void">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />

      <main className="flex-1 overflow-y-auto">
        <div className="sticky top-0 z-10 glass border-b border-border px-8 py-4 flex items-center justify-between">
          <h2 className="text-cloud font-bold text-lg">{SECTION_TITLES[activeSection]}</h2>
          <div className="flex items-center gap-2 text-silver/40 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-neon animate-pulse" />
            Live
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
