import { useMemo, useState } from 'react'
import { Flame, Smile } from 'lucide-react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useAppStore } from '../store/useAppStore'

function StatCard({ label, value, icon }: { label: string; value: string | number; icon: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3.5">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500/20 text-brand-300">{icon}</div>
      <div>
        <p className="text-lg font-semibold leading-tight text-slate-100">{value}</p>
        <p className="text-[11px] text-slate-500">{label}</p>
      </div>
    </div>
  )
}

export function DashboardView() {
  const streak = useAppStore((s) => s.streak)
  const checkIns = useAppStore((s) => s.checkIns)
  const goals = useAppStore((s) => s.goals)
  const memories = useAppStore((s) => s.memories)
  const addCheckIn = useAppStore((s) => s.addCheckIn)

  const [mood, setMood] = useState(3)
  const [energy, setEnergy] = useState(3)
  const [note, setNote] = useState('')

  const alreadyCheckedInToday = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10)
    return checkIns.some((c) => c.date.slice(0, 10) === today)
  }, [checkIns])

  const chartData = useMemo(
    () =>
      [...checkIns]
        .slice(0, 14)
        .reverse()
        .map((c) => ({
          date: new Date(c.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
          mood: c.mood,
          energy: c.energy,
        })),
    [checkIns],
  )

  const goalsDone = goals.filter((g) => g.status === 'done').length

  function submitCheckIn() {
    addCheckIn(mood, energy, note)
    setNote('')
  }

  return (
    <div className="mx-auto h-full max-w-2xl overflow-y-auto px-4 py-4 sm:px-6">
      <h2 className="mb-3 text-lg font-semibold text-slate-100">Your growth</h2>

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        <StatCard label="day streak" value={streak} icon={<Flame size={17} />} />
        <StatCard label="memories saved" value={memories.length} icon={<Smile size={17} />} />
        <StatCard label="goals completed" value={goalsDone} icon={<Smile size={17} />} />
        <StatCard label="check-ins" value={checkIns.length} icon={<Smile size={17} />} />
      </div>

      <div className="mt-5 rounded-xl border border-white/10 bg-white/5 p-4">
        <h3 className="text-sm font-semibold text-slate-100">Mood & energy trend</h3>
        {chartData.length === 0 ? (
          <p className="mt-6 text-center text-sm text-slate-500">Check in below to start your trend line.</p>
        ) : (
          <div className="mt-2 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="moodGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b7ff2" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#8b7ff2" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="energyGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#34d399" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#34d399" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="date" stroke="rgba(255,255,255,0.3)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis domain={[0, 5]} stroke="rgba(255,255,255,0.3)" fontSize={11} tickLine={false} axisLine={false} width={20} />
                <Tooltip
                  contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }}
                />
                <Area type="monotone" dataKey="mood" stroke="#8b7ff2" fill="url(#moodGrad)" strokeWidth={2} name="Mood" />
                <Area type="monotone" dataKey="energy" stroke="#34d399" fill="url(#energyGrad)" strokeWidth={2} name="Energy" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="mt-5 rounded-xl border border-white/10 bg-white/5 p-4">
        <h3 className="text-sm font-semibold text-slate-100">Daily check-in</h3>
        {alreadyCheckedInToday ? (
          <p className="mt-2 text-sm text-slate-400">You've already checked in today. Nice work — see you tomorrow.</p>
        ) : (
          <>
            <div className="mt-3">
              <label className="text-xs text-slate-400">Mood: {mood}/5</label>
              <input
                type="range"
                min={1}
                max={5}
                value={mood}
                onChange={(e) => setMood(Number(e.target.value))}
                className="mt-1 w-full accent-brand-500"
              />
            </div>
            <div className="mt-3">
              <label className="text-xs text-slate-400">Energy: {energy}/5</label>
              <input
                type="range"
                min={1}
                max={5}
                value={energy}
                onChange={(e) => setEnergy(Number(e.target.value))}
                className="mt-1 w-full accent-emerald-500"
              />
            </div>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Anything you want to remember about today? (optional)"
              rows={2}
              className="mt-3 w-full resize-none rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-brand-400 focus:outline-none"
            />
            <button
              onClick={submitCheckIn}
              className="mt-3 w-full rounded-full bg-brand-500 py-2 text-sm font-medium text-white hover:bg-brand-600"
            >
              Save check-in
            </button>
          </>
        )}
      </div>
    </div>
  )
}
