import { useState } from 'react'
import { Check, ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import type { Goal } from '../types'

function GoalCard({ goal }: { goal: Goal }) {
  const toggleMilestone = useAppStore((s) => s.toggleMilestone)
  const addMilestone = useAppStore((s) => s.addMilestone)
  const removeGoal = useAppStore((s) => s.removeGoal)
  const setGoalStatus = useAppStore((s) => s.setGoalStatus)
  const [expanded, setExpanded] = useState(true)
  const [newMilestone, setNewMilestone] = useState('')

  const done = goal.milestones.filter((m) => m.done).length
  const total = goal.milestones.length
  const pct = total > 0 ? Math.round((done / total) * 100) : goal.status === 'done' ? 100 : 0

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-3.5">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className={`truncate text-sm font-semibold ${goal.status === 'done' ? 'text-slate-500 line-through' : 'text-slate-100'}`}>
              {goal.title}
            </h3>
          </div>
          {goal.why && <p className="mt-0.5 text-xs text-slate-400">{goal.why}</p>}
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => setExpanded((v) => !v)} className="text-slate-500 hover:text-slate-300">
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          <button onClick={() => removeGoal(goal.id)} className="text-slate-500 hover:text-red-400">
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-black/30">
        <div className="h-full rounded-full bg-brand-500 transition-all" style={{ width: `${pct}%` }} />
      </div>
      <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500">
        <span>{total > 0 ? `${done}/${total} milestones` : 'No milestones yet'}</span>
        <select
          value={goal.status}
          onChange={(e) => setGoalStatus(goal.id, e.target.value as Goal['status'])}
          className="rounded border border-white/10 bg-black/20 px-1.5 py-0.5 text-[11px] text-slate-300"
        >
          <option value="active">Active</option>
          <option value="paused">Paused</option>
          <option value="done">Done</option>
        </select>
      </div>

      {expanded && (
        <div className="mt-3 space-y-1.5 border-t border-white/5 pt-2.5">
          {goal.milestones.map((m) => (
            <button
              key={m.id}
              onClick={() => toggleMilestone(goal.id, m.id)}
              className="flex w-full items-center gap-2 text-left text-xs"
            >
              <span
                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                  m.done ? 'border-brand-500 bg-brand-500 text-white' : 'border-white/20'
                }`}
              >
                {m.done && <Check size={11} />}
              </span>
              <span className={m.done ? 'text-slate-500 line-through' : 'text-slate-300'}>{m.text}</span>
            </button>
          ))}
          <div className="flex items-center gap-1.5 pt-1">
            <input
              value={newMilestone}
              onChange={(e) => setNewMilestone(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && newMilestone.trim()) {
                  addMilestone(goal.id, newMilestone)
                  setNewMilestone('')
                }
              }}
              placeholder="Add a milestone..."
              className="flex-1 rounded-lg border border-white/10 bg-black/20 px-2 py-1 text-xs text-slate-200 placeholder:text-slate-600 focus:border-brand-400 focus:outline-none"
            />
          </div>
        </div>
      )}
    </div>
  )
}

export function GoalsView() {
  const goals = useAppStore((s) => s.goals)
  const addGoal = useAppStore((s) => s.addGoal)
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [why, setWhy] = useState('')

  function handleAdd() {
    if (!title.trim()) return
    addGoal(title, why)
    setTitle('')
    setWhy('')
    setShowForm(false)
  }

  const active = goals.filter((g) => g.status !== 'done')
  const done = goals.filter((g) => g.status === 'done')

  return (
    <div className="mx-auto flex h-full max-w-2xl flex-col px-4 py-4 sm:px-6">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-100">Goals</h2>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-1 rounded-full bg-brand-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-600"
        >
          <Plus size={14} /> New goal
        </button>
      </div>

      {showForm && (
        <div className="mb-4 space-y-2 rounded-xl border border-white/10 bg-white/5 p-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What do you want to achieve?"
            className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-brand-400 focus:outline-none"
          />
          <input
            value={why}
            onChange={(e) => setWhy(e.target.value)}
            placeholder="Why does this matter to you? (optional)"
            className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-brand-400 focus:outline-none"
          />
          <div className="flex justify-end">
            <button onClick={handleAdd} className="rounded-full bg-brand-500 px-4 py-1.5 text-xs font-medium text-white hover:bg-brand-600">
              Create
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 space-y-2 overflow-y-auto pb-4">
        {goals.length === 0 && (
          <p className="mt-8 text-center text-sm text-slate-500">
            No goals yet. Set one, or just tell your assistant what you're working toward in chat.
          </p>
        )}
        {active.map((g) => (
          <GoalCard key={g.id} goal={g} />
        ))}
        {done.length > 0 && (
          <>
            <p className="pt-2 text-xs font-medium uppercase tracking-wide text-slate-500">Completed</p>
            {done.map((g) => (
              <GoalCard key={g.id} goal={g} />
            ))}
          </>
        )}
      </div>
    </div>
  )
}
