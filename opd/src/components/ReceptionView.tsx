import { useMemo, useState } from 'react'
import { CheckCircle2, RotateCcw, Search, UserPlus, UserX } from 'lucide-react'
import { emptyVitals, useDayVisits, useOpdStore, type RegisterInput } from '../store/useOpdStore'
import { formatTime } from '../lib/date'
import { COMORBIDITIES, type Patient, type Payment, type Sex } from '../types'
import { Button, Card, Chips, Empty, Input, Label, StatusBadge, TextArea, VerifiedBadge, VitalsForm } from './ui'

const SEXES: Sex[] = ['M', 'F', 'MCH', 'FCH']
const SEX_LABELS: Record<Sex, string> = { M: 'Male', F: 'Female', MCH: 'Boy (child)', FCH: 'Girl (child)' }
const PAYMENTS: Payment[] = ['PAID', 'GPAY', 'DR FREE', 'UNPAID']

function blankForm(): RegisterInput {
  return {
    patientId: null,
    name: '',
    contact: '',
    age: '',
    sex: 'F',
    address: '',
    comorbidities: [],
    payment: 'PAID',
    amount: '',
    vitals: { ...emptyVitals },
    notes: '',
  }
}

export function ReceptionView() {
  const patients = useOpdStore((s) => s.patients)
  const registerVisit = useOpdStore((s) => s.registerVisit)
  const setStatus = useOpdStore((s) => s.setStatus)
  const dayVisits = useDayVisits()

  const [form, setForm] = useState<RegisterInput>(blankForm)
  const [lookup, setLookup] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [lastToken, setLastToken] = useState<{ token: number; name: string } | null>(null)
  const [filter, setFilter] = useState('')

  const matches = useMemo(() => {
    const q = lookup.trim().toLowerCase()
    if (q.length < 3) return []
    return patients
      .filter((p) => p.contact.includes(q) || p.name.toLowerCase().includes(q))
      .slice(0, 6)
  }, [lookup, patients])

  const alreadyToday = new Set(dayVisits.filter((v) => v.status !== 'not_coming').map((v) => v.patientId))

  const pick = (p: Patient) => {
    setForm((f) => ({
      ...f,
      patientId: p.id,
      name: p.name,
      contact: p.contact,
      age: p.age,
      sex: p.sex,
      address: p.address,
      comorbidities: p.comorbidities,
    }))
    setLookup('')
  }

  const update = <K extends keyof RegisterInput>(k: K, v: RegisterInput[K]) => setForm((f) => ({ ...f, [k]: v }))

  const toggleComorbidity = (c: string) =>
    setForm((f) => {
      if (c === 'NO COMORBIDITIES') return { ...f, comorbidities: f.comorbidities.includes(c) ? [] : [c] }
      const rest = f.comorbidities.filter((x) => x !== 'NO COMORBIDITIES')
      return { ...f, comorbidities: rest.includes(c) ? rest.filter((x) => x !== c) : [...rest, c] }
    })

  const canSave = form.name.trim() && form.age.trim() && !saving

  const submit = async () => {
    if (!canSave) return
    setSaving(true)
    setError('')
    try {
      const visit = await registerVisit(form)
      setLastToken({ token: visit.token, name: visit.name })
      setForm(blankForm())
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not save — check your connection and try again.')
    } finally {
      setSaving(false)
    }
  }

  const listed = dayVisits.filter((v) => {
    const q = filter.trim().toLowerCase()
    return !q || v.name.toLowerCase().includes(q) || v.contact.includes(q) || String(v.token) === q
  })

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <Card title="Register patient" action={form.patientId && <span className="text-xs font-medium text-brand-700">Returning patient</span>}>
        <div className="relative mb-4">
          <Search className="pointer-events-none absolute top-2.5 left-3 size-4 text-slate-400" />
          <input
            value={lookup}
            onChange={(e) => setLookup(e.target.value)}
            placeholder="Find returning patient by phone or name"
            className="w-full rounded-lg border border-slate-300 py-2 pr-3 pl-9 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          />
          {matches.length > 0 && (
            <ul className="absolute z-10 mt-1 w-full overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg">
              {matches.map((p) => (
                <li key={p.id}>
                  <button type="button" onClick={() => pick(p)} className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-slate-50">
                    <span>
                      <span className="font-medium">{p.name}</span> <span className="text-slate-500">· {p.age}{p.sex} · {p.address}</span>
                    </span>
                    <span className="text-xs text-slate-500">{p.contact} · {p.visitCount} visit{p.visitCount === 1 ? '' : 's'}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Input label="Patient name *" placeholder="Mrs. Pavalakodi" value={form.name} onChange={(e) => update('name', e.target.value)} />
          <Input label="Contact" inputMode="tel" placeholder="10-digit mobile" value={form.contact} onChange={(e) => update('contact', e.target.value.replace(/[^\d]/g, '').slice(0, 10))} />
          <Input label="Age *" inputMode="numeric" value={form.age} onChange={(e) => update('age', e.target.value)} />
          <Input label="Address" placeholder="Village / town" value={form.address} onChange={(e) => update('address', e.target.value)} />
        </div>

        <div className="mt-3">
          <Label>Sex</Label>
          <Chips options={SEXES} labels={SEX_LABELS} value={[form.sex]} onToggle={(s) => update('sex', s)} />
        </div>

        <div className="mt-3">
          <Label>Comorbidities</Label>
          <Chips options={COMORBIDITIES} value={form.comorbidities} onToggle={toggleComorbidity} />
        </div>

        <div className="mt-4">
          <Label>Vitals</Label>
          <VitalsForm value={form.vitals} onChange={(v) => update('vitals', v)} />
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_8rem]">
          <div>
            <Label>Payment</Label>
            <Chips options={PAYMENTS} value={[form.payment]} onToggle={(p) => update('payment', p)} />
          </div>
          <Input label="Amount ₹" inputMode="numeric" value={form.amount} onChange={(e) => update('amount', e.target.value)} />
        </div>

        <TextArea className="mt-3" label="Notes" value={form.notes} onChange={(e) => update('notes', e.target.value)} />

        {form.patientId && alreadyToday.has(form.patientId) && (
          <p className="mt-3 text-xs font-medium text-amber-700">This patient is already registered today.</p>
        )}
        {error && <p className="mt-3 text-xs font-medium text-rose-700">{error}</p>}

        <div className="mt-4 flex items-center gap-2">
          <Button onClick={submit} disabled={!canSave}>
            <UserPlus className="size-4" /> {saving ? 'Saving…' : 'Register & send to doctor'}
          </Button>
          <Button variant="ghost" onClick={() => setForm(blankForm())}>Clear</Button>
        </div>

        {lastToken && (
          <div className="mt-4 flex items-center gap-3 rounded-xl bg-emerald-50 p-3 text-emerald-800">
            <CheckCircle2 className="size-6" />
            <div>
              <div className="text-xs">Token issued</div>
              <div className="text-lg font-bold">#{lastToken.token} · {lastToken.name}</div>
            </div>
          </div>
        )}
      </Card>

      <Card title={`Today's patients (${dayVisits.length})`}>
        <input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter by name, phone or token"
          className="mb-3 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
        />
        {listed.length === 0 ? (
          <Empty>No patients yet.</Empty>
        ) : (
          <ul className="divide-y divide-slate-100">
            {listed.map((v) => (
              <li key={v.id} className="flex items-center gap-3 py-2">
                <span className="w-8 text-center text-sm font-bold text-slate-400">{v.token}</span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-slate-900">
                    {v.name} <span className="font-normal text-slate-500">· {v.age}{v.sex} · {v.visitType} · {v.payment}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge status={v.status} /> <VerifiedBadge visit={v} />
                    <span className="text-xs text-slate-400">{formatTime(v.createdAt)}</span>
                  </div>
                </div>
                {v.status === 'waiting' && (
                  <Button variant="ghost" title="Mark not coming" onClick={() => setStatus(v.id, 'not_coming')}>
                    <UserX className="size-4" />
                  </Button>
                )}
                {v.status === 'not_coming' && (
                  <Button variant="ghost" title="Back to queue" onClick={() => setStatus(v.id, 'waiting')}>
                    <RotateCcw className="size-4" />
                  </Button>
                )}
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  )
}
