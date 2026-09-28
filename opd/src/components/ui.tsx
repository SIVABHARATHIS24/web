import type { ButtonHTMLAttributes, ChangeEvent, InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react'
import { AlertTriangle } from 'lucide-react'
import { vitalFlags } from '../lib/vitals'
import { STATUS_LABEL, type Visit, type VisitStatus, type Vitals } from '../types'

export function Card({ title, action, children, className = '' }: { title?: ReactNode; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-2xl border border-slate-200 bg-white p-4 shadow-sm ${className}`}>
      {(title || action) && (
        <div className="mb-3 flex items-center justify-between gap-2">
          {title && <h2 className="text-sm font-semibold tracking-wide text-slate-700 uppercase">{title}</h2>}
          {action}
        </div>
      )}
      {children}
    </section>
  )
}

export function Label({ children }: { children: ReactNode }) {
  return <span className="mb-1 block text-xs font-medium text-slate-500">{children}</span>
}

export function Input({ label, className = '', ...props }: InputHTMLAttributes<HTMLInputElement> & { label?: string }) {
  return (
    <label className={`block ${className}`}>
      {label && <Label>{label}</Label>}
      <input
        {...props}
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
      />
    </label>
  )
}

export function TextArea({ label, className = '', ...props }: TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string }) {
  return (
    <label className={`block ${className}`}>
      {label && <Label>{label}</Label>}
      <textarea
        rows={2}
        {...props}
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
      />
    </label>
  )
}

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost'
const VARIANTS: Record<Variant, string> = {
  primary: 'bg-brand-600 text-white hover:bg-brand-700 disabled:bg-slate-300',
  secondary: 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 disabled:text-slate-400',
  danger: 'border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100',
  ghost: 'text-slate-600 hover:bg-slate-100',
}

export function Button({ variant = 'primary', className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      type="button"
      {...props}
      className={`inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition disabled:cursor-not-allowed ${VARIANTS[variant]} ${className}`}
    />
  )
}

/** A row of toggle buttons; used for sex, payment, and comorbidity pickers. */
export function Chips<T extends string>({
  options,
  value,
  onToggle,
  labels,
}: {
  options: readonly T[]
  value: T[]
  onToggle: (option: T) => void
  labels?: Partial<Record<T, string>>
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((o) => {
        const on = value.includes(o)
        return (
          <button
            key={o}
            type="button"
            onClick={() => onToggle(o)}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
              on ? 'border-brand-600 bg-brand-600 text-white' : 'border-slate-300 bg-white text-slate-600 hover:border-brand-400'
            }`}
          >
            {labels?.[o] ?? o}
          </button>
        )
      })}
    </div>
  )
}

const STATUS_STYLE: Record<VisitStatus, string> = {
  waiting: 'bg-amber-100 text-amber-800',
  investigations: 'bg-sky-100 text-sky-800',
  review: 'bg-violet-100 text-violet-800',
  pharmacy: 'bg-teal-100 text-teal-800',
  completed: 'bg-emerald-100 text-emerald-800',
  not_coming: 'bg-slate-200 text-slate-600',
}

export function StatusBadge({ status }: { status: VisitStatus }) {
  return <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap ${STATUS_STYLE[status]}`}>{STATUS_LABEL[status]}</span>
}

export function VerifiedBadge({ visit }: { visit: Visit }) {
  if (visit.status === 'not_coming') return null
  return visit.verifiedAt ? (
    <span className="text-xs font-semibold text-emerald-700">VERIFIED</span>
  ) : (
    <span className="text-xs font-semibold text-amber-700">NOT VERIFIED</span>
  )
}

export function VitalsForm({ value, onChange }: { value: Vitals; onChange: (v: Vitals) => void }) {
  const set = (k: keyof Vitals) => (e: ChangeEvent<HTMLInputElement>) => onChange({ ...value, [k]: e.target.value })
  return (
    <div>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
        <Input label="BP" placeholder="120/80" value={value.bp} onChange={set('bp')} inputMode="numeric" />
        <Input label="PR" placeholder="72" value={value.pr} onChange={set('pr')} inputMode="numeric" />
        <Input label="SpO2 %" placeholder="98" value={value.spo2} onChange={set('spo2')} inputMode="numeric" />
        <Input label="Weight kg" placeholder="60" value={value.wt} onChange={set('wt')} inputMode="decimal" />
        <Input label="Temp °F" placeholder="98.4" value={value.temp} onChange={set('temp')} inputMode="decimal" />
      </div>
      <VitalWarnings vitals={value} />
    </div>
  )
}

export function VitalWarnings({ vitals }: { vitals: Vitals }) {
  const flags = vitalFlags(vitals)
  if (!flags.length) return null
  return (
    <ul className="mt-2 space-y-1">
      {flags.map((f) => (
        <li key={f.message} className="flex items-center gap-1.5 text-xs font-medium text-rose-700">
          <AlertTriangle className="size-3.5 shrink-0" /> {f.message}
        </li>
      ))}
    </ul>
  )
}

export function VitalsLine({ vitals }: { vitals: Vitals }) {
  const parts = [
    vitals.bp && `BP ${vitals.bp}`,
    vitals.pr && `PR ${vitals.pr}`,
    vitals.spo2 && `SpO2 ${vitals.spo2}`,
    vitals.wt && `Wt ${vitals.wt}`,
    vitals.temp && `T ${vitals.temp}°F`,
  ].filter(Boolean)
  return <span className="text-xs text-slate-500">{parts.join(' · ') || 'No vitals'}</span>
}

export function Empty({ children }: { children: ReactNode }) {
  return <p className="py-6 text-center text-sm text-slate-400">{children}</p>
}
