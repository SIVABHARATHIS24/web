import { useMemo, useState } from 'react'
import { Pin, PinOff, Plus, Trash2 } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import type { MemoryKind } from '../types'

const KIND_LABEL: Record<MemoryKind, string> = {
  fact: 'Fact',
  preference: 'Preference',
  'goal-related': 'Goal',
  reflection: 'Reflection',
  win: 'Win',
}

const KIND_COLOR: Record<MemoryKind, string> = {
  fact: 'bg-slate-500/20 text-slate-300',
  preference: 'bg-sky-500/20 text-sky-300',
  'goal-related': 'bg-brand-500/20 text-brand-300',
  reflection: 'bg-amber-500/20 text-amber-300',
  win: 'bg-emerald-500/20 text-emerald-300',
}

export function MemoryView() {
  const memories = useAppStore((s) => s.memories)
  const addMemory = useAppStore((s) => s.addMemory)
  const removeMemory = useAppStore((s) => s.removeMemory)
  const togglePin = useAppStore((s) => s.togglePinMemory)

  const [filter, setFilter] = useState<MemoryKind | 'all'>('all')
  const [showForm, setShowForm] = useState(false)
  const [text, setText] = useState('')
  const [kind, setKind] = useState<MemoryKind>('fact')

  const filtered = useMemo(() => {
    const list = filter === 'all' ? memories : memories.filter((m) => m.kind === filter)
    return [...list].sort((a, b) => Number(b.pinned) - Number(a.pinned) || b.createdAt.localeCompare(a.createdAt))
  }, [memories, filter])

  function handleAdd() {
    if (!text.trim()) return
    addMemory(text, kind)
    setText('')
    setShowForm(false)
  }

  return (
    <div className="mx-auto flex h-full max-w-2xl flex-col px-4 py-4 sm:px-6">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-100">Memory bank</h2>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-1 rounded-full bg-brand-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-600"
        >
          <Plus size={14} /> Add
        </button>
      </div>

      {showForm && (
        <div className="mb-4 rounded-xl border border-white/10 bg-white/5 p-3">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Something worth remembering..."
            rows={2}
            className="w-full resize-none rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-brand-400 focus:outline-none"
          />
          <div className="mt-2 flex items-center justify-between">
            <select
              value={kind}
              onChange={(e) => setKind(e.target.value as MemoryKind)}
              className="rounded-lg border border-white/10 bg-black/20 px-2 py-1 text-xs text-slate-200"
            >
              {Object.entries(KIND_LABEL).map(([k, label]) => (
                <option key={k} value={k}>
                  {label}
                </option>
              ))}
            </select>
            <button
              onClick={handleAdd}
              className="rounded-full bg-brand-500 px-4 py-1.5 text-xs font-medium text-white hover:bg-brand-600"
            >
              Save
            </button>
          </div>
        </div>
      )}

      <div className="mb-3 flex flex-wrap gap-1.5">
        {(['all', 'fact', 'preference', 'goal-related', 'reflection', 'win'] as const).map((k) => (
          <button
            key={k}
            onClick={() => setFilter(k)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition ${
              filter === k ? 'bg-brand-500 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'
            }`}
          >
            {k === 'all' ? 'All' : KIND_LABEL[k]}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <p className="mt-8 text-center text-sm text-slate-500">
            No memories yet. Chat with your assistant or add one manually.
          </p>
        ) : (
          <ul className="space-y-2 pb-4">
            {filtered.map((m) => (
              <li key={m.id} className="rounded-xl border border-white/10 bg-white/5 p-3">
                <div className="flex items-start justify-between gap-2">
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${KIND_COLOR[m.kind]}`}>
                    {KIND_LABEL[m.kind]}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => togglePin(m.id)}
                      className="text-slate-500 hover:text-brand-300"
                      aria-label="pin"
                    >
                      {m.pinned ? <Pin size={14} /> : <PinOff size={14} />}
                    </button>
                    <button
                      onClick={() => removeMemory(m.id)}
                      className="text-slate-500 hover:text-red-400"
                      aria-label="delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <p className="mt-1.5 text-sm text-slate-200">{m.text}</p>
                <p className="mt-1 text-[11px] text-slate-500">
                  {new Date(m.createdAt).toLocaleDateString()} · {m.source === 'chat' ? 'from chat' : 'manual'}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
