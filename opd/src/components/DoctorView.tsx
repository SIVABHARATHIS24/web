import { useState } from 'react'
import { BadgeCheck, FlaskConical, Plus, Save, Trash2 } from 'lucide-react'
import { newRxItem, useDayVisits, useOpdStore } from '../store/useOpdStore'
import { makeId } from '../lib/id'
import { toSheetDate } from '../lib/date'
import type { InvestigationType, RxItem, Visit, VisitStatus } from '../types'
import { Button, Card, Chips, Empty, Input, Label, StatusBadge, TextArea, VerifiedBadge, VitalsLine, VitalWarnings } from './ui'

const QUEUE_ORDER: VisitStatus[] = ['review', 'waiting', 'investigations', 'pharmacy', 'completed', 'not_coming']
const INV_TYPES: InvestigationType[] = ['XRAY', 'LAB', 'ECG']
const FREQUENCIES = ['OD', 'BD', 'TDS', 'QID', 'HS', 'SOS', '1-0-1', '1-1-1', '1-0-0', '0-0-1']

export function DoctorView() {
  const dayVisits = useDayVisits()
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const queue = [...dayVisits].sort(
    (a, b) => QUEUE_ORDER.indexOf(a.status) - QUEUE_ORDER.indexOf(b.status) || a.token - b.token,
  )
  const selected = dayVisits.find((v) => v.id === selectedId) ?? null
  const waiting = dayVisits.filter((v) => v.status === 'waiting' || v.status === 'review').length

  return (
    <div className="grid gap-4 lg:grid-cols-[20rem_minmax(0,1fr)]">
      <Card title={`Queue · ${waiting} waiting`} className="lg:max-h-[calc(100vh-9rem)] lg:overflow-y-auto">
        {queue.length === 0 ? (
          <Empty>No patients registered yet.</Empty>
        ) : (
          <ul className="space-y-1">
            {queue.map((v) => (
              <li key={v.id}>
                <button
                  type="button"
                  onClick={() => setSelectedId(v.id)}
                  className={`w-full rounded-lg px-3 py-2 text-left transition ${
                    v.id === selectedId ? 'bg-brand-50 ring-1 ring-brand-300' : 'hover:bg-slate-50'
                  } ${v.status === 'not_coming' ? 'opacity-50' : ''}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-medium">
                      <span className="text-slate-400">#{v.token}</span> {v.name}
                    </span>
                    <StatusBadge status={v.status} />
                  </div>
                  <div className="text-xs text-slate-500">
                    {v.age}{v.sex} · {v.visitType} · {v.address}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </Card>

      {selected ? (
        <Consultation key={selected.id} visit={selected} />
      ) : (
        <Card>
          <Empty>Select a patient from the queue.</Empty>
        </Card>
      )}
    </div>
  )
}

function Consultation({ visit }: { visit: Visit }) {
  const updateVisit = useOpdStore((s) => s.updateVisit)
  const orderInvestigations = useOpdStore((s) => s.orderInvestigations)
  const verify = useOpdStore((s) => s.verify)
  const allVisits = useOpdStore((s) => s.visits)

  const [provisionalDx, setProvisionalDx] = useState(visit.provisionalDx)
  const [finalDx, setFinalDx] = useState(visit.finalDx)
  const [treatment, setTreatment] = useState<RxItem[]>(visit.treatment.length ? visit.treatment : [newRxItem()])
  const [advice, setAdvice] = useState(visit.advice)
  const [invTypes, setInvTypes] = useState<InvestigationType[]>([])
  const [invName, setInvName] = useState('')

  const history = allVisits
    .filter((v) => v.patientId === visit.patientId && v.id !== visit.id && v.date < visit.date)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5)

  const cleanRx = () => treatment.filter((t) => t.drug.trim())
  const notesPatch = () => ({ provisionalDx, finalDx, treatment: cleanRx(), advice })
  const dirty =
    provisionalDx !== visit.provisionalDx ||
    finalDx !== visit.finalDx ||
    advice !== visit.advice ||
    JSON.stringify(cleanRx()) !== JSON.stringify(visit.treatment)

  const save = () => updateVisit(visit.id, notesPatch(), 'Consultation notes saved')

  const sendForTests = () => {
    if (!invTypes.length) return
    if (dirty) save()
    orderInvestigations(
      visit.id,
      invTypes.map((type) => ({ id: makeId(), type, name: invName.trim(), done: false, result: '', doneAt: null })),
    )
    setInvTypes([])
    setInvName('')
  }

  const signOff = () => {
    // Save first so verify() sees the final treatment when routing to pharmacy.
    updateVisit(visit.id, notesPatch(), 'Consultation notes saved')
    verify(visit.id)
  }

  const setRx = (id: string, patch: Partial<RxItem>) => setTreatment((rows) => rows.map((r) => (r.id === id ? { ...r, ...patch } : r)))
  const locked = visit.status === 'not_coming'

  return (
    <div className="space-y-4">
      <Card
        title={
          <span className="normal-case">
            #{visit.token} {visit.name}
          </span>
        }
        action={
          <div className="flex items-center gap-2">
            <StatusBadge status={visit.status} /> <VerifiedBadge visit={visit} />
          </div>
        }
      >
        <div className="text-sm text-slate-700">
          {visit.age} / {visit.sex} · {visit.visitType} · {visit.address} · {visit.contact} · {visit.payment}
        </div>
        <div className="mt-1">
          <VitalsLine vitals={visit.vitals} />
        </div>
        <VitalWarnings vitals={visit.vitals} />
        {visit.comorbidities.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {visit.comorbidities.map((c) => (
              <span key={c} className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-700">{c}</span>
            ))}
          </div>
        )}
        {visit.notes && <p className="mt-2 text-xs text-slate-500">Reception note: {visit.notes}</p>}
        {history.length > 0 && (
          <details className="mt-3 text-xs text-slate-600">
            <summary className="cursor-pointer font-medium text-brand-700">Previous visits ({history.length})</summary>
            <ul className="mt-2 space-y-1">
              {history.map((h) => (
                <li key={h.id}>
                  <span className="font-medium">{toSheetDate(h.date)}</span> — {h.finalDx || h.provisionalDx || 'no diagnosis'}
                  {h.treatment.length > 0 && <> · Rx: {h.treatment.map((t) => t.drug).join(', ')}</>}
                </li>
              ))}
            </ul>
          </details>
        )}
      </Card>

      <Card title="Consultation">
        <TextArea label="Provisional diagnosis" value={provisionalDx} onChange={(e) => setProvisionalDx(e.target.value)} disabled={locked} />

        <div className="mt-4 rounded-xl border border-slate-200 p-3">
          <Label>Investigations</Label>
          {visit.investigations.length > 0 && (
            <ul className="mb-3 space-y-1 text-sm">
              {visit.investigations.map((i) => (
                <li key={i.id} className="flex flex-wrap gap-2">
                  <span className="font-medium">{i.type}{i.name && `: ${i.name}`}</span>
                  {i.done ? <span className="text-emerald-700">— {i.result || 'done'}</span> : <span className="text-amber-700">— pending</span>}
                </li>
              ))}
            </ul>
          )}
          <div className="flex flex-wrap items-end gap-2">
            <Chips options={INV_TYPES} value={invTypes} onToggle={(t) => setInvTypes((xs) => (xs.includes(t) ? xs.filter((x) => x !== t) : [...xs, t]))} />
            <Input className="min-w-40 flex-1" placeholder="Tests (e.g. CBC, RBS, chest PA)" value={invName} onChange={(e) => setInvName(e.target.value)} />
            <Button variant="secondary" onClick={sendForTests} disabled={!invTypes.length || locked}>
              <FlaskConical className="size-4" /> Send for tests
            </Button>
          </div>
        </div>

        <TextArea className="mt-4" label="Final diagnosis" value={finalDx} onChange={(e) => setFinalDx(e.target.value)} disabled={locked} />

        <div className="mt-4">
          <Label>Treatment</Label>
          <datalist id="freq">
            {FREQUENCIES.map((f) => <option key={f} value={f} />)}
          </datalist>
          <div className="space-y-2">
            {treatment.map((r) => (
              <div key={r.id} className="grid grid-cols-[minmax(0,1fr)_5rem_5rem_3.5rem_auto] gap-1.5">
                <input className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm" placeholder="Drug" value={r.drug} onChange={(e) => setRx(r.id, { drug: e.target.value })} />
                <input className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm" placeholder="Dose" value={r.dose} onChange={(e) => setRx(r.id, { dose: e.target.value })} />
                <input className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm" placeholder="Freq" list="freq" value={r.frequency} onChange={(e) => setRx(r.id, { frequency: e.target.value })} />
                <input className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm" placeholder="Days" inputMode="numeric" value={r.days} onChange={(e) => setRx(r.id, { days: e.target.value })} />
                <Button variant="ghost" title="Remove" onClick={() => setTreatment((rows) => rows.filter((x) => x.id !== r.id))}>
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))}
          </div>
          <Button variant="ghost" className="mt-1" onClick={() => setTreatment((rows) => [...rows, newRxItem()])}>
            <Plus className="size-4" /> Add medicine
          </Button>
        </div>

        <TextArea className="mt-3" label="Advice / follow-up" value={advice} onChange={(e) => setAdvice(e.target.value)} disabled={locked} />

        <div className="mt-4 flex flex-wrap gap-2">
          <Button variant="secondary" onClick={save} disabled={!dirty || locked}>
            <Save className="size-4" /> Save
          </Button>
          {!visit.verifiedAt && (
            <Button onClick={signOff} disabled={locked}>
              <BadgeCheck className="size-4" /> Verify{cleanRx().length ? ' & send to pharmacy' : ''}
            </Button>
          )}
        </div>
        {visit.status === 'investigations' && !visit.verifiedAt && (
          <p className="mt-2 text-xs text-slate-500">Investigation results pending — you can still verify if they aren't needed for today's treatment.</p>
        )}
      </Card>
    </div>
  )
}
