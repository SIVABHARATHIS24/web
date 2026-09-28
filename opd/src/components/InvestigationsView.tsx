import { useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { useDayVisits, useOpdStore } from '../store/useOpdStore'
import { formatTime } from '../lib/date'
import type { Investigation, InvestigationType, Visit } from '../types'
import { Button, Card, Chips, Empty } from './ui'

const TYPES: InvestigationType[] = ['XRAY', 'LAB', 'ECG']

export function InvestigationsView() {
  const dayVisits = useDayVisits()
  const [types, setTypes] = useState<InvestigationType[]>([...TYPES])

  const rows = dayVisits
    .filter((v) => v.status !== 'not_coming')
    .flatMap((v) => v.investigations.filter((i) => types.includes(i.type)).map((inv) => ({ visit: v, inv })))
  const pending = rows.filter((r) => !r.inv.done)
  const done = rows.filter((r) => r.inv.done)

  return (
    <div className="space-y-4">
      <Chips options={TYPES} value={types} onToggle={(t) => setTypes((xs) => (xs.includes(t) ? xs.filter((x) => x !== t) : [...xs, t]))} />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card title={`Pending (${pending.length})`}>
          {pending.length === 0 ? (
            <Empty>No pending investigations.</Empty>
          ) : (
            <ul className="space-y-3">
              {pending.map(({ visit, inv }) => (
                <PendingRow key={inv.id} visit={visit} inv={inv} />
              ))}
            </ul>
          )}
        </Card>
        <Card title={`Done (${done.length})`}>
          {done.length === 0 ? (
            <Empty>Nothing completed yet.</Empty>
          ) : (
            <ul className="divide-y divide-slate-100">
              {done.map(({ visit, inv }) => (
                <li key={inv.id} className="py-2 text-sm">
                  <div className="font-medium">
                    <span className="text-slate-400">#{visit.token}</span> {visit.name} · {inv.type}{inv.name && `: ${inv.name}`}
                  </div>
                  <div className="text-xs text-slate-600">
                    {inv.result || 'done'} <span className="text-slate-400">· {formatTime(inv.doneAt)}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  )
}

function PendingRow({ visit, inv }: { visit: Visit; inv: Investigation }) {
  const recordResult = useOpdStore((s) => s.recordResult)
  const [result, setResult] = useState('')
  return (
    <li className="rounded-xl border border-slate-200 p-3">
      <div className="flex items-center justify-between gap-2 text-sm">
        <span className="font-medium">
          <span className="text-slate-400">#{visit.token}</span> {visit.name} <span className="font-normal text-slate-500">· {visit.age}{visit.sex}</span>
        </span>
        <span className="rounded-full bg-sky-100 px-2 py-0.5 text-xs font-semibold text-sky-800">{inv.type}</span>
      </div>
      {inv.name && <div className="mt-1 text-sm text-slate-700">{inv.name}</div>}
      {visit.provisionalDx && <div className="text-xs text-slate-500">Prov. Dx: {visit.provisionalDx}</div>}
      <div className="mt-2 flex gap-2">
        <input
          value={result}
          onChange={(e) => setResult(e.target.value)}
          placeholder="Result / findings (optional)"
          className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-brand-500"
        />
        <Button onClick={() => recordResult(visit.id, inv.id, result.trim())}>
          <CheckCircle2 className="size-4" /> Done
        </Button>
      </div>
    </li>
  )
}
