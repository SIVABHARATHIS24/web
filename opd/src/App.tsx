import { useEffect, useState } from 'react'
import type { JSX } from 'react'
import { ClipboardList, FlaskConical, LayoutDashboard, LogOut, Pill, Stethoscope } from 'lucide-react'
import { useOpdStore } from './store/useOpdStore'
import { isFirebaseConfigured } from './lib/cloud'
import { todayIST } from './lib/date'
import { ROLES, type Role } from './types'
import { AdminView } from './components/AdminView'
import { DoctorView } from './components/DoctorView'
import { InvestigationsView } from './components/InvestigationsView'
import { Login, Shell } from './components/Login'
import { PharmacyView } from './components/PharmacyView'
import { ReceptionView } from './components/ReceptionView'
import { Button, Input } from './components/ui'

const ICONS: Record<Role, typeof Stethoscope> = {
  reception: ClipboardList,
  doctor: Stethoscope,
  investigations: FlaskConical,
  pharmacy: Pill,
  admin: LayoutDashboard,
}

const VIEWS: Record<Role, () => JSX.Element> = {
  reception: ReceptionView,
  doctor: DoctorView,
  investigations: InvestigationsView,
  pharmacy: PharmacyView,
  admin: AdminView,
}

export default function App() {
  const initCloud = useOpdStore((s) => s.initCloud)
  const cloudStatus = useOpdStore((s) => s.cloudStatus)
  const role = useOpdStore((s) => s.role)
  const me = useOpdStore((s) => s.me)

  useEffect(() => initCloud(), [initCloud])

  if (isFirebaseConfigured) {
    if (cloudStatus === 'connecting') return <Shell><p className="text-sm text-slate-500">Connecting…</p></Shell>
    if (cloudStatus === 'signed_out') return <Login />
    if (cloudStatus === 'error') return <Shell><p className="text-sm text-rose-700">Could not reach the server. Check the connection and reload.</p></Shell>
    if (!me?.role) return <PendingApproval />
  } else if (!role) {
    return <LocalSetup />
  }
  return <Main />
}

function Main() {
  const role = useOpdStore((s) => s.role)!
  const date = useOpdStore((s) => s.date)
  const setDate = useOpdStore((s) => s.setDate)
  const setRole = useOpdStore((s) => s.setRole)
  const signOut = useOpdStore((s) => s.signOut)
  const who = useOpdStore((s) => s.me?.name || s.staffName)

  // Admin (and anyone in single-device mode) can look at every desk; others see their own.
  const canSwitch = role === 'admin' || !isFirebaseConfigured
  const [tab, setTab] = useState<Role>(role)
  const current = canSwitch ? tab : role
  const View = VIEWS[current]

  // Roll over to the new day automatically if the app is left open overnight.
  useEffect(() => {
    let last = todayIST()
    const id = setInterval(() => {
      const t = todayIST()
      if (t !== last) {
        if (useOpdStore.getState().date === last) setDate(t)
        last = t
      }
    }, 60_000)
    return () => clearInterval(id)
  }, [setDate])

  return (
    <div className="min-h-full">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur print:hidden">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-2">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-brand-600 p-1.5 text-white"><Stethoscope className="size-4" /></div>
            <span className="font-bold text-slate-900">OPD</span>
          </div>
          <input
            type="date"
            value={date}
            onChange={(e) => e.target.value && setDate(e.target.value)}
            className="rounded-lg border border-slate-300 px-2 py-1 text-sm"
          />
          {date !== todayIST() && (
            <button type="button" onClick={() => setDate(todayIST())} className="text-xs font-medium text-brand-700">Today</button>
          )}
          <div className="ml-auto flex items-center gap-2 text-sm text-slate-600">
            <span className="hidden sm:inline">{who}</span>
            <Button
              variant="ghost"
              title={isFirebaseConfigured ? 'Sign out' : 'Change user'}
              onClick={() => (isFirebaseConfigured ? signOut() : setRole(null))}
            >
              <LogOut className="size-4" />
            </Button>
          </div>
        </div>
        {canSwitch && (
          <nav className="scrollbar-none mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 pb-2">
            {ROLES.map((r) => {
              const Icon = ICONS[r.id]
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setTab(r.id)}
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition ${
                    current === r.id ? 'bg-brand-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="size-4" /> {r.label}
                </button>
              )
            })}
          </nav>
        )}
      </header>
      <main className="mx-auto max-w-7xl p-4 print:p-0">
        <View />
      </main>
    </div>
  )
}

function LocalSetup() {
  const setRole = useOpdStore((s) => s.setRole)
  const setStaffName = useOpdStore((s) => s.setStaffName)
  const staffName = useOpdStore((s) => s.staffName)
  const [name, setName] = useState(staffName)

  return (
    <Shell>
      <Input label="Your name" placeholder="e.g. Dr. Siva" value={name} onChange={(e) => setName(e.target.value)} />
      <p className="mt-4 mb-2 text-xs font-medium text-slate-500">Open desk</p>
      <div className="grid grid-cols-2 gap-2">
        {ROLES.map((r) => {
          const Icon = ICONS[r.id]
          return (
            <Button
              key={r.id}
              variant="secondary"
              className="justify-start"
              disabled={!name.trim()}
              onClick={() => {
                setStaffName(name)
                setRole(r.id)
              }}
            >
              <Icon className="size-4" /> {r.label}
            </Button>
          )
        })}
      </div>
      <p className="mt-4 text-xs text-slate-500">Single-device mode — data is saved in this browser only.</p>
    </Shell>
  )
}

function PendingApproval() {
  const me = useOpdStore((s) => s.me)
  const signOut = useOpdStore((s) => s.signOut)
  return (
    <Shell>
      <p className="text-sm text-slate-700">
        Hi {me?.name ?? 'there'} — your account is waiting for an admin to assign your desk (reception, doctor, investigations,
        pharmacy or admin).
      </p>
      <Button variant="secondary" className="mt-4 w-full" onClick={() => signOut()}>
        Sign out
      </Button>
    </Shell>
  )
}
