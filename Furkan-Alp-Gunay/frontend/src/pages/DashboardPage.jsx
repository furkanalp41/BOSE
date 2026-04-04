import { useState } from 'react'
import { motion } from 'framer-motion'
import Sidebar from '../components/layout/Sidebar'

// Profile
import ProfileCard from '../components/dashboard/ProfileCard'
import AIPreferences from '../components/dashboard/AIPreferences'
import DangerZone from '../components/dashboard/DangerZone'

function OverviewSection() {
  return (
    <div className="space-y-6">
      <ProfileCard />
      <AIPreferences />
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

const SECTIONS = {
  overview: OverviewSection,
  profile: ProfileSection,
}

const SECTION_TITLES = {
  overview: 'Dashboard Overview',
  profile: 'Account Settings',
}

export default function DashboardPage() {
  const [activeSection, setActiveSection] = useState('overview')
  const ActiveComponent = SECTIONS[activeSection] || OverviewSection

  return (
    <div className="flex min-h-screen bg-void">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />

      <main className="flex-1 overflow-y-auto">
        {/* Top bar */}
        <div className="sticky top-0 z-10 glass border-b border-border px-8 py-4 flex items-center justify-between">
          <h2 className="text-cloud font-bold text-lg">{SECTION_TITLES[activeSection]}</h2>
          <div className="flex items-center gap-2 text-silver/40 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-neon animate-pulse" />
            Live
          </div>
        </div>

        {/* Content */}
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
