import { useEffect, useState } from 'react'
import { BrainCircuit, Flame, MessageCircle, Target, TrendingUp } from 'lucide-react'
import { ChatView } from './components/ChatView'
import { MemoryView } from './components/MemoryView'
import { GoalsView } from './components/GoalsView'
import { DashboardView } from './components/DashboardView'
import { useAppStore } from './store/useAppStore'

type Tab = 'chat' | 'memories' | 'goals' | 'growth'

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'chat', label: 'Chat', icon: <MessageCircle size={19} /> },
  { id: 'memories', label: 'Memory', icon: <BrainCircuit size={19} /> },
  { id: 'goals', label: 'Goals', icon: <Target size={19} /> },
  { id: 'growth', label: 'Growth', icon: <TrendingUp size={19} /> },
]

export default function App() {
  const [tab, setTab] = useState<Tab>('chat')
  const streak = useAppStore((s) => s.streak)
  const touchActivity = useAppStore((s) => s.touchActivity)

  useEffect(() => {
    touchActivity()
  }, [touchActivity])

  return (
    <div className="flex h-dvh flex-col bg-[#0b0b14] text-slate-100">
      <header className="flex items-center justify-between border-b border-white/10 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-400 to-brand-600">
            <BrainCircuit size={17} className="text-white" />
          </div>
          <span className="text-sm font-semibold tracking-tight">My Assistant</span>
        </div>
        {streak > 0 && (
          <div className="flex items-center gap-1 rounded-full bg-orange-500/15 px-2.5 py-1 text-xs font-medium text-orange-300">
            <Flame size={13} /> {streak}
          </div>
        )}
      </header>

      <div className="flex min-h-0 flex-1">
        <nav className="hidden w-56 shrink-0 flex-col gap-1 border-r border-white/10 p-3 sm:flex">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
                tab === t.id ? 'bg-brand-500/20 text-brand-300' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </nav>

        <main className="min-h-0 flex-1">
          {tab === 'chat' && <ChatView />}
          {tab === 'memories' && <MemoryView />}
          {tab === 'goals' && <GoalsView />}
          {tab === 'growth' && <DashboardView />}
        </main>
      </div>

      <nav className="flex border-t border-white/10 sm:hidden" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium ${
              tab === t.id ? 'text-brand-300' : 'text-slate-500'
            }`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </nav>
    </div>
  )
}
